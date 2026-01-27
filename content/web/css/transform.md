---
sidebar_position: 40
tags: [Web, CSS, Animation, Transform]
---

# Transform

`transform`:

- No affect on the CSS box model layout (excepts [`overflow`](#alignment)).
- No affect on `display: inline` element.
- Affect the visual rendering.
- Affect client rectangles exposed by
  `Element Interface Extensions` (`getClientRects()`/`getBoundingClientRect()`).
- Affect after `clip`/`clip-path`: first `clip`/`clip-path`, then `transform`.
- Create new [stacking context](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).
- Create new [containing block](https://developer.mozilla.org/docs/Web/CSS/Containing_block#identifying_the_containing_block)
  for `absolute`/`fixed` positioned children.
- `<transform-function>+`: 多重变换**从右向左**按顺序执行.

## Translate

`translate()`/`translateX()`/`translateY()`/`translateZ()`/`translate3d()`:

```css
.translate {
  /* 往右偏移10px, 往下偏移20px */
  transform: translate(10px, 20px);

  /* 往右偏移10px */
  transform: translateX(10px);

  /* 往下偏移20px */
  transform: translateY(20px);

  /* 往左偏移自身宽度的一半, 往上偏移自身高度的一半 */
  transform: translate(-50%, -50%);
}
```

## Scale

`scale()`/`scaleX()`/`scaleY()`/`scaleZ()`/`scale3d()`:

```css
.scale {
  /* 水平放大 2 倍, 垂直缩小 1/2 */
  transform: scale(2, 0.5);

  /* 水平放大 2 倍 */
  transform: scaleX(2);

  /* 垂直缩小 1/2 */
  transform: scaleY(0.5);

  /* 水平翻转效果 */
  transform: scaleX(-1);

  /* 垂直翻转效果 */
  transform: scaleY(-1);
}
```

## Rotate

`rotate()`/`rotateX()`/`rotateY()`/`rotateZ()`/`rotate3d()`:

- `deg`: degrees 角度 ($0$ ~ $360^{\circ}$).
- `grad`: grads 百分度 ($0$ ~ $400$).
- `rad`: radians 弧度 ($1^{\circ} = \frac{180}{\pi}$).
- `turn`: turns 圈数.

```css
.rotate {
  /* 正值顺时针, 负值逆时针 */
  transform: rotate(45deg);
  transform: rotate(50grad);
  transform: rotate(0.7854rad);
  transform: rotate(0.25turn);
}
```

## Skew

`skew()`/`skewX()`/`skewY()`:

```css
.skew {
  /* 水平切斜 10 度, 垂直切斜 20 度 */
  transform: skew(10deg, 20deg);

  /* 水平切斜10度 */
  transform: skewX(10deg);

  /* 垂直切斜20度 */
  transform: skewY(20deg);
}
```

[![Skew Transform](./figures/transform-skew.png)](https://developer.mozilla.org/docs/Web/CSS/transform-function/skew)

## Matrix

`matrix(a, b, c, d, e, f)`:

$$
\begin{bmatrix}
  a & c & e \\
  b & d & f \\
  0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
  x \\
  y \\
  1
\end{bmatrix}
\implies
\begin{bmatrix}
  ax + cy + e \\
  bx + dy + f \\
  1
\end{bmatrix}
$$

$$
\begin{align}
   x' &= ax + cy + e  \\
   y' &= bx + dy + f
\end{align}
$$

Translate:

$$
\begin{align}
   x' &= 1 \cdot x + 0 \cdot y + e &= x + e \\
   y' &= 0 \cdot x + 1 \cdot y + f &= y + f
\end{align}
$$

Scale:

$$
\begin{align}
   x' &= a \cdot x + 0 \cdot y + 0  &= ax \\
   y' &= 0 \cdot x + d \cdot y + 0  &= dy
\end{align}
$$

Rotate:

$$
\begin{align}
   x' &= \cos\theta \cdot x - \sin\theta \cdot y \\
   y' &= \sin\theta \cdot x + \cos\theta \cdot y
\end{align}
$$

Skew:

$$
\begin{align}
   x' &= x + \tan{\theta x} \cdot y  \\
   y' &= \tan{\theta y} \cdot x + y
\end{align}
$$

```css
.matrix {
  transform: matrix(1, 0, 0, 1, var(--translate-x), var(--translate-y));
  transform: matrix(var(--scale-x), 0, 0, var(--scale-y), 0, 0);
  transform: matrix(var(--cos), var(--sin), var(--sin-minus), var(--cos), 0, 0);
  transform: matrix(1, var(--tan-y), var(--tan-x), 1, 0, 0);
}
```

## Origin

[`transform-origin`](https://developer.mozilla.org/docs/Web/CSS/transform-origin)
change `transform` start point:

- X offset: `<length>`/`<percentage>`/`left`/`center`/`right`.
- Y offset: `<length>`/`<percentage>`/`top`/`center`/`bottom`.
- Z offset: `<length>`.

```css
.transform-origin {
  /* One-value syntax, the other is `50%`/`center` */
  transform-origin: 2px;
  transform-origin: bottom;

  /* x-offset | y-offset */
  transform-origin: 3cm 2px;
  transform-origin: left 2px;

  /* x-offset | y-offset | z-offset */
  transform-origin: 2px 30% 10px;
  transform-origin: left 5px -3px;
}
```

## Individual

Individual transform [property](https://drafts.csswg.org/css-transforms-2/#individual-transforms):

- [`translate`](https://developer.mozilla.org/docs/Web/CSS/translate).
- [`scale`](https://developer.mozilla.org/docs/Web/CSS/scale).
- [`rotate`](https://developer.mozilla.org/docs/Web/CSS/rotate).

```css
.element {
  rotate: 90deg;
  rotate: y 0.25turn;
  rotate: z 1.57rad;
  rotate: 1 1 1 90deg;
  scale: 2;
  scale: 2 0.5;
  scale: 2 0.5 2;
  translate: 50%;
  translate: 100px 200px;
  translate: 50% 105px;
  translate: 50% 105px 5rem;
}
```

## Style

`transform-style`:

- `flat`: initial value, 表示平面变换.
- `preserve-3d`: 表示 3D 透视变换.

## Perspective

`perspective` 为 **3D** 转换元素定义透视视图:

```css
.parent {
  perspective: 201px;
}
```

- 设置的 `translateZ` 值越小, 则子元素大小越小 (因为元素远去, 我们眼睛看到的就会变小).
- `translateZ` 值越大, 该元素也会越来越大.
- 当 `translateZ` 值非常接近 201 像素, 但是不超过 201 像素的时候 (如 200 像素).
  该元素的大小就会撑满整个屏幕 (父辈元素没有 `overflow: hidden` 的限制).
- 当 `translateZ` 值再变大, 超过 201 像素的时候, 该元素看不见了.

[![Transform Perspective](./figures/transform-perspective.png)](https://developer.mozilla.org/docs/Web/CSS/perspective)

## Backface Visibility

```css
.element {
  backface-visibility: hidden;
}
```

当元素 `rotateY(180deg)` 时, 元素将被隐藏.

## Container

- `:hover` should not add to transformed elements,
  `:hover` should add to parent element.
- 3D 变换一般需要在容器元素上加上以下样式:

```css
.transform-container {
  transform-style: preserve-3d;
  perspective: 1024px;
}

.front .back {
  backface-visibility: hidden;
}
```

## Alignment

- Keep `translate(-50%, -50%)` in keyframe transform property list
  when using it for alignment.
- 父元素设置了 `transform` 变换,
  `position: fixed` 子元素固定定位失效.
- 父元素设置了 `transform` 变换 + `overflow: hidden`,
  `position: absolute` 子元素会被剪裁.
- 当变换绝对定位居中的元素时, 需要改变 `transform-origin`:

```css
.rotate {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: left;
}
```

## References

- Transform 101 [guide](https://learn.shayhowe.com/advanced-html-css/css-transforms).
