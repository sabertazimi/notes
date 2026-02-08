---
sidebar_position: 42
tags: [Web, CSS, Animation]
---

# Animation

## Properties

[`animation` formal syntax](https://developer.mozilla.org/docs/Web/CSS/animation#formal_syntax):

- `animation-name`.
- `animation-duration`.
- `animation-timing-function`:
  [`<easing-function>`](./transition.md#timing-function).
- `animation-delay`:
  支持负值.
- `animation-iteration-count`:
  - `infinite | <number>` 执行次数.
  - 支持 `0` 与小数.
  - 不支持负值.
- `animation-direction`:
  - `normal`: `0%->100%` 方向.
  - `reverse`: `100%->0%` 方向.
  - `alternate`/`alternate-reverse`: 不断交替方向.
- `animation-fill-mode`:
  `forwards`/`backwards`/`both`.
- `animation-play-state`:
  `paused`/`running`.

```css
@media only screen and (prefers-reduced-motion: reduce) {
  .element {
    animation: none;
  }
}
```

## Fill Mode

[`animation-fill-mode`](https://developer.mozilla.org/docs/Web/CSS/animation-fill-mode):

- `forwards`: 动画结束后, 应用动画最后一帧属性值.
- `backwards`: 动画开始前, 应用动画第一帧属性值.
- `both`: 同时应用上述两种效果.

| `animation-direction`         | `animation-iteration-count` | last keyframe |
| ----------------------------- | --------------------------- | ------------- |
| `normal`                      | even or odd                 | 100%          |
| `reverse`                     | even or odd                 | 0%            |
| `alternate`                   | even                        | 0%            |
| `alternate`                   | odd                         | 100%          |
| `alternate-reverse`           | even                        | 100%          |
| `alternate-reverse`           | odd                         | 0%            |
| `normal`/`alternate`          | 0                           | 0%            |
| `reverse`/`alternate-reverse` | 0                           | 100%          |

| animation-direction           | first keyframe |
| ----------------------------- | -------------- |
| `normal`/`alternate`          | 0%             |
| `reverse`/`alternate-reverse` | 100%           |

## Play State

利用 `animation-paly-state`
与 JavaScript 添加 `.animate` 类控制动画开始和停止.

```css
div {
  animation-play-state: paused;
}

:checked ~ div {
  animation-play-state: running;
}
```

```css
@media only screen and (prefers-reduced-motion: reduce) {
  .to-animate {
    animation: none;
  }
}

.to-animate {
  animation: animationName 1.5s linear;
  animation-iteration-count: infinite;
  animation-play-state: paused;
}

.animate {
  animation-play-state: running;
}
```

```ts
element.classList.add('animate')
setTimeout(() => element.classList.remove('animate'), duration)
```

## Timeline

Implement [scroll-driven animation](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css)
with CSS `animation-timeline`:

- `scroll()` timeline.
- `view()` timeline.

```css
@media not (prefers-reduced-motion) {
  footer::after {
    position: fixed;
    inset-inline-start: 0;
    bottom: 0;
    width: 100%;
    height: 1em;
    content: '';
    transform-origin: top left;
    animation: grow-progress linear;
    animation-timeline: scroll();
  }

  @keyframes grow-progress {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }
}
```

```css
@media not (prefers-reduced-motion) {
  img {
    animation: slide-in;
    animation-timeline: view();
    animation-range: 0% 50%;
  }

  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }

    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }
}
```

## Offset

[`offset`](https://developer.mozilla.org/docs/Web/CSS/offset),
animating an element along a defined path:

- [`offset-position`](https://developer.mozilla.org/docs/Web/CSS/offset-position).
- [`offset-path`](https://developer.mozilla.org/docs/Web/CSS/offset-path).
- [`offset-distance`](https://developer.mozilla.org/docs/Web/CSS/offset-distance).
- [`offset-rotate`](https://developer.mozilla.org/docs/Web/CSS/offset-rotate).
- [`offset-anchor`](https://developer.mozilla.org/docs/Web/CSS/offset-anchor).

```css
.path {
  /* Offset position */
  offset: auto;
  offset: 10px 30px;
  offset: none;

  /* Offset path */
  offset: ray(45deg closest-side);
  offset: url('arc.svg');
  offset: path('M 100 100 L 300 100 L 200 300 z');

  /* Offset path with distance and/or rotation */
  offset: url('circle.svg') 100px;
  offset: url('circle.svg') 40%;
  offset: url('circle.svg') 30deg;
  offset: url('circle.svg') 50px 20deg;

  /* Including offset anchor */
  offset: ray(45deg closest-side) / 40px 20px;
  offset: url('arc.svg') 2cm / 0.5cm 3cm;
  offset: url('arc.svg') 30deg / 50px 100px;
}
```

## Patterns

### FLIP

- First: 初始状态.
- Last: 动画结束状态.
- Invert: last 至 first 的 `transform` 属性.
- Play: `transition: transform .2s linear`.

```css
@media only screen and (prefers-reduced-motion: reduce) {
  .scale-up {
    transition: none;
  }
}

/* first: scale(1), last: scale(1.2) */
.scale-up {
  transform: scale(0.8);
  transition: transform 0.2s linear;
}

.scale-up:hover,
.scale-up:focus {
  transform: none;
}
```

### Bounce Cache

- First `-100`.
- Then `+5`/`+20`.
- Finally `0`.
- 切换动画时, 需要先把之前的动画清除: 防止出现闪烁 Bug.

### Helpers

- `opacity`.
- `overflow: hidden`.
- `transform`: `scale`/`translate`.
- `transition`.
- `animation-delay`.
- `width`/`height`
- `max-width`/`max-height`.
- `margin`.
- `border-*`.
- `background`.
- `background-position`.
- `background` with multiple `gradient`.
- Single `box-shadow`
- Multiple `box-shadow`.
- `*-clip-*`.
- `mask-*`.
- `filter`.
- `backdrop-filter`.
- Pseudo element (`::before`/`::after`).
- Pseudo class (`:hover`/`:focus`/`:target`).
- Changing `top`/`right`/`bottom`/`left` of pseudo element
  can change animation start point:
  e.g. `bottom: 0, right: 0` change `width`/`height` from `0` to `100%`,
  size animation will start from `bottom-right` corner.

```css
.animation-container {
  z-index: -1;
  overflow: hidden;
}
```

```css
/* 直接动画 */
.div {
  animation-name: name;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  animation-delay: 0.5s;
}

/* hover 后再播放动画, 高级化 transform + transition */
.div:hover,
.div:focus {
  animation-name: name;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  animation-delay: 0.5s;
}
```

## APIs

DOM events:

- `animationiteration`: triggered after each animation iteration.
- `animationend`: triggered after an animation completes.
- `animationstart`: triggered at the start of an animation.

## GreenSock Animation Platform

### Tween

```ts
import { gsap } from 'gsap'

gasp.fromTo(element, 1, { x: 0 }, { x: 100 })
```

### Flip

Responsive [grid layout transitions](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip):

```ts
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)
let animated = false

triggerButton.addEventListener('click', () => {
  // Lock animation state
  animated = true

  // Capture the current position and size of all grid items
  const state = Flip.getState(allGridItem)

  // Animate elements from the previous state to the new layout
  Flip.from(state, {
    duration: 0.8,
    ease: 'expo.inOut',
    onComplete: () => {
    // Unlock animation after completion
      animated = false
    },
  })
})
```

## References

- Animatable CSS [properties](https://developer.mozilla.org/docs/Web/CSS/CSS_animated_properties).
- Animation 101 [guide](https://github.com/cssanimation/css-animation-101).
- Animation performance [tier list](http://motion.dev/blog/web-animation-performance-tier-list).
