import {globby} from "globby";
import path from "node:path";
import * as fsp from "fs/promises";
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
  {name: "similar-tools", title: "相关工具"},
  {name: "tasks", title: "任务"},
];

// Functions

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

async function resolveFileHeader(opts: {path: string}): Promise<FileHeader> {
  const content = await fsp.readFile(opts.path);
  const lines = content.toString().split("\n");

  if (lines[0].startsWith("---")) {
    // find the end of header
    let i = 1;
    for (; i < lines.length; i++) {
      if (lines[i].startsWith("---")) {
        break;
      }
    }

    if (i == 1 || i == lines.length) {
      throw new Error(`invalid header for file=${opts.path}`);
    }

    const headerStr = lines.slice(1, i).join("\n");
    const header = yaml.load(headerStr) as FileHeader;

    return {ignore: false, ...header};
  }

  return {title: undefined, ignore: false};
}

async function generate(paths: string[]) {
  const files = paths
    .map((f) => {
      const name = path.basename(f, ".md");
      const dir = path.dirname(f);
      return {name, dir};
    })
    .filter((f) => !ignoreNames.has(f.name));

  const dirFiles = groupby(files, (f) => f.dir);

  let content = "";

  for (const dirConfig of dirConfigs) {
    const files = dirFiles.get(dirConfig.name);
    if (!files || files.length == 0) {
      continue;
    }

    content += `- [${dirConfig.title}](/${dirConfig.name})\n`;
    for (const file of files) {
      const header = await resolveFileHeader({
        path: path.join("docs", file.dir, `${file.name}.md`),
      });

      if (header.ignore) {
        continue;
      }

      const title = header.title ?? file.name;

      content += `  - [${title}](/${file.dir}/${file.name}.md)\n`;
    }
  }

  return content;
}

async function main() {
  // only one level
  let files = await globby("*/*.md", {
    cwd: "docs",
  });

  const content = await generate(files);

  // write to sidebar
  await fsp.writeFile("docs/_sidebar.md", content);
}

main().catch((e) => console.error(e));
