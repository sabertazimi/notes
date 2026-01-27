---
sidebar_position: 14
tags: [Web, CSS, Layout, Column]
---

# Column

## Block

- `inline-block` + `inline-block`.

## Absolute

- `absolute` + `margin-left`:
  absolute element not in normal flow.
- 利用父元素 `relative` 与子元素 `absolute` 进行布局.

```css
.div-1 {
  position: relative;
}

.div-1a {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
}

.div-1b {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
}
```

Position `.left` and `.right` with `absolute`,
add `margin-left` and `margin-right` to `.middle`:

```html
<div class="container">
  <div class="left"></div>
  <div class="middle"></div>
  <div class="right"></div>
</div>

<style>
  .container {
    position: relative;
  }

  .left,
  .right {
    position: absolute;
    width: 200px;
  }

  .middle {
    margin: 0 200px;
  }

  .left {
    left: 0;
  }

  .right {
    right: 0;
  }
</style>
```

## Float

- `float` + `float`.
- `float` + `margin-left`:
  block element ignore float element,
  inline element surround float element.
- `float` + BFC.

```css
.container {
  overflow: hidden; /* BFC creation */
}

.left {
  float: left;
  width: 60px;
  height: 60px;
}

.right {
  margin-left: 70px;
  overflow: hidden; /* BFC creation */
}
```

```html
<div class="left"></div>
<div class="right"></div>
<div class="middle"></div>
```

3 column layout:

```css
.left {
  float: left;
}

.right {
  float: right;
}

.middle {
  margin: 0 var(--right-width) 0 var(--left-width);
}
```

:::tip[Negative Margin]

For `float` element:

- Negative `margin` along the float direction:
  pull the `float` element in that direction.
- Negative `margin` opposite the float direction
  decrease the float area,
  causing adjacent elements to overlap the `float` element.

:::

[圣杯布局](https://github.com/sabertazimi/hust-web/blob/main/ife/2018/basic/layout/index.css):

1. HTML: `.middle` first.
2. Padding:
   `padding-left` and `padding-right` to `.container`,
   `min-width: 2 * (leftWidth + rightWidth)` to `.container`.
3. Float:
   `float: left` to `.left`, `.middle` and `.right`
   (Currently, `.middle` in row 1, `.left` and `.right` in row 2).
4. Negative margin:
   `margin-left: -100%` to `.left`,
   `margin-right: -rightWidth px` to `.right`
   (Pull them up to same row with `.middle`).
5. Move:
   `right: leftWidth px` to `.left`
   (Adjust `.left` position).

```html
<div class="container">
  <div class="middle"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

```css
.container {
  padding: 0 200px 0 300px; /* padding-left = .left width, same to .right */
}

.container .middle {
  float: left;
  width: 100%;
  background-color: violet;
}

.container .left {
  position: relative;
  right: 300px;
  float: left;
  width: 300px;
  margin-left: -100%;
  background-color: darkblue;
}

.container .right {
  position: relative;
  float: left;
  width: 200px;
  margin-right: -200px;
  background-color: red;
}
```

## Flex

```css
.fifty-fifty-flex {
  display: flex;
  flex-wrap: wrap;
}

.fifty-fifty-flex > * {
  flex-grow: 1;
  flex-basis: 250px;
}

.fifty-fifty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

## Grid

Three column layout allows [full-width content](https://www.joshwcomeau.com/css/full-bleed):

```css
.container {
  display: grid;
  grid-template-columns: 1fr min(60ch, calc(100% - 64px)) 1fr;
  column-gap: 32px;
}

.container > * {
  grid-column: 2;
}

.full-bleed {
  grid-column: 1 / -1;
  width: 100%;
}
```

## Multiple

Multiple `column` layout:

- `columns`:
  - `<'column-width'> || <'column-count'>`.
  - 分栏实际数目 = $\min(\frac{\text{width}}{\text{column-width}}, \text{column-count})$.
- `column-width`:
  `auto | <length>`, 期望分栏宽度.
- `column-count`:
  `auto | <integer>`, 期望分栏数目.
- `column-gap`:
  `normal | <length-percentage>`, 分隔间隙.
- `column-rule`:
  `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`, 分隔线.
- `column-rule-width` (`<line-width>`):
  `medium | thin | thick | <length>`.
- `column-rule-style` (`<line-style>`):
  `none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset`.
- `column-rule-color`:
  `currentcolor | <color>`.
- `column-span`: `none | all`, 子元素宽度.
- `column-fill`: `balance | balance-all | auto`, 子元素分布.
- [`break-inside`](https://developer.mozilla.org/docs/Web/CSS/break-inside):
  - `auto`: Allows break.
  - `avoid`: Avoids break.

```css
.three-column {
  column-gap: 1em;
  padding: 1em;
  column-count: 3;
}

.three-column > .last-child {
  column-span: all;
}
```

[![Column Fill](./figures/column-fill.png)](https://developer.mozilla.org/docs/Web/CSS/column-fill)
