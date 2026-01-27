---
tags: [Web, Vue]
sidebar_position: 15
---

# Keep Alive and Teleport

## Keep Alive

- `include`: `string | RegExp | Array<string>`, 匹配的组件会被缓存.
- `exclude`: `string | RegExp | Array<string>`, 匹配的组件不会被缓存.
- `max`: 缓存大小.
- 组件一旦被 `<keep-alive>` 缓存,
  再次渲染的时候不会执行 `created`/`mounted` 等钩子函数 (`core/vdom/create-component.js`).
  但会执行 `activated`/`deactivated` 钩子函数 (`core/vdom/create-component.js`/`core/instance/lifecycle.js`).

```ts
// core/components/keep-alive.js
const KeepAlive = defineComponent({
  name: 'KeepAlive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number],
  },

  created() {
    this.cache = Object.create(null)
    this.keys = []
  },

  mounted() {
    this.$watch('include', (val) => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', (val) => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  unmounted() {
    for (const key in this.cache) pruneCacheEntry(this.cache, key, this.keys)
  },

  render() {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions
      = vnode && vnode.componentOptions

    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this

      if (
        // not included
        (include && (!name || !matches(include, name)))
        // excluded
        || (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      const key: ?string
        = vnode.key == null
          ? componentOptions.Ctor.cid
          + (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)

        // prune oldest entry
        if (this.max && keys.length > Number.parseInt(this.max))
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
      }

      vnode.data.keepAlive = true
    }

    return vnode || (slot && slot[0])
  },
})
```

```ts
const KeepAlive = {
  __isKeepAlive: true,
  props: {
    include: RegExp,
    exclude: RegExp,
  },
  setup(props, { slots }) {
    const instance = currentInstance
    const { move, createElement } = instance.keepAliveCtx

    const storageContainer = createElement('div')

    instance._deactivate = (vnode) => {
      move(vnode, storageContainer)
    }

    instance._activate = (vnode, container, anchor) => {
      move(vnode, container, anchor)
    }

    return () => {
      const rawVNode = slots.default()

      if (typeof rawVNode.type !== 'object')
        return rawVNode

      const name = rawVNode.type.name

      if (
        name
        && ((props.include && !props.include.test(name))
          || (props.exclude && props.exclude.test(name)))
      ) {
        return rawVNode
      }

      const cachedVNode = cache.get(rawVNode.type)

      if (cachedVNode) {
        rawVNode.component = cachedVNode.component
        rawVNode.keptAlive = true
      } else {
        cache.set(rawVNode.type, rawVNode)
      }

      rawVNode.shouldKeepAlive = true
      rawVNode.keepAliveInstance = instance

      return rawVNode
    }
  },
}
```

## Teleport

```ts
const Teleport = {
  __isTeleport: true,
  process(n1, n2, container, anchor, internals) {
    const { patch, patchChildren, move } = internals

    if (!n1) {
      // 挂载
      const target
        = typeof n2.props.to === 'string'
          ? document.querySelector(n2.props.to)
          : n2.props.to
      n2.children.forEach(c => patch(null, c, target, anchor))
    } else {
      // 更新
      patchChildren(n1, n2, container)

      if (n2.props.to !== n1.props.to) {
        const newTarget
          = typeof n2.props.to === 'string'
            ? document.querySelector(n2.props.to)
            : n2.props.to
        n2.children.forEach(c => move(c, newTarget))
      }
    }
  },
}
```

## Client Only

```ts
const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false)

    // `onMounted()` hooks 只在客户端执行,
    // 服务端渲染时不执行.
    onMounted(() => {
      show.value = true
    })

    return () => (show.value && slots.default ? slots.default() : null)
  },
})
```
