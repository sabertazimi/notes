---
sidebar_position: 1
tags: [Web, Performance, DOM]
---

# DOM

- 局部变量缓存 DOM 元素.
- 局部变量缓存布局信息.

```ts
const btn = document.getElementById('btn')
```

- HTML Collection 转化成数组再操作.

```ts
function toArray(coll) {
  for (let i = 0, a = [], len = coll.length; i < len; i++) {
    a[i] = coll[i]
  }

  return a
}
```

- `children` 优于 `childNodes`.
- `childElementCount` 优于 `childNodes.length`.
- `firstElementChild` 优于 `firstChild`.
- `lastElementChild` 优于 `lastChild`.
- `nextElementSibling` 优于 `nextSibling` 优于 `childNodes[next]`.
- `previousElementSibling` 优于 `previousSibling`.

## Engine Pipeline

- 重排 (`reflow`): 重新构造渲染树, 从 `layout` 阶段开始.
- 重绘 (`repaint`): 重新绘制受影响部分, 从 `paint` 或 `composite` 阶段开始.

**获取**或改变布局的操作会导致渲染树**变化队列**刷新,
执行渲染队列中的**待处理变化**,
重排 DOM 元素.

## Manipulation

- 先 `display="none"`, 修改完成后, `display=""`.
- 使待修改 DOM 元素脱离标准文档流(改变布局／定位方式), 可减少其他元素的重绘次数.
- `document.createDocumentFragment()`.

```ts
const fragment = document.createDocumentFragment()
appendDataToElement(fragment, data)
document.getElementById('myList').appendChild(fragment)
```

- oldNode.cloneNode(true);

```ts
const old = document.getElementById('myList')
const clone = old.cloneNode(true)

appendDataToElement(clone, data)
old.parentNode.replaceChild(clone, old)
```

## Animation Frame

run scripts as early as possible:
`requestAnimationFrame()` runs after the CPU work is done (UI events and JS scripts),
and just before the frame is rendered (layout, paint, composite etc.).

## CSSOM

在 js 中(除定位属性) 外, 不直接操作 element.style.attr/element.cssText:

```ts
element.classList.add('className')
element.className += ' className'
```

:::tip[Pipeline]

Script -> Style -> Layout -> Paint -> Composite.

:::

Make `script` stage become: read then write.
Interleaved read and write will trigger multiple times
of re-layout/repaint/re-composite.

:::danger[Forced Synchronous Layout]

read css -> write css (re-layout/paint/composite)
-> read css -> write css (re-layout/paint/composite)
-> read css -> write css (re-layout/paint/composite).

:::

:::tip[High Performance]

read css -> write css (only re-layout/paint/composite once).

:::
