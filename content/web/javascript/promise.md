---
sidebar_position: 20
tags: [Web, JavaScript, ECMAScript, Asynchronous, Promise]
---

# Promise

Callback style asynchronous programming:

- Callback hell.
- Complicated error handling.
- Complicated composition.

Promise style asynchronous programming:

- Avoid callback hell:
  - Return `new Promise()`/`Promise.resolve()`.
  - Return `promise.then((value) => {})`.
- Simple error handling:
  - Catch error: `promise.catch((err) => {})`.
  - Cleanup: `promise.finally(() => {})`.
- Simple composition:
  - `Promise.all`: Converts an `Array` of `Promises` to a `Promise` for an `Array`.
  - `Promise.race`.

## Resolve

Resolve only accept **one** value:

```ts
return new Promise(resolve => resolve([a, b]))
```

```ts
const thenable = {
  then(resolve, reject) {
    resolve(42)
  },
}
const promise = Promise.resolve(thenable)
promise.then((value) => {
  console.log(value) // 42
})
```

`Promise.resolve` 是一个幂等方法 (状态机幂等):

```ts
const p = Promise.resolve(7)
setTimeout(console.log, 0, p === Promise.resolve(p))
// true
setTimeout(console.log, 0, p === Promise.resolve(Promise.resolve(p)))
// true

const p = new Promise(() => {})
setTimeout(console.log, 0, p)
// Promise <pending>
setTimeout(console.log, 0, Promise.resolve(p))
// Promise <pending>
setTimeout(console.log, 0, p === Promise.resolve(p))
// true
```

## Reject

```ts
let p1 = Promise.resolve('foo')
let p2 = p1.then()
stetTimeout(console.log, 0, p2) // Promise <resolved>: foo

p1 = Promise.reject('foo')
p2 = p1.then()
// Uncaught (in promise) foo
setTimeout(console.log, 0, p2) // Promise <rejected>: foo

const p3 = p1.then(null, () => undefined)
const p4 = p1.then(null, () => {})
const p5 = p1.then(null, () => Promise.resolve())
setTimeout(console.log, 0, p3) // Promise <resolved>: undefined
setTimeout(console.log, 0, p4) // Promise <resolved>: undefined
setTimeout(console.log, 0, p5) // Promise <resolved>: undefined

const p6 = p1.then(null, () => 'bar')
const p7 = p1.then(null, () => Promise.resolve('bar'))
setTimeout(console.log, 0, p6) // Promise <resolved>: bar
setTimeout(console.log, 0, p7) // Promise <resolved>: bar

const p8 = p1.then(null, () => new Promise(() => {}))
const p9 = p1.then(null, () => Promise.reject())
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p8) // Promise <pending>
setTimeout(console.log, 0, p9) // Promise <rejected>: undefined

const p10 = p1.then(null, () => {
  throw new Error('bar')
})
// Uncaught (in promise) bar
setTimeout(console.log, 0, p10) // Promise <rejected>: bar

const p11 = p1.then(null, () => new Error('bar'))
setTimeout(console.log, 0, p11) // Promise <resolved>: Error: bar
```

## Catch

```ts
const p = Promise.reject()
function onRejected(e) {
  setTimeout(console.log, 0, 'rejected')
}
// 语法糖:
p.then(null, onRejected) // rejected
p.catch(onRejected) // rejected
```

```ts
const p1 = new Promise(() => {})
const p2 = p1.catch()
setTimeout(console.log, 0, p1) // Promise <pending>
setTimeout(console.log, 0, p2) // Promise <pending>
setTimeout(console.log, 0, p1 === p2) // false
```

## Finally

```ts
const p1 = new Promise(() => {})
const p2 = p1.finally()
setTimeout(console.log, 0, p1) // Promise <pending>
setTimeout(console.log, 0, p2) // Promise <pending>
setTimeout(console.log, 0, p1 === p2) // false
```

