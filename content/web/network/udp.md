---
sidebar_position: 11
tags: [Web, Network, UDP]
---

# UDP

## Protocol

User Datagram Protocol (RFC 768):

- 数据报是一个完整, 独立的数据实体,
  携带着从源节点到目的地节点的足够信息,
  对这些节点间之前的数据交换和传输网络没有任何依赖.
- 无协议服务:
  UDP 仅仅是在 IP 层 (IP 源地址/目标地址) 之上通过嵌入应用程序的源端口和目标端口,
  提供了一个`应用程序多路复用`机制.
- 不可靠的服务传输:
  - 不保证消息交付: 不确认, 不重传, 无超时.
  - 不保证交付顺序: 不设置包序号, 不重排, 不会发生队头阻塞.
  - 不跟踪连接状态: 不必建立连接或重启状态机.
  - 不需要拥塞控制: 不内置客户端或网络反馈机制.
- Lightweight and connectionless service:
  - UDP 客户端和服务器之前不必存在长期的关系.
  - UDP 发送数据报之前无需经过握手创建连接的过程.
  - UDP 支持多播和广播.
- Unreliable delivery service:
  - UDP 本身不提供确认, 序列号, 超时重传等机制.
  - UDP 数据报可能在网络中被复制, 被重新排序.
  - UDP 不保证数据报会到达其最终目的地,
    也不保证各个数据报的先后顺序,
    也不保证每个数据报只到达一次.
- Datagram service:
  每个 UDP 数据报都有长度,
  若一个数据报正确地到达目的地,
  则该数据报的长度将随数据一起传递给接收方.
- UDP header:
  source port(16 bit), destination port(16 bit),
  checksum(16 bit), length(16 bit).

![UDP Header](./figures/udp-header.png 'UDP Header')

## Performance

基于 UDP 的应用程序:

- 必须容忍各种因特网路径条件.
- 应该控制传输速度.
- 应该对所有流量进行拥塞控制.
- 应该使用与 TCP 相近的带宽.
- 应该准备基于丢包的重发计数器.
- 应该不发送大于路径 MTU 的数据报.
- 应该处理数据报丢失, 重复与重排.
- 应该足够稳定以支持 2 分钟以上的交付延迟.
- 应该支持 IPv4 UDP 校验和, 必须支持 IPv6 校验和.
- 可以在需要时使用 `Keep-Alive` (最小间隔 15 秒).
- 基于 UDP 的 P2P 程序必须考虑 [NAT (Network Address Translator) 穿透](https://tailscale.com/blog/how-nat-traversal-works):
  - ICE: Interactive Connectivity Establishment.
  - STUN: Session Traversal Utilities for NAT.
  - TURN: Traversal Using Relays around NAT.

:::tip[WebRTC]

WebRTC 是符合上述要求的框架.

:::
