---
sidebar_position: 2
tags: [Web, DevOps, Rendering, CSR, SSR, SSG, ISR, Infrastructure]
---

# Rendering Patterns

- CSR (Client Side Rendering): SPA.
- SSR (Server Side Rendering): SPA with SEO.
- SSG (Static Site Generation): SPA with pre-rendering.
- ISR (Incremental Static Regeneration): SSG + SSR.
- SSR + CSR: HomePage with SSR, dynamic with CSR.
- SSG + CSR: HomePage with SSG, dynamic with CSR.
- SSG + SSR: static with SSG, dynamic with SSR.

[![Rendering Patterns](./figures/rendering-patterns.png)](https://www.patterns.dev/posts/rendering-patterns)

## CSR

- CSR hit API after the page loads (LOADING indicator).
- Data is fetched on every page request.

```tsx
import { TimeSection } from '@components'

export default function CSRPage() {
  const [dateTime, setDateTime] = React.useState<string>()

  React.useEffect(() => {
    axios
      .get('https://worldtimeapi.org/api/ip')
      .then((res) => {
        setDateTime(res.data.datetime)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <main>
      <TimeSection dateTime={dateTime} />
    </main>
  )
}
```

## SSR

Application code is written in a way that
it can be executed **both on the server and on the client**.
The browser displays the initial HTML (fetch from server),
simultaneously downloads the single-page app (SPA) in the background.
Once the client-side code is ready,
the client takes over and the website becomes a SPA.

前后端分离是一种进步，但彻底的分离，也不尽善尽美，
比如会有首屏加载速度和 SEO 方面的困扰。
前后端分离+服务端首屏渲染看起来是个更优的方案，
它结合了前后端分离和服务端渲染两者的优点，
既做到了前后端分离，又能保证首页渲染速度，还有利于 SEO。

[![Server Side Rendering](./figures/server-side-rendering.png)](https://www.patterns.dev/posts/ssr)

```ts
if (isBotAgent) {
  // return pre-rendering static html to search engine crawler
  // like Gatsby
} else {
  // server side rendering at runtime for real interactive users
  // ReactDOMServer.renderToString()
}
```

- Smaller first meaningful paint time.
- HTML's strengths: progressive rendering.
- Browsers are incredibly good at rendering partial content.
- Search engine crawlers used to not execute scripts (or initial scripts).
- Search engine usually stop after a while (roughly 10 seconds).
- SPAs can't set meaningful HTTP status codes.

Webpack for SSR:

```ts
const baseConfig = require('./baseConfig')

const webConfig = {
  ...baseConfig,
  target: 'web',
}

const nodeConfig = {
  ...baseConfig,
  target: 'node',
  output: {
    ...baseConfig.output,
    libraryTarget: 'commonjs2',
  },
  externals: [require('webpack-node-externals')()],
}

module.exports = { webConfig, nodeConfig }
```

React server side rendering `start.server.js`
(compile to `dist/server.js`):

```tsx
import Koa from 'koa'
import koaStatic from 'koa-static'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'

const routes = [
  { path: '/', component: Home, exact: true },
  {
    path: '/about',
    component: About,
    exact: true,
  },
]

function getStore() {
  return createStore(reducer, applyMiddleware(thunk))
}

const app = new Koa()
app.use(koaStatic('public'))

app.use(async (ctx) => {
  const store = getStore()
  const matchedRoutes = matchRoutes(routes, ctx.request.path)
  const loaders = []

  matchedRoutes.forEach((item) => {
    if (item.route.loadData) {
      // item.route.loadData() 返回的是一个 promise.
      loaders.push(item.route.loadData(store))
    }
  })

  // 等待异步完成, store 已完成更新.
  await Promise.all(loaders)

  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={ctx.request.path}>
        <div>{renderRoutes(routes)}</div>
      </StaticRouter>
    </Provider>
  )

  ctx.body = `
  <!DOCTYPE html>
    <head>
    </head>
    <body>
      <div id="app">${content}</div>
      <script>
        window.context = {
          state: ${JSON.stringify(store.getState())}
        };
      </script>
      <script src="/public/client.js"></script>
    </body>
  </html>`
})

app.listen(3003, () => {
  console.log('listen:3003')
})
```

React client side hydration `start.client.js`
(compile to `public/client.js`):

- 建立 Real DOM 与 Virtual DOM 的联系: `fiber.el = node`.
- 绑定事件处理器.
- 执行服务端未执行的 lifecycle hooks: `beforeMount()`/`onMounted()`.

```tsx
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'

const Routes = [
  { path: '/', component: Home, exact: true },
  {
    path: '/about',
    component: About,
    exact: true,
  },
]

function getStore() {
  const defaultState = window.context ? window.context.state : {}
  return createStore(reducer, defaultState, applyMiddleware(thunk))
}

export default function App() {
  return (
    <Provider store={getStore()}>
      <BrowserRouter>
        <div>{renderRoutes(Routes)}</div>
      </BrowserRouter>
    </Provider>
  )
}

ReactDOM.hydrateRoot(<App />, document.getElementById('app'))
```

Isomorphic data fetch
(`getStaticProps`/`getServerSideProps` in `Next.js`,
`loader` in `Remix`):

```tsx
const data = await App.fetchData()
const app = <App {...data} />

return {
  html: ReactDOMServer.renderToString(app),
  state: { data },
}
```

`Next.js` SSR:

- SSR hit API before the page loads (DELAY before render, and no LOADING indicator).
- Data is fetched on every page request.

```tsx
import { TimeSection } from '@components'

export default function SSRPage({ dateTime }: SSRPageProps) {
  return (
    <main>
      <TimeSection dateTime={dateTime} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get('https://worldtimeapi.org/api/ip')

  return {
    props: { dateTime: res.data.datetime },
  }
}
```

:::caution[SSR Hydration Warning]

服务端返回的 HTML 与客户端渲染结果不一致时会产生
`SSR Hydration Warning`,
必须重视 `SSR Hydration Warning`,
要当 `Error` 逐个解决:

- 出于性能考虑,
  `hydrate` 可以弥补文本内容的差异,
  但并不能保证修补**属性**的差异,
  只在 `development` 模式下对这些不一致的问题报 `Warning`.
- 前后端不一致时, `hydrate` 时会导致页面抖动:
  后端渲染的部分节点被修改, 用户会看到页面突然更改的现象,
  带来不好的用户体验.

:::

:::caution[SSR Components]

编写 SSR 组件时:

- 需要使用前后端同构的 API:
  对于前端或后端独有的 API (e.g. BOM, DOM, Node API),
  需要进行封装与填充 (adapter/mock/polyfill).
- 注意并发与时序:
  浏览器环境一般只有一个用户, 单例模式容易实现;
  但 Node.js 环境可能存在多条连接, 导致全局变量相互污染.
- 部分代码只在某一端执行:
  在 `onCreated()` 创建定时器, 在 `onUnmounted()` 清除定时器,
  由于 `onUnmounted()` hooks 只在客户端执行,
  会造成服务端渲染时产生内存泄漏.

:::

## SSG

- Reloading did not change anything.
- Hit API when running `npm run build`.
- Data will not change because no further fetch.

```tsx
import { TimeSection } from '@components'

export default function SSGPage({ dateTime }: SSGPageProps) {
  return (
    <main>
      <TimeSection dateTime={dateTime} />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('https://worldtimeapi.org/api/ip')

  return {
    props: { dateTime: res.data.datetime },
  }
}
```

## ISR

- Based on SSG, with **revalidate limit**.
- Cooldown state: reloading doesn't trigger changes and pages rebuilds.
- First person that visits when cooldown state is off,
  is going to trigger a rebuild.
  That person won't be seeing changes.
  But, the changes will be served for the next full reload.

```tsx
import { TimeSection } from '@components'

export default function ISR20Page({ dateTime }: ISR20PageProps) {
  return (
    <main>
      <TimeSection dateTime={dateTime} />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('https://worldtimeapi.org/api/ip')

  return {
    props: { dateTime: res.data.datetime },
    revalidate: 20,
  }
}
```

## Islands Architecture

[Islands architecture](https://www.patterns.dev/posts/islands-architecture):

- Script resources for these "islands" of interactivity
  (islands of dynamic components)
  can be **delivered and hydrated independently**,
  allowing the rest of the page to be just **static HTML**.
- Islands architecture combines ideas from different rendering techniques:
  - [Server-side rendering](https://www.patterns.dev/posts/server-side-rendering).
  - [Static site generation](https://www.patterns.dev/posts/static-rendering).
  - [Partial hydration](https://www.patterns.dev/posts/progressive-hydration).
- Simple islands architecture [implementation](https://juejin.cn/post/7155300194773860382).

## JamStack

JamStack 指的是一套用于构建现代网站的技术栈:

- JavaScript: enhancing with JavaScript.
- APIs: supercharging with services.
- Markup: pre-rendering.

## References

- Universal JavaScript [presentation](http://peerigon.github.io/talks/2018-07-20-js-camp-barcelona-bumpy-road-universal-javascript/#1).
- React SSR [complete guide](https://mp.weixin.qq.com/s/j2rB8qE5OOPmLHAS7qdCrQ):
  - SSR and hydration.
  - Isomorphic router.
  - Isomorphic store.
  - Isomorphic CSS.
- Vue SSR [guide](https://mp.weixin.qq.com/s/QWtrUJcGEgNYKbhq2b8XLw):
  - Vite.
  - Router.
  - Pinia.
- Next.js for [isomorphic rendering](https://nextjs.org).
- Server side rendering with [Puppeteer](https://developer.chrome.com/docs/puppeteer/ssr).
- Web rendering [guide](https://web.dev/rendering-on-the-web).
