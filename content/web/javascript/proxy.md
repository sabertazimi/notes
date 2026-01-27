---
sidebar_position: 24
tags: [Web, JavaScript, ECMAScript, Proxy, Reflect]
---

# Proxy and Reflect

Modify default object behavior with `Proxy` and `Reflect`:

- `new Proxy(target, handler)`.
- `Proxy.revocable(target, handler)`.

```ts
const proxy = new Proxy(target, {
  set(target, name, value, receiver) {
    const success = Reflect.set(target, name, value, receiver)
    if (success)
      log(`property ${name} on ${target} set to ${value}`)

    return success
  },
})
```

## Proxy

- Change original object will change proxy object.
- change proxy object will change original object via `set` related API.
- `Proxy.prototype` 为 `undefined`.
- `target !== proxy`.

```ts
const target = {
  id: 'target',
}
const handler = {}
const proxy = new Proxy(target, handler)

// Proxy.prototype 是 undefined
console.log(target instanceof Proxy) // TypeError
console.log(proxy instanceof Proxy) // TypeError
// 严格相等可以用来区分代理和目标
console.log(target === proxy) // false
```

`this` binding should process carefully:

```ts
const proxy = new Proxy(new Date(), {})
proxy.getDate() // `getDate` rely on internal slots
// TypeError: `this` is not a Date object.

const handler = {
  get(target, propKey, receiver) {
    if (propKey === 'getDate')
      return target.getDate.bind(target)

    return Reflect.get(target, propKey, receiver)
  },
}
const proxy = new Proxy(new Date('2020-12-24'), handler)
proxy.getDate() // 24
```

:::tip[Proxy vs DefineProperty]

- Simple: `Proxy` 使用上比 `Object.defineProperty` 方便.
  - `Object.defineProperty` 只能监听对象, 导致 `Vue 2` `data` 属性必须通过一个返回对象的函数方式初始化,
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

:::

## Reflect

- `Reflect.get(target, propKey)`.
- `Reflect.set(target, propKey, value)`.
- `Reflect.has(target, propKey)`:
  `in` operator.
- `Reflect.defineProperty(target, propKey, attributes)`.
- `Reflect.getOwnPropertyDescriptor(target, propKey)`.
- `Reflect.deleteProperty(target, propKey)`:
  `delete` operator.
- `Reflect.ownKeys(target)`:
  `Object.keys()` + `Object.getOwnPropertyNames()` + `Object.getOwnPropertySymbols()`,
  all keys.
- `Reflect.getPrototypeOf(target)`.
- `Reflect.setPrototypeOf(target, prototype)`.
- `Reflect.isExtensible(target)`.
- `Reflect.preventExtensions(target)`.
- `Reflect.apply(target, thisArgument, argumentsList)`:
  function call.
- `Reflect.construct(target, argumentsList)`:
  `new target(...argumentsList)` operator.

| Proxy Behavior                       | Overrides Behavior                  |
| ------------------------------------ | ----------------------------------- |
| `Reflect.get()`                      | Reading a property value            |
| `Reflect.set()`                      | Writing to a property               |
| `Reflect.has()`                      | `in` operator                       |
| `Reflect.deleteProperty()`           | `delete` operator                   |
| `Reflect.getPrototypeOf()`           | `Object.getPrototypeOf()`           |
| `Reflect.setPrototypeOf()`           | `Object.setPrototypeOf()`           |
| `Reflect.isExtensible()`             | `Object.isExtensible()`             |
| `Reflect.preventExtensions()`        | `Object.preventExtensions()`        |
| `Reflect.getOwnPropertyDescriptor()` | `Object.getOwnPropertyDescriptor()` |
| `Reflect.defineProperty()`           | `Object.defineProperty()`           |
| `Reflect.ownKeys()`                  | All `Object` keys methods           |
| `Reflect.apply()`                    | Calling a function                  |
| `Reflect.construct()`                | Calling a function with `new`       |

```ts
const target = {
  foo: 'bar',
}
const proxy = new Proxy(target, Reflect)
console.log(proxy.foo) // bar
console.log(target.foo) // bar
```

