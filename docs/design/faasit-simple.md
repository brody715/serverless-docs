# Intro

简化版 Faasit 语言，现阶段版本的编译器只需支持以下特性

## IR Model

IR 以 YAML 格式表示，可以被执行器处理，基本格式如下

```yaml
version: "0.1.0"
modules:
  - id: __main__
    kind: m_inline
```

每个语义对象都有一个 `kind`，`kind` 用于标识语义对象的类型。

语义对象的 kind 值会根据其类型，会带上一个字母的前缀，比如 module 的 `m_`，block 的 `b_`，value 的 `v_`

比如内联模块，kind 为 `m_inline`；自定义块，kind 为 `b_custom`。

## Language Features

Faasit 包含语义对象

### 1 Module

每一个 Faasit 文件是一个模块，一个模块包含多个 block。目前不支持引入外部模块。

**main** 模块是 Faasit 的入口，其 id 为 `__main__`。

IR Example

```yaml
modules:
  - id: __main__
    kind: m_inline
    blocks: []
```

### 2 Block

Block 表示一个概念对象，比如 Function, Resource 等。

文法格式

`@<block_type_name> <block_name> { <value_block> }`

目前只有一种 block 类型，即 value_block，其文法格式和值对象 object 一致

IR Example

```yaml
modules:
  - id: __main__
    kind: m_inline
    blocks:
      - kind: b_custom
        block_type: "std/faas::function"
        name: GetEmail
        props: {}
```

props 为 object value

为了简化实现，现在硬编码几种 custom block 的类型

- `@application`: `std/faas::application`
- `@function`: `std/faas::function`

### 3 Values

Value 表示值，支持嵌套。包括以下类型

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

IR Example

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

## Example

编译器需要读入以下 DSL，并转换为对应的 IR YAML

见 [./examples/simple.in.ft](./examples/simple.in.ft)
