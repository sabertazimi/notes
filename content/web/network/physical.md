---
sidebar_position: 15
tags: [Web, Network, Physical]
---

# Physical Layer

## Twisted Pair

双绞线 (TP):

- 抵消外源性噪声.
- 抵消内源性噪声.

![Twisted Pair](./figures/twisted-pair.png 'Twisted Pair')

| 种类            | 性能                                                      |
| --------------- | --------------------------------------------------------- |
| 五类 (CAT-5)    | 10BASE-T (10 Mbit/s) 和 100BASE-TX (100 Mbit/s) 以太网    |
| 超五类 (CAT-5e) | 1000BASE-T 千兆以太网, 改善了外部串扰                     |
| 六类 (CAT-6)    | 1000BASE-TX 千兆和 10GBASE-T 万兆以太网, 支持最高 250 MHz |
| 超六类 (CAT-6A) | 改善了外部串扰                                            |
| 七类 (CAT-7)    | 支持最高 600 MHz 的高速信号传输                           |

## Error Detection

- TCP/IP: checksums (1 bit).
- Ethernet (link layer): cyclic redundancy code (2 bit/more).
- SSL (Secure Sockets Layer)/TLS (Transport Layer Security):
  **MAC** (Message Authentication Code) (cryptographic data)
  to prevent malicious attacks.