```ts
Reflect.ownKeys({ z: 3, y: 2, x: 1 }) // [ "z", "y", "x" ]
Reflect.ownKeys([]) // ["length"]

const sym = Symbol.for('comet')
const sym2 = Symbol.for('meteor')
const obj = {
  [sym]: 0,
  'str': 0,
  '773': 0,
  '0': 0,
  [sym2]: 0,
  '-1': 0,
  '8': 0,
  'second str': 0,
}

Reflect.ownKeys(obj)
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
// Indexes in numeric order,
// strings in insertion order,
// symbols in insertion order.
```

CommonJS (`CJS`) to ES Module (`ESM`) exports:

```ts
const esm$1 = { exports: {} }

;(function (module, exports) {
  module.exports = () => {}
  exports.a = 3
  exports.b = 4
})(esm$1, esm$1.exports)

const esm = esm$1.exports

export { esm as default }
```

## Protection

### Default Zero Value

```ts
function withZeroValue(target, zeroValue = 0) {
  return new Proxy(target, {
    get: (obj, prop) => (prop in obj ? obj[prop] : zeroValue),
  })
}

let pos = { x: 4, y: 19 }
console.log(pos.z) // => undefined
pos = withZeroValue(pos)
console.log(pos.z) // => 0
```

### Hiding Properties

```ts
function hide(target, prefix = '_') {
  return new Proxy(target, {
    has: (obj, prop) => !prop.startsWith(prefix) && prop in obj,
    ownKeys: obj =>
      Reflect.ownKeys(obj).filter(
        prop => typeof prop !== 'string' || !prop.startsWith(prefix)
      ),
    get: (obj, prop, rec) => (prop in rec ? obj[prop] : undefined),
  })
}

const userData = hide({
  firstName: 'Tom',
  mediumHandle: '@bar',
  _favoriteRapper: 'Drake',
})

const falsy = '_favoriteRapper' in userData // has: false
const keys = Object.keys(userData) // ownKeys: ['firstName', 'mediumHandle']
console.log(userData._favoriteRapper) // get: undefined
```

### Read Only Object

```ts
function NOPE() {
  throw new Error('Can\'t modify read-only object')
}

const NOPE_HANDLER = {
  set: NOPE,
  defineProperty: NOPE,
  deleteProperty: NOPE,
  preventExtensions: NOPE,
  setPrototypeOf: NOPE,
  get: (obj, prop) => {
    if (prop in obj)
      return Reflect.get(obj, prop)

    throw new ReferenceError(`Unknown prop "${prop}"`)
  },
}

const readOnly = target => new Proxy(target, NODE_HANDLER)
```

### Negative Array Indices

```ts
function negativeArray(els) {
  return new Proxy(target, {
    get: (target, propKey, receiver) =>
      Reflect.get(
        target,
        +propKey < 0 ? String(target.length + +propKey) : propKey,
        receiver
      ),
  })
}
```

### Array Manipulation

```ts
function toUint32(value) {
  return Math.floor(Math.abs(Number(value))) % 2 ** 32
}

function isArrayIndex(key) {
  const numericKey = toUint32(key)
  return String(numericKey) === key && numericKey < 2 ** 32 - 1
}

class MyArray {
  constructor(length = 0) {
    this.length = length

    return new Proxy(this, {
      set(trapTarget, key, value) {
        const currentLength = Reflect.get(trapTarget, 'length')

        // the special case
        if (isArrayIndex(key)) {
          const numericKey = Number(key)

          if (numericKey >= currentLength)
            Reflect.set(trapTarget, 'length', numericKey + 1)
        } else if (key === 'length') {
          if (value < currentLength) {
            for (let index = currentLength - 1; index >= value; index--)
              Reflect.deleteProperty(trapTarget, index)
          }
        }

        // always do this regardless of key type
        return Reflect.set(trapTarget, key, value)
      },
    })
  }
}

const colors = new MyArray(3)
console.log(colors instanceof MyArray) // true
console.log(colors.length) // 3

colors[0] = 'red'
colors[1] = 'green'
colors[2] = 'blue'
colors[3] = 'black'
console.log(colors.length) // 4

colors.length = 2
console.log(colors.length) // 2
console.log(colors[3]) // undefined
console.log(colors[2]) // undefined
console.log(colors[1]) // "green"
console.log(colors[0]) // "red"
```

