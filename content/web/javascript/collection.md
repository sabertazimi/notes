---
sidebar_position: 7
tags: [Web, JavaScript, ECMAScript, Collection, Map, Set]
---

# Collection

## Map

- `size`.
- `has()`.
- `get()`.
- `set()`.
- `delete()`.
- `clear()`.
- `keys()`.
- `values()`.
- `entries()`.

```ts
const map = new Map([
  // You define a map via an array of 2-element arrays. The first
  // element of each nested array is the key, and the 2nd is the value
  ['name', 'Jean-Luc Picard'],
  ['age', 59],
  ['rank', 'Captain'],
])

// To get the value associated with a given `key` in a map, you
// need to call `map.get(key)`. Using `map.key` will **not** work.
map.get('name') // 'Jean-Luc Picard'
```

```ts
const map = new Map([])
const n1 = new Number(5)
const n2 = new Number(5)

map.set(n1, 'One')
map.set(n2, 'Two')

// `n1` and `n2` are objects, so `n1 !== n2`. That means the map has
// separate keys for `n1` and `n2`.
map.get(n1) // 'One'
map.get(n2) // 'Two'
map.get(5) // undefined

// If you were to do this with an object, `n2` would overwrite `n1`
const obj = {}
obj[n1] = 'One'
obj[n2] = 'Two'

const two1 = obj[n1] // 'Two'
const two2 = obj[5] // 'Two'
```

```ts
const objectClone = new Map(Object.entries(object))
const arrayClone = new Map(Array.from(map.entries))
const map = new Map([
  ['name', 'Jean-Luc Picard'],
  ['age', 59],
  ['rank', 'Captain'],
])

// The `for/of` loop can loop through iterators
for (const key of map.keys())
  console.log(key) // 'name', 'age', 'rank'

for (const value of map.values())
  console.log(value) // 'Jean-Luc Picard', 59, 'Captain'

for (const [key, value] of map.entries()) {
  console.log(key) // 'name', 'age', 'rank'
  console.log(value) // 'Jean-Luc Picard', 59, 'Captain'
}
```

## Set

- `size`.
- `has()`.
- `add()`.
- `delete()`.
- `clear()`.
- `keys()`.
- `values()`.
- `entries()`.

```ts
class XSet extends Set {
  union(...sets) {
    return XSet.union(this, ...sets)
  }

  intersection(...sets) {
    return XSet.intersection(this, ...sets)
  }

  difference(set) {
    return XSet.difference(this, set)
  }

  symmetricDifference(set) {
    return XSet.symmetricDifference(this, set)
  }

  cartesianProduct(set) {
    return XSet.cartesianProduct(this, set)
  }

  powerSet() {
    return XSet.powerSet(this)
  }

  // 返回两个或更多集合的并集
  // new Set([...setA, ...setB]);
  static union(a, ...bSets) {
    const unionSet = new XSet(a)

    for (const b of bSets) {
      for (const bValue of b)
        unionSet.add(bValue)
    }

    return unionSet
  }

  // 返回两个或更多集合的交集
  // new Set([...setA].filter(x => setB.has(x)))
  static intersection(a, ...bSets) {
    const intersectionSet = new XSet(a)

    for (const aValue of intersectionSet) {
      for (const b of bSets) {
        if (!b.has(aValue))
          intersectionSet.delete(aValue)
      }
    }

    return intersectionSet
  }

  // 返回两个集合的差集
  // new Set([...setA].filter(x => !setB.has(x)))
  static difference(a, b) {
    const differenceSet = new XSet(a)

    for (const bValue of b) {
      if (a.has(bValue))
        differenceSet.delete(bValue)
    }

    return differenceSet
  }

  // 返回两个集合的对称差集
  static symmetricDifference(a, b) {
    // 按照定义, 对称差集可以表达为:
    return a.union(b).difference(a.intersection(b))
  }

  // 返回两个集合 (数组对形式) 的笛卡儿积
  // 必须返回数组集合, 因为笛卡儿积可能包含相同值的对
  static cartesianProduct(a, b) {
    const cartesianProductSet = new XSet()

    for (const aValue of a) {
      for (const bValue of b)
        cartesianProductSet.add([aValue, bValue])
    }

    return cartesianProductSet
  }

  // 返回一个集合的幂集
  static powerSet(a) {
    const powerSet = new XSet().add(new XSet())

    for (const aValue of a) {
      for (const set of new XSet(powerSet))
        powerSet.add(new XSet(set).add(aValue))
    }

    return powerSet
  }
}
```

## WeakMap and WeakSet

WeakMap 结构与 Map 结构基本类似,
唯一的区别就是 WeakMap 只接受**非 null 对象**作为键名:

- 弱键: 键名构建的引用**无法阻止对象执行垃圾回收**.
- 不可迭代键: 键/值随时可能被垃圾回收, 无需提供迭代能力, 无 `clear()` 方法.

它的键所对应的对象可能会在将来消失.
一个对应 DOM 元素的 WeakMap 结构,
当某个 DOM 元素被清除,
其所对应的 WeakMap 记录就会自动被移除.

有时候我们会把对象作为一个对象的键用来存放属性值,
普通集合类型比如简单对象 (Object/Map/Set) 会阻止垃圾回收器对这些作为属性键存在的对象的回收,
有造成内存泄漏的危险,
WeakMap/WeakSet 则更加**内存安全**:

- Caching computed results.
- Managing listeners.
- Keeping private data.

弱引用可以缓存计算结果 (无需修改网络层):

```ts
const CACHE = new WeakMap()

async function describe(transaction) {
  const cached = CACHE.get(transaction)

  if (cached) {
    return cached
  }

  // Not cached, do all the work...

  CACHE.set(transaction, description)
  return description
}
```

弱引用可以[实现控制反转](https://jlongster.com/subverting-control-weak-refs):

```ts
const CONVERTERS = new WeakMap()

function getConverter(transaction) {
  const converter
    = CONVERTERS.get(transaction) || new CurrencyConversion(transaction, { options })
  CONVERTERS.set(transaction, converter)
  return converter
}

function describe(transaction) {
  if (!getConverter(transaction).isReady()) {
    // do something..
  }

  // Here converter only exists for the lifetime to the describe function call.
  // When we store it in a weak map, it exists for the entire lifetime of the transaction class.
  // That allows us to write code the assumes the same lifetime
  // e.g. caching things, using instance equality.
  const amount = getConverter(transaction).convert()
}
```
