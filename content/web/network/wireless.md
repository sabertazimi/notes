---
sidebar_position: 21
tags: [Web, Network, Wireless]
---

# Wireless Network

影响数据传输速度因素:

- 可用带宽 (Hz).
- 信号强度 (SNR, Signal Noise Ratio).

## Types

无线标准:

- WLAN (Wireless LAN):
  IEEE 802.11, CSMA/CA (Carrier Sense Multiple Access/Collision Avoidance).
- LTE (Long Term Evolution) / HSPA+ (High Speed Packet Access): 4G.

![LTE Radio Resource Controller State Machine](./figures/lte.png 'LTE Radio Resource Controller State Machine')

![LTE Request](./figures/lte-request.png 'LTE Request')

![LTE Response](./figures/lte-response.png 'LTE Response')

## Performance

Battery power save optimization:

- 轮询在移动网络中代价极高 (Energy Tail), 少用: e.g. heart beat, round beacon.
- 尽可能使用推送和通知.
- 消除不必要的长连接.
- 出站和入站请求应该合并和汇总.
- 非关键性请求应该推迟到无线模块活动时进行.
- 把请求分组, 尽可能多和快地下载数据, 然后让无线模块转为空闲:
  既可以获得最大的网络吞吐量, 也能节约电量.
- 把负载转移到 Wi-Fi 网络:
  可以建议用户打开 Wi-Fi 连接, 以提升体验和节省电量.

Offline optimization:

- 不要缓存或试图猜测网络状态.
- 调度请求, 监听并诊断错误.
- 瞬态错误总会发生, 不可忽视, 可以采取重试策略.
- 监听连接状态, 以便采用最佳请求方式.
- 对重试请求采用补偿算法, 不要永远循环.
- 离线时, 尽可能记录并在将来发送请求.
- 利用 Web Storage API (App Cache/Local Storage/Service Worker) 实现离线应用.
