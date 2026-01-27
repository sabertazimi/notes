---
sidebar_position: 19
tags: [Web, JavaScript, ECMAScript, Generator, Iterator]
---

# Generator

- 函数名称前面加一个星号 (`*`) 表示它是一个生成器函数.
- 箭头函数不能用来定义生成器函数.
- 调用生成器函数会产生一个生成器对象, 其是一个**自引用可迭代对象**:
  其本身是一个迭代器, 同时实现了 `Iterable` 接口 (返回 `this`).

```ts
function* gen() {
  yield 1
  yield 2
  yield 3
}

const g = gen()

g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
g.return() // { value: undefined, done: true }
g.return(1) // { value: 1, done: true }
```

## Types

```ts
interface GeneratorFunction {
  (...args: any[]): Generator
  readonly length: number
  readonly name: string
  readonly prototype: Generator
}

interface Generator<T> extends Iterator<T> {
  next: (...args: []) => IteratorResult<T>
  return: (value: T) => IteratorResult<T> // Required
  throw: (e: any) => IteratorResult<T> // Required
  [Symbol.iterator]: () => Generator<T>
}

interface AsyncGeneratorFunction {
  (...args: any[]): AsyncGenerator
  readonly length: number
  readonly name: string
  readonly prototype: AsyncGenerator
}

interface AsyncGenerator<T> extends AsyncIterator<T> {
  next: (...args: []) => Promise<IteratorResult<T>>
  return: (value: T | PromiseLike<T>) => Promise<IteratorResult<T>> // Required
  throw: (e: any) => Promise<IteratorResult<T>> // Required
  [Symbol.asyncIterator]: () => AsyncGenerator<T>
}
```

```ts
function* generatorFn() {}
console.log(generatorFn)
// f* generatorFn() {}

console.log(generatorFn()[Symbol.iterator])
// f [Symbol.iterator]() {native code}

console.log(generatorFn())
// generatorFn {<suspended>}

console.log(generatorFn()[Symbol.iterator]())
// generatorFn {<suspended>}

const g = generatorFn() // IterableIterator
console.log(g === g[Symbol.iterator]())
// true
```

## Roles

Generators can play 3 roles:

- Iterators (data producers):
  generators can produce sequences of values via loops and recursion.
- Observers (data consumers):
  generators become data consumers that pause
  until a new value is pushed into them via `next(value)`
  (`yield` can receive a value from `next(value)`).
- Coroutines (data producers and consumers):
  generators are pauseable and can be both data producers and data consumers,
  generators can be coroutines (cooperatively multi-tasked tasks).

