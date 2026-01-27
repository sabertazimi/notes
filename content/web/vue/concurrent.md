---
tags: [Web, Vue, Concurrent, Asynchronous, Suspense]
sidebar_position: 14
---

# Concurrent

## Async Component

```ts
// 1. Basic async component:
Vue.component('AsyncExample', (resolve, reject) => {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块,
  // 这些块将通过 Ajax 请求自动下载.
  require(['./my-async-component'], resolve)
})

// 2. Promise async component:
Vue.component(
  'AsyncWebpackExample',
  // 该 `import` 函数返回一个 `Promise` 对象.
  () => import('./my-async-component')
)

// 3. Advanced async component:
function AsyncComp() {
  return {
    // 需要加载的组件, 应当是一个 Promise.
    component: import('./MyComp.vue'),
    // 加载中应当渲染的组件.
    loading: LoadingComp,
    // 出错时渲染的组件.
    error: ErrorComp,
    // 渲染加载中组件前的等待时间, 默认: 200ms.
    delay: 200,
    // 最长等待时间, 超出此时间则渲染错误组件, 默认: Infinity.
    timeout: 3000,
  }
}
Vue.component('AsyncExample', AsyncComp)
```

## Resolve Async Component

`core/vdom/helpers/resolve-async-component.js`:

- 3 种异步组件的实现方式.
  - 高级异步组件实现了 loading/resolve/reject/timeout 4 种状态.
- 异步组件实现的本质是 2 次渲染:
  - 第一次渲染生成一个注释节点/`<LoadingComponent>`.
  - 当异步获取组件成功后, 通过 `forceRender` 强制重新渲染.

```ts
import { currentRenderingInstance } from 'core/instance/render'
import {
  hasSymbol,
  isDef,
  isObject,
  isPromise,
  isTrue,
  isUndef,
  once,
  remove,
} from 'core/util/index'
import { createEmptyVNode } from 'core/vdom/vnode'

export function resolveAsyncComponent(
  factory: Function,
  baseCtor: Class<Component>
): Class<Component> | void {
  // 3.
  if (isTrue(factory.error) && isDef(factory.errorComp))
    return factory.errorComp

  if (isDef(factory.resolved))
    return factory.resolved

  const owner = currentRenderingInstance

  if (owner && isDef(factory.owners) && !factory.owners.includes(owner)) {
    // already pending
    factory.owners.push(owner)
  }

  // 3.
  if (isTrue(factory.loading) && isDef(factory.loadingComp))
    return factory.loadingComp

  if (owner && !isDef(factory.owners)) {
    const owners = (factory.owners = [owner])
    let sync = true
    let timerLoading = null
    let timerTimeout = null

    owner.$on('hook:destroyed', () => remove(owners, owner))

    const forceRender = (renderCompleted: boolean) => {
      for (let i = 0, l = owners.length; i < l; i++) owners[i].$forceUpdate()

      if (renderCompleted) {
        owners.length = 0

        if (timerLoading !== null) {
          clearTimeout(timerLoading)
          timerLoading = null
        }

        if (timerTimeout !== null) {
          clearTimeout(timerTimeout)
          timerTimeout = null
        }
      }
    }

    const resolve = once((res: object | Class<Component>) => {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor)
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync)
        forceRender(true)
      else owners.length = 0
    })

    const reject = once((reason) => {
      if (isDef(factory.errorComp)) {
        factory.error = true
        forceRender(true)
      }
    })

    const res = factory(resolve, reject)

    if (isObject(res)) {
      if (isPromise(res)) {
        // 2. () => Promise.
        if (isUndef(factory.resolved))
          res.then(resolve, reject)
      } else if (isPromise(res.component)) {
        // 3.
        res.component.then(resolve, reject)

        if (isDef(res.error))
          factory.errorComp = ensureCtor(res.error, baseCtor)

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor)

          if (res.delay === 0) {
            factory.loading = true
          } else {
            timerLoading = setTimeout(() => {
              timerLoading = null

              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true
                forceRender(false)
              }
            }, res.delay || 200)
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(() => {
            timerTimeout = null

            if (isUndef(factory.resolved))
              reject(null)
          }, res.timeout)
        }
      }
    }

    sync = false
    // return in case resolved synchronously
    return factory.loading ? factory.loadingComp : factory.resolved
  }
}

function ensureCtor(comp: any, base) {
  if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module'))
    comp = comp.default

  return isObject(comp) ? base.extend(comp) : comp
}

function createAsyncPlaceholder(
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}
```

## Define Async Component

`defineAsyncComponent` higher order component:

```ts
function defineAsyncComponent({
  loader,
  timeout,
  loadingComponent,
  errorComponent,
}) {
  let InnerComponent = null

  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      const error = shallowRef(null)
      let timer = null

      loader()
        .then((Component) => {
          InnerComponent = Component
          loaded.value = true
        })
        .catch(err => (error.value = err))

      if (timeout) {
        timer = setTimeout(() => {
          const err = new Error(`Async component timed out after ${timeout}ms.`)
          error.value = err
        }, timeout)
      }

      onUnmounted(() => clearTimeout(timer))

      const placeholder = { type: Text, children: '' }

      // Return render function.
      return () => {
        if (loaded.value)
          return { type: InnerComponent }
        else if (error.value && errorComponent)
          return { type: errorComponent }
        else return loadingComponent ? { type: loadingComponent } : placeholder
      }
    },
  }
}
```

## Suspense

```html
<!-- Events.vue -->
<script setup lang="ts">
  import { getEvents } from '@/services'
  import type { Event } from '@/services'
  const events: Event[] = await getEvents()
</script>
```

```html
<template>
  <suspense>
    <template #default>
      <Events />
    </template>
    <template #fallback>
      <div>Loading events list ...</div>
    </template>
  </suspense>
</template>
```
