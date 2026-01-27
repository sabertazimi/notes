---
sidebar_position: 17
tags: [Web, CSS, Layout, Alignment, Centering]
---

# Alignment

[![Centering](./figures/centering.png)](https://www.joshwcomeau.com/css/center-a-div)

## Horizontal

### Inline Element

- `text-align: center`.
- `flex`.
- `grid`.

```css
.quote {
  text-align: center;
}
```

### Block Element

- Auto `margin`.
- `flex`.
- `grid`.

```css
.row {
  width: 100%;
  max-width: var(--row-max-width);
  margin: 0 auto;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
}
```

父元素 `float`, 父子元素 `relative`:

```css
.container {
  position: relative;
  left: 50%;
  float: left;
}

.container ul {
  position: relative;
  left: -50%;
}
```

## Vertical

### Inline Box

- `line-height`.
- `vertical-align: middle`:
  - 作用机制: 对齐基线 (`baseline`) 往上 1/2 `x-height` 高度 (即小写字母 `x` 交叉点处).
  - 作用环境: parent element `line-height` === `height`.
  - 作用对象: children `inline`/`inline-block`/`table-cell` element.
- Vertical parent `padding`.
- `flex`.
- `grid`.

Button label (`<a>`) vertical alignment
([行内块居中法](https://css-tricks.com/centering-in-the-unknown):

```css
a.button::before {
  display: inline-block;
  height: 16px;
  vertical-align: middle;
  content: '';
}
```

### Block Box

- `top` + `translateY`.
- `vertical-align: middle` + `display: table-cell`:
  [表格单元居中法](https://css-tricks.com/centering-in-the-unknown).
- Vertical `margin`.
- Vertical `padding`.
- `flex`.
- `grid`.

```css
.viewport-centered-block {
  width: 18em;
  margin: 50vh auto 0;
  transform: translateY(-50%);
}

.form-item-label {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

## Mixed

```css
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d; /* Remove blurry in WebKit browsers */
  backface-visibility: hidden; /* Remove blurry in WebKit browsers */
}

.dialog {
  position: absolute;
  inset: 0;
  width: fit-content;
  height: fit-content;
  margin: auto;
}
```

## Height

- `border` simulation.
- Negative `margin`.
- `absolute` element:
  `.absolute { top: 0; bottom: 0; }` 使所有子元素 (`absolute`) 与父元素 (`relative`) 等高.
- `table` layout:
  `display: table-cell` 默认等高.
- `flex` layout:
  `flex` items 默认拉伸至盒子高度.
- `grid` layout:
  `grid` items 默认等高.

### Border Simulation

```css
/* 导航背景区 border 创建 */
.box {
  background-color: #f0f3f9;
  border-left: 150px solid #333;
}

/* 清除浮动影响 */
.box::after {
  clear: both;
  display: block;
  content: '';
}

/* 布局主结构 */
.box > nav {
  float: left;
  width: 150px;
  margin-left: -150px;
}

.box > section {
  overflow: hidden;
}
```

### Negative Margin

```css
.column-box {
  overflow: hidden; /* hidden overflow background */
}

/* 视觉等高布局 */
.column-left,
.column-right {
  padding-bottom: 9999px;
  margin-bottom: -9999px;
}
```

### Layout

```css
.table {
  display: table;
  overflow: hidden;

  .left {
    display: table-cell;
    width: 200px;
    background: #4caf50;
  }

  .right {
    display: table-cell;
    width: 800px;
    background: #99afe0;
  }
}

.flex {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;

  .left {
    flex: 200px 0 0;
    background: #4caf50;
  }

  .right {
    flex: auto 1 0;
    background: #99afe0;
  }
}

.grid {
  display: grid;
  grid-template-columns: 200px auto;
  align-items: stretch;

  .left {
    background: #4caf50;
  }

  .right {
    background: #99afe0;
  }
}
```

## References

- Centering layout complete [guide](https://css-tricks.com/centering-css-complete-guide).
- Centering [`<div>`](https://www.joshwcomeau.com/css/center-a-div).