Generators can help
[reduce tight coupling](https://macarthur.me/posts/generators):

```ts
let windowStart = 0

function calculateMovingAverage(values, windowSize) {
  const section = values.slice(windowStart, windowStart + windowSize)

  if (section.length < windowSize)
    return null

  return section.reduce((sum, val) => sum + val, 0) / windowSize
}

loadButton.addEventListener('click', () => {
  const avg = calculateMovingAverage(prices, 5)
  average.innerHTML = `Average: $${avg}`
  windowStart++
})
```

`windowStart` is only exposed where needed,
state and logic are self-contained with generators:

```ts
function* calculateMovingAverage(values, windowSize) {
  let windowStart = 0

  while (windowStart <= values.length - 1) {
    const section = values.slice(windowStart, windowStart + windowSize)

    yield section.reduce((sum, val) => sum + val, 0) / windowSize

    windowStart++
  }
}

const generator = calculateMovingAverage(prices, 5)

loadButton.addEventListener('click', () => {
  const { value } = generator.next()
  average.innerHTML = `Average: $${value}`
})
```

Ugly callback-based code:

```ts
async function monitorVitals(cb) {
  while (true) {
    await new Promise(r => setTimeout(r, 1000))

    const vitals = await requestVitals()
    cb(vitals)
  }
}

monitorVitals((vitals) => {
  console.log('Update the UI...', vitals)
})
```

No callbacks and timing risks with generators:

```ts
async function* generateVitals() {
  while (true) {
    const result = await requestVitals()

    await new Promise(r => setTimeout(r, 1000))

    yield result
  }
}

for await (const vitals of generateVitals()) {
  console.log('Update the UI...', vitals)
}
```

## Default Iterator

生成器函数和默认迭代器**被调用**之后都产生迭代器
(生成器对象是**自引用可迭代对象**, 自身是一个迭代器),
所以生成器适合作为默认迭代器:

```ts
const users = {
  james: false,
  andrew: true,
  alexander: false,
  daisy: false,
  luke: false,
  clare: true,

  * [Symbol.iterator]() {
    // this === 'users'
    for (const key in this) {
      if (this[key])
        yield key
    }
  },
}

for (const key of users)
  console.log(key)

// andrew
// clare

class Foo {
  constructor() {
    this.values = [1, 2, 3]
  }

  * [Symbol.iterator]() {
    yield* this.values
  }
}

const f = new Foo()

for (const x of f)
  console.log(x)

// 1
// 2
// 3
```

## Early Return

- `return()` 方法会强制生成器进入关闭状态.
- 提供给 `return()` 的值, 就是终止迭代器对象的值.

```ts
function* gen() {
  yield 1
  yield 2
  yield 3
}

const g = gen()

g.next() // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next() // { value: undefined, done: true }
```

## Error Handling

- `throw()` 方法会在暂停的时候将一个提供的错误注入到生成器对象中.
  如果错误未被处理, 生成器就会关闭.
- 假如生成器函数内部处理了这个错误, 那么生成器就不会关闭, 可以恢复执行.
  错误处理会跳过对应的 yield (跳过一个值).

```ts
function* generator() {
  try {
    yield 1
  } catch (e) {
    console.log(e)
  }

  yield 2
  yield 3
  yield 4
  yield 5
}

const it = generator()

it.next() // {value: 1, done: false}

// the error will be handled and printed ("Error: Handled!"),
// then the flow will continue, so we will get the
// next yielded value as result.
it.throw(new Error('Handled!')) // {value: 2, done: false}

it.next() // {value: 3, done: false}

// now the generator instance is paused on the
// third yield that is not inside a try-catch.
// the error will be re-thrown out
it.throw(new Error('Not handled!')) // !!! Uncaught Error: Not handled! !!!

// now the iterator is exhausted
it.next() // {value: undefined, done: true}
```

## Next Value

当为 `next` 传递值进行调用时,
传入的值会被当作上一次生成器函数暂停时 `yield` 关键字的返回值处理.
第一次调用 `g.next()` 传入参数是毫无意义,
因为首次调用 `next` 函数时,
生成器函数并没有在 `yield` 关键字处暂停:

```ts
function* lazyCalculator(operator) {
  const firstOperand = yield
  const secondOperand = yield

  switch (operator) {
    case '+':
      yield firstOperand + secondOperand
      return
    case '-':
      yield firstOperand - secondOperand
      return
    case '*':
      yield firstOperand * secondOperand
      return
    case '/':
      yield firstOperand / secondOperand
      return
    default:
      throw new Error('Unsupported operation!')
  }
}

const g = gen('*')
g.next() // { value: undefined, done: false }
g.next(10) // { value: undefined, done: false }
g.next(2) // { value: 20, done: false }
g.next() // { value: undefined, done: true }
```

## Asynchronous

```ts
async function* remotePostsAsyncGenerator() {
  let i = 1

  while (true) {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${i++}`
    ).then(r => r.json())

    // when no more remote posts will be available,
    // it will break the infinite loop.
    // the async iteration will end
    if (Object.keys(res).length === 0)
      break

    yield res
  }
}

for await (const chunk of remotePostsAsyncGenerator())
  console.log(chunk)
```

### Default Asynchronous Iterator

Default asynchronous iterator:

```ts
const asyncSource = {
  async* [Symbol.asyncIterator]() {
    yield await new Promise(resolve => setTimeout(resolve, 1000, 1))
  },
}

for await (const chunk of asyncSource)
  console.log(chunk)
```

### Events Stream

Asynchronous UI events stream (RxJS):

```ts
class Observable {
  constructor() {
    this.promiseQueue = []
    // 保存用于队列下一个 promise 的 resolve 方法
    this.resolve = null
    // 把最初的 promise 推到队列, 该 promise 会 resolve 为第一个观察到的事件
    this.enqueue()
  }

  // 创建新 promise, 保存其 resolve 方法, 并把它保存到队列中
  enqueue() {
    this.promiseQueue.push(new Promise(resolve => (this.resolve = resolve)))
  }

  // 从队列前端移除 promise, 并返回它
  dequeue() {
    return this.promiseQueue.shift()
  }

  async* fromEvent(element, eventType) {
    // 在有事件生成时, 用事件对象来 resolve 队列头部的 promise
    // 同时把另一个 promise 加入队列
    element.addEventListener(eventType, (event) => {
      this.resolve(event)
      this.enqueue()
    })

    // 每次 resolve 队列头部的 promise 后, 都会向异步迭代器返回相应的事件对象
    while (true)
      yield await this.dequeue()
  }
}

const observable = new Observable()
const button = document.querySelector('button')
const mouseClickIterator = observable.fromEvent(button, 'click')

for await (const clickEvent of mouseClickIterator)
  console.log(clickEvent)
