---
tags: [Web, Vue, Internals, Reactivity]
sidebar_position: 28
---

# Legacy Reactivity

![Reactive](./figures/proxy.png 'Reactive')

Collect deps (get):

- `watcher.get()`.
- `pushTarget(watcher)`.
- `watcherGetter()`: Access reactive object `reactiveObject.key`.
- `reactiveObject.get(key)` (`defineReactive`).
- `dep.depend()` + `childObserver.dep.depend()` + `dependArray()`.
- `Dep.target.addDep(dep)` -> `watcher.addDep(dep)`.
- `dep.addSub(watcher)`
- `dep.subs.push(watcher)`.

Dispatch updates (set):

- Change reactive object `reactiveObject.key = value`.
- `reactiveObject.set(key, value)` (`defineReactive`).
- `dep.notify()`.
- `dep.subs.forEach(watcher => watcher.update())`.
- `watcher.update()`.
- `queueWatcher(watcher)`.
- `nextTick(flushSchedulerQueue)`.
- `watcher.run()`.
- `watcher.get()`: Get new value and recollect deps.

## Set and Delete

```ts
Vue.set = function set(target: Array<any> | object, key: any, val: any): any {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  const ob = target.__ob__

  if (target._isVue || (ob && ob.vmCount))
    return val

  if (!ob) {
    target[key] = val
    return val
  }

  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

Vue.del = function del(target: Array<any> | object, key: any) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }

  const ob = target.__ob__

  if (target._isVue || (ob && ob.vmCount))
    return

  if (!hasOwn(target, key))
    return

  delete target[key]

  if (!ob)
    return

  ob.dep.notify()
}
```

## Watcher and Observer

`core/observer/watcher.js`:

- Watcher 的创建顺序为先父后子, 执行顺序 (WatcherQueue) 保持先父后子.
- 用户自定义 Watcher 要优先于 RenderWatcher 执行 (先创建先执行).
- 若一个组件在父组件的 Watcher 执行期间被销毁, 则它对应的 Watcher 执行都可以被跳过.
- `RenderWatcher` (built-in Watcher)
  `updateComponent = () => vm._update(vm._render(), hydrating)`:
  When reactive props and data changed,
  `updateComponent` get invoked automatically.
- 四种 `Watcher` 类型:
  - `Computed Watcher`: `Computed Props` Watcher.
  - `Sync Watcher`: `sync: true`.
  - `Deep Watcher`: `deep: true`, 深测 `Object` 内部变化.
  - `User Watcher`.

```ts
let uid = 0

export default class Watcher {
  vm: Component
  expression: string
  cb: Function
  id: number
  deep: boolean
  user: boolean
  computed: boolean
  sync: boolean
  dirty: boolean
  active: boolean
  dep: Dep
  deps: Array<Dep>
  newDeps: Array<Dep>
  depIds: SimpleSet
  newDepIds: SimpleSet
  before: Function | null
  getter: Function
  value: any

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm

    if (isRenderWatcher)
      vm._watcher = this

    vm._watchers.push(this)

    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.computed = !!options.computed
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.computed = this.sync = false
    }

    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.computed // for computed watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = expOrFn.toString()

    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)

      if (!this.getter)
        this.getter = function () {}
    }

    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  get() {
    pushTarget(this)
    const vm = this.vm
    const value = this.getter.call(vm, vm)

    if (this.deep)
      traverse(value)

    popTarget()
    this.cleanupDeps()
    return value
  }

  addDep(dep: Dep) {
    const id = dep.id

    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)

      if (!this.depIds.has(id))
        dep.addSub(this)
    }
  }

  update() {
    if (this.lazy)
      this.dirty = true
    else if (this.sync)
      this.run()
    else queueWatcher(this)
  }

  run() {
    if (this.active) {
      const value = this.get()

      if (value !== this.value || isObject(value) || this.deep) {
        // set new value
        const oldValue = this.value
        this.value = value

        if (this.user) {
          const info = `callback for watcher "${this.expression}"`
          invokeWithErrorHandling(
            this.cb,
            this.vm,
            [value, oldValue],
            this.vm,
            info
          )
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  depend() {
    if (this.dep && Dep.target)
      this.dep.depend()
  }

  evaluate() {
    if (this.dirty) {
      this.value = this.get()
      this.dirty = false
    }

    return this.value
  }
}
```