```ts
const p1 = Promise.resolve('foo')

// 原样后传:
const p2 = p1.finally()
const p3 = p1.finally(() => undefined)
const p4 = p1.finally(() => {})
const p5 = p1.finally(() => Promise.resolve())
const p6 = p1.finally(() => 'bar')
const p7 = p1.finally(() => Promise.resolve('bar'))
const p8 = p1.finally(() => new Error('bar'))
setTimeout(console.log, 0, p2) // Promise <resolved>: foo
setTimeout(console.log, 0, p3) // Promise <resolved>: foo
setTimeout(console.log, 0, p4) // Promise <resolved>: foo
setTimeout(console.log, 0, p5) // Promise <resolved>: foo
setTimeout(console.log, 0, p6) // Promise <resolved>: foo
setTimeout(console.log, 0, p7) // Promise <resolved>: foo
setTimeout(console.log, 0, p8) // Promise <resolved>: foo

// 特殊处理:
const p9 = p1.finally(() => new Promise(() => {}))
setTimeout(console.log, 0, p9) // Promise <pending>
const p10 = p1.finally(() => Promise.reject())
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p10) // Promise <rejected>: undefined
const p11 = p1.finally(() => {
  throw new Error('bar')
})
// Uncaught (in promise) baz
setTimeout(console.log, 0, p11) // Promise <rejected>: bar
```

Any value or resolved promises returned
from `finally()` is ignored:

```ts
const promise = Promise.resolve(42)

promise
  .finally(() => {
    // Settlement handler
    return 43 // Ignored!
  })
  .then((value) => {
    // Fulfillment handler
    console.log(value) // 42
  })

promise
  .finally(() => {
    // Settlement handler
    return Promise.resolve(44) // Ignored!
  })
  .then((value) => {
    // Fulfillment handler
    console.log(value) // 42
  })
```

Returning rejected promise from `finally()`
equivalent to throwing an error:

```ts
const promise = Promise.resolve(42)

promise
  .finally(() => {
    return Promise.reject(43)
  })
  .catch((reason) => {
    console.error(reason) // 43
  })
```

```ts
const promise = Promise.reject(43)

promise
  .finally(() => {
    return Promise.reject(45)
  })
  .catch((reason) => {
    console.log(reason) // 45
  })
```

## Thenable

The main difference between the forms
`promise.then(success, error)` and
`promise.then(success).catch(error)`:
in case if success callback returns a rejected promise,
then only the second form is going to catch that rejection.

正常情况下, 在通过 `throw()` 关键字抛出错误时,
JavaScript 运行时的错误处理机制会停止执行抛出错误之后的任何指令.
但在 `Promise` 中抛出错误时, 因为错误实际上是从消息队列中异步抛出的,
所以并不会阻止运行时继续执行同步指令 (`Node.js` 中仍然会停止执行任何指令).

```ts
throw new Error('foo')
console.log('bar') // 这一行不会执行
// Uncaught Error: foo
```

```ts
Promise.reject(new Error('foo'))
console.log('bar')
// bar
// Uncaught (in promise) Error: foo

const p1 = new Promise((resolve, reject) => reject(new Error('foo'))) // 1.
const p2 = new Promise((resolve, reject) => {
  throw new Error('foo') // 2.
})
const p3 = Promise.resolve().then(() => {
  throw new Error('foo') // 4.
})
const p4 = Promise.reject(new Error('foo')) // 3.
// Uncaught (in promise) Error: foo
//   at Promise (test.html:1)
//   at new Promise (<anonymous>)
//   at test.html:1
// Uncaught (in promise) Error: foo
//   at Promise (test.html:2)
//   at new Promise (<anonymous>)
//   at test.html:2
// Uncaught (in promise) Error: foo
//   at test.html:4
// Uncaught (in promise) Error: foo
//   at Promise.resolve.then (test.html:3)
```

## Chain

- Promises on the same chain execute orderly.
- Promises on two separate chains execute in random order.

```ts
const users = ['User1', 'User2', 'User3', 'User4']

const response = []

function getUser(user) {
  return () => {
    return axios.get(`/users/userId=${user}`).then(res => response.push(res))
  }
}

function getUsers(users) {
  const [getFirstUser, getSecondUser, getThirdUser, getFourthUser]
    = users.map(getUser)

  getFirstUser()
    .then(getSecondUser)
    .then(getThirdUser)
    .then(getFourthUser)
    .catch(console.log)
}
```