```

Generator based asynchronous control flow goodness for nodejs and the browser,
using promises, letting you write non-blocking code in a nice-ish way
(just like [tj/co](https://github.com/tj/co)).

```ts
function coroutine(generatorFunc) {
  const generator = generatorFunc()

  function nextResponse(value) {
    const response = generator.next(value)

    if (response.done)
      return

    if (value instanceof Promise)
      value.then(nextResponse)
    else
      nextResponse(response.value)
  }

  nextResponse()
}

coroutine(function* bounce() {
  yield bounceUp
  yield bounceDown
})
```

利用 `async`/`await` 可以实现相同效果:

```ts
function co(gen) {
  return new Promise((resolve, reject) => {
    const g = gen()

    function next(param) {
      const { done, value } = g.next(param)

      if (!done) {
        // Resolve chain.
        Promise.resolve(value).then(res => next(res))
      } else {
        resolve(value)
      }
    }

    // First invoke g.next() without params.
    next()
  })
}

function promise1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('1')
    }, 1000)
  })
}

function promise2(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`value:${value}`)
    }, 1000)
  })
}

function* readFileGenerator() {
  const value = yield promise1()
  const result = yield promise2(value)
  return result
}

async function readFile() {
  const value = await promise1()
  const result = await promise2(value)
  return result
}

co(readFileGenerator).then(res => console.log(res))
// const g = readFileGenerator();
// const value = g.next();
// const result = g.next(value);
// resolve(result);

readFile().then(res => console.log(res))
```

## Delegation

`yield*` 能够迭代一个可迭代对象 (`yield* iterable`):

- 可以迭代标准库提供的 `Iterable` 集合.
- 生成器函数产生的生成器对象是一个**自引用可迭代对象**,
  可以使用 `yield*` 聚合生成器 (`Delegating Generator`).

```ts
function* generatorFn() {
  console.log('iter value:', yield* [1, 2, 3])
}

for (const x of generatorFn())
  console.log('value:', x)

// value: 1
// value: 2
// value: 3
// iter value: undefined
```

```ts
function* innerGeneratorFn() {
  yield 'foo'
  return 'bar'
}

function* outerGeneratorFn(genObj) {
  console.log('iter value:', yield* innerGeneratorFn())
}

for (const x of outerGeneratorFn())
  console.log('value:', x)

// value: foo
// iter value: bar
```

```ts
function* chunkify(array, n) {
  yield array.slice(0, n)
  array.length > n && (yield* chunkify(array.slice(n), n))
}

async function* getRemoteData() {
  let hasMore = true
  let page

  while (hasMore) {
    const { next_page, results } = await fetch(URL, { params: { page } }).then(
      r => r.json()
    )

    // Return 5 elements with each iteration.
    yield* chunkify(results, 5)

    hasMore = next_page !== null
    page = next_page
  }
}

for await (const chunk of getRemoteData())
  console.log(chunk)
```

## Recursion

在生成器函数内部,
用 `yield*` 去迭代自身产生的生成器对象,
实现递归算法.

Tree traversal:

```ts
// Tree traversal
class BinaryTree {
  constructor(value, left = null, right = null) {
    this.value = value
    this.left = left
    this.right = right
  }

  * [Symbol.iterator]() {
    yield this.value

    if (this.left) {
      // Short for: yield* this.left[Symbol.iterator]()
      yield* this.left
    }

    if (this.right) {
      // Short for: yield* this.right[Symbol.iterator]()
      yield* this.right
    }
  }
}

const tree = new BinaryTree(
  'a',
  new BinaryTree('b', new BinaryTree('c'), new BinaryTree('d')),
  new BinaryTree('e')
)

for (const x of tree)
  console.log(x)

// Output:
// a
// b
// c
// d
// e
```

Graph traversal:

```ts
// Graph traversal
function* graphTraversal(nodes) {
  for (const node of nodes) {
    if (!visitedNodes.has(node)) {
      yield node
      yield* graphTraversal(node.neighbors)
    }
  }
}
```

DOM traversal:

```ts
function* domTraversal(element) {
  yield element
  element = element.firstElementChild

  while (element) {
    yield* domTraversal(element)
    element = element.nextElementSibling
  }
}

for (const element of domTraversal(document.getElementById('subTree')))
  console.log(element.nodeName)
```

结合 `Promise`/`async`/`await` 可以实现异步递归算法:

```ts
import { promises as fs } from 'node:fs'
import { basename, dirname, join } from 'node:path'

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name)

    if (d.isDirectory())
      yield* walk(entry)
    else if (d.isFile())
      yield entry
  }
}

async function run(arg = '.') {
  if ((await fs.lstat(arg)).isFile())
    return runTestFile(arg)

  for await (const file of walk(arg)) {
    if (
      !dirname(file).includes('node_modules')
      && (basename(file) === 'test.js' || file.endsWith('.test.js'))
    ) {
      console.log(file)
      await runTestFile(file)
    }
  }
}
```
