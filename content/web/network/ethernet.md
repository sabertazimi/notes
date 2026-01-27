---
sidebar_position: 14
tags: [Web, Network, Ethernet]
---

# Ethernet

## Media Access Control

![MAC Header](./figures/mac-header.png 'MAC Header')

## Switch

交换机的作用为包的转发,
它自己不会成为发送方或者接收方,
各个端口不具有 MAC 地址.

![Switch](./figures/switch.png 'Switch')

交换机内部有一张 MAC 地址与对应网线端口的 MAC 地址表:

- 当交换机接收到包时,
  会将相应的端口号与发送方 MAC 地址写入表中,
  交换机可以根据该地址表进行包的转发.
- 当交换机发现一个包要发回到原端口时,
  会直接丢弃该包, 防止接收方收到重复包.
- 当地址表中找不到指定的 MAC 地址时,
  交换机会将包转发到除了源端口之外的所有端口.
  目标设备收到包后会返回响应包,
  交换机此时可以更新地址表, 下次转发时无需广播发包.

![Switch Circuit](./figures/switch-circuit.png 'Switch Circuit')

## Hub

以太网集线器 (Ethernet Hub):

- 中继式集线器: 广播以太帧, 接收方网卡根据 MAC 地址决定接收或丢弃报文.
- 交换式集线器: 信号只会根据 MAC 地址流到指定设备, 不会到达其他设备.

## ARP

Address resolution protocol:

- 通过 ARP 广播查询对方 MAC 地址, 填写至 MAC 头部, 传入网卡 (link layer).
- generates mappings between link layer and network layer addresses cached in nodes
- request-reply protocol: who has network address X => I have network address X
- request sent to link layer broadcast address, reply sent to requesting address
- when request to dest ARP packet header
  with empty DEST HARDWARE ADDRESS field and opcode 1(request)
- when reply to src ARP packet header
  with dest hardware address as SRC HARDWARE ADDRESS field,
  src hardware address as DEST HARDWARE ADDRESS field and opcode 2(reply)
- if A and B aren't in same sub-net,
  they delivery ARP broadcast with third public gateway
