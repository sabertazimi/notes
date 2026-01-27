---
sidebar_position: 25
tags: [Web, JavaScript, ECMAScript, Error, Exception]
---

# Error and Exception

## Error

### Type

- Error.
- EvalError.
- RangeError.
- ReferenceError.
- SyntaxError.
- TypeError.
- URIError.
- AggregateError.
- 自定义错误.

```ts
class Error {
  // Instance properties
  message: string
  cause?: any // ES2022
  stack: string // non-standard but widely supported

  constructor(message = '', options?: ErrorOptions) {
    this.name = 'Error'
    this.message = message
    this.cause = options?.cause // ES2022: error chain.
  }
}

interface ErrorOptions {
  cause?: string | Error // ES2022
}

class CustomError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'CustomError'
  }
}
```

### Object

```ts
const err = {
  name: 'XXError',
  message: 'something wrong',
  extra: 'This was rather embarrassing',
  remedy: genericErrorHandler, // 处理错误的函数名.
}

try {
  throwError()
} catch (e) {
  console.log(e.message)
  e.remedy() // genericErrorHandler.
}
```

## Exception

### Call Stack Overflow

调用栈尺寸限制异常, 应立即定位在代码中的递归实例上:

```ts
try {
  recursion()
} catch (ex) {
  console.error('error info')
}
```

### Handler

- `try catch`.
- `Promise.catch`.
- `window.addEventListener('error', handler, true)`.
- `window.addEventListener('unhandledrejection', handler, true)`.
- Web Worker heartbeat monitoring.
- `process.on('uncaughtException', handleError)`.
- `process.on('SIGHUP', handleExit)`.
- `process.on('SIGINT', handleExit)`.
- `process.on('SIGQUIT', handleExit)`.
- `process.on('SIGTERM', handleExit)`.
- AOP (Aspect Oriented Programming): Middleware/Interceptor/Monkey Patch.
- 在可能失败的地方抛出异常, 对失败处做标签, 易于**调试与测试**.
- 修复 bug 后, 可考虑是否在此处抛出异常.
- Avoid using try-catch inside a loop:

```ts
const object = ['foo', 'bar']

try {
  for (let i = 0; i < object.length; i++) {
    // do something that throws an exception
  }
} catch (e) {
  // handle exception
}
```

```ts
// 监听捕获阶段的异常事件
window.addEventListener(
  'error',
  (error) => {
    handleError(error)
    error.preventDefault()
  },
  true
)

// Un-catch `Promise` handler
window.addEventListener(
  'unhandledrejection',
  (error) => {
    handleError(error)
    error.preventDefault()
  },
  true
)
```

```ts
const instance = axios.create({
  baseURL: 'https://api.test.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 发生异常会走到这里
    if (error.response) {
      const response = error.response

      if (response.status >= 400)
        handleError(response)
    } else {
      handleError(null)
    }

    return Promise.reject(error)
  }
)
```

```ts
globalThis.onunhandledrejection = (event) => {
  console.log(event.type)
  // "unhandledrejection"
  console.log(event.reason.message)
  // "Oops!"
  console.log(rejected === event.promise)
  // true
}

globalThis.onrejectionhandled = (event) => {
  console.log(event.type)
  // "rejectionhandled"
  console.log(event.reason.message)
  // "Oops!"
  console.log(rejected === event.promise)
  // true
}

const possiblyUnhandledRejections = new Map()

// when a rejection is unhandled, add it to the map
globalThis.onunhandledrejection = (event) => {
  // prevents the console warning
  event.preventDefault()
  possiblyUnhandledRejections.set(event.promise, event.reason)
}

// when a rejection is handled, remove it from the map
globalThis.onrejectionhandled = (event) => {
  possiblyUnhandledRejections.delete(event.promise)
}

setInterval(() => {
  possiblyUnhandledRejections.forEach((reason, promise) => {
    console.error('Unhandled rejection')
    console.error(promise)
    console.error(reason.message ? reason.message : reason)
    // do something to handle these rejections
  })
  possiblyUnhandledRejections.clear()
}, 60000)

const rejected = Promise.reject(new Error('Oops!'))

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason.message)
  // "Oops!"
  console.log(rejected === promise)
  // true
})

const rejected = Promise.reject(new Error('Oops!'))

setTimeout(() => {
  // "rejectionhandled" triggered here
  rejected.catch(
    reason => console.error(reason.message) // "Oops!"
  )
}, 500)

process.on('rejectionHandled', (promise) => {
  console.log(rejected === promise) // true
})

const possiblyUnhandledRejections = new Map()

// when a rejection is unhandled, add it to the map
process.on('unhandledRejection', (reason, promise) => {
  possiblyUnhandledRejections.set(promise, reason)
})

process.on('rejectionHandled', (promise) => {
  possiblyUnhandledRejections.delete(promise)
})

setInterval(() => {
  possiblyUnhandledRejections.forEach((reason, promise) => {
    console.error('Unhandled rejection')
    console.error(promise)
    console.error(reason.message ? reason.message : reason)
    // do something to handle these rejections
  })
  possiblyUnhandledRejections.clear()
}, 60000)
```
