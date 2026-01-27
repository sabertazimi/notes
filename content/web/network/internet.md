---
sidebar_position: 1
tags: [Web, Network, Internet]
---

# Internet

## Consist

Internet Service Provider -> Packet Switch/Communication Link -> Host/End System.

## Delay

nodal = proc + queue + trans + prop: 总时延 = 产生/到达时延 + 排队时延 + 传输时延 + 传播时延.

## Layer

End-to-end principle: implement features in the end-system/hosts where possible.

:::tip

Congestion implemented on transport layer.

:::

Internet layer:

- Application layer protocol: HTTP SMTP (message, stream of data).
- Transport layer protocol: TCP UDP (segment, segment of data).
- Network layer protocol: IP (因特网的粘合剂) (**unreliable** datagram, packet of data).
- Data link layer protocol: WiFi PPP(点对点) 以太网 (frame).
- Physical layer protocol.

Layering principles:

- Modularity.
- Well defined service: simple service model provided by lower level,
  providing for higher level.
- Reuse.
- Separation of concerns.
- Continuous improvement: change inner structure of layer independently.
