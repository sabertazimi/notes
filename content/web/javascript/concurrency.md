---
sidebar_position: 22
tags: [Web, JavaScript, ECMAScript, Concurrency, Asynchronous, Thread, Worker]
---

# Concurrency

## Sleep

```ts
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}
```

```ts
sleep(2000).then(() => {
  // do something after 2000 milliseconds
  console.log('resolved')
})

async function add(n1, n2) {
  await sleep(2222)
  console.log(n1 + n2)
}

add(1, 2)
```

## Race Condition

- Keep latest updates.
- Recover from failures.
- Online and offline sync ([PouchDB](https://github.com/pouchdb/pouchdb)).

```ts
export default {
  data() {
    return {
      text: '',
      results: [],
      nextRequestId: 1,
      displayedRequestId: 0,
    }
  },
  watch: {
    async text(value) {
      const requestId = this.nextRequestId++
      const results = await search(value)

      // guarantee display latest search results (when input keep changing)
      if (requestId < this.displayedRequestId)
        return

      this.displayedRequestId = requestId
      this.results = results
    },
  },
}
```

## Web Worker

- 多线程并行执行.
- 利用 [BroadcastChannel API](https://developer.mozilla.org/docs/Web/API/BroadcastChannel)
  可以创建 Shared Worker, 即共享 Workers 在同一源 (origin) 下面的各种进程都可以访问它,
  包括: `iframe`/浏览器中的不同 Tab 页 (`Browsing Context`).
- Use Case:
  - Graphic App (Ray Tracing).
  - Encryption.
  - Prefetching Data.
  - PWA (Service Worker).
  - Spell Checking.

```html
<button onclick="startComputation()">Start computation</button>

<script>
  const worker = new Worker('worker.js')

  worker.addEventListener(
    'message',
    function (e) {
      console.log(e.data)
    },
    false,
  )

  function startComputation() {
    worker.postMessage({ cmd: 'average', data: [1, 2, 3, 4] })
  }
</script>
```

```ts
// worker.js
globalThis.addEventListener(
  'message',
  (e) => {
    const data = e.data
    switch (data.cmd) {
      case 'average': {
        const result = calculateAverage(data)
        globalThis.postMessage(result)
        break
      }
      default:
        globalThis.postMessage('Unknown command')
    }
  },
  false
)
```

- 先 `on`, 后 `post`.
- `main.js`/`worker.js` 的 `onmessage` 与 `postMessage` 相互触发.
- 有两种方法可以停止 Worker:
  从主页调用 `worker.terminate()` 或在 worker 内部调用 `self.close()`.

```ts
/*
 * JSONParser.js
 */
globalThis.onmessage = function (event) {
  const jsonText = event.data
  const jsonData = JSON.parse(jsonText)
  globalThis.postMessage(jsonData)
}
```

```ts
/*
 * main.js
 */
const worker = new Worker('JSONParser.js')

worker.onmessage = function (event) {
  const jsonData = event.data
  evaluateData(jsonData)
}

worker.postMessage(jsonText)
```

```ts
// main.js
function work() {
  onmessage = ({ data: { jobId, message } }) => {
    console.log(`I am worker, I receive:-----${message}`)
    postMessage({ jobId, result: 'message from worker' })
  }
}

function makeWorker(f) {
  const pendingJobs = {}
  const workerScriptBlobUrl = URL.createObjectURL(
    new Blob([`(${f.toString()})()`])
  )
  const worker = new Worker(workerScriptBlobUrl)

  worker.onmessage = ({ data: { result, jobId } }) => {
    // 调用 resolve, 改变 Promise 状态
    pendingJobs[jobId](result)
    delete pendingJobs[jobId]
  }

  return (...message) =>
    new Promise((resolve) => {
      const jobId = String(Math.random())
      pendingJobs[jobId] = resolve
      worker.postMessage({ jobId, message })
    })
}

const testWorker = makeWorker(work)

testWorker('message from main thread').then((message) => {
  console.log(`I am main thread, I receive:-----${message}`)
})
```

### Runtime

- Web Worker 无法访问一些非常关键的 JavaScript 特性:
  DOM (线程不安全), `window` 对象, `document` 对象, `parent` 对象.
- `self` 上可用的属性是 `window` 对象上属性的严格子集,
  [`WorkerGlobalScope`](https://developer.mozilla.org/docs/Web/API/WorkerGlobalScope):
  - `navigation` 对象: `appName`, `appVersion`, `userAgent`, `platform`.
  - `location` 对象: 所有属性只读.
  - ECMAScript 对象: `Object`/`Array`/`Date`.
  - `console` 对象.
  - `setTimeout`/`setInterval` 方法.
  - `XMLHttpRequest` 方法.
  - `fetch` 方法.
  - `caches` 对象: `ServicerWorker` `CacheStorage` 对象.
  - `self` 对象: 指向全局 worker 对象.
  - `close` 方法: 停止 worker.
  - `importScripts` 方法: 加载外部依赖.
  - [`MessagePort`](https://developer.mozilla.org/docs/Web/API/MessagePort)
    方法: `postMessage`/`onmessage`/`onmessageerror`.
- 工作者线程的脚本文件只能从与父页面相同的源加载,
  从其他源加载工作者线程的脚本文件会导致错误.
  在工作者线程内部可以使用 `importScripts()` 可以加载其他源的脚本.

### Pool

```ts
class TaskWorker extends Worker {
  constructor(notifyAvailable, ...workerArgs) {
    super(...workerArgs)

    // 初始化为不可用状态
    this.available = false
    this.resolve = null
    this.reject = null

    // 线程池会传递回调
    // 以便工作者线程发出它需要新任务的信号
    this.notifyAvailable = notifyAvailable

    // 线程脚本在完全初始化之后
    // 会发送一条"ready"消息
    this.onmessage = () => this.setAvailable()
  }

  // 由线程池调用, 以分派新任务
  dispatch({ resolve, reject, postMessageArgs }) {
    this.available = false
    this.onmessage = ({ data }) => {
      resolve(data)
      this.setAvailable()
    }
    this.onerror = (e) => {
      reject(e)
      this.setAvailable()
    }
    this.postMessage(...postMessageArgs)
  }

  setAvailable() {
    this.available = true
    this.resolve = null
    this.reject = null
    this.notifyAvailable()
  }
}

class WorkerPool {
  constructor(poolSize, ...workerArgs) {
    this.taskQueue = []
    this.workers = []

    // 初始化线程池
    for (let i = 0; i < poolSize; ++i) {
      this.workers.push(
        new TaskWorker(() => this.dispatchIfAvailable(), ...workerArgs)
      )
    }
  }

  // 把任务推入队列
  enqueue(...postMessageArgs) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ resolve, reject, postMessageArgs })
      this.dispatchIfAvailable()
    })
  }

  // 把任务发送给下一个空闲的线程
  dispatchIfAvailable() {
    if (!this.taskQueue.length)
      return

    for (const worker of this.workers) {
      if (worker.available) {
        const a = this.taskQueue.shift()
        worker.dispatch(a)
        break
      }
    }
  }

  // 终止所有工作者线程
  close() {
    for (const worker of this.workers)
      worker.terminate()
  }
}
```

```ts
// worker.js
globalThis.onmessage = ({ data }) => {
  const view = new Float32Array(data.arrayBuffer)
  let sum = 0
  // 求和
  for (let i = data.startIdx; i < data.endIdx; ++i) {
    // 不需要原子操作, 因为只需要读
    sum += view[i]
  }
  // 把结果发送给工作者线程
  globalThis.postMessage(sum)
}
// 发送消息给 TaskWorker
// 通知工作者线程准备好接收任务了
globalThis.postMessage('ready')

// main.js
const totalFloats = 1e8
const numTasks = 20
const floatsPerTask = totalFloats / numTasks
const numWorkers = 4

// 创建线程池
const pool = new WorkerPool(numWorkers, './worker.js')

// 填充浮点值数组
const arrayBuffer = new SharedArrayBuffer(4 * totalFloats)
const view = new Float32Array(arrayBuffer)

for (let i = 0; i < totalFloats; ++i)
  view[i] = Math.random()

const partialSumPromises = []

for (let i = 0; i < totalFloats; i += floatsPerTask) {
  partialSumPromises.push(
    pool.enqueue({
      startIdx: i,
      endIdx: i + floatsPerTask,
      arrayBuffer,
    })
  )
}

// 求和
Promise.all(partialSumPromises)
  .then(partialSums => partialSums.reduce((x, y) => x + y))
  .then(console.log)
// (在这个例子中, 和应该约等于 1E8/2)
// 49997075.47203197
```

### Performance

- Web Worker performance [guide](https://mp.weixin.qq.com/s/IJHI9JB3nMQPi46b6yGVWw).

## Abort Controller

### Fetch

```ts
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Post {
  id: number
  title: string
  body: string
}

function usePostLoading() {
  const { postId } = useParams<{ postId: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchPost = async () => {
      setIsLoading(true)
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        signal: abortController.signal,
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }

          return Promise.reject(new Error('The request failed.'))
        })
        .then((fetchedPost: Post) => {
          setPost(fetchedPost)
        })
        .catch((err) => {
          if (abortController.signal.aborted) {
            console.log('The user aborted the request')
          } else {
            console.error(err.message)
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    fetchPost()

    return () => {
      abortController.abort()
    }
  }, [postId])

  return {
    post,
    isLoading,
  }
}

export default usePostLoading
```

### Promise

```ts
function wait(time: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve()
    }, time)
    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new Error('Aborted.'))
    })
  })
}

const abortController = new AbortController()

setTimeout(() => {
  abortController.abort()
}, 1000)

wait(5000, abortController.signal)
  .then(() => {
    console.log('5 seconds passed')
  })
  .catch(() => {
    console.log('Waiting was interrupted')
  })
```

### Polyfill

Abort controller [helpers polyfill](https://whistlr.info/2022/abortcontroller-is-your-friend):

```ts
if ((!timeout) in AbortSignal) {
  AbortSignal.timeout = function abortTimeout(ms) {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), ms)
    return controller.signal
  }
}

if ((!any) in AbortSignal) {
  AbortSignal.any = function abortAny(signals) {
    const controller = new AbortController()
    signals.forEach((signal) => {
      if (signal.aborted)
        controller.abort()
      else
        signal.addEventListener('abort', () => controller.abort())
    })
    return controller.signal
  }
}
```

## Asynchronous APIs

- `promise` 和 `async/await` 专门用于处理异步操作.
- `generator` 并不是专门为异步设计, 它还有其他功能 (对象迭代/控制输出/Iterator Interface/etc).
- `promise` 编写代码相比 `generator/async/await` 更为复杂化, 且可读性也稍差.
- `generator/async/await` 需要与 `promise` 对象搭配处理异步情况.
- `async/await` 使用上更为简洁, 将异步代码以同步的形式进行编写, 是处理异步编程的最终方案.
