---
sidebar_position: 52
tags: [Web, CSS, Toolchain, PostCSS, StyleLint, Tailwind]
---

# Toolchain

## PostCSS

- PostCSS [modern preset](https://github.com/csstools/postcss-plugins)

### Vendor Prefix

CSS vendor prefix order:

- `-moz-` rule.
- `-ms-` rule.
- `-o-` rule.
- `-webkit-` rule.
- Standard rule.

### Normalize

[Minimal](https://meiert.com/blog/a-minimal-css-starter):

```css
html {
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
  text-wrap: pretty;
}

::selection,
::target-text {
  color: #fff;
  background: #000;
}

@view-transition {
  navigation: auto;
}
```

[Modern](https://github.com/sindresorhus/modern-normalize):

```css
html,
body {
  box-sizing: border-box;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 100%;
}

body {
  min-height: 100vh;
  line-height: 1.5;
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

input,
textarea,
img,
video,
object {
  box-sizing: border-box;
  max-inline-size: 100%;
  max-width: 100%;
  block-size: auto;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  padding: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
  appearance: none;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

[Reset](https://vale.rocks/posts/css-reset) user-agent [styles](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/html/resources/html.css):

```css
@layer {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    background-repeat: no-repeat;
  }

  * {
    padding: 0;
    margin: 0;
  }

  html {
    block-size: 100%;
    line-height: 1.5;
    text-size-adjust: none;
    -webkit-font-smoothing: antialiased;
  }

  body {
    min-block-size: 100%;
  }

  img,
  iframe,
  audio,
  video,
  canvas {
    display: block;
    max-inline-size: 100%;
    block-size: auto;
  }

  svg {
    max-inline-size: 100%;
  }

  svg:not([fill]) {
    fill: currentcolor;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  textarea {
    resize: vertical;
  }

  fieldset,
  iframe {
    border: none;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  p {
    font-variant-numeric: proportional-nums;
    text-wrap: pretty;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-variant-numeric: lining-nums;
  }

  p,
  blockquote,
  q,
  figcaption,
  li {
    hanging-punctuation: first allow-end last;
  }

  input,
  label,
  button,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  math,
  time,
  table {
    font-variant-numeric: tabular-nums lining-nums slashed-zero;
  }

  code {
    font-variant-numeric: slashed-zero;
  }

  table {
    border-collapse: collapse;
  }

  abbr {
    font-variant-caps: all-small-caps;
    text-decoration: none;

    &[title] {
      text-decoration: underline dotted;
      cursor: help;
    }
  }

  sup,
  sub {
    line-height: 0;
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  :focus-visible {
    outline-offset: 0.2rem;
  }
}
```

### Feature Detection

```html
<script>
  if (window.CSSPropertyRule) {
    const root = document.documentElement
    root.classList.add('supports-at-property')
  }
</script>

<style>
  .supports-at-property optgroup {
    font-size: 0;
  }
</style>
```

## StyleLint

`stylelint-config-mass` plugin `index.js`:

```ts
module.exports = {
  extends: ['stylelint-config-sass-guidelines'],
  rules: {
    'order/properties-order': [
      // Positioning
      'position',
      'z-index',
      'top',
      'right',
      'bottom',
      'left',
      // Box model
      'box-sizing',
      'display',
      'visibility',
      'opacity',
      'mix-blend-mode',
      'isolation',
      'float',
      'clear',
      // Layout
      'flex',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-wrap',
      'grid',
      'grid-template',
      'grid-area',
      'grid-row',
      'grid-column',
      'gap',
      'place-content',
      'align-content',
      'align-items',
      'align-self',
      'justify-content',
      'justify-items',
      'justify-self',
      'order',
      // Column
      'columns',
      'column-count',
      'column-width',
      'column-gap',
      'column-rule',
      'column-span',
      // Animation
      'transform',
      'transform-origin',
      'perspective',
      'backface-visibility',
      'transition',
      'animation',
      // Sizing
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'overflow',
      'resize',
      // Spacing
      'margin',
      'padding',
      // Border
      'border',
      'border-radius',
      'outline',
      'box-shadow',
      // Table
      'list-style',
      'table-layout',
      'border-collapse',
      'border-spacing',
      // Visual
      'background',
      'cursor',
      'color',
      // Typography
      'font',
      'line-height',
      'text-align',
      'text-decoration',
      'text-shadow',
      // Generated content
      'content',
      'quotes',
      'counter-reset',
      'counter-increment',
      // Miscellaneous
      'pointer-events',
      'will-change',
    ],
    'order/properties-alphabetical-order': null,
    'selector-class-pattern': [
      '^[a-z0-9\\-\\_]+$',
      {
        message:
          'Selector should be written in lowercase with hyphens (selector-class-pattern)',
      },
    ],
  },
}
```

`StyleLint` plugins:

- Ignored invalid properties [checker](https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties).
- CSS syntax [validator](https://github.com/csstree/stylelint-validator).

## Tailwind

### Configuration

:::caution[JIT Mode]

Missing `.html`/`.tsx`/`.vue` directory will lead to class purged.

:::

### Preflight

`@import 'tailwindcss'` [injects](https://github.com/tailwindlabs/tailwindcss/discussions/17324):

```css
@layer theme, base, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css' layer(utilities);
```

### Directives

```css
@layer base {
  h1 {
    @apply text-3xl;
  }
}

@layer components {
  .primary-btn {
    @apply bg-yellow-600 hover:bg-yellow-800 text-black font-bold py-4 px-6 shadow-md;
  }
}
```
