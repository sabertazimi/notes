---
sidebar_position: 33
tags: [Web, CSS, Component, Interaction, Modal, Dialog, Tooltip]
---

# Interaction

## Modal

### Overlay

```css
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 50%);
}
```

### Box Shadow

```css
.modal {
  box-shadow: 0 0 0 50vmax rgb(0 0 0 / 80%);
}
```

### Clip

图片剪裁的矩形镂空效果:

```css
.crop {
  overflow: hidden;
}

.crop > .crop-area {
  width: 80px;
  height: 80px;
  cursor: move;
  outline: 256px solid rgb(0 0 0 / 50%);
}
```

## Dialog

```html
<div class="container">
  <div class="dialog">
    <div class="content">内容占位</div>
  </div>
</div>
```

```css
.container {
  position: fixed;
  inset: 0;
  z-index: 99;
  text-align: center;
  white-space: nowrap;
}

.container::after {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  content: '';
}

.dialog {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  white-space: normal;
  background-color: #fff;
  border-radius: 6px;
}
```

## Tooltip

利用伪元素 (无法选中) 生成元素, 并设置 `pointer-events: none` (无法交互):

```css
.tooltip {
  position: relative;
  cursor: help;
}

/* 三角形 */
.tooltip::before {
  position: absolute;
  top: 12px;
  left: 20px;
  display: block;
  width: 0;
  height: 0;
  content: '';
  border: solid transparent 5px;
  border-bottom-color: rgb(0 0 0 / 80%);
  opacity: 0;
  transition:
    opacity 250ms,
    top 250ms;
}

/* 提示文字 */
.tooltip::after {
  position: absolute;
  top: 22px;
  left: 0;
  display: inline;
  width: 230px;
  padding: 0.5em 0.8em;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5em;
  color: #fff;
  pointer-events: none; /* This prevents the box from appearing when hovered. */
  content: attr(aria-label);
  background: rgb(0 0 0 / 80%);
  opacity: 0;
  transition:
    opacity 250ms,
    top 250ms;
}

/* Keeps the info boxes on top of other elements */
.tooltip:hover {
  z-index: 2;
}

.tooltip:hover::before,
.tooltip:hover::after {
  opacity: 1;
}

.tooltip:hover::before {
  top: 20px;
}

.tooltip:hover::after {
  top: 30px;
}
```
