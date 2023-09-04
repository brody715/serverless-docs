# 设计目标

## Faasit 语言

- [ ] CustomBlock 设计
- [ ] 符号系统
- [ ] 模块系统
- [ ] 类型系统
- [ ] Language Server

## 代码生成

- [ ] 基于模板与规则的代码生成器
  - [ ] 生成函数出、入参类型定义
  - [ ] 生成外部依赖 Mock 定义
  - [ ] 生成函数启动框架 （HTTP Server、PubSub Server ...)
  - [ ] 生成简单的端到端测试用例、性能测试用例
- [ ] 基于 LLM 的代码生成器
  - [ ] 根据业务场景描述，自动生成函数业务逻辑代码
  - [ ] 根据测试描述，自动生成测试用例代码

## 执行部署

- [ ] 实现类似于 Terraform，基于 Plan、Apply 的部署方式
- [ ] 部署至 Knative 平台

## Serverless 描述

- [ ] 具有代表性的 Serverless 应用
- [ ] 单 Serverless 函数的运维特征
- [ ] 多 Serverless 函数的编排描述
- [ ] 描述函数的同步、异步调用

## DevOps

- [ ] 使用 Faasit 描述 CI/CD 工作流程
- [ ] 实现程序 `faasit-ci-runner` 运行 CI/CD 工作流程
- [ ] 实现命令 `ft ci` 在本地运行 CI/CD 流程
- [ ] 基于 Docker 容器实现 CI 插件，或利用已有的 CI 插件
- [ ] 如何用现有 CI 系统交互？(Github Actions, Gitlab CI, Jenkins, Drone CI ...)
