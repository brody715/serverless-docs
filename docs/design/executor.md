# Faasit 执行器

执行器接收 IR 作为输入，并根据 IR 描述的 Serverless 应用部署信息，执行实际的部署

执行器使用 nodejs 实现，作为 npm 库 `faasit`

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
