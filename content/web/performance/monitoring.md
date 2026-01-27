---
sidebar_position: 7
tags: [Web, Performance, Monitoring]
---

# Monitoring

前端性能监控分为两种方式,
一种叫做合成监控 (Synthetic Monitoring, SYN),
另一种是真实用户监控 (Real User Monitoring, RUM).

## Synthetic

在一个模拟场景里, 去提交一个需要做性能审计的页面,
通过一系列的工具/规则去运行你的页面, 提取一些性能指标, 得出一个审计报告.

常见的工具有 Google 的 Lighthouse, WebPageTest, PageSpeed 等

| 优点                                   |             缺点             |
| :------------------------------------- | :--------------------------: |
| 实现简单                               |     无法还原全部真实场景     |
| 能采集到丰富的数据, 如硬件指标或瀑布图 |    登录等场景需要额外解决    |
| 不影响真实用户的访问性能               |       单次数据不够稳定       |
| 可以提供页面加载幻灯片等可视化分析途径 | 数据量较小, 无法发挥更大价值 |

## Real User

用户在页面访问之后就会产生各种各样的性能指标,
之后会将这些性能指标上传的我们的日志服务器上,
进行数据的提起清洗加工,
最后在监控平台上进行展示和分析的一个过程.

- 真实用户监控的优缺点

| 优点                                   | 缺点                             |
| :------------------------------------- | :------------------------------- |
| 无需配置模拟条件, 完全还原真实场景     | 影响真实用户的访问性能及流量消耗 |
| 不存在登录等需要额外解决的场景         | 无法采集硬件相关指标             |
| 数据样本足够庞大, 可以减少统计误差     | 无法采集完整的资源加载瀑布图     |
| 新年数据可与其它数据关联, 产生更大价值 | 无法可视化展示加载过程           |

:::tip[SYN vs RUM]

| 对比项         | 合成监控               | 真实用户监控               |
| :------------- | :--------------------- | :------------------------- |
| 实现难度及成本 | 较低                   | 较高                       |
| 采集数据丰富度 | 丰富                   | 基础                       |
| 数据样本量     | 较小                   | 大(视业务体量)             |
| 适合场景       | 定性分析, 小数据量分析 | 定量分析, 业务数据深度挖掘 |

:::

## Methods

在真实用户性能数据采集时, 要关注四个方面的东西:

- 使用标准的 API.
- 定义合适的指标.
- 采集正确的数据.
- 上报关联的维度.

## APIs

采集性能数据时先抹平 Navigation Timing spec 差异
优先使用 PerformanceTimeline API
(在复杂场景, 亦可考虑优先使用 PerformanceObserver):

- 重定向耗时 = redirectEnd - redirectStart.
- DNS 查询耗时 = domainLookupEnd - domainLookupStart.
- TCP 链接耗时 = connectEnd - connectStart.
- HTTP 请求耗时 = responseEnd - responseStart.
- 解析 DOM 树耗时 = domComplete - domInteractive.
- 白屏时间 = responseStart - navigationStart.
- DOMReady 时间 = domContentLoadedEventEnd - navigationStart.
- onload 时间 = loadEventEnd - navigationStart.

## Statistics

First Meaningful Paint: 首次有效渲染时长,
它的一个核心的想法是渲染并不一定代表着用户看到了主要内容,
Load 也不一定代表用户看到主要内容.
假设当一个网页的 DOM 结构发生剧烈的变化的时候,
就是这个网页主要内容出现的时候,
那么在这样的一个时间点上,
就是用户看到主要内容的一个时间点.

它的优点是相对校准的估算出内容渲染时间, 贴近用户感知.
但缺点是无原生 API 支持, 算法推导时 DOM 节点含权重.

- First Paint (FP): 0 ~ 1 ~ 2.5s.
- First Meaningful Paint (FMP)
- First Contentful Paint (FCP): 0 ~ 2 ~ 4s.
- Largest Contentful Paint (LCP): 0 ~ 2.5 ~ 4s.
- Interaction to Next Paint (INP): 0 ~ 0.2 ~ 0.5s.
- Cumulative Layout Shift (CLS): 0 ~ 0.1 ~ 0.25.
- Time to Interactive (TTI): 0 ~ 3.8 ~ 7.3s.

## Reporting

不同的页面操作/页面打开方式/浏览器环境都会对我们页面加载的性能会有影响,
需要上报这些维度的数据, 以便深入性能分析:

- 当前页面是否可见.
- 页面加载方式: 直接打开/刷新打开/前进后退打开.
- 是否启用 HTTP2.
- 是否启用 Service Worker.

解决上报对性能的影响问题有以下方案:

- 延迟合并上报: 延迟到 `onload` 事件后, 并合并多个上报请求.
- 使用 [Beacon API](https://developer.mozilla.org/docs/Web/API/Beacon_API):
  - Sent reliably (even if page unload).
  - Sent asynchronously.
  - Not impact loading of next page.
- 使用 `post` 上报.
- Prefer `visibilitychange`/`pagehide` event.
  `unload`/`beforeunload` event not precise for mobile users:
  e.g. switch to another app not trigger `unload` event.

```ts
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 挂载时间: ', Date.now() - timerStart)

  // 性能日志上报...
})

window.addEventListener('load', () => {
  console.log('所有资源加载完成时间: ', Date.now() - timerStart)

  // 性能日志上报...
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    const obj = { user: 1 }
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json',
    })
    navigator.sendBeacon('/log', blob)
  }
})
```

### Image Beacon

使用 `GIF` 图片进行前端监控上报:

- 跨域友好: `img` 天然支持跨域.
- 节省网络资源:
  - 图片请求不占用 AJAX 请求限额.
  - `GIF` 简单安全, 体积小, 对网页内容几乎无影响,
    相较 `BMP`/`PNG`, 可以节约 `41%`/`35%` 网络资源.
- 不会阻塞页面加载, 不影响用户体验:
  只需 `new Image()` 对象,
  通过 `onerror` 和 `onload` 事件来检测发送状态,
  一般情况下无需 `append` 到 `DOM` 中.

```ts
const thisPage = window.location.href
const referringPage = document.referrer ? document.referrer : 'none'
const beacon = new Image()
beacon.src = `http://www.example.com/logger/beacon.gif?page=${encodeURI(thisPage)}&ref=${encodeURI(referringPage)}`
```

## References

- Performance monitoring data collection and report [case](https://zhuanlan.zhihu.com/p/420330110).
- Performance monitoring real world [case](https://juejin.cn/post/7078512301665419295).
- Dangerous performance cheating [hacks](https://performance.shopify.com/blogs/blog/don-t-get-scammed-by-fake-performance-experts-and-apps).