`core/observer/dep.js`:

```ts
import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target)
      Dep.target.addDep(this)
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) subs[i].update()
  }
}

// current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget(_target: ?Watcher) {
  if (Dep.target)
    targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}
```

`core/observer/index.js`:

```ts
export class Observer {
  value: any
  dep: Dep
  vmCount: number // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      if (hasProto)
        protoAugment(value, arrayMethods)
      else copyAugment(value, arrayMethods, arrayKeys)

      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj: object) {
    const keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) defineReactive(obj, keys[i])
  }

  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) observe(items[i])
  }
}

export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode)
    return

  let ob: Observer | void

  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve
    && !isServerRendering()
    && (Array.isArray(value) || isPlainObject(value))
    && Object.isExtensible(value)
    && !value._isVue
  ) {
    ob = new Observer(value)
  }

  if (asRootData && ob)
    ob.vmCount++

  return ob
}

export function defineReactive(
  obj: object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)

  if (property && property.configurable === false)
    return

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  if ((!getter || setter) && arguments.length === 2)
    val = obj[key]

  let childOb = !shallow && observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val

      if (Dep.target) {
        dep.depend()

        // 对于数组的特殊处理:
        if (childOb) {
          // 1. 收集数组本身依赖.
          childOb.dep.depend()

          // 2. 收集嵌套数组依赖.
          if (Array.isArray(value))
            dependArray(value)
        }
      }

      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val

      // newVal and value are equal or both are NaN
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}
```

## Array

```ts
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

methodsToPatch.forEach((method) => {
  // Cache original method.
  const original = Array.prototype[method]

  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }

    if (inserted)
      ob.observeArray(inserted)
    ob.dep.notify()
    return result
  })
})
```

## Computed

`core/instance/state.js`:

- `Computed Props` 只关注最终计算结果是否发生变化, 是一种性能优化手段.
- `Computed Props` 最终计算结果不变, 不触发后续更新.
- `Computed Props` 创建的 `Watcher` 称为 `Computed Watcher`.

```ts
const computedWatcherOptions = { computed: true }

function initComputed(vm: Component, computed: object) {
  const watchers = (vm._computedWatchers = Object.create(null))

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    // create internal watcher for computed property.
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions
    )

    if (!(key in vm))
      defineComputed(vm, key, userDef)
  }
}

export function defineComputed(
  target: any,
  key: string,
  userDef: object | Function
) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get ?? noop
    sharedPropertyDefinition.set = userDef.set ?? noop
  }

  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]

    if (watcher) {
      watcher.depend()
      return watcher.evaluate()
    }
  }
}
```

Legacy `Vuex` rely on `Computed Props`,
see [`Store` constructor](https://github.com/vuejs/vuex/blob/3.x/src/store.js#L281):

```ts
function resetStoreVM(store, state, hot) {
  const oldVm = store._vm
  store.getters = {}
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}

  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true,
    })
  })

  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data() {
      return {
        $$state: state,
      }
    },
    computed,
  })
  Vue.config.silent = silent

  if (store.strict)
    enableStrictMode(store)

  if (oldVm) {
    if (hot) {
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }

    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

## Router

- `<router-link>` clicked.
- `vm.$router.push(location)`/`vm.$router.replace(location)`.
- `transitionTo(location, onComplete)`:
  - Call routes guard hooks.
  - Change `vm.$router.currentRoute`.
  - Call `window.history.pushState`/`window.history.replaceState` in `onComplete`.
- `vm.$route` trigger `<router-view>` re-rendering.
