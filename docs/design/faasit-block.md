# Faasit Block 设计

## Custom Block

Custom Block 定义方式

```ft
block function {
  input = {
    runtime = string
    codeUri = string
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
namespace ir {
  export interface CustomBlock {
    id: string;
    input: unknown;
    output: unknown;
  }
}

interface ICustomBlockPlugin {
  name: string;
  evaluate?: {
    on: string[];
    evaluate: (ctx: {
      svc: IrService;
      block: ir.CustomBlock;
      blockWriter: CustomBlockWriter;
    }) => Promise<void>;
  };

  traverse?: {
    on: string[];
    traverse: (ctx: {svc: IrService}) => Promise<void>;
  };
}
```

main.ft

可在 `main.ft` 或者 `lib.ft` 中的 lib block 配置项中配置需要启用的 Plugin

Plugin 通过 `on` 设置感兴趣的 CustomBlock，引擎会在遍历 IR 时，根据 `on` 的设置，将感兴趣的 CustomBlock 传递给 Plugin
