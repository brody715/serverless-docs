# Serverless Concept Models

Serverless 是一种计算模型，它使得开发者能够在无需管理服务器和基础架构的情况下运
行代码（或称函数）。使用无服务器计算，开发者可以将代码上传到云平台，平台会在需要
时根据流量自动进行资源分配和处理。

Serverless 的特点

- 按需分配
  - 无服务器计算基于事件驱动和按需调用，只在需要时才会进行计算资源的分配和管理
- 弹性伸缩
  - 无服务器计算平台会自动根据负载量的变化进行资源的动态分配和优化，无需手动干预
- 简化开发与部署
  - 开发者专注于编写核心业务逻辑代码，简化应用开发以及部署流程

## Concept Models

### Serverless 核心资源

**Service**

- 阿里云提供服务这一抽象
- 服务是函数计算资源管理的单位，同一服务下的所有函数共享一些设置，如服务授权和日志配置
- 一个应用可拆分为多个服务，一个服务可由多个函数组成

**Function**

- 云函数，云函数由代码和运行环境描述组成
- 云函数可能依赖于其他云函数，或者外部服务，如对象存储，API 网关，消息队列

**Trigger**

- 触发器，用于在满足某些条件时，触发 Function 的执行
- 基于事件驱动
- 常见的触发器类型
  - 定时触发器 Cron Trigger
  - API 网关触发器 HTTP Trigger
  - 消息队列触发器 MQ Trigger

**External Service**

- 云函数在运行过程中，可能调用外部的服务完成任务，如调用 Redis 或 RDBMS 存储状态

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
