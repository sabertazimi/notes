---
sidebar_position: 18
tags: [Web, JavaScript, ECMAScript, Iterator]
---

# Iterator

## Protocol

Iteration [protocol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols):

- 一个数据结构只要实现了 `[Symbol.iterator]()` 接口, 便可成为可迭代数据结构 (`Iterable`):
  - String: `StringIterator`.
  - Array: `ArrayIterator`.
  - Map: `MapIterator`.
  - Set: `SetIterator`.
  - `arguments` 对象.
  - DOM collection (`NodeList`): `ArrayIterator`.
- 接收可迭代对象的原生语言特性:
  - `for...in`/`for...of`.
  - Destructing: 数组解构.
  - `...`: 扩展操作符 (`Spread Operator`).
  - `Array.from()`.
  - `new Map()`.
  - `new Set()`.
  - `Promise.all()`.
  - `Promise.race()`.
  - `yield*` 操作符.
- `for...in`/`for...of` 隐形调用迭代器的方式, 称为内部迭代器, 使用方便, 不可自定义迭代过程.
- `{ next, done, value }` 显式调用迭代器的方式, 称为外部迭代器, 使用复杂, 可以自定义迭代过程.
- All built-in ES6 iterators are `Self Iterable Iterator`.

```ts
interface Iterable<T> {
  [Symbol.iterator]: () => Iterator<T>
}

interface Iterator<T> {
  next: (...args: []) => IteratorResult<T>
  return?: (value?: T) => IteratorResult<T> // Closable iterator
  throw?: (e?: any) => IteratorResult<T>
}

interface IterableIterator<T> extends Iterator<T> {
  [Symbol.iterator]: () => IterableIterator<T>
}

interface AsyncIterable<T> {
  [Symbol.asyncIterator]: () => AsyncIterator<T>
}

interface AsyncIterator<T> {
  next: (...args: []) => Promise<IteratorResult<T>>
  throw?: (e?: any) => Promise<IteratorResult<T>>
  // Closable iterator
  return?: (value?: T | PromiseLike<T>) => Promise<IteratorResult<T>>
}

interface AsyncIterableIterator<T> extends AsyncIterator<T> {
  [Symbol.asyncIterator]: () => AsyncIterableIterator<T>
}

interface IteratorResult<T> {
  done: boolean
  value: T
}
```

## Synchronous

### Object

```ts
function methodsIterator() {
  let index = 0
  const methods = Object.keys(this)
    .filter((key) => {
      return typeof this[key] === 'function'
    })
    .map(key => this[key])

  // iterator object
  return {
    next: () => ({
      // Conform to Iterator protocol
      done: index >= methods.length,
      value: methods[index++],
    }),
  }
}

const myMethods = {
  toString() {
    return '[object myMethods]'
  },
  sumNumbers(a, b) {
    return a + b
  },
  numbers: [1, 5, 6],
  [Symbol.iterator]: methodsIterator, // Conform to Iterable Protocol
}

for (const method of myMethods)
  console.log(method) // logs methods `toString` and `sumNumbers`
```

```ts
function zip(...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]())
  let done = false

  return {
    [Symbol.iterator]() {
      return this
    },
    next() {
      if (!done) {
        const items = iterators.map(i => i.next())
        done = items.some(item => item.done)

        if (!done)
          return { value: items.map(i => i.value) }

        // Done for the first time: close all iterators
        for (const iterator of iterators) {
          if (typeof iterator.return === 'function')
            iterator.return()
        }
      }

      // We are done
      return { done: true }
    },
  }
}

const zipped = zip(['a', 'b', 'c'], ['d', 'e', 'f', 'g'])

for (const x of zipped)
  console.log(x)

// Output:
// ['a', 'd']
// ['b', 'e']
// ['c', 'f']
```

### Class

```ts
class Counter {
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator]() {
    let count = 1
    const limit = this.limit

    return {
      next() {
        if (count <= limit)
          return { done: false, value: count++ }
        else
          return { done: true }
      },
      return() {
        console.log('Exiting early')
        return { done: true }
      },
    }
  }
}

const counter1 = new Counter(5)
for (const i of counter1) {
  if (i > 2)
    break

  console.log(i)
}
// 1
// 2
// Exiting early

const counter2 = new Counter(5)
try {
  for (const i of counter2) {
    if (i > 2)
      throw new Error('err')

    console.log(i)
  }
} catch (e) {}
// 1
// 2
// Exiting early

const counter3 = new Counter(5)
const [a, b] = counter3
// Exiting early
```

