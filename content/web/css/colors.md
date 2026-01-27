---
sidebar_position: 5
tags: [Web, CSS, Color]
---

# Colors

## Current

[`currentcolor`](https://css-tricks.com/currentcolor):

- `currentcolor` 变量使用当前 `color` 计算值.
- `border-color`/`outline-color`/`caret-color`/`text-shadow`/`box-shadow`
  默认表现为 `currentcolor`.

## Accent

[`accent-color`](https://developer.mozilla.org/docs/Web/CSS/accent-color):

Change user-interface controls accent color.

## HSL

[`hsl()`](https://developer.mozilla.org/docs/Web/CSS/color_value/hsl):

- H: hue.
- S: saturation (stay `50%` etc.).
- L: lightness (easy to theme colors).

Change `hue` to get color palette:

- Complement `hue`: `180deg`, `brand` and `secondary` color.
- Mix `hue` to get [natural color](https://tallys.github.io/color-theory).

Change `lightness`to get color palette:

- Decease `lightness` to get `:hover`/`:focus` color.
- Increase `lightness` to get `secondary`/`ghost` color.

```css
/* Hover Button */
:root {
  --primary-h: 221;
  --primary-s: 72%;
  --primary-l: 62%;
}

.button {
  background-color: hsl(var(--primary-h) var(--primary-s) var(--primary-l));
}

.button:hover,
.button:focus {
  --primary-l: 54%;
}

.button-secondary {
  --primary-l: 90%;

  color: #222;
}

.button-ghost {
  --primary-l: 90%;

  background-color: transparent;
  border: 3px solid hsl(var(--primary-h) var(--primary-s) var(--primary-l));
}
```

Change `lightness` to get gradient color:

```css
.section {
  background: linear-gradient(
    to left,
    hsl(var(--primary-h) var(--primary-s) var(--primary-l)),
    hsl(var(--primary-h) var(--primary-s) 95%)
  );
}

.section-2 {
  --primary-h: 167;
}
```

## HWB

[`hwb(H W B [/ A])`](https://developer.mozilla.org/docs/Web/CSS/color_value/hwb):

- `H`: hue (`<angle>`).
- `W`: whiteness (`<percentage>`).
- `B`: blackness (`<percentage>`).
- `A`: alpha (`<percentage>`).

## LCH

[`oklch()`](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl):

- Better readability.
- Simple color modifications.
- Relative colors.
- P3 colors.
- Better communication with design teams.

```bash
pnpm dlx convert-to-oklch ./src/**/*.css
```

```css
/* Simple color modifications */
.text {
  /* ERROR: a 20% lightness difference is not sufficient for good contrast and a11y */
  color: oklch(100% 0 0deg);
  background: oklch(80% 0.02 300deg);
}

.error {
  /* ERROR: colors have a slightly different hue */
  color: oklch(50% 0.19 27deg);
  background: oklch(90% 0.04 30deg);
}

.button {
  background: oklch(50% 0.2 260deg);
}

.button:hover {
  background: oklch(60% 0.2 260deg);
}
```

```css
/* Relative colors */
button {
  background: var(--button-color);
}

button:hover {
  /* One :hover for normal, secondary, and error states */
  background: oklch(from var(--button-color) calc(l + 0.1) c h);
}

button[variant='accent'] {
  --button-color: var(--accent);
}

button[variant='sceondary'] {
  --button-color: var(--dimmed);
}

button[variant='error'] {
  --button-color: var(--error);
}
```

```css
/* P3 colors */
.buy-button {
  background: oklch(62% 0.19 145deg);
}

@media (color-gamut: p3) {
  .buy-button {
    background: oklch(62% 0.26 145deg);
  }
}
```

## Scheme

[`color-scheme`](https://developer.mozilla.org/docs/Web/CSS/color-scheme):

```css
:root {
  color-scheme: normal;
  color-scheme: light dark;
  color-scheme: light;
  color-scheme: dark;
}
```

## Mix

Creating color palettes with [`color-mix()`](https://developer.mozilla.org/en-US/blog/color-palettes-css-color-mix):

```css
:root {
  --yellow: rgb(221 215 141);
  --peach: rgb(220 191 133);
  --chocolate: rgb(139 99 92);
  --khaki: rgb(96 89 77);
  --grey: rgb(147 162 155);
  --mix-warm: red;
  --mix-cool: blue;
}

.palette > div {
  --color: var(--yellow);

  background: color-mix(in srgb, var(--color), var(--mix, var(--color)) var(--amount, 10%));

  &:nth-child(2) {
    --color: var(--peach);
  }

  &:nth-child(3) {
    --color: var(--chocolate);
  }

  &:nth-child(4) {
    --color: var(--khaki);
  }

  &:nth-child(5) {
    --color: var(--grey);
  }
}

.cool {
  --mix: var(--mix-cool);
}

.cool-20 {
  --amount: 20%;
}

.warm {
  --mix: var(--mix-warm);
}

.warm-20 {
  --amount: 20%;
}
```

## References

- CSS color module level 5 [guide](https://blog.logrocket.com/exploring-css-color-module-level-5):
  - hwb.
  - lab.
  - lch.
  - color-mix.
  - color-contrast.
  - color.
  - accent-color.
- CSS `color` [value](https://developer.mozilla.org/docs/Web/CSS/color_value).
