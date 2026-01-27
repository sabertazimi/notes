---
sidebar_position: 20
tags: [Web, Network, Access]
---

# Access Network

## ADSL

非对称数字用户线 (Asymmetric Digital Subscriber Line):

![Asymmetric Digital Subscriber Line](./figures/adsl.png 'Asymmetric Digital Subscriber Line')

## FTTH

![Fiber](./figures/fiber.png 'Fiber')

光纤到户 (Fiber to the Home):

![Fiber to the Home](./figures/ftth.png 'Fiber to the Home')

## PPPoE

- 互联网接入路由器通过 PPPoE 的发现机制
  查询 BAS (Broadband Access Server) 的 MAC 地址.
- BAS 下发的 TCP/IP 参数会被配置到
  互联网接入路由器的 BAS 端的端口上,
  路由器完成了接入互联网的准备.
- BAS 收到用户路由器发送的网络包后,
  会去掉 MAC 头部和 PPPoE 头部,
  然后用隧道机制将包发送给网络运营商的路由器.

![PPPoE Header](./figures/pppoe-header.png 'PPPoE Header')

## ISP

- 网络包通过接入网后, 到达运营商 POP (Point of Presence) 的路由器.
- NOC (Network Operation Center) 是运营商的核心设备 (配备高性能的路由器),
  从 POP 传来的网络包会集中到此处,
  并从此处转发到离目的地更近的 POP 或者其他运营商.
- IX (Internet eXchange, 互联网交换中心) 是一个中心设备 (配备大型高速交换机),
  同时连接多个互联网运营商, 减少线路数量.
- 互联网内部使用 BGP (Border Gateway Protocol) 机制
  在运营商之间交换路由信息.

![Internet Service Provider](./figures/isp.png 'Internet Service Provider')