```ts
const users = ['User1', 'User2', 'User3', 'User4']

let response = []

function getUsers(users) {
  const promises = []
  promises[0] = axios.get(`/users/userId=${users[0]}`)
  promises[1] = axios.get(`/users/userId=${users[1]}`)
  promises[2] = axios.get(`/users/userId=${users[2]}`)
  promises[3] = axios.get(`/users/userId=${users[3]}`)

  Promise.all(promises)
    .then(userDataArr => (response = userDataArr))
    .catch(err => console.log(err))
}
```

## Combinators

- `Promise.all(iterable)` fail-fast:
  If at least one promise in the promises array rejects,
  then the promise returned rejects too.
  Short-circuits when an input value is rejected.
- `Promise.any(iterable)`:
  Resolves if any of the given promises are resolved.
  Short-circuits when an input value is fulfilled.
- `Promise.race(iterable)`:
  Short-circuits when an input value is settled
  (fulfilled or rejected).
- `Promise.allSettled(iterable)`:
  Returns when all given promises are settled
  (fulfilled or rejected).

```ts
Promise.all(urls.map(fetch))
  .then(responses => Promise.all(responses.map(res => res.text())))
  .then((texts) => {
    //
  })

async function loadData() {
  try {
    const urls = ['...', '...']

    const results = await Promise.all(urls.map(fetch))
    const dataPromises = await results.map(result => result.json())
    const finalData = Promise.all(dataPromises)

    return finalData
  } catch (err) {
    console.log(err)
  }
}

const data = loadData().then(data => console.log(data))
```

## Polyfill

