---
tags: [Web, Vue, Internals, Lifecycle]
sidebar_position: 23
---

# Lifecycle

![Lifecycle](./figures/lifecycle.png 'Lifecycle')

## Workflow

`new Vue()` -> 初始化 -> 编译 -> 渲染 -> 挂载 -> 更新:

- `new Vue()`.
- `Vue.prototype._init`.
- `Vue.prototype.$mount`.
- `vm.$options.render = compileToFunctions(vm.$options.template)`:
  - `vue-loader` for static transform:
    `.vue` -> `.js` in build time.
  - `compileToFunctions` for runtime transform:
    bundle `compiler` and `runtime` into `vue.js`.
- `mountComponent(vm, el)`.
- `Vue.prototype._render`.
- `VDOM.createElement(vm)`:
  - Normalize children.
  - Create VNode and install hooks.
  - Create children recursively.
- `Vue.prototype._update`.
- `Vue.prototype.__patch__` (`platforms/web/runtime/patch.js`):
  - `backend.nodeOps` (`platforms/web/runtime/node-ops`):
    - `createElement`.
    - `createElementNS`.
    - `createTextNode`.
    - `createComment`.
    - `insertBefore`.
    - `appendChild`.
    - `removeChild`.
    - `parentNode`.
    - `nextSibling`.
    - `tagName`.
    - `setTextContent`.
    - `setStyleScope`.
  - `backend.hooksModules` (`core/vdom/modules` + `platforms/web/runtime/modules`):
    - `create`.
    - `activate`.
    - `update`.
    - `remove`.
    - `destroy`.

## Initialization

```ts
const app = new Vue({ el: '#app', ...restOptionsAPI })
vm._init(...restOptionsAPI)
if (vm.$options.el)
  vm.$mount(vm.$options.el)
vm.$options.render = compileToFunctions(vm.$options.template)
mountComponent(vm, el)
```

`core/instance/init.js`:

- 合并配置.
- 初始化生命周期.
- 初始化事件中心.
- 初始化渲染.
- 初始化 data/props/computed/watcher.

```ts
// initMixin(Vue)
Vue.prototype._init = function (options?: object) {
  const vm: Component = this

  // uid
  vm._uid = uid++

  // a flag to avoid this being observed
  vm._isVue = true

  // merge options
  if (options && options._isComponent) {
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }

  vm._renderProxy = vm

  // expose real self
  vm._self = vm

  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')

  if (vm.$options.el)
    vm.$mount(vm.$options.el)
}
```

## Instance

```ts
// Vue.prototype._init: core/instance/init.js
vm._uid = uid++ // 每个Vue实例都拥有一个唯一的 id
vm._isVue = true // 这个表示用于避免Vue实例对象被观测(observed)
vm.$options = options // 当前Vue实例的初始化选项, 注意: 这是经过 mergeOptions() 后的
vm._renderProxy = vm // 渲染函数作用域代理
vm._self = vm // 实例本身
```

```ts
// initLifecycle(vm): core/instance/lifecycle.js
vm.$parent = vmParent
vm.$root = vmParent ? vmParent.$root : vm

vm.$children = []
vm.$refs = {}
```

```ts
// initEvents(vm): core/instance/events.js
vm._events = Object.create(null)
vm._hasHookEvent = false
```

```ts
// initRender(vm): core/instance/render.js
vm._vnode = null // root of child tree
vm._staticTrees = null // v-once cached trees

vm.$vnode = vnode
vm.$slots = slots
vm.$scopedSlots = scopedSlots
```

```ts
// initState(vm): core/instance/state.js
vm._watchers = []
vm._data = data
```

```ts
// mountComponent(): core/instance/lifecycle.js
vm.$el = el
```

```ts
// initComputed(): core/instance/state.js
vm._computedWatchers = Object.create(null)
```

```ts
// initProps(): core/instance/state.js
vm._props = {}
```

```ts
// initProvide(): core/instance/inject.js
vm._provided = provided
```

## Mounting

`core/instance/lifecycle.js`:

```ts
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el

  if (!vm.$options.render)
    vm.$options.render = createEmptyVNode

  callHook(vm, 'beforeMount')

  const updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted)
          callHook(vm, 'beforeUpdate')
      },
    },
    true /* isRenderWatcher */
  )

  hydrating = false

  // manually mounted instance, call mounted on self
  if (vm.$vnode == null) {
    // Only `new Vue()` trigger this:
    vm._isMounted = true
    callHook(vm, 'mounted')
  }

  return vm
}
```

## Rendering

