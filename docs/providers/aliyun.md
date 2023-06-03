## CreateService

### 参数


| 参数名          | 描述                              | 类型    | 是否必填 |
| -------------- | --------------------------------- | ------- | -------- |
| serviceName    | 服务的名称                        | string  | 是       |
| description    | 服务的描述信息                    | string  | 否       |
| internetAccess | 是否允许公网访问                  | boolean | 否       |
| role           | 服务所使用的角色                  | string  | 是       |
| vpcConfig      | 服务的VPC配置                      | dict    | 否       |
| logConfig      | 服务的日志配置                      | dict    | 否       |
| nasConfig      | 服务的NAS配置                       | dict    | 否       |

`vpcConfig` 字典包含以下键值：

| 键名        | 描述                          | 类型   | 是否必填 |
| ----------- | ----------------------------- | ------ | -------- |
| VpcId       | VPC的ID                        | string | 是       |
| VSwitchIds  | VSwitch的ID列表                | list   | 是       |

`logConfig` 字典包含以下键值：

| 键名       | 描述                          | 类型   | 是否必填 |
| ---------- | ----------------------------- | ------ | -------- |
| Project    | 日志服务的项目名称            | string | 是       |
| Logstore   | 日志服务的日志库名称          | string | 是       |

`nasConfig` 字典包含以下键值：

| 键名         | 描述                          | 类型   | 是否必填 |
| ------------ | ----------------------------- | ------ | -------- |
| MountPoints  | NAS挂载点列表                  | list   | 是       |
| UserId       | 用于访问NAS的用户ID            | string | 是       |
| GroupId      | 用于访问NAS的用户组ID          | string | 是       |



### 返回值


| 返回值名称      | 描述                           | 类型     |
| -------------- | ------------------------------ | -------- |
| requestId      | 请求ID                         | string   |
| serviceId      | 服务的ID                       | string   |
| serviceName    | 服务的名称                     | string   |
| description    | 服务的描述信息                 | string   |
| internetAccess | 是否允许公网访问               | boolean  |
| role           | 服务所使用的角色               | string   |
| vpcConfig      | 服务的VPC配置                   | dict     |
| logConfig      | 服务的日志配置                   | dict     |
| nasConfig      | 服务的NAS配置                    | dict     |
| createTime     | 服务的创建时间                  | string   |

`vpcConfig`字典包含以下键值：

| 键名         | 描述                           | 类型     |
| ------------ | ------------------------------ | -------- |
| VpcId        | VPC的ID                         | string   |
| VSwitchIds   | VSwitch的ID列表                 | list     |

`logConfig`字典包含以下键值：

| 键名         | 描述                           | 类型     |
| ------------ | ------------------------------ | -------- |
| Project      | 日志服务的项目名称             | string   |
| Logstore     | 日志服务的日志库名称           | string   |

`nasConfig`字典包含以下键值：

| 键名         | 描述                           | 类型     |
| ------------ | ------------------------------ | -------- |
| MountPoints  | NAS挂载点列表                   | list     |
| UserId       | 用于访问NAS的用户ID             | string   |
| GroupId      | 用于访问NAS的用户组ID           | string   |


## GetService

### 参数


| 参数名        | 描述                               | 类型     | 是否必填 |
| ------------- | ---------------------------------- | -------- | -------- |
| serviceName   | 服务的名称                         | string   | 是       |


### 返回值

| 返回值名称      | 描述                           | 类型     |
| -------------- | ------------------------------ | -------- |
| requestId      | 请求ID                         | string   |
| serviceId      | 服务的ID                       | string   |
| serviceName    | 服务的名称                     | string   |
| description    | 服务的描述信息                 | string   |
| internetAccess | 是否允许公网访问               | boolean  |
| role           | 服务所使用的角色               | string   |
| vpcConfig      | 服务的VPC配置                   | dict     |
| logConfig      | 服务的日志配置                   | dict     |
| nasConfig      | 服务的NAS配置                    | dict     |
| createTime     | 服务的创建时间                  | string   |

`vpcConfig`字典包含以下键值：

| 键名         | 描述                           | 类型     |
| ------------ | ------------------------------ | -------- |
| VpcId        | VPC的ID                         | string   |
| VSwitchIds   | VSwitch的ID列表                 | list     |

`logConfig`字典包含以下键值：

| 键名         | 描述                           | 类型     |
| ------------ | ------------------------------ | -------- |
| Project      | 日志服务的项目名称             | string   |
| Logstore     | 日志服务的日志库名称           | string   |

`nasConfig`字典包含以下键值：

| 键名         | 描述                           | 类型     |
| ------------ | ------------------------------ | -------- |
| MountPoints  | NAS挂载点列表                   | list     |
| UserId       | 用于访问NAS的用户ID             | string   |
| GroupId      | 用于访问NAS的用户组ID           | string   |

## CreateFunction

### 参数


| 参数名           | 描述                                        | 类型         | 是否必填 |
| ---------------- | ------------------------------------------- | ------------ | -------- |
| serviceName      | 函数所属的服务名称                          | string       | 是       |
| functionName     | 函数的名称                                  | string       | 是       |
| description      | 函数的描述信息                              | string       | 否       |
| runtime          | 函数的运行环境                              | string       | 是       |
| handler          | 函数的处理程序                              | string       | 是       |
| memorySize       | 函数的内存大小（单位：MB）                   | int          | 是       |
| timeout          | 函数的超时时间（单位：秒）                   | int          | 是       |
| initializer      | 函数的初始化程序                            | string       | 否       |
| initializerError | 初始化程序错误处理方式                      | string       | 否       |
| instanceConcurrency | 函数的实例并发数                          | int          | 否       |
| customContainerConfig | 函数的自定义容器配置                     | dict         | 否       |
| caPort           | 函数容器的端口号（仅适用于自定义容器）        | int          | 否       |
| environmentVariables | 函数的环境变量                           | dict         | 否       |
| vpcConfig        | 函数的VPC配置                               | dict         | 否       |
| logConfig        | 函数的日志配置                               | dict         | 否       |
| nasConfig        | 函数的NAS配置                                | dict         | 否       |
| mountPoints      | 函数的NAS挂载点列表                          | list[dict]   | 否       |
| instanceType     | 函数的实例类型                              | string       | 否       |
| code             | 函数的代码                                  | dict         | 是       |
| layers           | 函数的Layer列表                             | list[string] | 否       |
| deadLetterConfig | 函数的死信队列配置                          | dict         | 否       |
| tracingConfig    | 函数的追踪配置                              | dict         | 否       |
| caEnable         | 是否开启自定义容器功能（仅适用于自定义容器）  | boolean      | 否       |
| caFiles          | 自定义容器的CA证书文件列表（仅适用于自定义容器）| list[dict] | 否       |

#### runtime参数

runtime参数用于指定函数的运行环境。它决定了函数在何种语言和框架下执行。以下是runtime参数的常见取值及其对应的运行环境：

| runtime取值    | 运行环境                                 |
| -------------- | ---------------------------------------- |
| python2.7      | Python 2.7                               |
| python3.6      | Python 3.6                               |
| python3.7      | Python 3.7                               |
| python3.8      | Python 3.8                               |
| python3.9      | Python 3.9                               |
| nodejs6        | Node.js 6.x                              |
| nodejs8        | Node.js 8.x                              |
| nodejs10       | Node.js 10.x                             |
| nodejs12       | Node.js 12.x                             |
| nodejs14       | Node.js 14.x                             |
| nodejs16       | Node.js 16.x                             |
| java8          | Java 8                                   |
| java11         | Java 11                                  |
| php7.2         | PHP 7.2                                  |
| dotnetcore2.1  | .NET Core 2.1                            |
| dotnetcore3.1  | .NET Core 3.1                            |
| custom         | 自定义运行时环境                          |

对于大多数常用的编程语言和框架，可以直接选择相应的runtime取值。

对于自定义运行时环境，可以选择"custom"作为runtime的取值，并提供自定义的运行时环境。自定义运行时环境需要提供相应的配置和执行文件，以便在函数中正确运行。

#### code参数

code参数用于指定函数的代码内容或代码存储位置。根据函数的具体需求和使用情况，code参数可以采用不同的设置方式。以下是对code参数的详细介绍：

- 代码内容：可以直接将函数的代码内容作为字符串传递给code参数。这适用于函数代码比较简单且较短小的情况。将代码内容作为字符串传递给code参数时，通常需要指定runtime参数来指定函数的运行环境。

- 代码存储位置：可以将函数的代码存储在指定的位置，例如对象存储（如OSS）或代码仓库（如GitHub），然后通过code参数提供相关的配置信息来引用这些存储位置的代码。具体的设置方式会根据不同的云服务提供商和平台而有所不同，通常需要提供存储位置的信息（如存储桶名称、对象键或代码仓库地址等）。

对于直接传递代码内容的方式，阿里云提供了使用Base64编码的zip包方式。您可以将函数代码打包成zip包，并使用Base64编码将其转换为字符串，然后将该字符串作为`zipFile`字段的值传递给code参数。


对于代码存储位置的情况，您需要提供相应的配置信息，例如存储位置的访问密钥、存储桶名称、对象键等。具体的设置方式会因云服务提供商和平台而有所不同。例如，在使用对象存储（如OSS）存储位置的情况下，可以提供如下配置：

```python
code = {
  "ossBucketName": "my-bucket",
  "ossObjectName": "my-function.zip",
  "ossAccessKeyId": "my-access-key-id",
  "ossAccessKeySecret": "my-access-key-secret"
}

CreateFunction(serviceName="my-service", functionName="my-function", code=code, ...)
```

#### customContainerConfig参数


| 参数           | 描述                                                         |
|--------------|------------------------------------------------------------|
| image        | 指定要使用的容器镜像的名称。                                    |
| command      | 指定容器启动时要执行的命令。                                    |
| args         | 指定传递给容器启动命令的额外参数。                                |
| accelerationType         | 是否开启镜像加速。                       |
| webServerMode         |镜像运行是否为Web Server模式。取值为true表示需要在容器镜像中实现Web Server来监听端口并处理请求。取值为false表示需要容器运行后主动退出进程，并且ExitCode需要为0。|



### 返回值

- requestId (string): 请求ID。
- functionId (string): 函数的ID。
- functionArn (string): 函数的ARN。
- createTime (string): 函数的创建时间。

## GetFunction

### 参数

以下是GetFunction接口的参数列表，包括参数名、参数类型、是否必填和参数描述：

| 参数名           | 参数类型      | 是否必填   | 参数描述                                                |
|----------------|-------------|---------|-------------------------------------------------------|
| serviceName    | 字符串        | 是       | 函数所属的服务名称。                                           |
| functionName   | 字符串        | 是       | 要获取的函数名称。                                            |
| qualifier      | 字符串        | 否       | 函数版本或别名。如果未提供，则返回函数最新版本的信息。                           |


### 返回值

- requestId (string): 请求ID。
- functionId (string): 函数的ID。
- functionArn (string): 函数的ARN。
- serviceName (string): 函数所属服务的名称。
- functionName (string): 函数的名称。
- handler (string): 函数的处理程序。


- runtime (string): 函数的运行环境。
- code (string): 函数的代码内容。
- memorySize (integer): 函数的内存配置，单位为MB。
- timeout (integer): 函数的超时时间，单位为秒。
- initializer (string): 函数初始化的方法。
- instanceConcurrency (integer): 函数的并发执行数。
- customContainerConfig (dict): 自定义容器配置，包括Image、Command、Args等信息。
- createTime (string): 函数的创建时间。




## CreateTrigger

### 参数

- serviceName (string): 触发器所属服务的名称。
- functionName (string): 触发器所关联的函数的名称。
- triggerName (string): 触发器的名称。
- triggerType (string): 触发器的类型。
- triggerConfig (dict): 触发器的配置，根据不同类型的触发器而定。

### 返回值

- requestId (string): 请求ID。
- triggerId (string): 触发器的ID。
- triggerArn (string): 触发器的ARN。
- createTime (string): 触发器的创建时间。



## GetTrigger

### 参数

以下是GetTrigger接口的参数列表，包括参数名、参数类型、是否必填和参数描述：

| 参数名         | 参数类型   | 是否必填 | 参数描述                                   |
|-------------|----------|--------|------------------------------------------|
| serviceName | 字符串     | 是      | 触发器所属的服务名称。                            |
| functionName| 字符串     | 是      | 触发器所属的函数名称。                            |
| triggerName | 字符串     | 是      | 要获取的触发器名称。                             |


### 返回值

- requestId (string): 请求ID。
- triggerId (string): 触发器的ID。
- triggerArn (string): 触发器的ARN。
- serviceName (string): 触发器所属服务的名称。
- functionName (string): 触发器所关联的函数的名称。
- triggerName (string): 触发器的名称。
- triggerType (string): 触发器的类型。
- triggerConfig (dict): 触发器的配置。

## InvokeFunction

### 参数

以下是InvokeFunction接口的参数列表，包括参数名、参数类型、是否必填和参数描述：

| 参数名         | 参数类型   | 是否必填 | 参数描述                                          |
|-------------|----------|--------|-------------------------------------------------|
| serviceName | 字符串     | 是      | 函数所属的服务名称。                                   |
| functionName| 字符串     | 是      | 要调用的函数名称。                                    |
| payload     | 字符串     | 否      | 调用函数时传递的输入参数。可以是字符串形式的JSON数据。                          |
| qualifier   | 字符串     | 否      | 函数版本或别名。如果未提供，则使用函数的最新版本。                               |
| X-Fc-Invocation-Type | 字符串  | 否      | 函数调用的方式。可选值包括 "Sync"（同步）和 "Async"（异步）。默认为 "Sync"。         |
| X-Fc-Log-Type     | 字符串     | 否      | 函数调用的日志类型。可选值包括 "None"（无日志）和 "Tail"（返回完整日志）。默认为 "None"。 |


### 返回值

- requestId (string): 请求ID。
- result (string): 函数执行的结果。
