---
tags: [Web, Vue, Internals, Architecture]
sidebar_position: 20
---

# Core

## Constructor

`core/instance/index.js`:

```ts
// 从五个文件导入五个方法（不包括 warn）
import { warn } from '../util/index'
import { eventsMixin } from './events'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { stateMixin } from './state'

// 定义 Vue 构造函数
function Vue(options) {
  this._init(options)
}

// 将 Vue 作为参数传递给导入的五个方法
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

// 导出 Vue
export default Vue
```

`core/instance/init.js`:

```ts
// initMixin(Vue)
Vue.prototype._init = function (options?: object) {}
```

`core/instance/state.js`:

```ts
// stateMixin(Vue)
Vue.prototype.$data = data
Vue.prototype.$props = props
Vue.prototype.$set = set
Vue.prototype.$delete = del
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: object
): Function {}
```

`core/instance/events.js`:

```ts
// eventsMixin(Vue)
Vue.prototype.$on = function (
  event: string | Array<string>,
  fn: Function
): Component {}
Vue.prototype.$once = function (event: string, fn: Function): Component {}
Vue.prototype.$off = function (
  event?: string | Array<string>,
  fn?: Function
): Component {}
Vue.prototype.$emit = function (event: string): Component {}
```

`core/instance/lifecycle.js`:

```ts
// lifecycleMixin(Vue)
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
Vue.prototype.$forceUpdate = function () {}
Vue.prototype.$destroy = function () {}
```

`core/instance/render.js`:

```ts
export function initRender(vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = (vm.$vnode = options._parentVnode)
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  const parentData = parentVnode && parentVnode.data
}
```

`core/instance/render-helpers/index.js`:

```ts
export function installRenderHelpers(target: any) {
  target._o = markOnce
  target._n = toNumber
  target._s = toString
  target._l = renderList
  target._t = renderSlot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots
  target._g = bindObjectListeners
}
```

## Prototype

`core/index.js`:

```ts
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'
import { initGlobalAPI } from './global-api/index'
import Vue from './instance/index'

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering,
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get() {
    return this.$vnode && this.$vnode.ssrContext
  },
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext,
})

Vue.version = '__VERSION__'

export default Vue
```

`runtime/index.js`:

```ts
import config from 'core/config'
import Vue from 'core/index'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser, isChrome } from 'core/util/index'
import { extend, noop } from 'shared/util'

import {
  getTagNamespace,
  isReservedAttr,
  isReservedTag,
  isUnknownElement,
  mustUseProp,
  query,
} from 'web/util/index'

import platformComponents from './components/index'
import platformDirectives from './directives/index'
import { patch } from './patch'

// Install platform specific utils.
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// Install platform runtime directives & components.
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// Install platform patch function.
Vue.prototype.__patch__ = inBrowser ? patch : noop

// Public mount method.
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

`platforms/web/entry-runtime-with-compiler.js` 重写 `Vue.prototype.$mount` 方法:

```ts
import config from 'core/config'
import { cached } from 'core/util/index'

import { compileToFunctions } from './compiler/index'
import Vue from './runtime/index'
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
} from './util/compat'
import { query } from './util/index'

const mount = Vue.prototype.$mount

const idToTemplate = cached((id) => {
  const el = query(id)
  return el && el.innerHTML
})

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  if (el === document.body || el === document.documentElement) {
    // Do not mount Vue to <html> or <body>
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#')
          template = idToTemplate(template)
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        // Invalid template option
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }

  return mount.call(this, el, hydrating)
}

Vue.compile = compileToFunctions

export default Vue
```

## Global APIs

`core/global-api/index.js` 添加 `Vue.XXX` 静态方法:

```ts
// initGlobalAPI
Vue.config = config
Vue.util = {
  warn,
  extend,
  mergeOptions,
  defineReactive,
}
Vue.set = set
Vue.delete = del
Vue.nextTick = nextTick
Vue.options = {
  components: {
    KeepAlive,
    // Transition 和 TransitionGroup 组件在 runtime/index.js 文件中被添加
    // Transition,
    // TransitionGroup
  },
  directives: Object.create(null),
  // 在 runtime/index.js 文件中, 为 directives 添加了两个平台化的指令 model 和 show
  // directives:{
  // model,
  // show
  // },
  filters: Object.create(null),
  _base: Vue,
}

