import {globby} from "globby";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import readline from "node:readline";
import yaml from "js-yaml";

// Configuration

interface DirConfig {
  name: string;
  title: string;
}

interface FileHeader {
  title?: string;
  ignore: boolean;
}

const ignoreNames = new Set(["README", "_sidebar"]);

const dirConfigs: DirConfig[] = [
  {name: "design", title: "设计"},
  {name: "dev-libraries", title: "开发框架"},
  {name: "providers", title: "Serverless 平台"},
  {name: "providers/knative", title: "Knative"},
  {name: "similar-tools", title: "相关工具"},
  {name: "materials", title: "资料"},
  {name: "demo", title: "演示"},
  {name: "tasks", title: "任务"},
];

// Functions

function getPathLevel(path: string): number {
  let cnt = 0;
  for (const ch of path) {
    if (ch === "/") {
      cnt++;
    }
  }
  return cnt;
}

function groupby<T>(items: T[], key: (v: T) => string): Map<string, T[]> {
  const m: Map<string, T[]> = new Map();

  for (let item of items) {
    const k = key(item);
    if (!m.has(k)) {
      m.set(k, []);
    }
    m.get(k)?.push(item);
  }
  return m;
}

// run tasks in batch to avoid too many files opening
async function runBatchedTasks<T>(
  tasks: (() => Promise<T>)[],
  opts: {batchSize: number}
) {
  if (opts.batchSize <= 0) {
    throw new Error("limit must be positive");
  }

  const results: T[] = [];
  for (let i = 0; i < tasks.length; i += opts.batchSize) {
    const batch = tasks.slice(i, i + opts.batchSize);
    const data = await Promise.all(batch.map((t) => t()));
    results.push(...data);
  }

  return results;
}

// only read partial file content: use stream and read line
// to avoid perfermance issue when file is large
class FileLineReader {
  private rl: readline.Interface;
  private it: AsyncIterableIterator<string>;
  private back: string[] = [];
  constructor(path: string) {
    const readStream = fs.createReadStream(path, {encoding: "utf-8"});
    this.rl = readline.createInterface(readStream);
    this.it = this.rl[Symbol.asyncIterator]();
  }

  async next(): Promise<IteratorResult<string, any>> {
    if (this.back.length != 0) {
      return {done: false, value: this.back.shift()};
    }
    return this.it.next();
  }

  putBack(line: string) {
    this.back.push(line);
  }

  // we wraps here to make file reader can be used in for-await-of
  // and it can hold the iterator state
  [Symbol.asyncIterator]() {
    return this;
  }
}

async function resolveMarkdownContent(fileReader: FileLineReader): Promise<{
  head1?: string;
}> {
  const result = {head1: undefined} as {head1?: string};
  for await (let line of fileReader) {
    line = line.trim();
    if (line.length === 0) {
      continue;
    }

    if (line.startsWith("# ")) {
      result.head1 = line.slice(2);
      return result;
    }
  }

  return result;
}

async function resolveFileHeader(opts: {path: string}): Promise<FileHeader> {
  const fileReader = new FileLineReader(opts.path);

  const lines: string[] = [];
  let slashCnt = 0;

  for await (let line of fileReader) {
    if (line.length == 0) {
      continue;
    }

    line = line.trimEnd();
    lines.push(line);

    // check first line
    if (slashCnt === 0) {
      // no front matter, just break
      if (!line.startsWith("---")) {
        fileReader.putBack(line);
        break;
      }

      slashCnt += 1;
      continue;
    }

    // check other line

    if (line.startsWith("---")) {
      // encounter another slash, break
      slashCnt++;
      break;
    }
  }

  // we have no front matter
  if (slashCnt == 0) {
    const {head1} = await resolveMarkdownContent(fileReader);
    return {ignore: false, title: head1};
  }

  // we have slash, but not enough or invalid
  if (slashCnt == 1 || lines.length == 0 || lines[0] !== "---") {
    throw new Error(`invalid header for file=${opts.path}`);
  }

  const headerStr = lines.slice(1, -1).join("\n");
  const header = yaml.load(headerStr) as FileHeader;

  // no header title, we try to extract from level1 title like '# xxx'
  if (!header.title) {
    const {head1} = await resolveMarkdownContent(fileReader);
    header.title = head1;
  }

  return {ignore: false, ...header};
}

async function generate(paths: string[]) {
  const fileTasks = paths
    .map((f) => {
      const name = path.basename(f, ".md");
      const dir = path.dirname(f);
      return {name, dir};
    })
    .filter((f) => !ignoreNames.has(f.name))
    .map((f) => {
      return async () => {
        const header = await resolveFileHeader({
          path: path.join("docs", f.dir, `${f.name}.md`),
        });
        return {...f, header};
      };
    });

  const files = await runBatchedTasks(fileTasks, {batchSize: 16});

  const dirFiles = groupby(files, (f) => f.dir);

  let content = "";

  for (const dirConfig of dirConfigs) {
    const files = dirFiles.get(dirConfig.name);
    if (!files || files.length == 0) {
      continue;
    }

    const level = getPathLevel(dirConfig.name);

    const indent = '  '.repeat(level)

    content +=
      indent + `- [${dirConfig.title}/](/${dirConfig.name})\n`;
    for (const file of files) {
      const header = file.header;

      if (header.ignore) {
        continue;
      }

      const title = header.title ?? file.name;

      content += indent + `  - [${title}](/${file.dir}/${file.name}.md)\n`;
    }
  }

  return content;
}

async function main() {
  // only one level
  let files = await globby("*/**/*.md", {
    cwd: "docs",
    objectMode: true,
    stats: true,
  });

  files.sort((obj1, obj2) => obj2.stats.ctimeMs - obj1.stats.ctimeMs);

  const content = await generate(files.map((f) => f.path));

  // write to sidebar
  await fsp.writeFile("docs/_sidebar.md", content);
}

main().catch((e) => console.error(e));
