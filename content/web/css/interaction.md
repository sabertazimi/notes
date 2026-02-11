---
sidebar_position: 29
tags: [Web, CSS, Interaction, Cursor, Pointer, Scroll, Parallax]
---

# Interaction

## Cursor

[`cursor`](https://developer.mozilla.org/docs/Web/CSS/cursor):

- `auto`/`default`/`pointer`/`move`/`text`.
- `wait`/`help`/`crosshair`/`progress`.
- `not-allowed`/`no-drop`/`vertical-text`/`all-scroll`.
- `none`/`alias`/`cell`/`copy`/`context-menu`.
- `grab`/`grabbing`.
- `n-resize`/`e-resize`/`s-resize`/`w-resize`.
- `ne-resize`/`nw-resize`/`se-resize`/`sw-resize`.
- `col-resize`/`row-resize`.
- `ew-resize`/`ns-resize`/`nesw-resize`/`nwse-resize`.
- `zoom-in`/`zoom-out`.
- `url()`.

```css
.wrap {
  pointer-events: none;
  cursor: default;
}
```

## Pointer Events

[`pointer-events`](https://developer.mozilla.org/docs/Web/CSS/pointer-events):

- `auto`.
- `none`:
  - 不能阻止键盘行为: 元素依然可以通过 `Tab` 键被 `focus`.
  - 无法显示 `[title]` 等 `A11Y` 提示, 影响无障碍访问 (特别是移动端).
  - 综上所述, `none`
    不适合 `<a>`/`<button>` 等控件元素,
    适合作用在装饰性的或仅用作视觉表现的非控件元素.
- 具有继承性.

## Touch Action

[`touch-action`](https://developer.mozilla.org/docs/Web/CSS/touch-action):

- `auto`:
  enable all panning and zooming gestures.
- `none`:
  disable all panning and zooming gestures.
- `manipulation`:
  only enable panning and pinch zoom gestures (滚动, 持续缩放),
  remove click delay (300ms) for mobile device.
- `[pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom`.

```css
.box {
  touch-action: auto;
  touch-action: none;
  touch-action: manipulation;
  touch-action: pan-x;
  touch-action: pan-left;
  touch-action: pan-right;
  touch-action: pan-y;
  touch-action: pan-up;
  touch-action: pan-down;
  touch-action: pinch-zoom;
  touch-action: pan-left pan-up;
}
```

## Resize

[`resize`](https://developer.mozilla.org/docs/Web/CSS/resize):

- `none`.
- `both`.
- `horizontal`.
- `vertical`.
- `inline`.
- `block`.
- 不支持内联元素.
- 支持 `overflow` non-`visible` 块级元素.
- 可用 `min-width`/`min-height`/`max-width`/`max-height` 限制拉伸范围.

```css
.editable {
  overflow: hidden;
  resize: both;
}
```

[Image comparison slider](https://codepen.io/Chokcoco/pen/bGqWJZL):

```html
<div class="image-slider">
  <div class="image-before">
    <img src="cat-before.jpg" alt="Before" />
  </div>
  <img class="image-after" src="cat-after.jpg" alt="After" />
  <input type="range" class="image-a11y-control" />
</div>

<style>
  .image-slider {
    position: relative;
    display: inline-block;
  }

  .image-slider img {
    display: block;
    user-select: none;
  }

  .image-slider > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 50%; /* resizable width */
    max-width: 100%;
    overflow: hidden;
    resize: horizontal;
  }

  .image-slider > div::before {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 12px;
    height: 12px;
    padding: 5px;
    cursor: ew-resize;
    content: '';
    background: linear-gradient(-45deg, white 50%, transparent 0);
    background-clip: content-box;
  }
</style>

<script>
  /* Additional range input feature */
  const range = document.querySelector('.image-a11y-control')
  range.addEventListener('input', (event) => {
    document.querySelector('.image-before').style.width = `${event.target.value}%`
  })
</script>
```

## User Select

禁止图文被选中, 保持和原生 App 一样的文字选中体验:

```css
.body {
  -webkit-touch-callout: none;
  user-select: none;
}
```

点击任意位置实现全选效果:

```css
.box {
  user-select: all;
}
```

## Caret Color

输入框光标颜色:

```css
input {
  caret-color: red;
}
```

## Scroll Behavior

[`scroll-behavior`](https://developer.mozilla.org/docs/Web/CSS/scroll-behavior):

- `auto`.
- `smooth`.

```css
html,
body {
  scroll-behavior: smooth;
}
```

## Overscroll Behavior

[`overscroll-behavior`](https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior):

- `auto{1,2}`.
- `contain{1,2}`: 嵌套滚动不会传导至相邻区域, 即嵌套滚动条滚动到底部便停止, 不会继续滚动外部滚动条.
- `none{1,2}`.

## Scroll Snap

[`scroll-snap`](https://developer.mozilla.org/docs/Web/CSS/CSS_Scroll_Snap):

- 可让网页容器滚动停止时, 自动平滑定位到指定元素的指定位置.
- Parent (scroll port) property:
  - [`scroll-snap-type`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type).
  - [`scroll-padding`](https://developer.mozilla.org/docs/Web/CSS/scroll-padding).
  - `overscroll-behavior`.
  - Overflow axis.
- Children (scroll item) property:
  - [`scroll-snap-align`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align).
  - [`scroll-snap-stop`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop).
  - [`scroll-margin`](https://developer.mozilla.org/docs/Web/CSS/scroll-margin).

```html
<div class="scroll-x">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
  <img src="4.jpg" />
</div>

<style>
  .scroll-x {
    max-width: 414px;
    height: 420px;
    overflow: auto;
    white-space: nowrap;
    scroll-snap-type: x mandatory;
  }

  .scroll-x img {
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }
</style>
```

### Type

[`scroll-snap-type`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type):

- `none`.
- `[ x | y | inline | block | both ] [ mandatory | proximity ]?`:
  - `x`: 捕捉水平定位点.
  - `y`: 捕捉垂直平定位点.
  - `inline`: 捕捉和内联元素排列一个滚动方向的定位点, 默认文档流下指的就是水平轴.
  - `block`: 捕捉和块状元素排列一个滚动方向的定位点, 默认文档流下指的就是垂直轴.
  - `both`: 横轴与纵轴都捕捉.
  - `mandatory`: 强制定位, 若存在有效的定位点位置, 则滚动容器必须在滚动结束时进行定位.
  - `proximity`: 大约定位, 让浏览器自己判断要不要定位.

### Margin

[`scroll-margin`](https://developer.mozilla.org/docs/Web/CSS/scroll-margin):

- `0`.
- `<length>{1,4}`.

### Padding

[`scroll-padding`](https://developer.mozilla.org/docs/Web/CSS/scroll-padding):

- `auto{1,4}`.
- `<length-percentage>{1,4}`.

### Align

[`scroll-snap-align`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align):

- `none{1,2}`.
- `start{1,2}`: 起始位置对齐, 子元素对齐容器左边缘/上边缘.
- `end{1,2}`: 结束位置对齐, 子元素对齐容器右边缘/下边缘.
- `center{1,2}`: 居中对齐, 子元素中心和滚动容器中心一致.

### Stop

[`scroll-snap-stop`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop):

- `normal`: 可以忽略捕获位置.
- `always`: 不能忽略捕获位置, 且必须定位到第一个捕获元素的位置, 保证每次只滚动一屏或一个指定元.

## Overflow Anchor

[`overflow-anchor`](https://developer.mozilla.org/docs/Web/CSS/overflow-anchor):

- `auto`: 开启滚动锚定.
- `none`: 关闭滚动锚定.

## Overflow Scrolling

`overflow: scroll` 剪裁界线为 `padding box`.
但部分浏览器不符合这一标准.
实际项目开发时, 要尽量避免滚动容器设置 `padding-bottom` 值:

- 跨浏览器样式表现不一致.
- 跨浏览器 `scrollHeight` 值不一致.

## Horizontal Scrolling

### Principles

Horizontal scrolling [design](https://designshack.net/articles/navigation/horizontal-scrolling-pros-cons):

- Avoid a full-screen horizontal scroll;
  ensure that users know there is also content
  that can be reached using a traditional method.
- Make scroll interactions obvious and provide instruction.
- To avoid accessibility issues,
  ensure that horizontal scrolling elements also work with keyboard navigation.
- Design horizontal scrolling elements in containers using HTML and CSS.
- Use visual cues, such as partial images,
  to show that there is a horizontal scroll action in effect.
- Use partial horizontal scrolling with a static design element for stability.
- Design horizontal scroll bars in the same manner as vertical scroll bars
  to create an element of familiarity for users.

### Methods

- Transform: rotate `90deg` element.
- Flex.
- Grid.
- Scroll snap.

```css
.scroll-container {
  width: 100%;
  overflow: auto hidden;
  white-space: nowrap;

  /* Hide scrollbar in IE and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Hide scrollbar in Chrome */
.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-container .item {
  display: inline-flex;
}

@supports (display: grid) {
  .scroll-container {
    display: grid;
    grid-template-rows: auto;
    grid-auto-flow: column;
    max-width: min-content;
  }
}

@supports (scroll-snap-type: x mandatory) {
  .scroll-container {
    scroll-snap-type: x mandatory;
    scroll-padding: 0 1.2rem;
  }

  .scroll-container .item {
    scroll-snap-align: center;
  }
}
```

## Custom Scrollbar

Scroll bars take up space within `padding box`.

### Width and Color

[`scrollbar-width`](https://developer.mozilla.org/docs/Web/CSS/scrollbar-width):

- `auto`.
- `thin`.
- `none`.

[`scrollbar-color`](https://developer.mozilla.org/docs/Web/CSS/scrollbar-color):

- `auto`.
- `<color>{2}`.

### WebKit

[WebKit scrollbar](https://github.com/henripar/scrollbar):

- 整体部分: `::-webkit-scrollbar`.
- 两端按钮: `::-webkit-scrollbar-button`.
- 外层轨道: `::-webkit-scrollbar-track`.
- 内层轨道: `::-webkit-scrollbar-track-piece`.
- 滚动滑块: `::-webkit-scrollbar-thumb`.
- 边角: `::-webkit-scrollbar-corner`.

```css
.demo::-webkit-scrollbar {
  /* 滚动条整体样式 */

  /* 高宽分别对应横竖滚动条的尺寸 */
  width: 10px;
  height: 1px;
}

.demo::-webkit-scrollbar-thumb {
  background-color: blue;
  background-image: linear-gradient(
    45deg,
    rgb(255 255 255 / 20%) 25%,
    transparent 25%,
    transparent 50%,
    rgb(255 255 255 / 20%) 50%,
    rgb(255 255 255 / 20%) 75%,
    transparent 75%,
    transparent
  );

  /* 滚动条方块 */
  border-radius: 10px;
}

.demo::-webkit-scrollbar-track {
  background-color: #ededed;

  /* 滚动条轨道 */
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 20%);
}
```

### Hidden

```css
.scroll-none {
  overflow: hidden auto;
  scrollbar-width: none; /* FireFox */
  -ms-overflow-style: none; /* IE 10+ */
}

.scroll-none::-webkit-scrollbar {
  /* Chrome Safari */
  display: none;
  width: 0;
  height: 0;
}
```

### Gutter

[`scrollbar-gutter`](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-gutter),
预留滚动条占用空间, 防止 layout shift:

```css
html {
  scrollbar-gutter: stable;
}
```

## Parallax

### Background Attachment

```css
.parallax {
  min-height: 60%; /* key */
  background-image: url('./images/bg.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed; /* key */
  background-position: center;
  background-size: cover;
}
```

### Perspective Transform

[3D perspective transform](https://keithclark.co.uk/articles/pure-css-parallax-websites)
[parallax effect](https://github.com/netlify/matterday.netlify.com):

```html
<div class="parallax">
  <div class="parallax-group">
    <div class="parallax-layer parallax-fore-layer"></div>
    <div class="parallax-layer parallax-base-layer"></div>
  </div>
  <div class="parallax-group">
    <div class="parallax-layer parallax-base-layer"></div>
    <div class="parallax-layer parallax-back-layer"></div>
    <div class="parallax-layer parallax-deep-layer"></div>
  </div>
</div>

<style>
  .parallax {
    height: 100vh;
    overflow: hidden auto;
    perspective: 1px;
    perspective-origin: 100% 50%;
  }

  .parallax-group {
    position: relative;
    height: 100vh;
    transform-style: preserve-3d;
  }

  .parallax-layer {
    position: absolute;
    inset: 0;
    transform-origin: 100% 50%;
  }

  .parallax-fore-layer {
    transform: translateZ(90px) scale(0.7);
  }

  .parallax-base-layer {
    transform: translateZ(0);
  }

  .parallax-back-layer {
    transform: translateZ(-1px) scale(2);
  }

  .parallax-deep-layer {
    transform: translateZ(-2px) scale(3);
  }
</style>
```

## Progress Indicator

```css
body {
  position: relative;
}

.indicator {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(to right top, teal 50%, transparent 50%) no-repeat;
  background-size: 100% calc(100% - 100vh);
  mix-blend-mode: darken;
}

/* use after element to hidden triangle background gradient */

/* only show 5px background */
.indicator::after {
  position: fixed;
  inset: 5px 0 0;
  z-index: 1;
  content: '';
  background: #fff;
}
```
