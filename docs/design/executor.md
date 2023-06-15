---
title: Faasit 执行器
---

# Faasit 执行器

执行器接收 IR 作为输入，并根据 IR 描述的 Serverless 应用部署信息，执行实际的部署

执行器使用 nodejs 实现，作为 npm 库 `faasit`

## Components

Executor 分为两个阶段，plan 和 execute

Plan 阶段会根据用户的输入 IR 以及从外部环境（如 Serverless Provider）采集到的信息，生成执行计划，如数据的变更

Plan 生成的执行计划需要可序列化以及反序列化

Execute 阶段会根据执行计划，执行实际的操作，如部署或者删除

## Use flow

1. 用户使用 `faasit init --name project` 创建 Serverless 项目

   项目结构

   ```yaml
   - src/  # serverless source code
     - index.js
   - main.ft  # faasit manifest
   - package.json  # faasit package manifest (same as nodejs)
   ```

2. 用户编写 `main.ft` 文件，描述 Serverless 应用部署信息

   ```faasit
   @function HelloWorld {
      runtime = "nodejs:1.16"
      codeUri = "./src"
      handler = "index.handler"
      resource = {
        cpu = "1000m"
        memory = "128Mi"
      }

      triggers = [{
        name = "http"
        type = "http"
        methods = ["GET"]
      }]
   }

   @application App {
      provider = "knative"
      functions = [HelloWorld]
   }
   ```

3. 用户使用 `faasit deploy` 部署 Serverless 应用

   ```bash
   $ faasit deploy
   ```

   执行器根据 `main.ft` 文件描述的部署信息，执行实际的部署

   ```bash
   $ faasit deploy
   [faasit] Deploying application App
   [faasit] Deploying function HelloWorld
   [faasit:knative] Building docker image
   [faasit:knative] Deploying function HelloWorld ok
   [faasit:knative] Deploying application App ok
   ```
