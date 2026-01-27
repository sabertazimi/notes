---
sidebar_position: 20
tags: [Web, CSS, Border, Outline]
---

# Border

## Radius

[`border-radius`](https://developer.mozilla.org/docs/Web/CSS/border-radius):

- 不支持负值.
- 圆角以外的区域不可点击, 无法响应 `click` 事件.
- 没有继承性:
  因此父元素设置 `border-radius`, 子元素依然是直角效果.
  可以给父元素设置 `overflow:hidden` 让子元素视觉上表现为圆角.
- 支持 `border-collapse` 设置为 `separate` 的
  `table`/`inline-table`/`table-cell` 元素.
- 每角都支持单独设置 `水平半径` `/` `垂直半径`:
  `<length-percentage>{1, 4} [/ <length-percentage>{1,4}]?`.

```css
.box {
  /* 左上 右上+左下 右下 / 左上 右上+左下 右下 */
  border-radius: 10px 5px 2em / 20px 25px 30%;

  /* 左上+右下 右上+左下 / 左上 右上 右下 左下 */
  border-radius: 10px 5% / 20px 25em 30px 35em;

  /* 水平半径 垂直半径 */
  border-top-left-radius: 30px 50%;

  /* 水平半径 垂直半径 */
  border-bottom-left-radius: 20% 15px;
}
```

![Border Radius](./figures/border-radius.png 'Border Radius')

[圆角曲线重叠时](http://w3.org/TR/css3-background/#corner-overlap),
所有圆角半径都缩小至 $f$ 倍:

$$
f =
\min\left(
  \frac{\text{Length}_{\text{horizontal}}}{\sum^{\text{horizontal}}_{\text{radius}}},
  \frac{\text{Length}_{\text{vertical}}}{\sum^{\text{vertical}}_{\text{radius}}}
\right)
$$

```css
.w-150px-h-100px {
  /* f = min(0.50, 0.50) = 0.50 */
  border-radius: 100%;
  border-radius: 75px / 50px;

  /* f = min(0.50, 0.33) = 0.33 */
  border-radius: 150px;
  border-radius: 50px;
}
```

## Color

### Alpha

半透明边框:

```css
.box {
  background: white;
  background-clip: padding-box;
  border: 10px solid hsl(0deg 0% 100% / 50%);
}
```

### Transparent

利用透明边框扩大元素点击区域,
并利用 `background-clip: padding-box` 隐藏边框:

```css
.icon-clear {
  width: 16px;
  height: 16px;
  background-clip: padding-box;
  border: 11px solid transparent;
}
```

## Style

利用 `solid` border 模拟链接下划线:

```css
.link {
  padding-bottom: 5px;
  text-decoration: none;
  border-bottom: 1px solid;
}
```

## Image

[`border-image`](https://developer.mozilla.org/docs/Web/CSS/border-image):

- 以九宫格为基本模式, `content-box` 为九宫格中间格子.
- 可以结合 `clip-path` 裁剪边框.
- 可用于实现自定义边框: 渐变边框, 条纹边框, 虚线边框.
- `<'border-image-source'>`
  || `<'border-image-slice'> / <'border-image- width'> / <'border-image-outset'>`
  || `<'border-image-repeat'>`.

```css
.box {
  border-image: url('./grid-nine.svg') 54 33.33% 33.33% 54 / 10px 20px 30px 1 / 1 30px 20px 10px round space;
}
```

```css
.border-linear-gradient {
  border-style: solid;
  border-image: linear-gradient(deepskyblue, deeppink) 20 / 10px;
  clip-path: inset(0 round 10px);
}

.border-radial-gradient {
  border-style: solid;
  border-image: radial-gradient(deepskyblue, deeppink) 20 / 10px;
  clip-path: inset(0 round 10px);
}

.border-stripe {
  border: 12px solid;
  border-image: repeating-linear-gradient(-45deg, red, red 5px, transparent 5px, transparent 10px) 12;
}

.border-dashed {
  border: 1px dashed deepskyblue;
  border-image: repeating-linear-gradient(135deg, deepskyblue, deepskyblue 5px, transparent 5px, transparent 10px) 1;
}
```

## Collapse

```css
table,
tr,
td {
  border: 1px solid #666;
}

table {
  border-collapse: collapse;
}
```

## Multiple

[Multiple border](https://css-tricks.com/animating-border):

- `border`.
- `outline`.
- `background` gradient:
  - `linear-gradient` [border](https://codepen.io/Chokcoco/pen/YzGdEMZ).
  - `conic-gradient` [border](https://codepen.io/Chokcoco/pen/dypaobm).
- `box-shadow`.
- `clip-path`.
- Pseudo element.
- SVG [`stroke-dasharray`](https://codepen.io/Chokcoco/pen/gOOKYmV).

## Outline

[`outline`](https://developer.mozilla.org/docs/Web/CSS/outline):

- `initial` value: `medium none currentcolor`.
- `outline` do not take up space,
  it overlap margins and surrounding elements.
- `outline` do not change element `size` and `position`.
- `outline` is same on all sides.

```css
.input {
  outline: none;
}

.input:focus {
  border-color: var(--highlight);
}

.button:focus-visible {
  outline: 1px solid #000;
  outline-offset: 3px;
}

.button:focus:not(:focus-visible) {
  outline: none;
}

.image:active {
  outline: 50px solid rgb(0 0 0 / 10%);
  outline-offset: -50px;
}
```

## Box Decoration Break

[`box-decoration-break`](https://developer.mozilla.org/docs/Web/CSS/box-decoration-break):

- Control `background`/`border`/`border-image`/`box-shadow`/`clip-path`/`margin`/`padding`
  styles when lines break.
- `slice`: initial value, 断开部分样式直接切割.
- `clone`: 断开部分样式独立渲染.
