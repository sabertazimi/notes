---
sidebar_position: 22
tags: [Web, React, Toolchain]
---

# Toolchain

## Micro Frontends

通过 `single-spa` 包装的主应用是一个基座,
它提供相应的协议,
子应用按照协议进行包装就可以接入主应用.
主应用就像插座,
子应用就像不同的电器,
只要遵循某种协议就可以轻松实现可插拔操作.

:::tip[Single SPA Lifecycle]

- Register.
- Load.
- Bootstrap.
- Mount.
- Unmount.
- Unload.

:::

`single-spa` 子项目的的挂载、更新、卸载等操作,
并不是 `single-spa` 原生提供的,
用户可以根据自己的需要来自行实现子应用的挂载, 卸载及更新等逻辑.
`single-spa` 通过 `reroute` 和路由控制来调用子应用.
在 `single-spa` 的开发过程中,
需要自己手动去写调用子应用的方法.

### EntryPoint

- HTML Entry (`import-html-entry` from `qiankun`).
- JavaScript Entry.

### Styles

- Shadow DOM container.
- CSS module.
- CSS scoped namespace.
- CSS selector renaming.
- CSS in JS.

### Scripts

- Snapshot sandbox: 类似中断恢复机制, 备份快照 -> 子应用挂载/运行/卸载 -> 恢复快照.
- Proxy sandbox: `window` proxy (`fakeWindow` for every sub-app).
- Runtime sandbox.

### Communication

- Pub-Sub Pattern.
- Callback registration.
- Global store.

## Low-Code

### Components

利用静态解析 (`react-docgen-typescript`) 与动态解析 (`parse-prop-types`)
从原始组件生成属性文件, 匹配低代码物料协议
[`assets.json`](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/assets.ts),
从而将原始组件转化为低代码组件.

![Low-Code Components](./figures/low-code-components.png 'Low-Code Components')

### Editor

低代码编辑器目标:

- Layout :低代码组件布局设置.
- Configure: 低代码组件属性设置.
- Interactive: 低代码组件逻辑设置.

低代码编辑器功能:

- 容器节点功能.
- 节点设置功能.
- 节点增删功能.
- 节点移动功能:
  通过 `__reactInternalInstance$` 找到组件对应的 `fiberNode`,
  通过 `fiberNode` 上的 `stateNode` 获取 DOM 实例,
  调用 `getBoundingClientRect` 得到具体位置信息,
  实现拖拽定位功能.
- 节点在画布上的辅助功能: e.g. `hover`/`select`/`resize`/`drag`/`drop`.
- 设计态和渲染态的坐标系转换: e.g. 滚动监听.
- 快捷键功能.
- 历史功能: 撤销和重做.
- 结构化的插件扩展功能.
- 原地编辑功能.

![Low-Code Editor](./figures/low-code-editor.png 'Low-Code Editor')

经过 `Editor` 设置后, 生成符合业务需求的
[`schema.json`](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/schema.ts):

- 项目模型 (`Project`).
- 文档模型 (`DocumentModel`).
- 节点模型 (`Node`):
  - `ReactElement` 变种.
  - 管理 `Props`/`Node` tree.
  - 操作 `schema.json` 的最低粒度.
- 属性模型 (`Prop`):
  - `ReactProp` 变种.
  - 每一个 `Prop` 对应 `schema.json` `props` 的一个字段.

一个 `Project` 包含若干个 `DocumentModel` 实例,
每个 `DocumentModel` 包含一组 `Node` 构成一颗树,
每个 `Node` 通过 `Props` 实例管理所有 `Prop`:

![Low-Code Schema](./figures/low-code-schema.png 'Low-Code Schema')

### Renderer

`低代码渲染`: 将 `schema.json` 通过 `Renderer` 渲染生成业务页面.

### Generator

`低代码出码`: 将 `schema.json` 通过 `Generator` 转化生成业务代码.

## React Compiler

React compiler use `useMemoCache` hook to
memoize variables, handlers and elements automatically.

```tsx
export default function Hello() {
  const name = 'Jack'

  return (
    <div>
      <p>
        Hi:
        {name}
      </p>
      <strong>Static Content</strong>
    </div>
  )
}
```

Compiles to:

```tsx
import { unstable_useMemoCache as useMemoCache } from 'react'

export default function Hello() {
  const $ = useMemoCache(1)
  let t0

  if ($[0] === Symbol.for('react.memo_cache_sentinel')) {
    t0 = __jsx(
      'div',
      null,
      __jsx('p', null, 'Hi:', 'Jack'),
      __jsx('strong', null, 'Static Content')
    )
    $[0] = t0
  } else {
    t0 = $[0]
  }

  return t0
}
```

## References

- Low-Code engine [technical white paper](https://developer.aliyun.com/ebook/7507).
