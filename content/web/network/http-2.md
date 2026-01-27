---
sidebar_position: 3
tags: [Web, Network, HTTP]
---

# HTTP 2

在 HTTP/1.x 中, 每次请求都会建立一次 HTTP 连接:

- 串行的文件传输. 当请求 a 文件时, b 文件只能等待.
- 连接数过多.

HTTP/2 的多路复用就是为了解决上述的两个性能问题.
在 HTTP/2 中, 有两个非常重要的概念, 分别是帧 (frame) 和流 (stream).
帧代表着最小的数据单位, 每个帧会标识出该帧属于哪个流, 流也就是多个帧组成的数据流.
多路复用, 就是在一个 TCP 连接中可以存在多条流, 避免队头阻塞问题和连接数过多问题.

![HTTP 2.0 Binary Frame](./figures/http2-binary-frame.png 'HTTP 2.0 Binary Frame')

![HTTP 2.0 Stream](./figures/http2-stream.png 'HTTP 2.0 Stream')

HTTP/2 = `HTTP` + `HPack / Stream` + `TLS 1.2+` + `TCP`:

- HTTP 2.0 的主要目标是改进传输性能, 实现低延迟和高吞吐量.
- 二进制传输 (乱序二进制帧 Stream):
  HTTP/1.1 不是二进制传输, 而是通过文本进行传输.
  由于没有流的概念, 在并行传输数据时,
  接收端无法区分多个响应分别对应的请求,
  无法将多个响应的结果重新进行组装,
  无法实现多路复用.
- Multiplexing (多路复用): more parallelized requests.
- Header compression (HPack): 降低协议字节开销占比 (尤其是 `Cookie` 带来的性能瓶颈).
- 双向流量控制 (`WINDOW_UPDATE` 帧更新).
- Server push:
  - 客户端可以缓存推送过来的资源.
  - 客户端可以拒绝推送过来的资源.
  - 推送资源可以由不同的页面共享.
  - 服务器可以按照优先级推送资源.
- HTTPS guaranteed: 事实加密 (Chrome/Firefox 只支持 HTTP/2 over TLS 1.2+).

:::caution[Cons]

HTTP/2 虽然通过多路复用解决了 HTTP 层的队头阻塞,
但仍然存在 TCP 层的队头阻塞 (`Head-of-line Blocking`):

- 由于 TCP 不支持乱序确认, 当没有收到队头 (滑动窗口最左端) 的 ACK 确认报文时,
  发送窗口无法往前移动, 此时发送方将无法继续发送后面的数据, 产生发送窗口的队头阻塞问题.
- 同样地, 当接收窗口接收有序数据时, 当没有收到队头 (滑动窗口最左端) 的数据时,
  接收窗口无法往前移动, 此时接收方将直接丢弃所有滑动窗口右侧的数据, 产生接收窗口的队头阻塞问题.

QUIC (Quick UDP Internet Connections)
给每一个 Stream 都分配了一个独立的滑动窗口,
使得一个连接上的多个 Stream 之间没有依赖关系,
拥有相互独立各自控制的滑动窗口.

:::

## Optimization

HTTP 2 performance:

- Reducing HTTP requests:
  - 重用 TCP 连接.
  - 多路复用.
  - 减少传输冗余资源.
- Caching and reducing DNS lookups:
  - Remove too much domains.
  - HTML5 DNS prefetch.
- Avoid HTTP redirects.
- CDN: minimize RTT.
- Web caches.
- Resources minification.

Due to asset granularity and **caching effectiveness**:

- No need for 域名分区 (no need for multiple HTTP connection).
- No need for CSS/Image sprites.
- Less need for resources bundling and inlining.

## HTTP 3

HTTP/3 = `HTTP` + `QPack / Stream` + `QUIC / TLS 1.3+` + `UDP`:

- QUIC 实现快速握手, 解决多次握手高延迟问题:
  - Establishing connection in HTTP/2 requires 3 RTT.
  - Establishing connection in HTTP/3 only requires 2 RTT.
- QUIC 协议保证传输可靠: packet loss handling.
- QUIC 给每个请求流 (Stream ID) 都分配一个独立的滑动窗口, 同时进行队头压缩,
  实现传输层**无队头阻塞的多路复用**, 解决队头 (数据重传) 阻塞 (后续数据) 问题:
  - Stream prioritization.
  - Header compression.
- QUIC 集成 TLS 加密.
- HTTP/3 brings tunable congestion control and connection migration.

For a new domain,
browser connects using H/1 or H/2.
Server sends back an [`alternative services`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Alt-Svc)
header indicating H/3 support.
Browser stores [`alt-svc`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Alt-Svc)
info in alt-svc cache.
From then on,
browser tries HTTP/3 in parallel with HTTP/1 and 2
so that there's an immediate fallback if network blocks.
