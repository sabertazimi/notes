---
sidebar_position: 50
tags: [Web, Performance, Best Practice]
---

# Best Practices

- Code optimization:
  - Fast CSS styles: `CSS Performance`.
  - Fast JavaScript code (`Effective JavaScript`):
    - DOM performance.
    - React performance.
    - Concurrency: asynchronous/web worker.
    - Use monomorphic objects due to shape and inline caches.
    - Use monomorphic function in hot code paths.
- Resources optimization (HTML/CSS/JS/Images/Audio/Video/Fonts):
  - Remove useless files: Chrome devtool code coverage panel.
  - Code splitting: Webpack `splitChunks`.
  - Tree shaking.
  - Gzip/Brotli (`Accept-Encoding`/`Content-Encoding`).
  - CDN: faster resources.
- Loading performance:
  - PreFetch/PreLoad/PreRendering (SSR).
  - Lazy loading: HTML/CSS/JS/Images/Audio/Video/Fonts.
  - Resources priority hints.
  - Resources loading hints.
- Web caching:
  - Offline caching: PWA.
  - HTTP caching: 强缓存与协商缓存.
  - CDN: shared public caches.
- Network protocols performance:
  - Reducing HTTP requests.
    - 重用 TCP 连接.
    - 多路复用.
    - 减少传输冗余资源.
  - Caching and reducing DNS lookups:
    - Remove too much domains.
    - HTML5 DNS prefetch.
  - Avoid HTTP redirects.
  - CDN: minimize RTT.

## Library

Speed tools [list](https://web.dev/speed-tools):

- [WebPageTest](https://www.webpagetest.org)
- [PageSpeed Insights](https://pagespeed.web.dev)
- Chrome UX [report](https://developer.chrome.com/docs/crux).
- Chrome [DevTools](https://developer.chrome.com/docs/devtools)
- LightHouse CI [action](https://github.com/treosh/lighthouse-ci-action).
- Chrome audit [tab](https://github.com/GoogleChrome/lighthouse):
  - Performance [audit](https://web.dev/lighthouse-performance).
  - PWA [audit](https://web.dev/lighthouse-pwa).
  - Best practices [audit](https://web.dev/lighthouse-best-practices).
  - Accessibility [audit](https://web.dev/lighthouse-accessibility).
  - SEO [audit](https://web.dev/lighthouse-seo).
- Chrome inspector: `chrome://inspect/#devices` to start inspecting.

## References

- `web.dev` performance optimization [guide](https://web.dev/explore/fast).
- `web.dev` performance newbie [course](https://web.dev/learn/performance).
- Performance [budgets](https://www.speedcurve.com/blog/performance-budgets).
- Next.js SEO [course](https://nextjs.org/learn/seo).
- The [anatomy](https://calendar.perfplanet.com/2025/the-anatomy-of-a-web-performance-report) of a web performance report.
