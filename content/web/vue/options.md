---
tags: [Web, Vue, Internals, Options]
sidebar_position: 22
---

# Options

Parent component options:

```ts
vm.$options = {
  components: {
    KeepAlive,
    Transition,
    TransitionGroup,
    ...UserRegisterComponents,
  },
  created: [
    function created() {
      console.log('parent created')
    },
  ],
  directives: {
    model,
    show,
    ...userCustomDirectives,
  },
  filters: {},
  _base: function Vue(options) {},
  el: '#app',
  render: function _render(h) {},
}
```

Children component options:

```ts
vm.$options = {
  parent: Vue /* 父Vue实例 */,
  propsData: undefined,
  _componentTag: undefined,
  _parentVnode: VNode /* 父VNode实例 */,
  _renderChildren: undefined,
  __proto__: {
    components: {
      KeepAlive,
      Transition,
      TransitionGroup,
      ...UserRegisterComponents,
    },
    directives: {
      model,
      show,
      ...userCustomDirectives,
    },
    filters: {},
    _base: function Vue(options) {},
  },
  created: [
    function created() {
      console.log('parent created')
    },
    function created() {
      console.log('child created')
    },
  ],
  directives: {
    model,
    show,
    ...userCustomDirectives,
  },
  filters: {},
  _base: function Vue(options) {},
  el: '#app',
  render: function _render(h) {},
}
```

`core/instance/state.js/initProps()`: `this.XXX` -> `this._props.XXX`.
`core/instance/state.js/initData()`: `this.XXX` -> `this._data.XXX`.

## Merge

`mergeOptions` (`core/util/options.js`):

- 对于 `el`/`propsData` 选项使用默认的合并策略 `defaultStrategy`.
- 对于 `data` 选项, 使用 `mergeDataOrFn` 函数进行处理, 最终结果是 `data` 选项将变成一个函数, 且该函数的执行结果为真正的数据对象.
- 对于生命周期钩子选项, 将合并成数组, 使得父子选项中的钩子函数都能够被执行.
- 对于 `directives`/`filters` 以及 `components` 等资源选项,
  父子选项将以原型链的形式被处理, 正是因为这样我们才能够在任何地方都使用内置组件或指令等.
- 对于 `watch` 选项的合并处理, 类似于生命周期钩子, 如果父子选项都有相同的观测字段, 将被合并为数组, 这样观察者都将被执行.
- 对于 `props`/`methods`/`inject`/`computed` 选项, 父子选项始终可用, 但是子选项会覆盖同名的父选项字段。
- 对于 `provide` 选项, 其合并策略使用与 `data` 选项相同的 `mergeDataOrFn` 函数。
- 最后, 以上没有提及到的选项都将使默认选项 `defaultStrategy`.
- 最最后, 默认认合并策略函数 `defaultStrategy` 的策略是: 只要子选项不是 `undefined` 就使用子选项, 否则使用父选项。

```ts
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(
  parent: object,
  child: object,
  vm?: Component
): object {
  if (typeof child === 'function')
    child = child.options

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  const extendsFrom = child.extends

  if (extendsFrom)
    parent = mergeOptions(parent, extendsFrom, vm)

  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++)
      parent = mergeOptions(parent, child.mixins[i], vm)
  }

  const options = {}
  let key

  for (key in parent) mergeField(key)

  for (key in child) {
    if (!hasOwn(parent, key))
      mergeField(key)
  }

  return options
}

function mergeField(key) {
  const strategy = strategies[key] || defaultStrategy
  options[key] = strategy(parent[key], child[key], vm, key)
}
```

## Normalize

Props:

```ts
export default {
  props: {
    someData1: {
      type: Number,
    },
    someData2: {
      type: String,
      default: '',
    },
  },
}
```

Injects:

```ts
export default {
  inject: {
    data1: { from: 'data1' },
    d2: { from: 'data2' },
    data3: { from: 'data3', someProperty: 'someValue' },
  },
}
```

Directives:

```ts
for (const key in dirs) {
  const def = dirs[key]
  if (typeof def === 'function')
    dirs[key] = { bind: def, update: def }
}
```
