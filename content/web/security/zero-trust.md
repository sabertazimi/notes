---
sidebar_position: 3
tags: [Web, Security, Zero Trust, Access Control]
---

# Zero Trust

从防御的角度来讲, 内部风险是外部风险的超集:
当攻击者攻陷任何一个内部人员 (合法用户或员工) 的设备后,
攻击者便成了内部人员.
[零信任](https://zchn.github.io/j/ztcn)
从这个角度看就是假设任何一台主机都有可能被攻陷.

## Chain of Trust

零信任并不是完全没有信任,
而是几个基本的最小化的信任根 (Root of Trust),
重构信任链 (Chain of Trust).
通过一系列的标准化流程 (Standard Process) 建立的一个完整的信任链
(信任树 Tree of Trust 或者信任网 Web of Trust).

几个典型的例子包括:

- 多因子认证 (MFA, Multi-Factor Authentication):
  人的身份的信任根.
- 可信平台模块 (TPM, Trusted Platform Module)和可信启动 (Trusted Boot):
  机器的身份的信任根.
- 源代码和可信编译 (Trusted Build):
  软件的信任根.

## Identity 2.0

身份 2.0 是对于以上的信任链的标准化,
以便于在安全访问策略中使用这些在建立信任过程中收集到的信息.

在身份 2.0 中, 一切本体 (Entity) 都有身份.
用户有用户身份, 员工有员工身份, 机器有机器身份, 软件有软件身份.

在身份 2.0 中, 一切访问 (Access) 都带有访问背景 (Access Context):

- 目的: 为了帮助用户解决一个技术问题
- 访问者: 员工 A
- 授权者: 用户 B
- 访问方式: 软件 C
- 访问地点: 机器 D

## Continuous Access Control

持续访问控制会在软件开发和运行的各个环节持续地进行访问控制:

- 在员工登录时要求提供多因子认证.
- 在部署软件时要求软件是从信任的源码库在安全的环境中编译而来,
  并经过代码评估 (Code Review).
- 在主机之间建立连接时要求双方提供主机完整性证明.
- 在微服务获取特定用户数据时要求提供该用户的授权令牌 (Authorization Token).

## Basement

零信任的实施依赖于扎实的基础安全架构, 没有基础就没有上层建筑.
谷歌零信任依赖于以下基础设施提供的基本安全保障:

- 数据加密和密钥管理 (Encryption and Key Management)
- 身份和访问管理 (Identity and Access Management)
- 数字化人力资源管理 (Digital Human Resource)
- 数字化设备管理 (Digital Device Management)
- 数据中心安全 (Data Center Security)
- 网络安全 (Network Security)
- 主机安全 (Host Security)
- 容器隔离 (Container Isolation, gVisor)
- 可信启动 (Trusted Boot)
- 可验证编译 (Verifiable Build)
- 软件完整性验证 (Software Integrity Verification)
- 双向 TLS (mTLS)
- 基于服务的访问策略 (Service Access Policy)
- 终端用户令牌 (End User Context Tokens)
- 配置即代码 (Configuration as Code)
- 标准化开发和部署 (Standard Development and Deployment)
