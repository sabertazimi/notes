---
sidebar_position: 21
tags: [Web, JavaScript, ECMAScript, Asynchronous, Await]
---

# Async and Await

## Features

- `async` 异步函数如果不包含 `await` 关键字, 其执行 (除返回值外) 基本上跟普通函数没有什么区别.
- JavaScript 运行时在碰到 `await` 关键字时, 会记录在哪里暂停执行.
- 等到 `await` 右边的值可用了, JavaScript 运行时会向消息队列中推送一个任务, 这个任务会恢复异步函数的执行.
- 即使 `await` 后面跟着一个立即可用的值, 函数的其余部分也会被异步求值.

```ts
async function foo() {
  console.log(2)
}

console.log(1)
foo()
console.log(3)
// 1
// 2
// 3

async function bar() {
  console.log(2)
  await null
  console.log(4)
}

console.log(1)
bar()
console.log(3)
// 1
// 2
// 3
// 4
```

- Await `thenable` object (implements `then` interface):

```ts
async function bar() {
  const thenable = {
    then(callback) {
      callback('bar')
    },
  }
  return thenable
}

bar().then(console.log)
// bar

async function baz() {
  const thenable = {
    then(callback) {
      callback('baz')
    },
  }
  console.log(await thenable)
}

baz()
// baz
```

- `async`/`await` implement generator based asynchronous control flow:

```ts
const fetchJson = co.wrap(function* (url) {
  try {
    const response = yield fetch(url)
    const text = yield response.text()
    return JSON.parse(text)
  } catch (error) {
    console.log(`ERROR: ${error.stack}`)
  }
})

async function fetchJson(url) {
  try {
    const response = await fetch(url)
    const text = await response.text()
    return JSON.parse(text)
  } catch (error) {
    console.log(`ERROR: ${error.stack}`)
  }
}
```

- `async` 函数自动将返回值包装为 `Promise`:

```ts
// BAD.
async function downloadContent(urls) {
  const promiseArray = urls.map(fetch)
  return await Promise.all(promiseArray)
}

// GOOD.
async function downloadContent(urls) {
  const promiseArray = urls.map(fetch)
  return Promise.all(promiseArray)
}
```

## Arrays

- If you want to execute await calls in series,
  use a for-loop (or any loop without a callback).
- Don't ever use await with `forEach` (`forEach` is not promise-aware),
  use a for-loop (or any loop without a callback) instead.
- Don't await inside filter and reduce,
  always await an array of promises with map, then filter or reduce accordingly.
- Avoid wrong parallel logic (too sequential):

```ts
// Wrong:
const books = await bookModel.fetchAll()
const author = await authorModel.fetch(authorId)

// Correct:
const bookPromise = bookModel.fetchAll()
const authorPromise = authorModel.fetch(authorId)
const book = await bookPromise
const author = await authorPromise

async function getAuthors(authorIds) {
  // WRONG, this will cause sequential calls
  // const authors = authorIds.map(id => await authorModel.fetch(id));
  // CORRECT:
  const promises = authorIds.map(id => authorModel.fetch(id))
  const authors = await Promise.all(promises)
}
```

```ts
async function randomDelay(id) {
  const delay = Math.random() * 1000
  return new Promise(resolve =>
    setTimeout(() => {
      console.log(`${id} finished`)
      resolve(id)
    }, delay)
  )
}

async function sequential() {
  const t0 = Date.now()

  for (let i = 0; i < 5; ++i)
    await randomDelay(i)

  console.log(`${Date.now() - t0}ms elapsed`)
}

sequential()
// 0 finished
// 1 finished
// 2 finished
// 3 finished
// 4 finished
// 2877ms elapsed

async function parallel() {
  const t0 = Date.now()
  const promises = Array.from({ length: 5 })
    .fill(null)
    .map((_, i) => randomDelay(i))

  for (const p of promises)
    console.log(`awaited ${await p}`)

  console.log(`${Date.now() - t0}ms elapsed`)
}

parallel()
// 4 finished
// 2 finished
// 1 finished
// 0 finished
// 3 finished
// awaited 0
// awaited 1
// awaited 2
// awaited 3
// awaited 4
// 645ms elapsed
```
