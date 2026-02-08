---
sidebar_position: 42
tags: [Web, CSS, Component, Shape]
---

# Shape

## Pseudo Element

[利用伪类画额外图形](https://css-tricks.com/examples/ShapesOfCSS):

```css
.first-details-intro::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 0;
  height: 0;
  content: '';
  border-top: 15px solid transparent;
  border-right: 25px solid #fff;
  border-bottom: 15px solid transparent;
}
```

## Border

### Horizontal and Vertical

Separate set horizontal and vertical radius to make well-designed shapes:

```css
.avatar-shape {
  border-radius: 70% 30% 30% 70% / 60% 40%;
}

.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: solid deepskyblue;
  border-radius: 50%;
  animation: morph 6s paused linear;
}

@keyframes morph {
  0% {
    border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
    transform: rotate(-5deg);
  }

  100% {
    border-radius: 40% 60%;
    transform: rotate(5deg);
  }
}

.avatar:nth-child(4n) {
  animation-delay: -3.5s;
}

.avatar:nth-child(2n + 1) {
  animation-delay: -1s;
}

.avatar:nth-child(3n + 2) {
  animation-delay: -2s;
}

.avatar:nth-child(5n + 3) {
  animation-delay: -3s;
}

.avatar:nth-child(7n + 5) {
  animation-delay: -4s;
}

.avatar:nth-child(11n + 7) {
  animation-delay: -5s;
}
```

### Transparent

Mix `transparent` with non-`transparent` border to make shapes (e.g. triangle):

```css
.arrow-up {
  width: 0;
  height: 0;
  border-right: 16px solid transparent;
  border-bottom: 20px solid #8888e8;
  border-left: 16px solid transparent;
}

.arrow-right {
  width: 0;
  height: 0;
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
  border-left: 20px solid #e888a3;
}

.arrow-down {
  width: 0;
  height: 0;
  border-top: 20px solid #f7df6c;
  border-right: 16px solid transparent;
  border-left: 16px solid transparent;
}

.arrow-left {
  width: 0;
  height: 0;
  border-top: 16px solid transparent;
  border-right: 20px solid #8de698;
  border-bottom: 16px solid transparent;
}
```

## Background

```css
.btn-add,
.btn-sub {
  width: 1.5rem;
  height: 1.5rem;
  color: dimgray;
  background:
    linear-gradient(currentcolor, currentcolor) no-repeat center / 0.875em 2px,
    linear-gradient(currentcolor, currentcolor) no-repeat center / 2px 0.875em;
  border: 1px solid gray;
}

.btn-sub {
  background-size:
    0.875em 2px,
    0;
}
```

```css
.square {
  width: 304px;
  height: 160px;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
  background-position:
    0 0,
    8px 8px;
  background-size: 16px 16px;
}
```

![Background Shape](./figures/background-shape.png 'Background Shape')

## Stretch

- `background` line.
- `border` line.
- Pseudo element with `line-through` `text-decoration`.

```css
.line {
  width: 70%;
  height: 10px;
  background-color: #000;
}

.line,
.line-background {
  background: linear-gradient(#000, #000) 50% / 70% 10px no-repeat;
}

.line,
.line-border {
  border-top: 10px solid #000;
}

.line,
.line::after {
  /* set thickness */
  font-size: 5em;

  /* hide content */
  color: transparent;
  text-decoration: line-through #000;

  /* control line length */
  content: '_______';
}
```

## Dash

- `background` dash line.
- `border` dash line.
- Pseudo element with `dashed` `text-decoration`.

```css
.dash-background {
  background: linear-gradient(to left, #000 70%, transparent 0);
  background-repeat: repeat-x;
  background-size: 30px 10px;
}

.dash-border {
  border-top: 10px dashed #000;
}

.dash::after {
  text-decoration-style: dashed;
}
```

## Bar

Background gradient [bar](https://css-tricks.com/single-element-loaders-the-bars/#aa-lets-make-some-bars):

```css
.bars {
  --color: no-repeat linear-gradient(#000 0 0);

  width: 45px;
  aspect-ratio: 1;
  background:
    var(--color) 0% 50%,
    var(--color) 50% 50%,
    var(--color) 100% 50%;
  background-size: 20% 100%; /* 20% * (3 bars + 2 spaces) = 100% */
}
```

Grid pseudo element border [bar](https://css-tricks.com/single-element-loaders-the-bars/#aa-rounding-the-bars):

```css
.loader {
  --size: 100px; /* control the size */

  display: grid;
  place-content: center;
  place-items: center;
  margin: 0 calc(var(--size) / 2); /* 50px */
}

.loader::before,
.loader::after {
  grid-area: 1 / 1;
  content: '';
}

.loader,
.loader::before,
.loader::after {
  width: calc(var(--size) / 5); /* 20px */
  height: var(--size);
  border-radius: var(--size);
  transform: translate(calc(var(--index, 0) * 200%));
}

.loader::before {
  --index: -1;
}

.loader::after {
  --index: 1;
}
```

## Wave

Rotate border [wave](https://codepen.io/Chokcoco/pen/EXJrdB):

```html
<div class="container">
  <div class="wave"></div>
  <p>45%</p>
</div>

<style>
  .container {
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: 50%;
  }

  .wave {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: rgb(118 218 255);
    border-radius: 50%;
  }

  .wave::before,
  .wave::after {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    width: 400px;
    height: 400px;
    content: '';
    background-color: rgb(255 255 255 / 40%);
    border-radius: 45%;
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 6s linear infinite;
  }

  .wave::after {
    z-index: 2;
    background-color: rgb(255 255 255 / 90%);
    border-radius: 47%;
    transform: translate(-50%, -70%) rotate(0);
    animation: rotate 10s linear -5s infinite;
  }

  @keyframes rotate {
    50% {
      transform: translate(-50%, -73%) rotate(180deg);
    }

    100% {
      transform: translate(-50%, -70%) rotate(360deg);
    }
  }
</style>
```

## Menu

```css
.icon-menu {
  display: inline-block;
  width: 140px;
  height: 10px;

  /* Line gap */
  padding: 35px 0;

  /* Line 2 */
  background-color: currentcolor;
  background-clip: content-box;

  /* Line 1 */
  border-top: 10px solid;

  /* Line 3 */
  border-bottom: 10px solid;
}
```

## Grid

- `background-image` for line color,
- `background-size` for line gap.

```css
.grid-line {
  background-color: #fff;
  background-image:
    linear-gradient(var(--line-color) 1px, transparent 0), linear-gradient(90deg, var(--line-color) 1px, transparent 0);
  background-size: 10px 10px;
  border-top: 1px solid #e5e8eb;
  border-bottom: 1px solid #e5e8eb;
  box-shadow:
    inset 0 15px 20px -15px #f6f7f9,
    inset -5px -15px 20px -15px #f6f7f9;
}

/**
 * @see {@link play.csssecrets.io/blueprint}
 */
.nest-grid-line {
  background: #58a;
  background-image:
    linear-gradient(var(--primary-line-color) 2px, transparent 0),
    linear-gradient(90deg, var(--primary-line-color) 2px, transparent 0),
    linear-gradient(var(--secondary-line-color) 1px, transparent 0),
    linear-gradient(90deg, var(--secondary-line-color) 1px, transparent 0);
  background-size:
    75px 75px,
    75px 75px,
    15px 15px,
    15px 15px;
}
```

## Spinner

- Rotate conic gradient.
- Rotate border.

Background gradient [loading spinner](https://css-tricks.com/single-element-loaders-the-spinner):

```css
.loading-ring {
  --mask: radial-gradient(closest-side, transparent 75%, black 76%);

  width: 100px;
  height: 100px;
  background: conic-gradient(deepskyblue, 30%, white);
  border-radius: 50%;
  mask-image: var(--mask);
  animation: spin 1s linear infinite reverse;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
```

More spinner see [SpinKit](https://github.com/tobiasahlin/SpinKit).

## Dot

`background` and `border` dot:

```css
.icon-dot {
  display: inline-block;
  width: 100px;
  height: 100px;

  /* Cycle gap */
  padding: 10px;

  /* Cycle shape */
  background-color: currentcolor;
  background-clip: content-box;

  /* Cycle ring */
  border: 10px solid;
  border-radius: 50%;
}
```

[`radial-gradient` dot](https://css-tricks.com/single-element-loaders-the-dots):

```css
/**
 * @see {@link play.csssecrets.io/polka}
 */
.dot {
  background: #655;
  background-image: radial-gradient(tan 30%, transparent 0);
  background-size: 30px 30px;
}
```

[`repeating-radial-gradient` dot](https://codepen.io/Chokcoco/pen/vYgrGEE):

```css
@property --length {
  syntax: '<length>';
  inherits: false;
  initial-value: 0.0008px;
}

/* TV snowflake noise signal screen effect (雪花屏效果) */
div {
  background-image: repeating-radial-gradient(
    circle at 17% 32%,
    rgb(4 4 0),
    rgb(52 72 197),
    rgb(115 252 224),
    rgb(116 71 5),
    rgb(223 46 169),
    rgb(0 160 56),
    rgb(234 255 0) var(--length)
  );
  animation: change 1s infinite alternate;
}

@keyframes change {
  100% {
    --length: 0.0009px;
  }
}
```

## Circle

- `background` circle.
- `border` circle.
- `clip-path` circle.
- Pseudo element circle.

```css
.circle-background {
  background-image: radial-gradient(#000 72%, transparent 0);
}

.circle-background-corner {
  background: #58a;
  background:
    radial-gradient(circle at top left, transparent 15px, #58a 0) top left,
    radial-gradient(circle at top right, transparent 15px, #58a 0) top right,
    radial-gradient(circle at bottom right, transparent 15px, #58a 0) bottom right,
    radial-gradient(circle at bottom left, transparent 15px, #58a 0) bottom left;
  background-repeat: no-repeat;
  background-size: 50% 50%;
}

.circle-border {
  overflow: hidden;
  border-radius: 50%;
}

.circle-clip-path {
  clip-path: circle(50%);
}

.circle::after {
  font-size: 120vw;
  line-height: 0;
  content: '·';
}
```

## Ellipse

```css
/**
 * @see {@link play.csssecrets.io/half-ellipse}
 * @see {@link play.csssecrets.io/quarter-ellipse}
 */
.ellipse {
  border-radius: 50% / 50%;
  border-radius: 50% / 100% 100% 0 0;
  border-radius: 50% / 0 0 100% 100%;
  border-radius: 100% 0 0 100% / 50%;
  border-radius: 0 100% 100% 0 / 50%;
  border-radius: 100% 0 0;
  border-radius: 0 100% 0 0;
  border-radius: 0 0 100%;
  border-radius: 0 0 0 100%;
}
```

![Ellipse Border](./figures/ellipse-border.png 'Ellipse Border')

## Triangle

- `background` triangle.
- `border` triangle.
- `clip-path` triangle.
- Pseudo element triangle.

Background gradient triangle:

```css
.triangle {
  background: linear-gradient(45deg, #000 50%, transparent 0);
}

/**
 * @see {@link https://codepen.io/Chokcoco/pen/BGeJGm}
 */
.arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 40px;
  font-size: 200%;
  color: white;
  text-align: center;
  background:
    linear-gradient(-135deg, transparent 10%, #04e6fb 10%, #65ff9a 100%) top right,
    linear-gradient(-45deg, transparent 10%, #04e6fb 10%, #65ff9a 100%) bottom right,
    linear-gradient(-135deg, #04e6fb 0, #65ff9a 90%, transparent 90%) top left,
    linear-gradient(-45deg, #04e6fb 0, #65ff9a 90%, transparent 90%) bottom left;
  background-repeat: no-repeat;
  background-size: 90% 50%;
  transform: translate(-50%, -50%);
}

/**
 * @see {@link play.csssecrets.io/folded-corner-realistic}
 */
.note {
  position: relative;
  background: #58a; /* 回退样式 */
  background: linear-gradient(-150deg, transparent 1.5em, #58a 0);
}

.note::before {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.73em;
  height: 3em;
  content: '';
  background: linear-gradient(to left bottom, transparent 50%, rgb(0 0 0 / 20%) 0, rgb(0 0 0 / 40%)) 100% 0 no-repeat;
  transform: translateY(-1.3em) rotate(-30deg);
  transform-origin: bottom right;
}
```

Border triangle:

```css
/* transparent border */
.arrow-up {
  width: 0;
  height: 0;
  border-right: 16px solid transparent;
  border-bottom: 20px solid #8888e8;
  border-left: 16px solid transparent;
}
```

Clip path triangle:

```css
/* clip path */
.arrow-right {
  width: 20px;
  height: 32px;
  background-color: #e888a3;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
}
```

Pseudo element triangle:

```css
/* pseudo element + hidden overflow */
.arrow-down {
  position: relative;
  width: 40px;
  height: 40px;
  overflow: hidden;
}

.arrow-down::before {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: calc(40px / 1.41);
  height: calc(40px / 1.41);
  content: '';
  background: #f7df6c;
  transform: rotate(-45deg);
  transform-origin: 0 0;
}

/**
 * pseudo element + HTML5 entities:
 * ◄ : &#9668;
 * ► : &#9658;
 * ▼ : &#9660;
 * ▲ : &#9650;
 */
.arrow::before {
  content: '&#9660';
}
```

## Square

Background gradient square shape:

```css
.checkerboard-linear-gradient {
  background: #eee;
  background-image:
    linear-gradient(45deg, rgb(0 0 0 / 25%) 25%, transparent 0 75%, rgb(0 0 0 / 25%) 0),
    linear-gradient(45deg, rgb(0 0 0 / 25%) 25%, transparent 0 75%, rgb(0 0 0 / 25%) 0);
  background-position:
    0 0,
    15px 15px;
  background-size: 30px 30px;
}

.checkerboard-conic-gradient {
  background: repeating-conic-gradient(#bbb 0, #bbb 25%, #eee 0, #eee 50%);
  background-size: 30px 30px;
}
```

## Polygon

### Gradient

Background gradient polygon:

```css
/**
 * @see {@link play.csssecrets.io/bevel-corners-gradients}
 */
.polygon-background-corner {
  background: #58a;
  background:
    linear-gradient(135deg, transparent 15px, #58a 0) top left,
    linear-gradient(-135deg, transparent 15px, #58a 0) top right,
    linear-gradient(-45deg, transparent 15px, #58a 0) bottom right,
    linear-gradient(45deg, transparent 15px, #58a 0) bottom left;
  background-repeat: no-repeat;
  background-size: 50% 50%;
}
```

### Clip Path

`clip-path` polygon:

```css
.polygon {
  /* 菱形 */
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);

  /* 矩形箭头 */
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);

  /* 八边形 */
  clip-path: polygon(
    20px 0,
    calc(100% - 20px) 0,
    100% 20px,
    100% calc(100% - 20px),
    calc(100% - 20px) 100%,
    20px 100%,
    0 calc(100% - 20px),
    0 20px
  );
}
```

```ts
function polygon(n = 3) {
  const deg = (2 * Math.PI) / n
  const points = []

  for (let i = 0; i < n; ++i) {
    const theta = deg * i
    const x = `${50 * Math.cos(theta) + 50}%`
    const y = `${50 * Math.sin(theta) + 50}%`
    points.push(`${x} ${y}`)
  }

  return `polygon(${points.join(',')})`
}
```

### Transform

`transform` polygon:

```css
/* 平行四边形 */
.button::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: ''; /* 用伪元素来生成一个矩形 */
  background: #58a;
  transform: skew(45deg);
}
```

[Chrome style tab](https://codepen.io/Chokcoco/pen/WNNgyMV):

```css
/* 梯形 */
.tab::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: ''; /* 用伪元素来生成一个矩形 */
  background: #58a;
  transform: scaleY(1.3) perspective(0.5em) rotateX(5deg);
  transform-origin: bottom;
}
```

## References

- Modern CSS [shapes](https://www.smashingmagazine.com/2024/05/modern-guide-making-css-shapes).
- Pure CSS [icons](https://github.com/wentin/cssicon).
