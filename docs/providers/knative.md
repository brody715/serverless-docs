---
title: Knative
---

# Knative

Serverless Containers in Kubernetes environments

## Install knative

**Install Knative CLI**

Knative CLI 用来管理 Knative Serving 和 Event 的资源

```sh
cd ~/tools/downloads
wget https://github.com/knative/client/releases/download/knative-v1.10.0/kn-linux-amd64 -O kn
chmod +x kn
mv kn ~/tools/bin
```

**Install Knative Function CLI**

用来管理 Function

```sh
cd ~/tools/downloads
wget https://github.com/knative/func/releases/download/knative-v1.10.0/func_linux_amd64 -O func
chmod +x func
mv func ~/tools/bin
```

**Install Knative Operator**

- https://knative.dev/docs/install/operator/knative-with-operators/#prerequisites

1. Install with yaml

   ```bash
   kubectl apply -f https://github.com/knative/operator/releases/download/knative-v1.10.2/operator.yaml
   ```

   version 1.3

   ```bash
   kubectl apply -f https://github.com/knative/operator/releases/download/knative-v1.3.2/operator.yaml
   kubectl apply -f https://github.com/knative/operator/releases/download/knative-v1.3.2/operator-post-install.yaml
   ```

2. Verify installation

   ```bash
   # it will install the operator in default namespace
   kubectl get deployment knative-operator -n default
   kubectl logs -f deploy/knative-operator -n default
   ```

3. K8s version and Knative version

   - https://github.com/knative/community/blob/main/mechanics/RELEASE-SCHEDULE.md
   - knative 1.3 support k8s 1.21

**Install knative serving**

1.  Install

    ```bash
    # fetch ip
    kubectl --namespace knative-serving get service kourier

    # verify deployments
    kubectl get deployment -n knative-serving

    # check the status
    kubectl get KnativeServing knative-serving -n knative-serving
    ```

2.  Configure DNS

    configure DNS to prevent the need to run curl commands with a host header.

    Use sslip.io as the default DNS suffix

    ```bash
    kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.10.2/serving-default-domain.yaml
    ```

**Install Knative Event**

TODO

## Components

### Knative Serving

- Provides Router and CR for deploying serverless functions
- Provides Autoscaling and Revision for scaling and versioning
- Support for multiple networking layers, like Kourier or Istio

**K8s Custom Resource**

![](https://github.com/knative/serving/raw/main/docs/spec/images/object_model.png)

**Knative Serving Architecture**

![](https://knative.dev/docs/serving/images/serving-architecture.png)

### Knative Eventing

- Provides Broker and Channel for deploying event-driven application

## Function CLI Usage

**Docs**

- https://knative.dev/docs/getting-started/create-a-function/

**Creating a function**

```sh
func create -l <language> <function-name>

func create -l go hello
```

**Deploy**

```sh
# build & specify registry
func run [--registry <registry>]

# build force
func run --build=false

# invoke
func invoke
```
