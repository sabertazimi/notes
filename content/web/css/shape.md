---
sidebar_position: 25
tags: [Web, CSS, Shape]
---

# Shape

[CSS shapes](https://css-tricks.com/the-shapes-of-css):

- `aspect-ratio`.
- `border`.
- `box-shadow` (inset).
- Background:
  `position`/`size`/`color`/`image`/[`gradient`](https://css-tricks.com/drawing-images-with-css-gradients).
  In modern browsers,
  background shapes with `transition`/`transform` are better than pseudo elements.
- [`clip-path`](https://css-tricks.com/using-css-clip-path-create-interactive-effects).
- `mask`
- `filter`.
- SVG:
  - SVG icon.
  - SVG filter.
  - SVG clip-path.
  - SVG mask.
- [Pseudo elements](https://css-tricks.com/pseudo-element-roundup).

## Outside

[`shape-outside`](https://developer.mozilla.org/docs/Web/CSS/shape-outside)
provides a way to customize wrapping effect for `float` element,
combined with
[`shape-margin`](https://developer.mozilla.org/docs/Web/CSS/shape-margin)
[`shape-image-threshold](https://developer.mozilla.org/docs/Web/CSS/shape-image-threshold)
making it possible to wrap text around complex objects rather than simple boxes:

```css
.shape {
  float: left;
  shape-outside: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  shape-image-threshold: 20%;
  shape-margin: 20px;
}
```

## Clip

[`clip`](https://developer.mozilla.org/docs/Web/CSS/clip)
属性只对 `absolute` 与 `fixed` 元素起作用,
是对 `overflow` 属性的有力补充
(`overflow` 对于上述两种元素的裁剪作用有限):

- `auto`.
- `rect(<top-length>, <right-length>, <bottom-length>, <left-length>)`.
- `clip` 元素 `clientWidth`, `clientHeight`, `computedStyle` 保持不变:
  仅视觉上裁剪, 元素尺寸仍为原本尺寸, 原始布局仍然保留.
- `clip` 元素非可见部分无法响应点击事件.

```css
.fixed-clip {
  position: fixed;
  clip-path: rect(30px 200px 200px 20px);
}
```

## Clip Path

[`clip-path`](https://developer.mozilla.org/docs/Web/CSS/clip-path):

- `none`.
- `<url>`.
- `<geometry-box> || <basic-shape>`:
  - `<geometry-box>`:
    - `border-box`.
    - `padding-box`.
    - `content-box`.
    - `margin-box`.
    - `fill-box`.
    - `stroke-box`.
    - `view-box`.
  - [`<basic-shape>`](https://developer.mozilla.org/docs/Web/CSS/basic-shape):
    - [`inset(<length-percentage>{1,4} [round <'border-radius'>]?)`](https://developer.mozilla.org/docs/Web/CSS/basic-shape/inset).
    - [`circle([<shape-radius>]? [at <position>]?)`](https://developer.mozilla.org/docs/Web/CSS/basic-shape/circle).
    - [`ellipse([<shape-radius>{2}]? [at <position>]?)`](https://developer.mozilla.org/docs/Web/CSS/basic-shape/ellipse).
    - [`polygon([<fill-rule>,]? [<length-percentage> <length-percentage>]#)`](https://developer.mozilla.org/docs/Web/CSS/basic-shape/polygon).
    - [`path([<fill-rule>,]? <string>)`](https://developer.mozilla.org/docs/Web/CSS/path).
- `clip-path` 元素 `clientWidth`, `clientHeight`, `computedStyle` 保持不变:
  仅视觉上裁剪, 元素尺寸仍为原本尺寸, 原始布局仍然保留.
- `clip-path` 元素非可见部分无法响应点击事件.
- [`<fill-rule>`](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule)
  用于确定复杂路径构成的图形的内部与外部, 内部填充, 外部透明.

![NonZero Fill Rule](./figures/fill-rule-non-zero.png 'NonZero Fill Rule')

![EvenOdd Fill Rule](./figures/fill-rule-even-odd.png 'EvenOdd Fill Rule')

```css
.clip-path {
  clip-path: inset(10% 20% 30% 40%);
  clip-path: circle(50% at 50% 50%);
  clip-path: ellipse(50% 25% at 50% 50%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  clip-path: path('M 0 0 L 100 0 L 100 100 L 0 100 Z');
}
```
