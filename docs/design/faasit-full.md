---
ignore: true
---

# Faasit

Faasit is a domain-specific language (DSL) used for modeling serverless
applications. Its compiler toolchain offers the following features:

- Defining functions and platform resources
- Deploying functions across different cloud providers automatically
- Generating test cases automatically
- Simulating functions locally

Faasit offers several language features to facilitate coding, including

- Module system
- Type system
- Decorator system

## Project Status

The language design and development of the toolchain is **working in progress**.

- [x] Design the basis of the language

The language features

- [x] Define basic types and models

- [x] Define functions, cloud service

## Overview

Faasit is not a general-purpose language (GPL) and
currently does not support conditions, loops, or recursion. Its main purpose is
modeling and writing infrastructure code for serverless applications, similar to
[Terraform](https://github.com/hashicorp/terraform) or other DSLs.

Faasit applies the concept of Model-Driven Engineering (MDE) in software
engineering. The toolchain uses Model Transformation Techniques to transform the
DSL into variant models.

Faasit provides two language interfaces: the DSL and the Intermediate
Representation (IR).

The DSL offers an easy-to-use and expressive interface for users to write
high-level code in the `faasit` language. The faasit toolchain can then operate
on this DSL code.

The IR, on the other hand, offers a low-level and more machine-friendly
interface for compiler or plugin developers. The IR is expressed in
text-friendly JSON or YAML, making it easy to read and write.

## Semantic Components

- Module
- Types
- Values
- Blocks
- Decorators
- Symbols

### Module

A module serves as the fundamental unit of Faasit code, defining various
entities such as types, values, blocks, and decorators.

The `import` clause allows the module to refer to other modules using their
unique identifiers.

Import resolution works similarly to Go, treating all files in the same
directory as a single module.

The module identifier is defined in the format `std/sema`.

Notably, there is a special module identified as `__main__`, which serves as the
entry point module for Faasit compiler, facilitating both code-generation and
dead-code elimination processes.

DSL Example

```faasit

// example1.ft
import (
  "std/sema"

  // module can be aliased
  swagger "github.com/faasit/x/swagger/v1"
  faas "std/faas"
)

// We can alias symbol by `use` clause in the module, alias can be then used in this module or export to other modules.
use {
  function = faas.function
  resource = faas.resource
  provider = faas.provider
}

// Define function
@function GetEmail {
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

// Children blocks can be defined in the module, using `for`
// Define resource
@resource for GetEmail {
  cpu = "1000m"
  memory = "128Mi"
}

// Define provider details
@provider for GetEmail {
  provider = "aws"
  region = "us-east-1"
  runtime = "go1.18"
}

@provider for GetEmail {
  provider = "aliyun"
  region = "cn-hangzhou"
  runtime = "go1.18"
}
```

IR Example

```yaml
modules:
  - id: __main__
    kind: m_inline
    blocks:
      - kind: b_custom
        block_type: "core/faas::function"
        name: "GetEmail"
        props: {}
        ...
    symbols:
      - id: "core/faas::function"
        kind: "b_block"
        ...
  - id: core/faas
    kind: m_ref
    version: 0.1.0
```

### Types

The type system in Faasit defines the types of values and user-defined types.
One of the most important types in Faasit is the `struct` type.

In some object-oriented languages, `struct` is often used to represent `object`,
`class`, or `entity`. A `struct` contains a list of properties, and users can use it
to represent different kinds of models.

DSL Example

```faasit
struct User {
  name = string
  age = int
  is_married = bool
  // map and any type
  props = map<string, any>
  // 'type' is a special type, represents type value
  types = map<string, type>
}

// we can use `:` instead of `=`
// we can use '?' at the end of type, to represent optional type
struct User2 {
  name: string
  age: int?
  // list type
  parent_ids: [string?]
}

// we can use typedef to define alias of type
typedef {
  UserList = [User]
  UserMap = map<string, User>
}
```

### Values

The value system in Fassit defines the values used in different places.

It currently supports both literal values and simple lazy evaluated expressions
(Used by plugins to evaluate).

Notice: For those expression can be const-folded during compile time, the value
in generated IR will fold into constant literal.

DSL Example

```faasit

// define constant values using const block
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

// use value in blocks
@resource for Func1 {
  // use object value
  requests = {
    cpu = "1000m"
  }
}
```

### Blocks

In Faasit, block is a first-class citizen that serves as the building block for
defining functions, resources, and other constructs.

Custom blocks can be defined and plugins can be provided to handle them.

DSL Example

```faasit

// Define a custom block using `block`
block function {
  props = {
    input = type
    output = type
    handler = string
  }
}

// Use the defined custom block with the prefix char '@'
@function A {
  input = {}
  output = {}
  handler = "main"
}

// Define a custom block with props
block provider {
  props = {
    provider = string
    runtime = string
  }
}

// Use the defined custom block with props
@provider {
  provider = "aws"
  runtime = "go1.18"
}
```

### Decorators

Faasit's decorators system annotates metadata to different semantic objects.

It is similar to features such as annotation or decorator in other languages.

Plugins can define decorators and handle their usage.

Decorators can be used in this format `#[decorator(params)]` (similar to Rust).

```faasit

// define decorator using `decorator` block
decorator description {
  params = {
    value = string
  }
}

// use decorator to annotate the fields of a struct
struct User {
  #[description("name is the user's name")]
  name = string
}
```

### Symbols

In Faasit, symbols are special string components that refer to other semantic
objects defined in either the current module or external module.

During stage semantic analysis, the compiler constructs scoped symbol tables and
performs type checking with the definition and usage of those symbols.

To simplify the usage for plugin developers, once the compiler has constructed
the scoped symbol table, it flattens them and produces a flatten symbol table
that can be easily used in the plugins code.

IR Example

```yaml
modules:
  id: __main__
  kind: m_inline
  symbols:
    - id: std/faas::function
      kind: b_custom
      ...
```
