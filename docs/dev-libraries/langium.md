## Usage

### 1 Langium download

- https://www.npmjs.com/package/langium 
- demo: https://langium.org/docs/getting-started/
  - note1：第一次按以上流程创建DSL，HELLO-WORLD项目在`/Users/{用户名}/`目录下
  - note2: VScode下安装code指令。 `Shift+Command+P`调起命令窗口，输入`shell Command`，下方出现 `Install 'code' command in PATH` 选项，点击以安装 
- vscode extension: `langium`


### 2 Langium Concepts

**1. The Grammar Language**

- document: https://langium.org/docs/grammar-language/
- Language Declaration: Langium语法文件以声明语言名称的标题开头
- Terminal Rules: Langium解析器内置流基于`Javascript Regular Expressions`的lexer，也允许使用`EBNF`表达式。但是建议使用javascript正则表达式，因为在langium内部将EBNF转换成了正则表达式
- Parser Rules: Parser Rules向parser指示哪些令牌序列是有效的
- The Entry Rule: 解析步骤起点的Parser Rules，从关键字entry开始，并匹配其他Parser Rules

**2. 目录结构**

以 https://langium.org/docs/getting-started/的demo为例：
- `src/language-server/hello-world.langium`: 语法规则文件
    - document: https://langium.org/tutorials/writing_a_grammar/
- `src/language-server/hello-world-validator.ts`: 合法性检验，当用户输入相同函数名、关键字输入错误...等一系列不符合语法规则时，编辑器能给出相应的错误提醒
    - document: https://langium.org/tutorials/validation/
- `src/cli/index.ts`: 语言的命令行界面的一般布局，并允许注册特定命令
    - document: https://langium.org/tutorials/customizing_cli/
- `src/language-server/main-browser.ts`: 为的语言服务器创建一个新的入口点等
    - document: https://langium.org/tutorials/langium_and_monaco/
- `src/static/index.html`,`src/static/styles.css`: 静态页面，在与 Monaco Editor 集成，在web上运行会用到。
    - document: https://langium.org/tutorials/langium_and_monaco/
- `src/web/index.ts`: 网络的生成器端点
    - document: https://langium.org/tutorials/generation_in_the_web/

**3. Extension**

基于Langium的语言构建VSIX扩展（VSCode扩展）
- document: https://langium.org/tutorials/building_an_extension/

**4. running Langium in the web**

在网络中将Langium与Monaco Editor集成，无需后端
- document: https://langium.org/tutorials/generation_in_the_web/

## Resource
- document：https://langium.org/docs/
- github：https://github.com/langium/langium
- VS Code extension API：https://code.visualstudio.com/api/language-extensions/overview
- Typescript document：https://typescript.bootcss.com/basic-types.html