`core/instance/render.js`:

```ts
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  if (_parentVnode)
    vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject

  // set parent vnode. this allows render functions to have access
  // to data on placeholder node.
  vm.$vnode = _parentVnode

  // render self
  const vnode = render.call(vm._renderProxy, vm.$createElement)

  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode))
    vnode = createEmptyVNode()

  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

`core/vdom/create-element.js`:

- Normalize children: transform children to `Array<VNode>`.
- Create VNode:
  - `new VNode(tag, data, children, vm)` for native host elements (e.g. `<div>`).
  - `createComponent(tag, data, children, vm)` for custom components:
    - `resolveConstructorOptions`: merge and resolve options API.
    - `installComponentHooks`:
      - Install internal (`core/vdom/create-component.js/componentVNodeHooks`) hooks.
      - Merge user-defined VNode hooks.
    - new VNode(`vue-component-${Ctor.options.name}`, data, undefined, vm).
    - Component VNode children is `undefined`.
- `vm._vnode.parent === vm.$vnode`.
- 组件 patch 过程中 DOM 的插入顺序为**先子后父**:
  `createComponent(vnode)` 中会调用内部钩子函数 `init(vnode)`,
  `init(vnode)` 函数会创建子组件 `VNode`, 并调用 `child.$mount(vnode.elm)`,
  递归式地创建子组件.

```ts
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }

  if (isDef(data) && isDef(data.__ob__))
    return createEmptyVNode()

  // object syntax in v-bind
  if (isDef(data) && isDef(data.is))
    tag = data.is

  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }

  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }

  if (normalizationType === ALWAYS_NORMALIZE)
    children = normalizeChildren(children)
  else if (normalizationType === SIMPLE_NORMALIZE)
    children = simpleNormalizeChildren(children)

  let vnode
  let ns

  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)

    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      )
    } else if (!data || !data.pre) {
      Ctor = resolveAsset(context.$options, 'components', tag)

      if (isDef(Ctor)) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag)
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(tag, data, children, undefined, undefined, context)
      }
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }

  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns))
      applyNS(vnode, ns)
    if (isDef(data))
      registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

## Updating

`core/instance/lifecycle.js`:

```ts
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode

  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }

  restoreActiveInstance()

  // update __vue__ reference
  if (prevEl)
    prevEl.__vue__ = null

  if (vm.$el)
    vm.$el.__vue__ = vm

  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode)
    vm.$parent.$el = vm.$el

  // updated hook is called by scheduler
  // to ensure that children are updated in a parent's updated hook.
}
```

## Options

`beforeCreate`/`created` in `core/instance/init.js`:

- `beforeCreate` cannot access `props`/`data`/`methods`.
- `created` can access `props`/`data`/`methods`.
- `beforeCreate`/`created` cannot access DOM.

`beforeMount`/`mounted` in `core/instance/lifecycle.js`:

- 对于同步渲染的子组件, `mounted` 执行顺序为**先子后父**.
- `mounted` is called for render-created child components in its inserted hook.

`beforeDestroy`/`destroyed` in `core/instance/lifecycle.js`:

- 调用 `beforeDestroy` 钩子函数.
- 从 `parent` 的 `$children` 中删掉自身.
- 删除 `watcher`.
- 当前渲染的 VNode 执行销毁钩子函数.
- 调用 `destroyed` 钩子函数.
- 在 `$destroy` 的执行过程中,
  会执行 `vm.__patch__(vm._vnode, null)` 触发子组件的销毁钩子函数 (递归),
  `destroyed` 钩子函数执行顺序为**先子后父**.

## Composition

```ts
const currentInstance = null

function mountComponent(vnode, container, anchor) {
  const componentOptions = vnode.type
  const { setup, data, props, attrs, slots } = componentOptions
  const instance = {
    state: reactive(data),
    props: shallowReadonly(props),
    isMounted: false,
    subTree: null,
    slots,
    mounted: [],
  }

  const setupContext = { attrs, slots }
  setCurrentInstance(instance)

  const setupResult = setup(allowReadonly(instance.props), setupContext)
  setCurrentInstance(null)

  effect(
    () => {
      const subTree = render.call(renderContext, renderContext)

      if (!instance.mounted)
        instance.mounted?.forEach(hook => hook.call(renderContext))
    },
    {
      scheduler: queueJob,
    }
  )
}

function onMounted(fn) {
  if (currentInstance)
    currentInstance.mounted.push(fn)
  else console.error('`onMounted()` can only be called in `setup()`.')
}
```
