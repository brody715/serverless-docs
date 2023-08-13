# Faasit Block 设计

## Custom Block

Custom Block 定义方式

```ft
block function {
  input = {
    runtime = string
    codeUri = string
  }
  output_config = {
    include_input = true
  }
  output = {}
}
```

Custom Block 使用方式

```ft
@function A {
  runtime = "Hello"
  codeUri = "./code"
}
```

Faasit 库实现 `ICustomBlockPlugin` 接口

```ts
export interface CustomBlock {
  schema: {},
  input: T1,
  output: T2
}
interface ICustomBlockPlugin {
  name: string;
  transform(block: ir.CustomBlock): CustomBlockValue;
}
```
