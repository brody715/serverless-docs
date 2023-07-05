---
title: Faasit 语言设计 (完整版)
---

# Faasit

Faasit 是一种用于建模无服务器应用程序的领域特定语言(DSL)。其编译器工具链提供以下特性:

- 定义函数和平台资源
- 自动将函数部署到不同的云供应商中
- 自动生成测试用例
- 在本地模拟函数

Faasit 提供了几种语言特性来方便编码，包括

- 模块系统
- 类型系统
- 装饰器系统

## 项目状态

语言设计和工具链的开发正在**进行中**。

- [x] 设计语言的基础

该语言特性

- [x] 定义基本类型和模型

- [x] 定义函数和云服务

## 概览

Faasit 不是通用语言(GPL)，目前不支持条件、循环或递归。它的主要目的是建模和编写无
服务器应用程序的基础设施代码，类似于
[Terraform](https://github.com/hashicorp/terraform)或其他 DSL。

Faasit 在软件工程中应用了模型驱动工程(MDE)的概念。工具链使用模型转换技术将 DSL
转换为多种模型。

Faasit 提供了两个语言接口: DSL 和中间表示(IR)。

DSL 提供了一个易于使用和表达的接口，供用户在`faasit`语言中编写高级代码。然
后，faasit 工具链可以操作这个 DSL 代码。

另一方面，IR 提供了一个更低级别和机器友好的接口，供编译器或插件开发人员使
用。IR 可以使用 JSON 或 YAML 表示。

## 语义组件

- 包（Package）
- 类型
- 值
- 块
- 装饰器
- 符号

### Library（库）、包 (Package) 与 Faasit 实例 （Instance）

Faasit 通过 库、包、ft 实例等概念实现模块系统与依赖管理系统。

Faasit 模块系统与 Golang 相似，而依赖管理系统则复用 NodeJs。

模块系统提供了不同代码文件之间的组织机制，不同包之间的符号导出和符号引用机制。

依赖管理系统提供了标准库和第三方库的依赖管理机制。

ft 实例是 Faasit 代码的基本单位，每个代码文件对应一个 ft 实例，定义了各种实体，如类型、值、块和装饰器。

包是一组 ft 实例的集合，同一目录下的所有 ft 代码文件属于一个包，同一个包中的符号在所有实例中可见，不需要通过 import 指定。

`import` 子句允许 ft 实例通过唯一标识符引用其他的包。

`use` 子句允许 ft 实例通过别名引用其他的包中的符号，该别名在整个包中都可见。

`pub` 关键字修饰符号或者 use 子句，表示该符号或者别名可以被其他包引用。

Library 是 Faasit 包的集合。第三方依赖库的发布和版本管理需要以 Library 为单位进行

在 Library 根目录下的 `package.json` 文件中，声明 Library 相关信息，如导入前缀，依赖项等。

Library 配置文件实例

```json
{
  "faasit": {
    "library": {
      "prefix": "brody715.com/faasit-samples"
    },
    "deps": {
      // 表示 node_modules 中的 @faasit/std 是 Faasit Library
      "@faasit/std": {}
    }
  },
  // nodejs configs
  "devDependencies": {
    "eslint": "*",
    "faasit": "^0.0.1",
    "@faasit/std": "^0.0.1",
    "@faasit/swagger": "^0.0.1"
  }
}
```

项目目录结构实例

```yaml
- my_lib/
  - vars/
    - vars.ft
    - ft.json  # 可选的 Package 描述文件，用于定义 Package 的元信息，如包名、文件列表（用于 HTTP 服务）等
  - main.ft
  - package.json  # nodejs package.json, 包含配置项 `faasit` 用于定义 Library 的导入前缀 Import Prefix
```

DSL 示例:

```faasit

// example1.ft
import (
  "std/sema"

  // 包可以声明别名
  swagger "github.com/faasit/x/swagger/v1"
  faas "std/faas"

  // wildcard 导入
  . "std/schema"
)

// 我们可以使用 `use` 子句来别名其他包中的符号。
use {
  function = faas.function
  resource = faas.resource
  provider = faas.provider
}

// 导出 use 块的所有别名
pub use {
  application = faas.application
}

// 定义函数，并导出该符号
pub @function GetEmail {
  input = {
    sender = string
    receiver = string
    content = string
  }

  output = {
    status = string
  }

  handler = "main"
}

// 可以在模块中定义子块，使用 `for`
// 子块或者匿名块，无法使用 `pub` 修饰
// 定义资源
@resource for GetEmail {
  cpu = "1000m"
  memory = "128Mi"
}

// 定义触发器子块
@trigger for GetEmail {
  kind = "http"
  method = "GET"
  path = "/"
}

@trigger for GetEmail {
  kind = "schedule"
  every = "1m"
}
```

IR 示例:

```yaml
packages:
  - id: brody715.com/faasit-samples
    kind: p_entry
    blocks:
      - kind: b_custom
        block_type: "std/faas::function"
        name: "GetEmail"
        props: {}
        ...
    symbols:
      - id: "std/faas::function"
        kind: "b_block"
        ...
libs:
  - id: brody715.com/faasit-samples
    kind: l_entry
  - id: std/faas
    kind: l_ref
    version: 0.1.0
```

### 类型

Faasit 的类型系统定义了值和用户定义类型的类型。 Faasit 中最重要的类型之一是
`struct`类型。

在一些面向对象语言中，`struct`常用于表示`object`、`class` 或 `entity`

一个`struct`包含一组属性，用户可以使用它来表示不同类型的模型。

类型可在语义分析阶段进行类型计算，并进行语法检测，检查块或者变量的使用是否满足约束。

TODO: 类型系统定义

DSL 示例:

```faasit
struct User {
  name = string
  age = int
  is_married = bool
  // map和any类型
  props = map<string, any>
  // 'type'是一种特殊的类型，表示类型值
  types = map<string, type>
}

// 我们可以在类型的末尾使用 `?` 表示可选类型
struct User2 {
  name = string
  age = int?
  // 列表类型
  parent_ids = [string?]
}

```

### 值

Faasit 中的值系统定义了表达式以及值。

Faasit 支持字面值，简单惰性求值表达式以及组合值
(由插件使用来进行评估)。

注意:对于编译时可以被折叠的表达式，生成的 IR 中的值将折叠为常量字面量。

值包括以下类型

**原子类型**

- int: `123`
- string: `"hello"`
- boolean: `false`, `true`

**复合类型**

- list: `[1, 2, 3]`
- object: `{a = 1, b = 2, c = {a = 1, b = [1, 2, 3]}}`

**引用类型**

引用其他值

- ref: `{ functions = [GetEmail]}`

DSL 示例

```faasit
// 使用const块定义常量值
const {
  PI = 3.1415926
  E = 2.7182818
}

const {
  LogLevelError = "error"
  LogLevelInfo = "info"
  LogLevelDebug = "debug"
  names = ["hello", "world"]
}

// 在块中使用值
@resource for Func1 {
  // 使用对象值
  requests = {
    cpu = "1000m"
  }
}
```

IR 示例

```yaml
values:
  - kind: v_int
    value: 123
  - kind: v_string
    value: "hello"
  - kind: v_bool
    value: false
  - kind: v_list
    items:
      - kind: v_int
        value: 123
  - kind: v_object
    props:
      - key: "a"
        value:
          kind: v_int
          value: 123
      - key: "c"
        value:
          kind: v_object
          value: ...
  - kind: v_ref
    id: "__main__::GetEmail"
```

### 块

在 Faasit 中，块是定义函数、资源和其他构造块的基本构建块。

使用 `block` 定义自定义快类型，并使用 `@<block_type>` 使用这些自定义块类型定义块

DSL 示例:

```faasit

// 使用`block`定义自定义块类型
block function {
  props = {
    input = type
    output = type
    handler = string
  }
}

// 使用前缀字符`@`使用定义的自定义块类型
@function A {
  input = {}
  output = {}
  handler = "main"
}

// 使用具有属性的定义的自定义块类型
block provider {
  props = {
    provider = string
    runtime = string
  }
}

// 使用具有属性的定义的自定义块类型
@provider {
  kind = "aws"
  runtime = "go1.18"
}
```

IR 示例

```yaml
blocks:
  - kind: m_block
    name: provider
    props: ...

  - kind: m_custom
    block_type: __main__::provider
    props:
      - name: kind
        value: ...
```

### 装饰器

Faasit 的装饰器系统将元数据注解给不同的语义对象。

它类似于其他语言中的注解或装饰器。

插件可以定义装饰器并进行处理。

装饰器格式为 `#[decorator(params)]`(类似于 Rust)

```faasit

// 使用`decorator`块定义装饰器
decorator description {
  params = {
    value = string
  }
}

// 使用装饰器注释struct的字段
struct User {
  #[description("name is the user's name")]
  name = string
}
```

### 符号

在 Faasit 中，符号是指向当前模块或外部模块中定义的其他语义对象的特殊字符串。

在语义分析阶段，编译器构造作用域符号表，并使用符号进行类型检查。

为了简化插件开发人员的使用，编译器会扁平化处理过的构造好的符号表，并存放至 IR
中。

IR 示例:

```yaml
packages:
  id: __main__
  kind: p_entry
  symbols:
    - id: std/faas::function
      kind: b_custom
      ...
```
