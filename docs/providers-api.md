## 介绍

### Serverless

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

### Serverless DSL 主要功能

- Serverless 应用生命周期管理
  - 管理应用的开发、调试、部署、运维
- Serverless 运维特征描述
  - 代码位置
  - 所需计算和内存资源
  - 部署区域
  - 依赖的外部服务，事件
- CICD 集成
- 可观测性
  - 接入云厂商提供的可观测性服务
  - 查询函数运行时指标 metrics 以及 日志 logs
- 多模调试
  - 提供本地运行，在线运行，端云联调等功能
  - 支持本地模拟 Serverless 云上环境，用于测试

## Provider

Provider 提供 Serverless 服务，分为以下两类

**公有云提供商**

如阿里云，腾讯云，AWS 等

**开源 Serverless 平台**

如 OpenFaas，OpenWhisk，Knative 等。一般基于 Kubernetes 集群

### 阿里云 API

**重要 API 整理**

详细文档见 https://help.aliyun.com/document_detail/415668.html

| **API**                                                              | **概述**       | **其他** |
| -------------------------------------------------------------------- | -------------- | -------- |
| [CreateService](https://help.aliyun.com/document_detail/415719.htm)  | 创建服务       |          |
| [GetService](https://help.aliyun.com/document_detail/415723.htm)     | 获取服务信息   |          |
| [CreateTrigger](https://help.aliyun.com/document_detail/415729.htm)  | 创建触发器     |          |
| [GetTrigger](https://help.aliyun.com/document_detail/415732.htm)     | 获取触发器信息 |          |
| [CreateFunction](https://help.aliyun.com/document_detail/415747.htm) | 创建函数       |          |
| [GetFunction](https://help.aliyun.com/document_detail/415750.htm)    | 获取函数信息   |          |
| [InvokeFunction](https://help.aliyun.com/document_detail/415753.htm) | 调用函数       |          |

### 腾讯云 API

重要 API 整理

详细文档见 https://cloud.tencent.com/document/product/583/17235

| **API**                                                            | **概述**           | **其他** |
| ------------------------------------------------------------------ | ------------------ | -------- |
| [CreateTrigger](https://cloud.tencent.com/document/api/583/18589)  | 创建触发器         |          |
| [ListTriggers](https://cloud.tencent.com/document/api/583/44268)   | 获取函数触发器列表 |          |
| [CreateFunction](https://cloud.tencent.com/document/api/583/18586) | 创建函数           |          |
| [GetFunction](https://cloud.tencent.com/document/api/583/18584)    | 获取函数信息       |          |
| [Invoke](https://cloud.tencent.com/document/api/583/17243)         | 调用函数           |          |

### OpenFaaS API

重要 API 整理

详细文档见 https://github.com/openfaas/faas/tree/master/api-docs

| **API**         | **概述**     | **地址**                       |
| --------------- | ------------ | ------------------------------ |
| Deploy Function | 创建函数     | `POST /system/functions`       |
| Get Functions   | 获取函数列表 | `POST /system/functions`       |
| Invoke Function | 调用函数     | `POST /function/{functioName}` |

### Openwhisk

见 [./providers/openwhisk.md](./providers/openwhisk.md)

## 参考资料

- ServerlessDevs - 阿里云函数
  - https://github.com/devsapp/fc
- 阿里云函数计算 FC - API 文档
  - https://help.aliyun.com/document_detail/415668.html
- 腾讯云函数 SCF - API 文档
  - https://cloud.tencent.com/document/product/583/17235
- OpenFaaS API 文档
  - https://docs.openfaas.com/
  - 使用 https://editor.swagger.io/ 预览 swagger API 文档
  - https://github.com/openfaas/faas/tree/master/api-docs
