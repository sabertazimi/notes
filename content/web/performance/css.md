---
sidebar_position: 3
tags: [Web, Performance, CSS]
---

# Effective CSS

## Will Change

告知浏览器该元素会有哪些变化的方法,
浏览器可在元素属性真正发生变化之前提前做好对应的优化准备工作:

```css
.will-change-parent:hover .will-change {
  will-change: auto;
  will-change: scroll-position;
  will-change: contents;

  /* <custom-ident> */
  will-change: transform;
  will-change: opacity;
  will-change: left, top;
}
```

## Contain

[CSS containment](https://developer.chrome.com/blog/css-containment):

- `contain` 属性允许开发者声明当前元素和它的内容尽可能的独立于 DOM 树的其他部分.
  这使得浏览器在重新计算布局/样式/绘图或它们的组合的时候, 只会影响到有限的 DOM 区域, 而不是整个页面:
  `none | strict | content | [ size || layout || style || paint ]`.
- `size` containment:
  声明这个元素的尺寸会变化, 不需要去检查它依赖关系中的尺寸变化.
- `layout` containment:
  声明没有外部元素可以影响它内部的布局, 反之亦然.
- `style` containment:
  声明那些同时会影响这个元素和其子孙元素的属性, 都在这个元素的包含范围内.
- `paint` containment:
  声明这个元素的子孙节点不会在它边缘外显示.
  如果一个元素在视窗外或因其他原因导致不可见, 则同样保证它的子孙节点不会被显示.

```css
.box {
  /* 无布局包含 */
  contain: none;

  /* 布局包含 size/layout/style/paint */
  contain: strict;

  /* 布局包含 layout/style/paint */
  contain: content;

  /* 布局包含 size */
  contain: size;

  /* 布局包含 layout */
  contain: layout;

  /* 布局包含 style */
  contain: style;

  /* 布局包含 paint */
  contain: paint;
}
```

## Content Visibility

[`content-visibility`](https://developer.mozilla.org/docs/Web/CSS/content-visibility):

- `visible`:
  element contents are laid out and rendered as normal.
- `hidden`:
  hide element while **preserving its rendering state**,
  if there are any changes that need to happen,
  they only happen when the element is shown again
  (i.e. `content-visibility: hidden` property is removed).
  `display: none` destroys element rendering state,
  `visibility: hidden` doesn't truly remove element.
- `auto`:
  element turns on `layout`, `style` and `paint` containment,
  可用于实现 **lazy loading**, **virtualized list**.

```css
.content {
  /* <length> values */
  contain-intrinsic-size: 1000px;
  contain-intrinsic-size: 10rem;

  /* Keyword values */
  content-visibility: visible;
  content-visibility: hidden;
  content-visibility: auto;
}

.p {
  contain-intrinsic-size: 320px; /* 预设高度, 防止滚动条频繁抖动 */
  content-visibility: auto;
}
```

[Prevent jittery scrollbar](https://infrequently.org/2020/12/resize-resilient-deferred-rendering):

```ts
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target.getBoundingClientRect().height > 0) {
      observer.unobserve(entry.target)
      entry.target.classList.remove('content-visibility-auto')
    }
  }
})

for (const element of document.querySelectorAll('.content-visibility-auto'))
  observer.observe(element)
```

## Selectors

减少选择器的复杂性, 与构造样式本身的其他工作相比,
选择器复杂性可以占用计算元素样式所需时间的 50%以上:

- 避免使用统配选择器:
  `*`.
- 避免使用后代选择器 (开销较高):
  `.anchor .link` -> `.anchor-link`.
- 避免使用标签子代选择器:
  `.list > li` -> `.list > .item` (better) -> `.list-item` (best).

## Triggers

- CSS triggers [list](https://github.com/GoogleChromeLabs/css-triggers).
- JavaScript triggers [list](https://gist.github.com/paulirish/5d52fb081b3570c81e3a).

Avoid to frequently change CSS property
and call JavaScript API triggering layout stage (`reflow`):

- `Layout` stage triggers:
  - `display`.
  - `position`.
  - `float`.
  - `top`/`bottom`/`left`/`right`.
  - `width`.
  - `height`.
  - `min-height`.
  - `margin`.
  - `padding`.
  - `border`/`border-width`.
  - `overflow`/`overflow-y`.
  - `font-family`
  - `font-size`.
  - `font-weight`.
  - `white-space`.
  - `line-height`.
  - `vertical-align`.
  - `text-align`.
  - `clear`.
- `Paint` stage triggers:
  - `background`/`background-image`/`background-repeat`/`background-position`/`background-size`
  - `border-radius`/`border-style`.
  - `box-shadow`.
  - `outline`/`outline-width`/`outline-style`/`outline-color`.
  - `color`.
  - `text-decoration`.
  - `visibility`.
- `Composite` stage triggers:
  - `cursor`.
  - `opacity`.
  - `transform`.
  - `z-index`.

## Loading

- Avoid `@import`:
  - In HTML.
  - In CSS especially;
  - Beware of oddities with the `PreLoad Scanner`.
- Be wary of synchronous CSS and JavaScript order:
  - JavaScript defined after CSS won't run until CSSOM is completed.
  - If JavaScript doesn't depend on CSS: load it before CSS.
  - If JavaScript does depend on CSS: load it after CSS.
- Load CSS as the DOM needs it:
  - Unblocks `Start Render` and allows progressive rendering.
  - Avoid **flash of un-styled content**.
  - Avoid **re-rendering and repaint** for initial page:
    put `Critical CSS` in HTML footer will lead to
    entire DOM re-rendering and repaint.
- Lazyload any CSS not needed for `Start Render`:
  - Only load `Critical CSS` in `<head>`.
  - Splitting CSS into `Media Queries`.

```html
<!-- Doesn't block rendering -->
<link rel="preload" href="/path/to/split.css" as="style" />

<!-- Loading media query -->
<link rel="stylesheet" href="/path/to/split.css" media="print" onload="this.media = 'all'" />
```

## Animation

[High performance animations](http://web.dev/articles/animations-guide):

- CSS 高性能动画三要素:
  - `absolute` position: 脱离文档流, 不会导致其他元素重排或重绘.
  - `opacity`: high performance trigger.
  - `transform`: high performance trigger.
- Animation performance [tier list](http://motion.dev/blog/web-animation-performance-tier-list):
  - All animation: `keyframe` animation or `transitions` is best.
  - JS-based animation: `requestAnimationFrame` is better than `setTimeout`/`setInterval`.
  - Position animation: `transform: translate(npx, npx)` is better than `top`/`right`/`bottom`/`left`.
  - Scale animation: `transform: scale(n)` better than `width`/`height`.
  - Rotation animation: `transform: rotate(deg)` is better.
  - Opacity/visibility animation: `opacity: 0...1` is better.

### Frame

`window.requestAnimationFrame`:

- Reflow: `JavaScript -> Style -> Layout -> Paint -> Composite`.
- Repaint: `Paint -> Composite`.

告诉浏览器希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画.
该方法使用一个回调函数作为参数, 这个回调函数会在浏览器重绘之前调用.

> 若想要在下次重绘时产生另一个动画画面, callback 必须调用 requestAnimationFrame.

```ts
let start = null
const element = document.getElementById('SomeElementYouWantToAnimate')
element.style.position = 'absolute'

function step(timestamp) {
  if (!start)
    start = timestamp

  const progress = timestamp - start
  element.style.left = `${Math.min(progress / 10, 200)}px`

  if (progress < 2000)
    window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
```

### DevTools

[DevTools](https://calibreapp.com/blog/investigate-animation-performance-with-devtools)
for animation performance:

- Slower CPU simulation in `performance` panel.
- Enable paint instrumentation in `performance` panel.
- FPS meter in `rendering` panel.
- Paint flashing in `rendering` panel.
- `layers` panel.

## Imports

`link` is parallel, `@import` isn't parallel.

## References

- CSS optimization [guide](https://kinsta.com/blog/optimize-css).
