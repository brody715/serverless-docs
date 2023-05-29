# Serverless Concept Models

Serverless 部署涉及到的概念模型

## Function

表示 Serverless 函数

**Function 基本信息**

包括函数的代码 URI，运行时，处理函数名称等

**Function 资源需求**

指定函数运行时所需的计算资源，如内存，CPU 等

**Function 触发器**

```ts
export interface Function {
  runtime: string;
  codeUri: string;
  handler: string;
  resource: {
    memory: string;
    cpu: string;
  };
  triggers: {}[];
}
```

## Trigger

函数触发器，基于事件驱动机制触发函数执行

```ts
export interface Trigger {
  name: string;
  type: string;
  props: unknown;
}
```

## Application

Application 表示当前部署的 Serverless 应用

一个 Application 可能包含多个 Function

Application 需要指定默认的部署参数，比如使用的 Provider

```ts
export interface Application {
  provider: string;
  functions: Function[];
}
```

执行器会解析入口模块的 Application，并执行实际的部署
