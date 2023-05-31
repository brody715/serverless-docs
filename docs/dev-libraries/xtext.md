## Usage

### 项目创建

**XText 开发一个新的语言**

- 定义 xtext 文件
  - `dsl.xtext`
  - 包括语法定义，语义（Cross-Reference）定义
- 生成模型代码
  - XText 根据 `dsl.xtext` 在 `src-gen` 目录下，生成
    - AST 节点模型类
    - parser，semantic analysis 等阶段需要的 类，如 GrammarAccess，Scope 等
  - 定义 `GenerateDsl.mwe2` 定义生成流程
  - generateXtendStub = false 禁用 xtend 模板文件生成
- 编写 Language Implementation
- 编写 IDE Features

**项目初始化**

- 使用 Eclipse 开发 Xtext 应用能够得到最大化的支持，包括 xtext，xtext 语言支持，Editor 支持，自动生成 Artifact 等
- 由于 Eclipse 一些使用上的原因，建议将 Xtext 当做一个纯 Java 框架进行使用，通过 Gradle 自动根据 xtext 生成源代码，这样能够使用 IDEA 进行开发。

目录结构

- `xxx.dsl`
  - 定义 DSL 的核心处理类，包括 Format，Scope，Validation，Code Generation
- `xxx.dsl.ide`
  - 定义与 IDE 相关的处理类，包括 Hover，QuickFix 等
  - 与 Language Server 相关的业务逻辑
- `xxx.dsl.tests`
  - 测试类

## Concepts

### Xtend

- 一种类似 Java 的语言，包含一些语法糖，如在 Code Generation 使用模板语言定义代码生成过程
- Xtext 文档和教程中大量使用该语言，但由于 xtent 在 IDEA 中没有支持，建议只使用 Java 进行开发

### Inject

- Xtext 框架使用 `com.google.inject` 库进行依赖注入，注册不同的语言服务（如 GrammarAccess，Formatter）

### Grammar Language

- https://www.eclipse.org/Xtext/documentation/301_grammarlanguage.html
- 名为 xtext 的 DSL，用于定义语言语法，以及与语义对象的映射关系
- 语法对象：抽象语法树的节点，与源代码对应，Parsing 过程将字符串转换为多个语法对象构造的树
- 语义对象：语义分析处理的对象，比如类型对象，模块对象等
- Xtext 框架设计原则是，用 xtext 定义语法以及语义对象，在解析过程中，同时构造出语义对象。其他的语言服务将处理这些语义对象
- 语义对象使用 EMF Ecore 模型作为规范，见 https://www.eclipse.org/Xtext/documentation/308_emf_integration.html#model-metamodel

### Module

- https://www.eclipse.org/Xtext/documentation/302_configuration.html
- 如 `DslRuntimeModule`
- 类似于 依赖注入中的 Module，提供当前 DSL 各种语言服务的类
- 要使用 DSL 的语言功能（如编译器或 Language Server），通过 Injector 获取 Module，然后调用对应的方法使用

### Language Implementation

https://www.eclipse.org/Xtext/documentation/303_runtime_concepts.html

实现语言的各种功能

**CodeGeneration**

- 用于将 AST 解释执行，或翻译为其他代码
- 如 Model -> Java, YAML 等
- 实现 `IGenerator2` 接口
- 关注对象
  - 当前待生成的资源（语法树子树根节点）
  - 输出管理（输出的内容，输出的文件路径）
  - 引用其他的对象

**Validation**

- 静态分析实现 Lint，检测模型是否满足约束
- 静态分析输出 Errors 与 Warnings，通过 `Resource.getErrors()` 与 `Resource.getWarnings()` 获取
- 类别
  - Automatic Validation
    - Lexer/Parser: 语法校验
    - Linker：交叉引用校验
      - 利用 Scope（符号表）等信息，执行校验
      - 可能会跨多个模块
    - Serializer：Concrete Syntax Validation
      collapsed:: true
      - 具体的语法验证，当验证通过，说明模型可以被正确序列化
      - TODO: 使用场景
      - 用于模型序列化后，再反序列化回来？
  - Custom Validation
    - 实现 `AbstractDslValidator`

**Linking**

- 实现交叉引用
- 需要完成两步
  - 在 xtext grammar 文件中，定义交叉引用
  - 通过 `Scoping API` 声明 Linking 的语义
- Lazy Link
  - Xtext 建议使用 Lazy Link
  - 通过创建 Proxy 对象实现，当实际访问该 Proxy 对象时，才进行 resolve
- Scoping
  - 通过 Scoping API 定义如何通过引用找到引用的对象

## Tips

安装过程可以记录的点

1. 安装 Eclipse & XText

- 下载 Eclipse
  - https://www.eclipse.org/Xtext/download.html
- 选择 Eclipse IDE for Java Developer 安装
- 在 Installer 中，右上角设置 - `Adavanced Mode` - 连接图标 - 设置代理 - 切换回 Easy Mode
  - 代理选择全局模式
- 安装完成后，可设置 Eclipse HTTP 代理 (似乎没用)
- 在 Eclipse 中添加 Xtext update URL
  - Help -> Install New Software ... -> 复制下面链接 -> Add ...
  - https://download.eclipse.org/modeling/tmf/xtext/updates/composite/releases/
  - Or
  - https://mirrors.tuna.tsinghua.edu.cn/eclipse/modeling/tmf/xtext/updates/composite/releases/
  - 添加完成后，选择 xtext，拉取 metadata，拉取完成后，Software sites 出现多个 URL，同样替换源
  - 添加下列 URL
    - https://mirrors.ustc.edu.cn/eclipse/modeling/tmf/xtext/updates/releases/
- 替换源
  - Help -> Install New Software.. -> Available Software sites
  - 将 `https://download.eclipse.org`
    - 全部替换为 `https://mirrors.tuna.tsinghua.edu.cn/eclipse`
    - 需要全部替换，否则每次 fetching children 都可能从某个 eclipse.org 中拉取，影响速度

2. Eclipse 设置代理

- 需要使用 http 代理，socks5 代理有些问题
- Window -> Preference -> Network
- 设置 http 代理，选择 Active Provider 为 manual
- 另一个方法是，修改 `eclipse.ini`
- 位于 `~/eclipse\java-2023-03\eclipse`

3. VSCode 插件

- grammarcraft.xtend-lang
- grammarcraft.xtext-lang

## Resource

- Document
  - https://www.eclipse.org/Xtext/documentation/301_grammarlanguage.html
- Runtime concepts
  - https://www.eclipse.org/Xtext/documentation/303_runtime_concepts.html
- Book
  - https://github.com/varmaprr/books/blob/master/Implementing%20Domain%20Specific%20Languages%20with%20Xtext%20and%20Xtend%20-%20Second%20Edition.pdf
