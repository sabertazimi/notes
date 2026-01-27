---
tags: [Web, Vue, Internals, Reactivity]
sidebar_position: 29
---

# Modern Reactivity

## System

- `effect.ts`: `effect`, `track`, `trigger`.
- `baseHandlers.ts`: proxy handler (`get` and `set`).
- `reactive.ts`: `reactive` using ES6 Proxy.
- `ref.ts`:
  - reactive reference using Object Accessors.
  - `ref` performant over `reactive`.
- `computed.ts`: `computed` using `effect` and return a `ref`.

## Effects

Data `getter`/`setter` -> Notify -> Watcher -> Trigger --> Renderer:

```ts
console.log(data.a) // getHook() get called.
data.a = 2 // setHook() get called.
```

Effects bucket:

- `targetMap` = `target: effectsMap`.
- `effectsMap` = `keyName: effectsSet`.

```ts
type Primitive = string | number | boolean
type Key = string | symbol
type Effect<T> = () => T

const runningEffects = []

const targetMap = new WeakMap()

const IterateKey = Symbol('IterateKey')
const LengthKey = 'length'

// runEffect -> effect -> proxy.get -> track.
function createEffect<T>(effect: Effect<T>) {
  runningEffects.push(effect)
  effect()
  runningEffects.pop()
}

function track<T extends object>(target: T, key: Key) {
  for (const effect of runningEffects) {
    let effectsMap = targetMap.get(target)
    if (!effectsMap)
      targetMap.set(target, (effectsMap = new Map()))

    let effects = effectsMap.get(key)
    if (!effects)
      effectsMap.set(key, (effects = new Set()))

    effects.add(effect)
  }
}

function trigger<T extends object>(target: T, key: Key, type: Type) {
  const effectsMap = targetMap.get(target)
  if (!effectsMap)
    return

  const effectsToRun = new Set()

  const ordinaryEffects = effectsMap.get(key)
  ordinaryEffects?.forEach((effect) => {
    // Remove current running effect
    // to avoid infinite call stack
    // (skip triggering current tracking effect):
    // reactive.foo = reactive.foo + 1;
    if (effect !== runningEffects.top())
      effectsToRun.add(effect)
  })

  if (type === 'ADD' || type === 'DELETE') {
    const iterateEffects = effectsMap.get(IterateKey)
    iterateEffects?.forEach((effect) => {
      if (effect !== runningEffects.top())
        effectsToRun.add(effect)
    })
  }

  if (type === 'LENGTH') {
    const lengthEffects = effectsMap.get(LengthKey)
    lengthEffects?.forEach((effect) => {
      if (effect !== runningEffects.top())
        effectsToRun.add(effect)
    })
  }

  effectsToRun.forEach((effect) => {
    if (effect.options.scheduler)
      effect.options.scheduler(effect)
    else effect()
  })
}

export function reactive<T extends object>(target: T) {
  const handler: ProxyHandler<T> = {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      track(target, key)
      if (value !== null && typeof value === 'object')
        return reactive(value)
      else return value
    },
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      // Proxy `for key in target` operator.
      track(target, Array.isArray(target) ? LengthKey : IterateKey)
      return Reflect.ownKeys(target)
    },
    set(target, key, value, receiver) {
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? 'SET'
          : 'LENGTH'
        : Object.hasOwn(target, key)
          ? 'SET'
          : 'ADD'
      const oldValue = Reflect.get(target, key, receiver)
      const result = Reflect.set(target, key, value, receiver)
      if (result && oldValue !== value)
        trigger(target, key, type)
      return result
    },
    deleteProperty(target, key) {
      const isOwnKey = Object.hasOwn(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (result && isOwnKey)
        trigger(target, key, 'DELETE')
      return result
    },
  }

  return new Proxy(target, handler)
}

export function ref<T extends Primitive>(raw?: T) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return raw
    },
    set value(newValue: T) {
      raw = newValue
      trigger(refObject, 'value')
    },
  }

  return refObject
}

export function computed<T extends Primitive>(getter: () => T) {
  const refObject = ref<T>()
  createEffect(() => (refObject.value = getter()))
  return refObject
}
```

```ts
interface Product {
  price: number
  quantity: number
}

const product = reactive<Product>({ price: 5, quantity: 2 })
const salePrice = computed(() => product.price * 0.9)
const total = computed(() => salePrice.value * product.quantity)

console.assert(salePrice.value === 4.5)
console.assert(total.value === 9)

product.quantity = 3
console.assert(total.value === 13.5)

product.quantity = 4
console.assert(total.value === 18)

product.price = 6
console.assert(salePrice.value === 5.4)
console.assert(total.value === 21.6)
```

## Proxy

- Simple: `Proxy` 使用上比 `Object.defineProperty` 方便.
  - `Object.defineProperty` 只能监听对象, 导致 `Vue 2` `data` 属性必须通过一个返回对象的函数方式初始化.
  - `Vue 3` 更加多元化, 可以监听任意数据.
- Performant: `Proxy` 代理整个对象, `Object.defineProperty` 只代理对象上的某个属性.
  - `Object.defineProperty` 由于每次只能监听对象一个键的 `get`/`set`, 导致需要循环监听浪费性能.
  - `Proxy` 可以一次性监听到所有属性.
- Lazy: `Proxy` 性能优于 `Object.defineProperty`.
  - 如果对象内部要全部递归代理, 则 `Proxy` 可以只在调用时递归.
  - `Object.defineProperty` 需要在一开始就全部递归.
- Feature:
  - 对象上定义新属性时, 只有 `Proxy` 可以监听到:
    - Vue2: 提供 `Vue.set`/`Vue.delete` 等辅助方法.
    - Vue3: `Proxy` 监听新属性.
  - 数组新增删除修改时, 只有 `Proxy` 可以监听到:
    - `Object.defineProperty` 无法监听数组, `Proxy` 则可以直接监听数组变化.
    - Vue2: 重写数组方法监听数组变化.
    - Vue3: `Proxy` 监听数组变化.
- `Proxy` 不兼容 IE, `Object.defineProperty` 不兼容 IE8 及以下.

Vue 2:

```ts
Vue.set(app.items, indexOfItem, newValue)
Vue.set(app.product, newField, newValue)
```

Vue 3:

```ts
app.items[indexOfItem] = newValue
app.product[newField] = newValue
```
