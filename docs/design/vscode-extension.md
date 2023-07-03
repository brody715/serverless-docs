# Faasit Vscode Extension

## Principle

VScode 插件开发需要同时支持桌面端以及 Web 端，尽量不使用 NodeJs API

插件同时支持 Node 和 Browser

- 只能导入 vscode 模块，其他模块需要进行 bundle
- 不能使用 NodeJs API，需要使用 vscode API，比如访问文件 `vscode.workspace.fs`
- Language Server 需要通过 Web Worker API 进行创建

## 在线编辑器

在线编辑器的设计可参考 [月兔语言 Playground](https://try.moonbitlang.com/)
其在前端提供了一个在线的 VSCode 编辑器，能够有效的减少开发难度，复用开发好的 VSCode 插件

### 功能

- 最好是纯前端，不依赖后端服务器，或依赖轻量的后端服务，如 Cloudflare Workers，方便跑在 Github Pages 上
- 在线编辑 Faasit DSL，并提供语言功能
- 支持模拟文件系统，提供文件夹和文件
- 支持导入 NodeJs 模块（使用 unpkg）
- 提供输出窗口，能够显示编译后的 IR Yaml，代码生成结果，可视化图片等等
- 提供导入和导出功能

## Tips

1. 使用 ESBuild 打包 workspace 依赖库
   当 extension 依赖 workspace 中其他依赖库时，如 `@faasit/core`，可以使用 condition 功能让 esbuild 直接打包 `@faasit/core` 的 Typescript 文件
   文档见 https://esbuild.github.io/api/#conditions
   代码见 `vscode-faasit/build.ts`
   condition 优先级与 JSON Key 出现的顺序有关，越提前优先级越高

2. Publish Extension
   - https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Resource

- vscode-web: https://github.com/Felx-B/vscode-web
- vscode-web-playground:https://github.com/microsoft/vscode-web-playground/blob/main/src/memfs.ts
- 开发 Web Extension: https://code.visualstudio.com/api/extension-guides/web-extensions
- Web Sample: https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample
