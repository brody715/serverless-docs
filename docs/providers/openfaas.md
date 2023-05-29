# OpenFaaS

## Design

Invoke a function

![Alt text](https://docs.openfaas.com/images/invoke.png)

## Deploy

see https://docs.openfaas.com/deployment/kubernetes/

Install arkade

```sh
curl -SLsf https://get.arkade.dev/ | bash
```

Install the OpenFaas app

```sh
# switch k8s context first
arkade install openfaas
```

## Features

### Deploy

`faas-cli deploy -f ./stack.yml`

### Invoke

`faas-cli invoke <function-name>`
