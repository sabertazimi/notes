---
sidebar_position: 2
tags: [Web, Security, Sandbox]
---

# Sandbox

[`Sandbox`](https://developer.51cto.com/article/710911.html):

- `eval()`:
  它能访问执行上下文中的局部变量, 也能访问所有全局变量, 是一个非常危险的函数.
- `new Function()`:
  在全局作用域中被创建, 不会创建闭包.
  当运行函数时, 只能访问本地变量和全局变量,
  不能访问 Function 构造器被调用生成的上下文的作用域.
- `with () {}`:
  它首先会在传入的对象中查找对应的变量,
  如果找不到就会往更上层的全局作用域去查找,
  导致全局环境污染.
- 快照沙盒: ES5 沙盒, 备份恢复全局上下文.
- 代理沙盒: ES6 沙盒, 使用 Proxy 代理全局上下文.
- `<iframe>` 沙盒: 使用 `<iframe>` 隔离全局上下文.
- [`ShadowRealm`](https://2ality.com/2022/04/shadow-realms.html) 沙盒.

## Snapshot

`SnapshotSandbox`:

```ts
class SnapshotSandbox {
  constructor() {
    this.proxy = window // window 属性.
    this.windowSnapshot = {} // 快照.
    this.modifyPropsMap = {} // 记录在 window 上的修改.
    this.sandboxRunning = false
  }

  active() {
    this.windowSnapshot = {} // 快照.

    for (const prop in window) {
      if (window.hasOwn(prop))
        this.windowSnapshot[prop] = window[prop]

      Object.keys(this.modifyPropsMap).forEach((p) => {
        window[p] = this.modifyPropsMap[p]
      })
    }

    this.sandboxRunning = true
  }

  inactive() {
    this.modifyPropsMap = {} // 记录在 window 上的修改.

    for (const prop in window) {
      if (window.hasOwn(prop)) {
        if (window[prop] !== this.windowSnapshot[prop]) {
          this.modifyPropsMap[prop] = window[prop]
          window[prop] = this.windowSnapshot[prop]
        }
      }
    }

    this.sandboxRunning = false
  }
}
```

## Proxy

`ProxySandbox`:

```ts
function ProxySandbox(code) {
  code = `with (sandbox) {${code}}`
  const fn = new Function('sandbox', code)

  return function (sandbox) {
    const sandboxProxy = new Proxy(sandbox, {
      has(target, key) {
        return true
      },
      get(target, key) {
        if (key === Symbol.unscopables)
          return undefined
        return target[key]
      },
    })
    return fn(sandboxProxy)
  }
}
```

## Iframe

```ts
class SandboxWindow {
  constructor(context, frameWindow) {
    return new Proxy(frameWindow, {
      get(target, name) {
        if (name in context)
          return context[name]
        else if (typeof target[name] === 'function' && /^[a-z]/.test(name))
          return target[name].bind && target[name].bind(target)
        else return target[name]
      },
      set(target, name, value) {
        if (name in context)
          return (context[name] = value)

        target[name] = value
      },
    })
  }
}

// 需要全局共享的变量
const context = {
  document: new Proxy(window.document, {}),
  location: new Proxy(window.location),
  history: new Proxy(window.history),
}

// 创建 iframe
const userInputUrl = ''
const iframe = document.createElement('iframe', {
  url: userInputUrl,
  src: 'about:blank',
  sandbox:
    'allow-scripts allow-same-origin allow-popups allow-presentation allow-top-navigation',
  style: 'display: none;',
})
document.body.appendChild(iframe)
const sandboxGlobal = new Proxy(iframe.contentWindow, {})

// 创建沙箱
const newSandboxWindow = new SandboxWindow(context, sandboxGlobal)
```