```ts
// Class Iterator:
class MatrixIterator {
  constructor(matrix) {
    this.x = 0
    this.y = 0
    this.matrix = matrix
  }

  next() {
    if (this.y === this.matrix.height)
      return { done: true }

    const value = {
      x: this.x,
      y: this.y,
      value: this.matrix.get(this.x, this.y),
    }

    this.x++

    if (this.x === this.matrix.width) {
      this.x = 0
      this.y++
    }

    return { value, done: false }
  }
}

// Iterable Class:
class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width
    this.height = height
    this.content = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++)
        this.content[y * width + x] = element(x, y)
    }
  }

  get(x, y) {
    return this.content[y * this.width + x]
  }

  set(x, y, value) {
    this.content[y * this.width + x] = value
  }

  [Symbol.iterator]() {
    return new MatrixIterator(this)
  }
}

const matrix = new Matrix(2, 2, (x, y) => `value ${x},${y}`)

for (const { x, y, value } of matrix)
  console.log(x, y, value)

// → 0 0 value 0, 0
// → 1 0 value 1, 0
// → 0 1 value 0, 1
// → 1 1 value 1, 1
```

## Asynchronous

```ts
const AsyncIterable = {
  [Symbol.asyncIterator]() {
    return AsyncIterator
  },
}

const AsyncIterator = {
  next() {
    return Promise.resolve(IteratorResult)
  },
  return() {
    return Promise.resolve(IteratorResult)
  },
  throw(e) {
    return Promise.reject(e)
  },
}

const IteratorResult = {
  value: any,
  done: boolean,
}

// Tasks will chained:
ait
  .next()
  .then(({ value, done }) => ait.next())
  .then(({ value, done }) => ait.next())
  .then(({ done }) => done)

// Tasks will run in parallel:
ait.next().then()
ait.next().then()
ait.next().then()
```

```ts
function remotePostsAsyncIteratorsFactory() {
  let i = 1
  let done = false

  const asyncIterableIterator = {
    // the next method will always return a Promise
    async next() {
      // do nothing if we went out-of-bounds
      if (done) {
        return Promise.resolve({
          done: true,
          value: undefined,
        })
      }

      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${i++}`
      ).then(r => r.json())

      // the posts source is ended
      if (Object.keys(res).length === 0) {
        done = true
        return Promise.resolve({
          done: true,
          value: undefined,
        })
      } else {
        return Promise.resolve({
          done: false,
          value: res,
        })
      }
    },
    [Symbol.asyncIterator]() {
      return this
    },
  }

  return asyncIterableIterator
}

;(async () => {
  const ait = remotePostsAsyncIteratorsFactory()

  await ait.next() // { done:false, value:{id: 1, ...} }
  await ait.next() // { done:false, value:{id: 2, ...} }
  await ait.next() // { done:false, value:{id: 3, ...} }
  // ...
  await ait.next() // { done:false, value:{id: 100, ...} }
  await ait.next() // { done:true, value:undefined }
})()
```

## Closable

- An iterator is closable if it has a method `return()`.

```ts
interface ClosableIterator {
  next: () => IteratorResult
  return: (value?: any) => IteratorResult
}
```

- Not all iterators are closable: e.g. `Array Iterator`.

```ts
const iterable = ['a', 'b', 'c']
const iterator = iterable[Symbol.iterator]()
console.log('return' in iterator)
// => false
```

- If an iterator is not closable,
  you can continue iterating over it after an abrupt exit.
- If an iterator is closable,
  you can't continue iterating over it after an abrupt exit.

```ts
function* elements() {
  yield 'a'
  yield 'b'
  yield 'c'
}

function twoLoops(iterator) {
  // eslint-disable-next-line no-unreachable-loop -- break loop
  for (const x of iterator) {
    console.log(x)
    break
  }

  for (const x of iterator) {
    console.log(x)
  }
}

class PreventReturn {
  constructor(iterator) {
    this.iterator = iterator
  }

  [Symbol.iterator]() {
    return this
  }

  next() {
    return this.iterator.next()
  }

  return(value = undefined) {
    return { done: false, value }
  }
}

twoLoops(elements())
// Output:
// a

twoLoops(new PreventReturn(elements()))
// Output:
// a
// b
// c

twoLoops(['a', 'b', 'c'][Symbol.iterator]())
// Output:
// a
// b
// c
```

- Manually call `iterator.return()`:

```ts
function take(n, iterable) {
  const iter = iterable[Symbol.iterator]()

  return {
    [Symbol.iterator]() {
      return this
    },
    next() {
      if (n > 0) {
        n--
        return iter.next()
      } else {
        iter?.return()
        return { done: true }
      }
    },
    return() {
      n = 0
      iter?.return()
    },
  }
}
```