// initUse: global-api/use.js
Vue.use = function (plugin: Function | object) {}

// initMixin: global-api/mixin.js
Vue.mixin = function (mixin: object) {}

// initExtend: global-api/extend.js
Vue.cid = 0
Vue.extend = function (extendOptions: object): Function {}

// initAssetRegisters: global-api/assets.js
Vue.component
  = Vue.directive
    = Vue.filter
      = function (
        id: string,
        definition: Function | object
      ): Function | object | void {}

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext,
})

Vue.version = '__VERSION__'

// entry-runtime-with-compiler.js
Vue.compile = compileToFunctions
```

### Extend

`core/global-api/extend.js`:

- `Vue.extend`/`vm.$options._base.extend` will return brand new `Vue` constructor.

```ts
/**
 * Class inheritance
 */
Vue.extend = function (extendOptions: object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})

  if (cachedCtors[SuperId])
    return cachedCtors[SuperId]

  const name = extendOptions.name || Super.options.name
  const Sub = function VueComponent(options) {
    this._init(options)
  }

  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(Super.options, extendOptions)
  Sub.super = Super

  // For props and computed properties, we define the proxy getters on
  // the Vue instances at extension time. This
  // avoids Object.defineProperty calls for each instance created.
  if (Sub.options.props)
    initProps(Sub)

  if (Sub.options.computed)
    initComputed(Sub)

  // allow further extension/mixin/plugin usage
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  // create asset registers, so extended classes
  // can have their private assets too.
  ASSET_TYPES.forEach((type) => {
    Sub[type] = Super[type]
  })

  // enable recursive self-lookup
  if (name)
    Sub.options.components[name] = Sub

  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

### NextTick

为了减少布局和渲染,
`Vue` 把 `DOM` 更新设计为异步更新,
每次侦听到数据变化,
将开启一个队列,
并缓冲在同一事件循环中发生的所有数据变更。
如果同一个 `watcher` 被多次触发,
只会被推入到队列中一次。
在下一个事件循环 tick 中,
`Vue` 才会真正执行队列中的数据变更,
页面才会重新渲染,
使得多次 DOM 更新合并成一次批处理更新。

`core/util/next-tick.js`:

```ts
import { noop } from 'shared/util'
import { isIOS, isNative } from './env'
import { handleError } from './error'

const callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0

  for (let i = 0; i < copies.length; i++) copies[i]()
}

let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// setImmediate -> MessageChannel -> setTimeout.
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (
  typeof MessageChannel !== 'undefined'
  && (isNative(MessageChannel)
  // PhantomJS
    || MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// Promise.then -> Macro Timer.
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS)
      setTimeout(noop)
  }
} else {
  microTimerFunc = macroTimerFunc
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a micro task.
 */
export function withMacroTask(fn: Function): Function {
  return (
    fn._withTask
    || (fn._withTask = function (...args) {
      useMacroTask = true
      const res = fn(...args)
      useMacroTask = false
      return res
    })
  )
}

export function nextTick(cb?: Function, ctx?: object) {
  let _resolve

  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })

  if (!pending) {
    pending = true

    if (useMacroTask)
      macroTimerFunc()
    else microTimerFunc()

    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve) => {
        _resolve = resolve
      })
    }
  }
}
```

### Mixin

`core/global-api/mixin.js`:

```ts
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

### Use

`core/global-api/use.js`:

```ts
export function initUse(Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | object, ...args: any) {
    const installedPlugins
      = this._installedPlugins || (this._installedPlugins = [])

    if (installedPlugins.includes(plugin))
      return this

    // Pass `Vue` to plugin install hook.
    args.unshift(this)

    if (typeof plugin.install === 'function')
      plugin.install(...args)
    else if (typeof plugin === 'function')
      plugin(...args)

    installedPlugins.push(plugin)
    return this
  }
}
```
