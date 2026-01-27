---
sidebar_position: 13
tags: [Web, CSS, Layout, Float]
---

# Float

## Element

- 包裹性:
  - 宽度受子元素影响.
  - 宽度受 containing block 影响.
- 块状化并格式化上下文.
- 没有任何 `margin` 合并.
- 破坏文档流: 父级高度塌陷.
- 浮动元素的浮动参考 (`float reference`) 是行框盒子:
  - 浮动元素在[当前行框盒子内定位](https://meowni.ca/posts/float-layout).
  - `float: left` box is positioned at begin of line box.
  - `float: right` box is positioned at end of line box.
  - Non-floaty flow (text) is laid out along edges of floating boxes.
- 浮动元素与行框盒子不可重叠:
  行框盒子会缩短以容纳浮动盒子, 会形成文字环绕效果.

[![Float Layout](./figures/float-layout.png)](https://meowni.ca/posts/float-layout)

浮动元素与 BFC 一起布局时,
BFC 会收缩以容纳浮动盒子,
此时会忽略自己的边界必须接触包含块边界的规则.
可用此特性创建[自适应布局](./column.md):

[![Float Element](./figures/float-element.png)](https://developer.mozilla.org/docs/Web/CSS/CSS_Flow_Layout/Intro_to_formatting_contexts)

## Block Formatting Context

`float` make element specified value of `display`:

- `inline-table` computed to `table`.
- `inline-flex` computed to `flex`.
- `inline-grid` computed to `grid`.
- `inline`/`inline-block`/`table-*` computed to `block`.

## Fixed Parent

Floating won't work inside `fixed` or `absolute` `div` unless specify width:

```css
.parent {
  position: fixed;
  top: 5px;
  left: 0;
  width: 100%;
}
```

## Clear Fix

为父容器 (`.row`) 添加 `.clearfix`:

- [`clear`](https://developer.mozilla.org/docs/Web/CSS/clear)
  只能作用于 block level element:
  `::before`/`::after` 默认为 inline level element,
  `display: table` 将 `::before`/`::after` 转换为 block level element.
- [`clear: both`](https://css-tricks.com/snippets/css/clear-fix)
  本质是让自身不和浮动元素在同一行排列,
  并没有真正意义上地清除浮动元素的 `float` (仍然脱离文档流):
  `::after` 伪元素不与浮动元素在同一行,
  其形成的盒子自然而然地撑起了父容器的高度,
  使得**因浮动元素脱离文档流而塌陷**的父容器恢复正常高度.

```css
.clearfix::before,
.clearfix::after {
  display: table;
  content: '';
}

.clearfix::after {
  clear: both;
}

.clearfix {
  *zoom: 1; /* display: inline-block BFC creation for IE7 */
}
```

![Float Clear Fix](./figures/float-clear-fix.png 'Float Clear Fix')
