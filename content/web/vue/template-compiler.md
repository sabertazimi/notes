---
tags: [Web, Vue, Internals, Template, Compiler]
sidebar_position: 27
---

# Template Compiler

## Workflow

```ts
function compile(template: string, options: CompilerOptions): CompiledResult {
  const ast = parse(template.trim(), options)
  optimize(ast, options)
  const code = generate(ast, options)

  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
}
```

template 属性存在, render 方法不存在时:

- runtime with compiler 版本会在 JavaScript 运行时进行模板编译, 生成 render 函数。
- runtime only 版本会打印警告信息, 提示用户使用 runtime with compiler 版本或者使用使用 `vue-loader` 进行静态编译。

## Performance

- Shorten template helper function with prefix `_v`/`_s` etc.
- Hoist static template blocks,
  eliminate unnecessary virtual DOM diff effort,
  only track dynamic VNode.
- Cache event handlers (React `useCallback`):
  默认情况下绑定事件行为会被视为动态绑定,
  所以每次都会去追踪它的变化,
  开启事件侦听器缓存后,
  直接复用事件处理器.
- Tree flattening:
  每个区块都会追踪其所有带更新类型标记的后代节点,
  在激活时只有区块节点和其动态子节点需要被遍历,
  只需要遍历打平的树而非整棵树 (高效略过模板中任何的静态部分),
  大大减少了在虚拟 DOM 协调时需要遍历的节点数量.

```ts
const enum PatchFlags {
  TEXT = 1, // 静态的文本节点
  CLASS = 1 << 1, // 2 静态的 class
  STYLE = 1 << 2, // 4 静态的 style
  PROPS = 1 << 3, // 8 静态属性，不包括类名和样式
  FULL_PROPS = 1 << 4, // 16 静态 key，当 key 变化时需要完整的 diff 算法做比较
  HYDRATE_EVENTS = 1 << 5, // 32 表示带有事件监听器的节点
  STABLE_FRAGMENT = 1 << 6, // 64 一个不会改变子节点顺序的 Fragment
  KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9, // 512
  DYNAMIC_SLOTS = 1 << 10, // 1024 动态 slot
  HOISTED = -1, // 特殊标志是负整数表示永远不会用作 diff
  BAIL = -2, // 一个特殊的标志，指代差异算法
}

function isStatic(node: ASTNode): boolean {
  if (node.type === 2) {
    // expression
    return false
  }

  if (node.type === 3) {
    // text
    return true
  }

  return !!(
    node.pre
    || (!node.hasBindings // no dynamic bindings
      && !node.if
      && !node.for // not v-if or v-for or v-else
      && !isBuiltInTag(node.tag) // not a built-in
      && isPlatformReservedTag(node.tag) // not a component
      && !isDirectChildOfTemplateFor(node)
      && Object.keys(node).every(isStaticKey))
  )
}

function patchElement(n1, n2) {
  if (n2.dynamicChildren) {
    // Skip all static blocks.
    patchBlockChildren(n1, n2)
  } else {
    patchChildren(n1, n2, el)
  }
}
```
