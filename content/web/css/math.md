---
sidebar_position: 6
tags: [Web, CSS, Math]
---

# Math

## Calc

[`calc()`](https://developer.mozilla.org/docs/Web/CSS/calc):

- 支持多种数据类型:
  `<length>`/`<frequency>`/`<angle>`/`<time>`/`<percentage>`/`<number>`/`<integer>`.
- 支持加减乘除 4 种运算.
- 运算符前后带单位或者带百分号的值只能进行加减运算, 不能进行乘除运算.
- 加号和减号两侧一定要有空格, 乘号和除号两侧无须空格.
- 结合 `CSS Variables`, 拥有强大功能与可维护性.

```css
html {
  font-size: calc(16px + 2 * (100vw - 375px) / 39);
}

.button {
  width: calc(100% - 20px);
}

.list {
  --size: calc(100% - 2rem);

  width: calc(var(--size) / 6);
}
```

:::caution[Broken Calculation]

If `calc()` result breaks,
check cache plugin or build tool.
Some tools like to remove whitespace always
lead to broken `calc()` addition and subtraction operator.

:::

## Min and Max

[Flexible size](https://www.youtube.com/watch?v=8slZJrTK3nE):

```css
.box {
  width: min(100vw - 3rem, 80ch);
  width: max(10px * 10, 10em);
  width: min(calc(10px * 10), 10em);
  width: max(10px * 10, var(--width));
  margin-block-start: min(4rem, 8vh);
}
```

```css
.legacy-container {
  width: 100%;
  max-width: 1024px;
}

.modern-container {
  width: min(100%, 1024px);
}
```

```css
.legacy-container {
  width: 100%;
  min-width: 768px;
}

.modern-container {
  width: max(100%, 768px);
}
```

## Clamp

[Fluid size](https://github.com/codeAdrian/modern-fluid-typography-editor):

```css
.clamp {
  width: max(75px, min(25vw, 125px));
  width: clamp(30ch, 80%, 80ch);
  padding: clamp(1rem, 3%, 1.5rem);
  margin-bottom: clamp(4px, 6.5vh, 5.5rem);
  font-size: clamp(2.25rem, 2vw + 1.5rem, 3.25rem);
  text-indent: clamp(15px, 10%, 1.5rem);
  letter-spacing: clamp(0.1rem, 1.5vw, 0.5rem);
}
```

Generate fluid size for [`Tailwind.css`](https://davidhellmann.com/blog/development/tailwindcss-fluid-typography-with-css-clamp):

```ts
const settings = {
  typography: {
    fontSizeMin: 1.125,
    fontSizeMax: 1.25,
    msFactorMin: 1.125,
    msFactorMax: 1.2,
    lineHeight: 1.6,
  },
  screensRem: {
    'min': 20,
    'sm': 40,
    'md': 48,
    'lg': 64,
    'xl': 80,
    '2xl': 96,
  },
  grid: {
    cols: 24,
  },
}

const remToPx = rem => `${rem * 16}px`

const screens = {
  'sm': remToPx(settings.screensRem.sm),
  'md': remToPx(settings.screensRem.md),
  'lg': remToPx(settings.screensRem.lg),
  'xl': remToPx(settings.screensRem.xl),
  '2xl': remToPx(settings.screensRem['2xl']),
}

const fsMin = settings.typography.fontSizeMin
const fsMax = settings.typography.fontSizeMax
const msFactorMin = settings.typography.msFactorMin
const msFactorMax = settings.typography.msFactorMax
const screenMin = settings.screensRem.min
const screenMax = settings.screensRem['2xl']

function calcMulti(multiMin = 0, multiMax = null) {
  return {
    fsMin: fsMin * msFactorMin ** multiMin,
    fsMax: fsMax * msFactorMax ** (multiMax || multiMin),
  }
}

function clamp(multiMin = 0, multiMax = null) {
  const _calcMulti = calcMulti(multiMin, multiMax || multiMin)
  const _fsMin = _calcMulti.fsMin
  const _fsMax = _calcMulti.fsMax
  const _calc = `calc(${_fsMin}rem + (${_fsMax} - ${_fsMin}) * ((100vw - ${screenMin}rem) / (${screenMax} - ${screenMin})))`
  return `clamp(${_fsMin}rem, ${_calc}, ${_fsMax}rem)`
}

const fontSize = {
  'xs': clamp(-2),
  'sm': clamp(-1),
  'base': clamp(0),
  'lg': clamp(1),
  'xl': clamp(2),
  '2xl': clamp(3),
  '3xl': clamp(4),
  '4xl': clamp(5),
  '5xl': clamp(6),
  '6xl': clamp(7),
  '7xl': clamp(8),
  '8xl': clamp(9),
  '9xl': clamp(10),
}

module.exports = {
  theme: {
    screens,
    fontSize,
  },
}
```

```css
:root {
  /* Fluid type scale */
  --size-step-minus-2: clamp(0.6944rem, 0.6376rem + 0.284vi, 0.84rem);
  --size-step-minus-1: clamp(0.8333rem, 0.7488rem + 0.4228vi, 1.05rem);
  --size-step-0: clamp(1rem, 0.878rem + 0.6098vi, 1.3125rem);
  --size-step-1: clamp(1.2rem, 1.028rem + 0.8598vi, 1.6406rem);
  --size-step-2: clamp(1.44rem, 1.2016rem + 1.1918vi, 2.0508rem);
  --size-step-3: clamp(1.728rem, 1.402rem + 1.6302vi, 2.5635rem);
  --size-step-4: clamp(2.0736rem, 1.6323rem + 2.2063vi, 3.2043rem);
  --size-step-5: clamp(2.4883rem, 1.8963rem + 2.9602vi, 4.0054rem);
  --size-step-6: clamp(2.986rem, 2.1974rem + 3.943vi, 5.0068rem);
  --size-step-7: clamp(3.5832rem, 2.5392rem + 5.2201vi, 6.2585rem);

  /* Fluid space scale */
  --space-3xs: clamp(0.25rem, 0.2256rem + 0.122vi, 0.3125rem);
  --space-2xs: clamp(0.5rem, 0.4268rem + 0.3659vi, 0.6875rem);
  --space-xs: clamp(0.75rem, 0.6524rem + 0.4878vi, 1rem);
  --space-s: clamp(1rem, 0.878rem + 0.6098vi, 1.3125rem);
  --space-m: clamp(1.5rem, 1.3049rem + 0.9756vi, 2rem);
  --space-l: clamp(2rem, 1.7561rem + 1.2195vi, 2.625rem);
  --space-xl: clamp(3rem, 2.6341rem + 1.8293vi, 3.9375rem);
  --space-2xl: clamp(4rem, 3.5122rem + 2.439vi, 5.25rem);
  --space-3xl: clamp(6rem, 5.2683rem + 3.6585vi, 7.875rem);
}
```

Create fluid typography with [`clamp()`](https://www.sitepoint.com/fluid-typography-css-clamp-function):

- Calculating factor:
  factor = `(max-value - min-value ) / (max-viewport-width - min-viewport-width)`.
- Calculating relative value:
  relative-value = `min-value - min-viewport-width * factor`.
- Calculating preferred value:
  fluid-value (`vw`) = `100vw * factor`.

```css
.fluid-typography {
  --fluid-value: clamp(min-value, relative-value + fluid-value, max-value);
}
```
