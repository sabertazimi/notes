---
sidebar_position: 10
tags: [Web, Network, TCP]
---

# TCP

## Protocol

![TCP Setup](./figures/tcp-setup.png 'TCP Setup')

Transmission Control Protocol (RFC 793):

- 三次握手带来的延迟 (RTT: Round-trip Delay) 使得每创建一个新 TCP 连接都要付出很大代价.
  这决定了提高 TCP 应用性能的关键, 在于**重用连接**.
- TCP 提供一种面向连接的, 可靠的字节流服务:
  - Connection-oriented service.
  - Reliable delivery service.
  - In-sequence stream of bytes service.
- Connection-oriented service:
  在一个 TCP 连接中,
  仅有两方进行彼此通信,
  广播和多播不能用于 TCP.
- Reliable delivery service:
  - TCP 使用校验和, 确认和重传机制来保证可靠传输.
  - TCP 给数据分节进行排序,
    并使用累积确认保证数据的顺序不变和非重复.
- In-sequence stream of bytes service:
  TCP 是字节流协议, 没有任何 (协议上的) 记录边界.
- Flow control:
  TCP 使用滑动窗口机制来实现流量控制.
- Congestion control:
  TCP 通过动态改变窗口的大小进行拥塞控制.

![TCP Header](./figures/tcp-header.png 'TCP Header')

## Handshake

- 3-way handshake:
  `SYN (toB)` -> `SYN/ACK (toA)` -> `ACK (toB)`.
- 4-way handshake:
  `FIN (toB)` -> `[Data+]ACK (toA)` -> `FIN (toA)` -> `ACK (toB)`.

![TCP 3-way Handshake](./figures/tcp-3-way-handshake.png 'TCP 3-way Handshake')
![TCP 4-way Handshake](./figures/tcp-4-way-handshake.png 'TCP 4-way Handshake')

## Slide Window and Retransmission

- SWZ N and RWS 1: go back N.
- SWZ N and RWZ N: selective repeat.

## Flow Control

流量控制:

TCP 连接的每一方都要通告自己的接收窗口 (`rwnd` 字段),
两端动态调整数据流速,
使之适应发送端和接收端的容量及处理能力.
客户端与服务器最大可传输数据量为 min(`rwnd`, `cwnd`),
即接口窗口与拥塞窗口的最小值.

:::tip[理想窗口大小]

WindowSize = BandWidth `*` RTT (带宽延迟积)

:::

## Congestion Control

拥塞控制:

- 慢启动:
  `cwnd` 初始值为 `1`/`4`/`10` 个 TCP 段 (1460 字节).
  慢启动导致客户端与服务器之间经过几百 ms 才能达到接近最大速度.
- 指数增长:
  每收到一个 ACK 报文, `cwnd` 翻倍.
- 拥塞预防:
  拥塞预防算法把丢包作为网络拥塞的标志, 重置拥塞窗口,
  之后拥塞预防机制按照自己的算法来增大窗口以尽量避免丢包.
  e.g. TCP Tahoe, TCP Reno, TCP Vegas, TCP New Reno, TCP BIC, TCP CUBIC.
  AIMD (Multiplicative Decrease and Additive Increase, 倍减加增),
  PRR (Proportional Rate Reduction, 比例降速).
- 快速重传:
  若收到 3 个重复确认报文 (3ACK),
  则说明下一个报文段丢失,
  此时执行快速重传,
  立即重传下一个报文段.
- 快速恢复:
  只是丢失个别报文段,
  而不是整个网络拥塞时,
  此时执行快速恢复,
  `ssthresh = cwnd / 2`,
  `cwnd = ssthresh`
  (`cwnd` 很快可以达到接近最大速度),
  并进入拥塞避免状态.
- 慢启动和快速恢复的**快慢**指的是 `cwnd` 的设定值,
  而不是 `cwnd` 的增长速率.
  慢启动 `cwnd = 1`,
  快速恢复 `cwnd = ssthresh`.

![TCP Congestion Control](./figures/tcp-congestion-control.png 'TCP Congestion Control')

![TCP Fast Retransmission](./figures/tcp-fast-retransmission.png 'TCP Fast Retransmission')

:::tip[Flow Control vs Congestion Control]

- 流量控制是为了让双方适应容量与处理能力.
- 拥塞控制是为了降低整个网络的拥塞程度.

:::

:::tip[14kB Rule]

[14kB rule](https://endtimes.dev/why-your-website-should-be-under-14kb-in-size),
most web servers TCP slow start algorithm starts by sending 10 TCP packets:

`10 x 1460 = 14600 bytes`.

:::

## Performance

- Upgrade kernel version.
- 增大 TCP 的初始拥塞窗口 (`cwnd` >= 10).
- 禁用空闲后的慢启动.
- 启用窗口缩放, 增大最大接收窗口大小.
- TCP 快速打开 (TCP Fast Open): 允许在第一个 SYN 分组中发送应用程序数据.
- 减少传输冗余资源.
- 压缩要传输的资源.
- CDN: 降低 RTT.
- 重用 TCP 连接.
