---
sidebar_position: 26
tags: [Web, Security, DoS, DDoS, ReDoS, Vulnerability]
---

# Denial of Service

## DoS

DoS 攻击, 攻击者不断地提出服务请求, 让合法用户的请求无法及时处理,
包括但不限于 DNS, Email, FTP, ICMP, TCP, Telnet, Web, 即时通讯服务:

- Application firewall.
- Intrusion prevention system.
- 购买专门设计用来对抗 DoS 攻击的设备.
- 依靠网络服务提供商 (ISP) 来检测并消除 DoS 攻击.
- 获取云缓存提供商的服务: mature CDN service support DDoS protection.
- Scalable job queue.

## DDoS

Distributed denial of service:

- SYN flood:
  伪造 IP 不应答服务器 `SYN/ACK` 报文, 导致服务器消耗资源 (retry time) 处理这种半连接.
- UDP flood.
- ICMP flood.
- Slow connection attack: 构造 `Content-Length` 大值, 低速度发包 (10s ~ 100s 发送一个字节), 占用服务器资源.
- Redirect: 入侵了一个大网站后, 通过篡改页面, 将巨大的用户流量分流到目标网站.

加固服务器:

- SYN cookie: 每个 IP 地址分配一个 cookie, 限制访问频率, 超过一定频率后不响应 IP.
- 限制请求频率与请求力度:
  - 客户端:
    CAPTCHA (Completely Automated Pub-lic Turing Test to Tell Computers and HumansApart).
  - 服务端:
    建立应用防火墙与服务器安全模块, e.g. 过滤网关防护.
- 提升带宽最大负荷.
  - 缩短超时 (SYN Timeout) 时间.
  - 增加最大半连接数.
- 提升服务器性能:
  - Use mature memory cache library, e.g. `Redis`.
  - 负载均衡.
  - CDN.

## ReDoS

正则表达式引擎采用回溯的方式匹配所有可能性, 导致性能问题:

- 不使用 NFA 实现的正则表达式引擎, 使用 DFA 实现的正则表达式引擎.
- 不定义性能消耗过大的正则表达式.
- 不动态构造正则表达式 `new RegExp()`.
- 禁止用户输入影响正则表达式构建/匹配.
