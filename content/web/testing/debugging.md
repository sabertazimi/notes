---
sidebar_position: 10
tags: [Web, Testing, Debugging]
---

# Debugging

## Monkey Patch

### Window State

Inject trace function (log, monitor, report service)
to window `pushState` and `replaceState`.

```ts
function _wr(type) {
  const orig = window.history[type]

  return function (...args) {
    const rv = orig.apply(this, args)
    const e = new Event(type.toLowerCase())
    e.arguments = args
    window.dispatchEvent(e)
    return rv
  }
}

window.history.pushState = _wr('pushState')
window.history.replaceState = _wr('replaceState')

window.addEventListener('pushstate', (event) => {
  console.trace('pushState')
})

window.addEventListener('replacestate', (event) => {
  console.trace('replaceState')
})
```

### Event Propagation

```ts
const originalStopPropagation = MouseEvent.prototype.stopPropagation

MouseEvent.prototype.stopPropagation = function (...args) {
  console.trace('stopPropagation')
  originalStopPropagation.call(this, ...args)
}
```

### Window Scroll

```ts
let originalScrollTop = element.scrollTop

Object.defineProperty(element, 'scrollTop', {
  get() {
    return originalScrollTop
  },
  set(newVal) {
    console.trace('scrollTop')
    originalScrollTop = newVal
  },
})
```

## Logging

### Type

- Application client log.
- Web server log.
- Database server log.
- Access log.
- Debug log.
- Error log.

### Information

- 日志时间: 包含时区信息和毫秒.
- 日志级别.
- 会话标识.
- 功能标识.
- 精炼内容: 场景信息, 状态信息 (开始/中断/结束), 重要参数.
- 其他信息: 版本号, 线程号.

### Setup

```ts
const { createLogger, format, transports } = require('winston')

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}

const logger = createLogger({
  levels: logLevels,
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
})

logger.info('System Started')
logger.fatal('Fatal error occurred')
```

### Clock

- `performance.now()` is more precise (100 us).
- `performance.now()` is strictly monotonic (unaffected by changes of machine time).

```ts
let lastVisibilityChange = 0

window.addEventListener('visibilitychange', () => {
  lastVisibilityChange = performance.now()
})

// don’t log any metrics started before the last visibility change
// don't log any metrics if the page is hidden
// discard perf data from when the machine was not running app at full speed
function metrics() {
  if (metric.start < lastVisibilityChange || document.hidden)
    return

  process()
}
```

```ts
requestAnimationFrame(() => {
  requestAnimationFrame((timestamp) => {
    metric.finish(timestamp)
  })
})
```

## Tracing

`debugger`:

```ts
// debugger;
```

```ts
copy(obj) // to clipboard
```

```ts
window.onerror = function (errorMessage, scriptURI, lineNo, columnNo, error) {
  console.log(`errorMessage: ${errorMessage}`) // 异常信息
  console.log(`scriptURI: ${scriptURI}`) // 异常文件路径
  console.log(`lineNo: ${lineNo}`) // 异常行号
  console.log(`columnNo: ${columnNo}`) // 异常列号
  console.log(`error: ${error}`) // 异常堆栈信息
  // ...
  // 异常上报
}

window.addEventListener('error', () => {
  console.log(error)
  // ...
  // 异常上报
})
```

### Trace Property

```ts
function traceProperty(object, property) {
  let value = object[property]
  Object.defineProperty(object, property, {
    get() {
      console.trace(`${property} requested`)
      return value
    },
    set(newValue) {
      console.trace(`setting ${property} to `, newValue)
      value = newValue
    },
  })
}
```

## Node.js

- `node --inspect`.
- [ndb](https://github.com/GoogleChromeLabs/ndb).

```bash
node --inspect
ndb index.js
```

## Bug List

### Basic Bug

- 必须进行输入验证 - 永远不要相信用户输入.
- 永不使用未经验证的数值的长度或大小.
- 必须返回正确的错误状态.
- 注意(隐式)类型转换.

### C Bug

- 栈缓冲区溢出.
- 空指针解引用.
- (隐式)类型转换.
- GOT 覆写 (Global Offset Table).

### Occasional Bug

- 多进程完全异步编程的复杂性.
- 逐渐地内存泄漏.
