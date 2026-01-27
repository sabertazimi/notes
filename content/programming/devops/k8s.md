---
tags: [Programming, DevOps, Container, Kubernetes]
---

# Kubernetes

## Installation

```bash
# 查看帮助
kubectl --help

# 查看API版本
kubectl api-versions

# 查看集群信息
kubectl cluster-info
```

## Create

```bash
# 创建并运行一个指定的镜像
kubectl run NAME --image=image [params...]
# e.g. 创建并运行一个名字为nginx的Pod
kubectl run nginx --image=nginx

# 根据YAML配置文件或者标准输入创建资源
kubectl create RESOURCE
# e.g.
# 根据nginx.yaml配置文件创建资源
kubectl create -f nginx.yaml
# 根据URL创建资源
kubectl create -f https://k8s.io/examples/application/deployment.yaml
# 根据目录下的所有配置文件创建资源
kubectl create -f ./dir

# 通过文件名或标准输入配置资源
kubectl apply -f (-k DIRECTORY | -f FILENAME | stdin)
# e.g.
# 根据nginx.yaml配置文件创建资源
kubectl apply -f nginx.yaml
```

## Get

```bash
# 查看集群中某一类型的资源
kubectl get RESOURCE
# 其中，RESOURCE可以是以下类型：
kubectl get pods / po         # 查看Pod
kubectl get svc               # 查看Service
kubectl get deploy            # 查看Deployment
kubectl get rs                # 查看ReplicaSet
kubectl get cm                # 查看ConfigMap
kubectl get secret            # 查看Secret
kubectl get ing               # 查看Ingress
kubectl get pv                # 查看PersistentVolume
kubectl get pvc               # 查看PersistentVolumeClaim
kubectl get ns                # 查看Namespace
kubectl get node              # 查看Node
kubectl get all               # 查看所有资源

# 后面还可以加上 -o wide 参数来查看更多信息
kubectl get pods -o wide

# 查看某一类型资源的详细信息
kubectl describe RESOURCE NAME
# e.g. 查看名字为nginx的Pod的详细信息
kubectl describe pod nginx
```

## Update

```bash
# 更新某个资源的标签
kubectl label RESOURCE NAME KEY_1=VALUE_1 ... KEY_N=VALUE_N
# e.g. 更新名字为nginx的Pod的标签
kubectl label pod nginx app=nginx

# 设置某个资源的副本数
kubectl scale --replicas=COUNT RESOURCE NAME
# e.g. 设置名字为nginx的Deployment的副本数为3
kubectl scale --replicas=3 deployment/nginx

# 根据配置文件或者标准输入替换某个资源
kubectl replace -f FILENAME
# e.g. 根据nginx.yaml配置文件替换名字为nginx的Deployment
kubectl replace -f nginx.yaml
```

## Delete

```bash
# 删除某个资源
kubectl delete RESOURCE NAME
# e.g. 删除名字为nginx的Pod
kubectl delete pod nginx

# 删除某个资源的所有实例
kubectl delete RESOURCE --all
# e.g. 删除所有Pod
kubectl delete pod --all

# 根据YAML配置文件删除资源
kubectl delete -f FILENAME
# e.g. 根据nginx.yaml配置文件删除资源
kubectl delete -f nginx.yaml
```

## Log

```bash
# 进入某个Pod的容器中
kubectl exec [-it] POD [-c CONTAINER] -- COMMAND [args...]
# e.g. 进入名字为nginx的Pod的容器中，并执行/bin/bash命令
kubectl exec -it nginx -- /bin/bash

# 查看某个Pod的日志
kubectl logs [-f] [-p] [-c CONTAINER] POD [-n NAMESPACE]
# e.g. 查看名字为nginx的Pod的日志
kubectl logs nginx

# 将某个Pod的端口转发到本地
kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]
# e.g. 将名字为nginx的Pod的80端口转发到本地的8080端口
kubectl port-forward nginx 8080:80

# 连接到现有的某个Pod（将某个Pod的标准输入输出转发到本地）
kubectl attach POD -c CONTAINER
# e.g. 将名字为nginx的Pod的标准输入输出转发到本地
kubectl attach nginx

# 运行某个Pod的命令
kubectl run NAME --image=image -- COMMAND [args...]
# e.g. 运行名字为nginx的Pod
kubectl run nginx --image=nginx -- /bin/bash
```

## Dashboard

```bash
# 在master节点上安装portainer，并将其暴露在NodePort 30777上
kubectl apply -n portainer -f https://downloads.portainer.io/ce2-19/portainer.yaml
```
