---
sidebar_position: 13
tags: [Web, Network, IP]
---

# IP

## Protocol

![IP Header](./figures/ip-header.png 'IP Header')

## Service Model

- Prevent packets looping forever(TTL/time to live field in header):
  if TTL gets decreased to zero, then drop this datagram.
- Limit fragment packets size(Packet ID, Flags, Fragment Offset).
- Reduce changes of wrong destination(Checksum, Destination Address).
- 操作系统协议栈的 IP 模块会检查 IP 报文头部:
  - 判断本机是否为接收方.
  - 判断网络包是否经过分片.
  - 将包转交给 TCP 模块或 UDP 模块.

:::tip[IP Layer]

IP 本身不负责包的传输,
而是委托各种通信技术将包传输到下一个路由器 (纯粹路由器).
极简的 IP Layer 设计,
可以根据需要灵活运用各种通信技术 (以太网, 无线网 etc),
从而构建出互联网这一规模巨大的网络.

:::

## Router

- 路由器的各个端口都具有 MAC 地址和 IP 地址.
- 路由器会忽略主机号, 只匹配网络号.
  通过路由聚合, 减少路由表记录数, 合并子网.

## IPv4

Address structure:

- 32 bits long: `a.b.c.d`.
- Historical:
  - Class A: `0-network(7 bits)-host(24 bits)`.
  - Class B: `10-network(14 bits)-host(16 bits)`.
  - Class C: `110-network(21 bits)-host(8 bits)`.
- Today:
  `171.64.0.0/16` means `171.64.0.0` to `171.64.255.255`,
  `A/24` describes `256` addresses, `A/20` describes `4096` addresses.
- Longest prefix matching and netmask (`A/16`):
  e.g. `0.0.0.0/0` => matching all addresses.

## Packet Format

- Network is big-endian.
- In x86 processor, use `htons()/ntohs()/htonl()/ntohl()` host:
  network `short`/`long` helper function to transform format.

```cpp
#include <arpa/inet.h>

uint16_t http_port = 80;
uint16_t packet_port = ntohs(packet->port);

if (packet_port == http_port) {
    // OK
}
```

## ICMP

- Report error conditions back.
- Help diagnose problems.
- Site above IP:
  ICMP 报文包含在 IP 数据报中, 属于 IP 的一个用户.
  一个 ICMP 报文包括 IP 头部 + ICMP 头部 + ICMP 报文.
  IP 头部的 Protocol 值为 1 表示这是一个 ICMP 报文.

![ICMP Header](./figures/icmp-header.png 'ICMP Header')

- 0 type 0 code: echo reply(by ping)
- 3 type 0 code: destination network unreachable
- 3 type 1 code: destination host unreachable
- 3 type 3 code: destination port unreachable
- 8 type 0 code: echo request(by ping)
- 11 type 0 code: TTL(time to live) Expired(by ping)
