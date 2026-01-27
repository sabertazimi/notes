---
sidebar_position: 23
tags: [Web, CSS, Shadow]
---

# Shadow

## Text Shadow

[`text-shadow](https://developer.mozilla.org/docs/Web/CSS/text-shadow):

- `none`.
- `<shadow-text>#`: `<length>{2,3} && <color>?`.
  - 支持多重阴影.
  - 不支持内阴影.
  - `<length>{2,3}`: 不支持扩展阴影 `offset-x offset-y blur-radius`.
  - `<color>?`: default `revert` (user agent color).

```css
:root {
  --colo: #c0c0c0;
  --br-shadow: -6px 6px 15px rgb(0 0 0 / 50%);
  --tl-shadow: 6px -6px 15px rgb(255 255 255/80%);
}

body {
  background: var(--color);
}

/* 新拟物文字 */
.neumorphic-text {
  color: var(--color);
  text-shadow: var(--br-shadow), var(--tl-shadow);
}

/* 印刷文字 */
.press-text {
  color: hsl(210deg 13% 75%);
  text-shadow: 0 -1px 1px black;
  background: hsl(210deg 13% 40%);
}

/* 描边文字 */
.stroked-text {
  color: white;
  text-shadow:
    1px 1px black,
    -1px -1px black,
    1px -1px black,
    -1px 1px black;
}

/* 发光文字 */
.glow-text {
  color: #ffc;
  text-shadow:
    0 0 0.1em,
    0 0 0.3em;
  background: #203;
}

/* 凸起文字 */
.extruded-text {
  color: white;
  text-shadow:
    0 1px hsl(0deg 0% 85%),
    0 2px hsl(0deg 0% 80%),
    0 3px hsl(0deg 0% 75%),
    0 4px hsl(0deg 0% 70%),
    0 5px hsl(0deg 0% 65%),
    0 5px 10px black;
  background: #58a;
}

/* 复古文字 */
.retro-text {
  color: white;
  text-shadow:
    1px 1px black,
    2px 2px black,
    3px 3px black,
    4px 4px black,
    5px 5px black,
    6px 6px black,
    7px 7px black,
    8px 8px black;
  background: hsl(0deg 50% 45%);
}
```

## Box Shadow

[`box-shadow`](https://developer.mozilla.org/docs/Web/CSS/box-shadow):

- `none`.
- `<shadow>#`: `inset? && <length>{2,4} && <color>?`.
  - 支持多重阴影.
  - `inset?`: 支持内阴影.
  - `<length>{2,4}`: 支持扩展阴影 `offset-x offset-y blur-radius spread-radius`.
  - `<color>?`: default `currentcolor` (text computed color).

```css
.box {
  /* offset-x | offset-y | blur-radius | color */
  box-shadow: 10px 5px 5px black;

  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 2px 1px rgb(0 0 0 / 20%);
}
```

### Side Shadow

Bottom side box shadow:

```css
.box {
  box-shadow: 0 5px 4px -4px black;
}
```

Right and bottom sides box shadow:

```css
.box {
  box-shadow: 3px 3px 6px -3px black;
}
```

Two opposite sides box shadow:

```css
.box {
  box-shadow:
    5px 0 5px -5px black,
    -5px 0 5px -5px black;
}
```

### Inset Shadow

模拟边框:

```css
.button-ghost {
  background-color: #fff;

  /* 模拟边框: 左 右 上 下 */
  box-shadow:
    inset 1px 0 #a2a9b6,
    inset -1px 0 #a2a9b6,
    inset 0 1px #a2a9b6,
    inset 0 -1px #a2a9b6;
}
```

模拟背景:

```css
.button:active {
  box-shadow: inset 0 0 0 999px rgb(0 0 0 / 10%);
}
```

### Neumorphic Shadow

[Neumorphic box shadow](https://codepen.io/myacode/pen/PoqQQNM):

```css
.neumorphic {
  box-shadow:
    -10px -10px 15px rgb(255 255 255 / 50%),
    10px 10px 15px rgb(70 70 70 / 12%);
}

.neumorphic:active {
  box-shadow:
    inset -10px -10px 15px rgb(255 255 255 / 50%),
    inset 10px 10px 15px rgb(70 70 70 / 12%);
}
```