```ts
class Promise {
  // `executor` takes 2 parameters, `resolve()` and `reject()`. The executor
  // function is responsible for calling `resolve()` or `reject()` to say that
  // the async operation succeeded (resolved) or failed (rejected).
  constructor(executor) {
    if (typeof executor !== 'function')
      throw new TypeError('Executor must be a function')

    // Internal state. `$state` is the state of the promise, and `$chained` is
    // an array of the functions we need to call once this promise is settled.
    this.$state = 'PENDING'
    this.$chained = []

    // Implement `resolve()` and `reject()` for the executor function to use
    const resolve = (res) => {
      // A promise is considered "settled" when it is no longer
      // pending, that is, when either `resolve()` or `reject()`
      // was called once. Calling `resolve()` or `reject()` twice
      // or calling `reject()` after `resolve()` was already called
      // are no-ops.
      if (this.$state !== 'PENDING')
        return

      // If `res` is a "thenable", lock in this promise to match the
      // resolved or rejected state of the thenable.
      const then = res !== null ? res.then : null
      if (typeof then === 'function') {
        // In this case, the promise is "resolved", but still in the 'PENDING'
        // state. This is what the ES6 spec means when it says "A resolved promise
        // may be pending, fulfilled or rejected" in
        // http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
        return then(resolve, reject)
      }

      this.$state = 'FULFILLED'
      this.$internalValue = res

      // If somebody called `.then()` while this promise was pending, need
      // to call their `onFulfilled()` function
      for (const { onFulfilled } of this.$chained)
        onFulfilled(res)

      return res
    }

    const reject = (err) => {
      if (this.$state !== 'PENDING')
        return

      this.$state = 'REJECTED'
      this.$internalValue = err

      for (const { onRejected } of this.$chained)
        onRejected(err)
    }

    // Call the executor function with `resolve()` and `reject()` as in the spec.
    try {
      // If the executor function throws a sync exception, we consider that
      // a rejection. Keep in mind that, since `resolve()` or `reject()` can
      // only be called once, a function that synchronously calls `resolve()`
      // and then throws will lead to a fulfilled promise and a swallowed error
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  // `onFulfilled` is called if the promise is fulfilled, and `onRejected`
  // if the promise is rejected. For now, you can think of 'fulfilled' and
  // 'resolved' as the same thing.
  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      // Ensure that errors in `onFulfilled()` and `onRejected()` reject the
      // returned promise, otherwise they'll crash the process. Also, ensure
      // that the promise
      const _onFulfilled = (res) => {
        try {
          // If `onFulfilled()` returns a promise, trust `resolve()` to handle
          // it correctly.
          // store new value to new Promise
          resolve(onFulfilled(res))
        } catch (err) {
          reject(err)
        }
      }

      const _onRejected = (err) => {
        try {
          // store new value to new Promise
          reject(onRejected(err))
        } catch (_err) {
          reject(_err)
        }
      }

      switch (this.$state) {
        case 'FULFILLED':
          _onFulfilled(this.$internalValue)
          break
        case 'REJECTED':
          _onRejected(this.$internalValue)
          break
        default:
          this.$chained.push({
            onFulfilled: _onFulfilled,
            onRejected: _onRejected,
          })
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(
      (value) => {
        return Promise.resolve(callBack()).then(() => value)
      },
      (reason) => {
        return Promise.resolve(callBack()).then(() => {
          throw reason
        })
      }
    )
  }

  static all(iterable) {
    return new Promise((resolve, reject) => {
      let index = 0
      let pendingCount = 0
      const result = Array.from({ length: iterable.length })

      for (const promise of iterable) {
        const currentIndex = index
        promise.then(

          (value) => {
            result[currentIndex] = value
            pendingCount++

            if (pendingCount === iterable.length)
              resolve(result)
          },
          (err) => {
            reject(err)
          }
        )
        index++
      }

      if (index === 0)
        resolve([])
    })
  }

  static any(iterable) {
    return new Promise((resolve, reject) => {
      let index = 0
      let pendingCount = 0
      const error = new Error('All promise were rejected')
      error.errors = Array.from({ length: iterable.length })

      for (const promise of iterable) {
        const currentIndex = index
        promise.then(
          (value) => {
            resolve(value)
          },

          (err) => {
            error.errors[currentIndex] = err
            pendingCount++

            if (pendingCount === iterable.length)
              reject(error)
          }
        )
        index++
      }

      if (index === 0)
        resolve([])
    })
  }

  static race(iterable) {
    return new Promise((resolve, reject) => {
      for (const promise of iterable) {
        promise.then(
          (value) => {
            resolve(value)
          },
          (err) => {
            reject(err)
          }
        )
      }
    })
  }

  static allSettled(iterable) {
    return new Promise((resolve, reject) => {
      let index = 0
      let pendingCount = 0
      let result

      function addElementToResult(i, elem) {
        result[i] = elem
        pendingCount++

        if (pendingCount === result.length)
          resolve(result)
      }

      for (const promise of iterable) {
        const currentIndex = index
        promise.then(
          value =>
            addElementToResult(currentIndex, {
              status: 'fulfilled',
              value,
            }),
          reason =>
            addElementToResult(currentIndex, {
              status: 'rejected',
              reason,
            })
        )
        index++
      }

      if (index === 0) {
        resolve([])
        return
      }

      result = Array.from({ length: index })
    })
  }
}
```

## Memorization

```ts
const memo = {}
const progressQueues = {}

function memoProcessData(key) {
  return new Promise((resolve, reject) => {
    if (Object.prototype.hasOwnProperty.call(memo, key)) {
      resolve(memo[key])
      return
    }

    if (!Object.prototype.hasOwnProperty.call(progressQueues, key)) {
      // Called for a new key
      // Create an entry for it in progressQueues
      progressQueues[key] = [[resolve, reject]]
    } else {
      // Called for a key that's still being processed
      // Enqueue it's handlers and exit.
      progressQueues[key].push([resolve, reject])
      return
    }

    processData(key)
      .then((data) => {
        memo[key] = data
        for (const [resolver] of progressQueues[key]) resolver(data)
      })
      .catch((error) => {
        for (const [, rejector] of progressQueues[key]) rejector(error)
      })
      .finally(() => {
        delete progressQueues[key]
      })
  })
}
```
