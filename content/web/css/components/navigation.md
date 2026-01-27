---
sidebar_position: 11
tags: [Web, CSS, Component, Navigation]
---

# Navigation

## Float

[Styling lists](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Styling_lists):

- `list-style-type`: 改变 `ul`/`ol` 前标记类型.
- `list-style-image`: 改变 `ul`/`ol` 前标记类型.
- 设置 `<a href="#">` 样式.

```css
ul {
  /* 垂直菜单设置宽度, 水平菜单不设置宽度 */
  list-style: none;
}

/* 水平菜单 */
li {
  float: left;
}

a {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
}
```

## Inline Block

```css
ul {
  text-align: right;
}

li {
  display: inline-block;
}
```

## Dropdown

```css
.anchor {
  display: none;
}

.content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s,
    opacity 0.3s;
}

.anchor:target ~ .content {
  max-height: 100%;
  opacity: 1;
}
```

## Tab

```css
.tab > a {
  position: relative;
  display: inline-block;
  padding: 0.3em 1em 0;
}

.tab > a::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: #ccc;
  background-image: linear-gradient(hsl(0deg 0% 100% / 60%), hsl(0deg 0% 100% / 0%));
  border: 1px solid rgb(0 0 0 / 40%);
  border-bottom: none;
  border-radius: 0.5em 0.5em 0 0;
  box-shadow: 0 0.15em white inset;
  transform: perspective(0.5em) rotateX(5deg);
  transform-origin: bottom;
}
```
