# Serverless Concept Models

Serverless 部署涉及到的概念模型

## Concept Models

### Function

表示 Serverless 函数

**Function 基本信息**

包括函数的代码 URI，运行时，处理函数名称等

**Function 资源需求**

指定函数运行时所需的计算资源，如内存，CPU 等

**Function 触发器**

```ts
export interface Function {
  runtime: string;
  codeDir: string; // source code directory to bundle
  resource: {
    memory: string;
    cpu: string;
  };
  triggers: {}[];
}
```

### Trigger

函数触发器，基于事件驱动机制触发函数执行

```ts
export interface Trigger {
  name: string;
  type: string;
  props: unknown;
}
```

### Application

Application 表示当前部署的 Serverless 应用

一个 Application 可能包含多个 Function

Application 需要指定默认的部署参数，比如使用的 Provider

```ts
export interface Application {
  provider: {
    name: string;
    props: {};
  };
  functions: Function[];
}
```

执行器会解析入口模块的 Application，并执行实际的部署

## Function 部署过程涉及到的阶段

函数部署会涉及以下阶段

- 状态查询：向集群查询部署状态，判断是否已有部署
- 构建：打包用户代码和依赖，执行构建，生成 Artifact
- 上传：将构建好的 Artifact 上传到指定的存储服务
- 执行部署：调用 Provider 提供的 API，创建函数资源

对于基于 Kubernetes 的 Serverless 平台，如 OpenFaas，OpenWhisk 和 Knative。函数的运行基本单位为 POD，产物为 Docker 镜像。

对于腾讯云，阿里云等公有云厂商，产物为构建好的二进制文件，打包为 zip，并需要上传至 OSS
