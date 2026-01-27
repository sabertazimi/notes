---
sidebar_position: 6
tags: [Web, Node.js, Process]
---

# Process

## Environment

- `process.pid`: 当前进程的进程号.
- `process.version`: Node 的版本, 比如 v0.10.18.
- `process.platform`: 当前系统平台, 比如 Linux.
- `process.title`: 默认值为“node”, 可以自定义该值.
- `process.argv`: 当前进程的命令行参数数组.
- `process.env`: 指向当前 shell 的环境变量, 比如 process.env.HOME.
- `process.execPath`: 运行当前进程的可执行文件的绝对路径.
- `process.stdout`: 指向标准输出.
- `process.stdin`: 指向标准输入.
- `process.stderr`: 指向标准错误.

```ts
process.stdin.resume()
process.stdin.pipe(process.stdout)
```

## Events

- Error events:
  - `uncaughtException`.
  - `unhandledRejection`.
- Signal events:
  - `SIGHUP`.
  - `SIGINT`.
  - `SIGQUIT`.
  - `SIGTERM`.
- Exit events:
  - `beforeExit`.
  - `exit`.
- Node HTTP applications graceful shutdown
  [library](https://github.com/godaddy/terminus).

```ts
process.on('uncaughtException', (err) => {
  console.log(`Uncaught exception: ${err.message}.`)
  process.exit(1)
})
process.on('uncaughtException', (reason, promise) => {
  console.log(`Unhandled rejection at ${promise}, reason: ${reason}.`)
  process.exit(1)
})

process.on('SIGHUP', (signal) => {
  console.log(`Process ${process.pid} received a SIGHUP signal.`)
  process.exit(0)
})
process.on('SIGINT', (signal) => {
  console.log(`Process ${process.pid} has been interrupted.`)
  process.exit(0)
})
process.on('SIGQUIT', (signal) => {
  console.log(`Process ${process.pid} received a SIGQUIT signal.`)
  process.exit(0)
})
process.on('SIGTERM', (signal) => {
  console.log(`Process ${process.pid} received a SIGTERM signal.`)
  process.exit(0)
})

process.on('beforeExit', (code) => {
  setTimeout(() => {
    console.log(`Process will exit with code: ${code}.`)
    process.exit(code)
  })
})
process.on('exit', (code) => {
  console.log(`Process exited with code: ${code}.`)
})
```

## Information

- `process.on()`
- `process.uptime()`: 进程运行时长
- `process.getgid`/`setgid`/`getuid`/`setuid`: 获取/设置用户 ID
- `process.cwd()`
- `process.memoryUsage()`

## Event Loop

- `process.nextTick()`: 将回调函数添加到事件循环的末尾

## Child

- `cp.spawn()`: 创建子进程, 拥有独立的 stdin/stdout/stderr 文件描述符
- `cp.exec()`: 创建子进程, 并会在进程结束时调用传入的回调函数
- [Exec Library](https://github.com/sindresorhus/execa)
- Each spawned Node.js child process is independent
  and has its own memory, event-loop, and V8 instance.
- Use `process.on` to communicate between parent and child process.

```ts
const cp = require('node:child_process')

cp.exec(
  'ls -l',
  {
    encoding: 'uft-8',
    timeout: 0,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM',
    setsid: false,
    cwd: null,
    env: null,
  },
  (err, stdout, stderr) => {
    if (!err) {
      console.log(stdout)
      console.log(stderr)
    }
  }
)
```
