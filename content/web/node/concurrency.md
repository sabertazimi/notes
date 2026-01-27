---
sidebar_position: 7
tags: [Web, Node.js, Concurrency, Asynchronous, Thread, Worker]
---

# Concurrency

## Cluster

对回调进行计数是处理 Node 中异步的基础 - 自定义 Semaphore 变量: 每完成一个异步处理, Semaphore++

```ts
const cluster = require('node:cluster')
const http = require('node:http')
const numCPUs = require('node:os').cpus().length

const rssWarn = 50 * 1024 * 1024
const heapWarn = 50 * 1024 * 1024
const workers = {}

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++)
    createWorker()

  setInterval(() => {
    const time = new Date().getTime()
    for (pid in workers) {
      if (
        Object.prototype.hasOwnProperty.call(workers, pid)
        && workers[pid].lastCb + 5000 < time
      ) {
        console.log(`Long running worker ${pid} killed`)
        workers[pid].worker.kill()
        delete workers[pid]
        createWorker()
      }
    }
  }, 1000)
} else {
  // Server
  http
    .Server((req, res) => {
      // mess up 1 in 200 request
      if (Math.floor(Math.random() * 200) === 4) {
        console.log(`Stopped ${process.pid} from ever finishing`)
        while (true)
          continue
      }
      res.writeHead(200)
      res.end(`hello world from ${process.pid}\n`)
    })
    .listen(8000)
  // Report stats once a second
  setInterval(() => {
    process.send({
      cmd: 'reportMem',
      memory: process.memoryUsage(),
      process: process.pid,
    })
  }, 1000)
}

function createWorker() {
  const worker = cluster.fork()
  console.log(`Created worker: ${worker.pid}`)

  // allow boot time
  workers[worker.pid] = { worker, lastCb: new Date().getTime() - 1000 }
  worker.on('message', (m) => {
    if (m.cmd === 'reportMem') {
      workers[m.process].lastCb = new Date().getTime()
      if (m.memory.rss > rssWarn)
        console.log(`Worker ${m.process} using too much memory.`)
    }
  })
}
```

## Worker Threads

Worker threads use threads to execute the work
within the same process of the main application:

- Worker threads are lightweight compared to child processes.
- Worker threads can share memory (can transfer `ArrayBuffer`).
- Each Node.js worker thread has its own independent Node.js runtime
  (including its own V8 instance, event loop, etc.)
  with its own isolated context,
  therefore **no thread synchronization** is usually needed.

```ts
// fibonacci-worker.js
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('node:worker_threads')

function fibonacci(num) {
  if (num <= 1)
    return num
  return fibonacci(num - 1) + fibonacci(num - 2)
}

if (isMainThread) {
  module.exports = n =>
    new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: n,
      })
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`))
      })
    })
} else {
  const result = fibonacci(workerData)
  parentPort.postMessage(result)
  process.exit(0)
}
```

```ts
const http = require('node:http')
const fibonacciWorker = require('./fibonacci-worker')

const port = 3000

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    console.log('Incoming request to:', url.pathname)

    if (url.pathname === '/fibonacci') {
      const n = Number(url.searchParams.get('n'))
      console.log('Calculating fibonacci for', n)

      const result = await fibonacciWorker(n)
      res.writeHead(200)
      return res.end(`Result: ${result}\n`)
    } else {
      res.writeHead(200)
      return res.end('Hello World!')
    }
  })
  .listen(port, () => console.log(`Listening on port ${port}...`))
```

Worker pool is needed:

- Creating a new worker/process is expensive.
  For best performance, they should be reused.
- No control over the number of workers/processes created without worker pool.
  This leaves vulnerable to DoS attacks.
- [Worker pool library](https://github.com/josdejong/workerpool)

```ts
// task-worker.js
const { parentPort } = require('node:worker_threads')

parentPort.on('message', (task) => {
  // Simulate CPU work
  const result = task.number * 2
  parentPort.postMessage({ id: task.id, result })
})
```

```ts
const os = require('node:os')
// worker-pool.js
const { Worker } = require('node:worker_threads')

class WorkerPool {
  constructor(workerPath, poolSize = os.cpus().length) {
    this.workerPath = workerPath
    this.poolSize = poolSize
    this.workers = []
    this.taskQueue = []
    this.activeTasks = new Map()

    for (let i = 0; i < this.poolSize; i++) {
      this.addWorker()
    }
  }

  addWorker() {
    const worker = new Worker(this.workerPath)
    worker.on('message', (msg) => {
      const { resolve } = this.activeTasks.get(msg.id)
      this.activeTasks.delete(msg.id)
      resolve(msg.result)
      this.checkQueue(worker)
    })
    worker.on('error', console.error)
    worker.on('exit', () => {
      this.workers = this.workers.filter(w => w !== worker)
      this.addWorker() // Replace worker if it exits unexpectedly
    })
    this.workers.push(worker)
  }

  runTask(data) {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random() // Unique task ID
      const task = { id, number: data }
      this.taskQueue.push({ task, resolve })
      this.checkQueue()
    })
  }

  checkQueue(workerOverride) {
    if (this.taskQueue.length === 0)
      return

    const idleWorker = workerOverride || this.workers.find(
      worker => ![...this.activeTasks.values()].some(w => w.worker === worker)
    )

    if (!idleWorker)
      return

    const { task, resolve } = this.taskQueue.shift()
    this.activeTasks.set(task.id, { worker: idleWorker, resolve })
    idleWorker.postMessage(task)
  }

  destroy() {
    this.workers.forEach(worker => worker.terminate())
  }
}

(async () => {
  const pool = new WorkerPool('./task-worker.js')

  const tasks = [10, 20, 30, 40, 50]
  const results = await Promise.all(tasks.map(num => pool.runTask(num)))

  console.log('Results:', results) // [20, 40, 60, 80, 100]
  pool.destroy()
})()
```