### Exception

```ts
function createExceptionProxy(target) {
  return new Proxy(target, {
    get: (target, prop) => {
      if (!(prop in target))
        return

      if (typeof target[prop] === 'function')
        return createExceptionZone(target, prop)

      return target[prop]
    },
  })
}

function createExceptionZone(target, prop) {
  return (...args) => {
    let result
    ExceptionsZone.run(() => {
      result = target[prop](...args)
    })
    return result
  }
}

class ExceptionsZone {
  static exceptionHandler = new ExceptionHandler()

  static run(callback) {
    try {
      callback()
    } catch (e) {
      this.exceptionHandler.handle(e)
    }
  }
}

class ExceptionHandler {
  handle(exception) {
    console.log('记录错误: ', exception.message, exception.stack)
  }
}
```

```ts
const obj = {
  name: 'obj',
  say() {
    console.log(`Hi, I'm ${this.name}`)
  },
  coding() {
    // xxx.
    throw new Error('bug')
  },
  coding2() {
    // xxx.
    throw new Error('bug2')
  },
}

const proxy = createProxy(obj)

proxy.say()
proxy.coding()
```

## Validation

### Range

`in` operator capture:

```ts
function range(min, max) {
  return new Proxy(Object.create(null), {
    has: (_, prop) => +prop >= min && +prop <= max,
  })
}

const X = 10.5
const nums = [1, 5, X, 50, 100]

if (X in range(1, 100)) {
  // => true
}

nums.filter(n => n in range(1, 10))
// => [1, 5]
```

### Property

`set` operator capture:

```ts
const target = {
  onlyNumbersGoHere: 0,
}

const proxy = new Proxy(target, {
  set(target, property, value) {
    if (typeof value !== 'number')
      return false
    else
      return Reflect.set(target, property, value)
  },
})

proxy.onlyNumbersGoHere = 1
console.log(proxy.onlyNumbersGoHere) // 1
proxy.onlyNumbersGoHere = '2'
console.log(proxy.onlyNumbersGoHere) // 1
```

### Function Parameter

`apply` operator capture:

```ts
function median(...nums) {
  return nums.sort()[Math.floor(nums.length / 2)]
}

const proxy = new Proxy(median, {
  apply(target, thisArg, argumentsList) {
    for (const arg of argumentsList) {
      if (typeof arg !== 'number')
        throw new TypeError('Non-number argument provided')
    }

    return Reflect.apply(target, thisArg, argumentsList)
  },
})

console.log(proxy(4, 7, 1)) // 4
console.log(proxy(4, '7', 1))
// TypeError: Non-number argument provided

class Person {
  constructor(name) {
    this.name = name
  }
}

const PersonProxy = new Proxy(Person, {
  apply(TrapTarget, thisArg, argumentList) {
    return new TrapTarget(...argumentList)
  },
})

const me = PersonProxy('Nicholas')
console.log(me.name) // "Nicholas"
console.log(me instanceof Person) // true
console.log(me instanceof PersonProxy) // true
```

### Constructor Parameter

`new` operator capture:

```ts
class User {
  constructor(id) {
    this.id_ = id
  }
}

const ProxyUser = new Proxy(User, {
  construct(target, argumentsList, newTarget) {
    if (argumentsList[0] === undefined)
      throw new Error('User cannot be instantiated without id')
    else
      return Reflect.construct(target, argumentsList, newTarget)
  },
})

const obj = new ProxyUser(1)
const throwError = new ProxyUser()
// Error: User cannot be instantiated without id
```

## Patterns

- Remote mock and placeholder:
  - Data mock.
  - Image placeholder.
- Cache:
  - Database objects access caching.
  - Memoized functions.
- Profiling.
- Observer and watcher: Vue 3 reactivity, ImmerJS draft state.
