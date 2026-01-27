---
sidebar_position: 1
tags: [Web, DevOps, Service Worker, PWA]
---

# Service Worker

Progressive Web Apps:

- Served over `HTTPS`.
- Provide a manifest.
- Register a `ServiceWorker`
  (web cache for offline and performance).
- Consists of website, web app manifest,
  service worker, expanded capabilities
  and OS integration.

:::tip[Pros]

- Cache.
- Offline.
- Background.
- Custom request to minimize network.
- [Notification API](https://developer.mozilla.org/docs/Web/API/ServiceWorkerRegistration/showNotification).

:::

:::caution[Costs]

- 服务工作者线程缓存不自动缓存任何请求, 所有缓存都必须明确指定.
- 服务工作者线程缓存没有到期失效的概念.
- 服务工作者线程缓存必须手动更新和删除.
- 缓存版本必须手动管理:
  每次服务工作者线程更新, 新服务工作者线程负责提供新的缓存键以保存新缓存.
- 唯一的浏览器强制逐出策略基于服务工作者线程缓存占用的空间.
  缓存超过浏览器限制时, 浏览器会基于 LRU 原则为新缓存腾出空间.
- Need startup time: `performance.getEntriesByName(url)[0].requestStart - performance.getEntriesByName(url)[0].workerStart`,
  20~100 ms for desktop, 100 ms for mobile.
- Cache reads aren't always instant:
  - cache hit time = read time (only this case better than `NO SW`),
  - cache miss time = read time + network latency,
  - cache slow time = slow read time + network latency,
  - SW asleep = SW boot latency + read time ( + network latency),
  - NO SW = network latency.

```ts
const entry = performance.getEntriesByName(url)[0]

// no remote request means this was handled by the cache
if (entry.transferSize === 0) {
  const cacheTime = entry.responseStart - entry.requestStart
}

async function handleRequest(event) {
  const cacheStart = performance.now()
  const response = await caches.match(event.request)
  const cacheEnd = performance.now()
}
```

:::

## Caching Strategy

![Service Worker Cache](./figures/service-worker-cache.webp 'Service Worker Cache')

5 caching strategy in [workbox](https://developer.chrome.com/docs/workbox/caching-strategies-overview).

Stale-While-Revalidate:

```ts
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      cache.match(event.request).then((cacheResponse) => {
        fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse)
        })

        return cacheResponse || networkResponse
      })
    })
  )
})
```

Cache first, then Network:

```ts
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      cache.match(event.request).then((cacheResponse) => {
        if (cacheResponse)
          return cacheResponse

        return fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
      })
    })
  )
})
```

Network first, then Cache:

```ts
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
})
```

Cache only:

```ts
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      cache.match(event.request).then((cacheResponse) => {
        return cacheResponse
      })
    })
  )
})
```

Network only:

```ts
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      return networkResponse
    })
  )
})
```

## Registration

```ts
// Check that service workers are registered
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performance
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

## Broken Images

```ts
function isImage(fetchRequest) {
  return fetchRequest.method === 'GET' && fetchRequest.destination === 'image'
}

globalThis.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response.ok)
          return response

        // User is online, but response was not ok
        if (isImage(e.request)) {
          // Get broken image placeholder from cache
          return caches.match('/broken.png')
        }
      })
      .catch((err) => {
        // User is probably offline
        if (isImage(e.request)) {
          // Get broken image placeholder from cache
          return caches.match('/broken.png')
        }
        process(err)
      })
  )
})

globalThis.addEventListener('install', (e) => {
  globalThis.skipWaiting()
  e.waitUntil(
    caches.open('precache').then((cache) => {
      // Add /broken.png to "precache"
      cache.add('/broken.png')
    })
  )
})
```

## Caches Version

```ts
globalThis.addEventListener('activate', (event) => {
  const cacheWhitelist = ['v2']

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all([
        keyList.map((key) => {
          return cacheWhitelist.includes(key) ? caches.delete(key) : null
        }),
        globalThis.clients.claim(),
      ])
    })
  )
})
```

## References

- Service worker [overview](https://developer.chrome.com/docs/workbox/service-worker-overview).
- Workbox [library](https://github.com/GoogleChrome/workbox).
- Offline cookbook [guide](https://web.dev/offline-cookbook).
- PWA extensive [guide](https://www.smashingmagazine.com/2018/11/guide-pwa-progressive-web-applications).
- Network reliable web app definitive [guide](https://web.dev/reliable):
  - [Resilient search](https://web.dev/resilient-search-experiences).
  - [Instant navigation](https://web.dev/instant-navigation-experiences).
  - [App shell](https://web.dev/app-shell-ux-with-service-workers)>
  - [Adaptive loading](https://web.dev/adaptive-loading-with-service-workers).
  - [Broadcast updates](https://web.dev/broadcast-updates-guide).
