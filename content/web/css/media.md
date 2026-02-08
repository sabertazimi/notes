---
sidebar_position: 31
tags: [Web, CSS, Responsive, Media]
---

# Media Query

- Logical operators + media types + media features.
- Only for improving compatibility with older browsers.
- Definition order matters when media query with a different selector.
- JavaScript API: `window.matchMedia()`.

```css
/* screen size : 500px ~ 1000px */
@media only screen and (width >= 500px) and (width <= 1000px) {
  .container {
    width: 750px;
  }
}
```

## Logical

[Logical operators](https://developer.mozilla.org/docs/Web/CSS/@media#logical_operators)

- `only`: only specific media type.
- `not`: negate entire media query.
- `and`: all.
- `,`: any.

[CSS Media Queries Level 4](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4):

```css
@media (height > 600px) {
  body {
    line-height: 1.4;
  }
}

@media (400px <= width <= 700px) {
  body {
    line-height: 1.4;
  }
}
```

## Type

[Media types](https://developer.mozilla.org/docs/Web/CSS/@media#media_types):

| Type                 | Query                                    |
| :------------------- | :--------------------------------------- |
| all                  | 所有设备                                 |
| print                | 文档打印或打印预览模式                   |
| screen               | 彩色电脑屏幕                             |
| **Deprecated Query** |                                          |
| braille              | 盲文                                     |
| embossed             | 盲文打印                                 |
| handheld             | 手持设备                                 |
| projection           | 项目演示, 比如幻灯                       |
| speech               | 演讲                                     |
| tty                  | 固定字母间距的网格的媒体, 比如电传打字机 |
| tv                   | 电视                                     |

## Feature

[Media features](https://developer.mozilla.org/docs/Web/CSS/@media#media_features):

| Feature             | Value                   | Min/Max | Query              |
| :------------------ | :---------------------- | :------ | :----------------- |
| grid                | `<integer>`             | no      | 是否基于格栅的设备 |
| orientation         | `portrait`/`landscape`  | no      | 横屏或竖屏         |
| aspect-ratio        | `<integer>`/`<integer>` | yes     | 渲染界面宽高比例   |
| device-aspect-ratio | `<integer>`/`<integer>` | yes     | 设备屏幕宽高比例   |
| monochrome          | `<integer>`             | yes     | 缓冲器中每像素字节 |
| resolution          | `<resolution>`          | yes     | 分辨率             |
| width               | `<length>`              | yes     | 渲染界面的宽度     |
| height              | `<length>`              | yes     | 渲染界面的高度     |
| device-width        | `<length>`              | yes     | 设备屏幕的输出宽度 |
| device-height       | `<length>`              | yes     | 设备屏幕的输出高度 |
| color               | `<integer>`             | yes     | 每种色彩的字节数   |
| color-index         | `<integer>`             | yes     | 色彩表中的色彩数   |

## Print

```css
@media print {
  header,
  footer {
    display: none;
  }

  table {
    color-adjust: exact;
  }

  h2 {
    break-before: page;
  }
}
```

- Page style standard [specification](https://developer.mozilla.org/docs/Web/CSS/@page).
- PDF style [tutorial](https://www.smashingmagazine.com/2015/01/designing-for-print-with-css).

## Hover

`hover`/`any-hover`:

- `none`.
- `hover`.

```html
<a href="#">Try hovering over me!</a>

<style>
  @media (hover: hover) {
    a:hover {
      background: yellow;
    }
  }

  @media (any-hover: hover) {
    a:hover {
      background: yellow;
    }
  }
</style>
```

## Pointer

`pointer`/`any-pointer`:

- `none`: no pointer device (e.g. phones).
- `coarse`: limited accuracy pointer device (e.g. smart TV, video game consoles).
- `fine`: accurate pointer device (e.g. mouse, touch pads, stylus).

```html
<input id="test" type="checkbox" /> <label for="test">Look at me!</label>

<style>
  input[type='checkbox'] {
    margin: 0;
    appearance: none;
    border: solid;
  }

  input[type='checkbox']:checked {
    background: gray;
  }

  @media (pointer: fine) {
    input[type='checkbox'] {
      width: 15px;
      height: 15px;
      border-color: blue;
      border-width: 1px;
    }
  }

  @media (pointer: coarse) {
    input[type='checkbox'] {
      width: 30px;
      height: 30px;
      border-color: red;
      border-width: 2px;
    }
  }

  @media (any-pointer: fine) {
    input[type='checkbox'] {
      width: 15px;
      height: 15px;
      appearance: none;
      border: 1px solid blue;
    }
  }

  @media (any-pointer: coarse) {
    input[type='checkbox'] {
      width: 30px;
      height: 30px;
      appearance: none;
      border: 2px solid red;
    }
  }
</style>
```

:::tip[Hover and Pointer Query Combination]

| Hover Query | Pointer Query | Device                                 |
| ----------- | ------------- | -------------------------------------- |
| none        | coarse        | smartphones, touch screens             |
| none        | fine          | stylus-based screens                   |
| hover       | coarse        | smart TVs, video game consoles         |
| hover       | fine          | desktop computers, laptops, touch pads |

:::

## Foldable

[`viewport-segments`](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md):

<!-- markdownlint-disable MD013 -->

```css
/* stylelint-disable-next-line media-feature-name-no-unknown */
@media (horizontal-viewport-segments <= 2) and (vertical-viewport-segments <= 1) {
  main article {
    flex: 1 1 env(viewport-segment-width 0 0);
  }

  main aside {
    flex: 1;
  }
}
```

<!-- markdownlint-enable MD013 -->

## Display Mode

[`display-mode`](https://developer.mozilla.org/docs/Web/CSS/@media/display-mode):

- `fullscreen`.
- `standalone`.
- `minimal-ui`.
- `browser`.

```css
@media all and (display-mode: fullscreen) {
  body {
    margin: 0;
    border: 5px solid black;
  }
}
```

## Resolution

[`<resolution>`](https://developer.mozilla.org/docs/Web/CSS/resolution):

- `<number>dpi`.
- `<number>dpcm`.
- `<number>x`/`<number>dppx`: `1dppx` = `96dpi`.

```css
/* Exact resolution */
@media (resolution <= 150dpi) {
  p {
    color: red;
  }
}

/* Minimum resolution */
@media (resolution >= 72dpi) {
  p {
    text-decoration: underline;
  }
}

/* Maximum resolution */
@media (resolution <= 300dpi) {
  p {
    background: yellow;
  }
}
```

## Contrast

`prefers-contrast`:

- `less`.
- `more`.

```css
@media (prefers-contrast: no-preference) {
  html {
    color: #333;
    background-color: #eee;
  }
}

@media (prefers-contrast: more) {
  html {
    color: #000;
    background-color: white;
  }
}

@media (prefers-contrast: less) {
  html {
    color: #555;
    background: conic-gradient(from 90deg at 50% -10%, #bbb, 50%, #999, #bbb);
  }
}
```

## Color Scheme

`prefers-color-scheme`:

- `no-preference`.
- `light`.
- `dark`.

```css
html {
  color-scheme: light dark; /* This site supports both light and dark mode */
}

:root {
  /* light styles */
  color-scheme: var(--color-scheme, light);

  --primary-color: black;
  --primary-background: white;

  /* page preference is "dark" */
  &:has(#color-scheme option[value='dark']:checked) {
    --color-scheme: dark;

    /* any additional dark styles */
    --primary-color: white;
    --primary-background: black;
  }

  /* page preference is "system", and system preference is "dark" */
  @media (prefers-color-scheme: dark) {
    &:has(#color-scheme option[value='system']:checked) {
      --color-scheme: dark;

      /* any additional dark styles, again */
      --primary-color: white;
      --primary-background: black;
    }
  }
}

body {
  color: var(--primary-color);
  background: var(--primary-background);
}
```

```ts
const ColorSchemeStorageItemName = 'preferredColorScheme'

/*
 * If a color scheme preference was previously stored,
 * select the corresponding option in the color scheme preference UI
 * unless it is already selected.
 */
function restoreColorSchemePreference() {
  const colorScheme = localStorage.getItem(ColorSchemeStorageItemName)

  if (!colorScheme) {
    // There is no stored preference to restore
    return
  }

  const option = colorSchemeSelectorEl.querySelector(`[value=${colorScheme}]`)

  if (!option) {
    // The stored preference has no corresponding option in the UI.
    localStorage.removeItem(ColorSchemeStorageItemName)
    return
  }

  if (option.selected) {
    // The stored preference's corresponding menu option is already selected
    return
  }

  option.selected = true
}

/*
 * Store an event target's value in localStorage under ColorSchemeStorageItemName
 */
function storeColorSchemePreference({ target }) {
  const colorScheme = target.querySelector(':checked').value
  localStorage.setItem(ColorSchemeStorageItemName, colorScheme)
}

function main() {
  const colorSchemeSelectorEl = document.querySelector('#color-scheme')

  if (colorSchemeSelectorEl) {
    restoreColorSchemePreference()
    colorSchemeSelectorEl.addEventListener('input', storeColorSchemePreference)
  }
}
```

3 mode switch:

```html
<select name="color-scheme-">
  <option value="system">System</option>
  <option value="light">Forced Light</option>
  <option value="dark">Forced Dark</option>
</select>

<script>
  document.querySelector('color-scheme').addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-force-color-mode', e.target.value)
    localStorage.setItem('preferredColorScheme', e.target.value)
  })

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addListener(() => {
    // Make sure the dropdown is up-to-date based on mediaQuery.matches
  })
</script>

<style>
  :root,
  :root[data-force-color-mode='light'] {
    /* Default Light Mode colors + Forced Light Mode */
    --primary-color: black;
    --primary-background: white;
  }

  /* Dark Color Scheme (System Preference) */
  @media (prefers-color-scheme: dark) {
    :root {
      --primary-color: white;
      --primary-background: black;
    }
  }

  /* Dark Color Scheme (Override) */
  :root[data-force-color-mode='dark'] {
    --primary-color: white;
    --primary-background: black;
  }
</style>
```

## Reduced Motion

`prefers-reduced-motion`:

- `no-preference`.
- `reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    background-attachment: initial !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    animation-duration: 1ms !important;
    animation-delay: -1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

## Scripting

[`scripting`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting):

```css
@media (scripting: enabled) {
  .my-element {
    /* enhanced styles if JS is available */
  }
}

@media (scripting: none) {
  .my-element {
    /* fallback styles when JS is not supported */
  }
}

@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  /* JS available and motion OK */
}

@media (scripting: none), (prefers-reduced-motion) {
  /* JS disabled or reduced motion enabled */
}
```

## APIs

Media query [`matchMedia`](https://developer.mozilla.org/docs/Web/API/Window/matchMedia):

```ts
// https://developer.mozilla.org/docs/Web/API/MediaQueryList
const mql = window.matchMedia(mediaQueryString)
```

```ts
if (window.matchMedia('(min-width: 400px)').matches) {
  /* the view port is at least 400 pixels wide */
} else {
  /* the view port is less than 400 pixels wide */
}
```

[Respond to media query changes](https://polypane.app/blog/the-complete-guide-to-css-media-queries/#using-media-queries-in-javascript):

```ts
const match = window.matchMedia('(min-width: 400px)')

match.addEventListener('change', (e) => {
  if (e.matches) {
    /* do a thing */
  } else {
    /* do another thing */
  }
})
```

:::tip[Support Detection]

Detecting media query support in CSS:

```css
@media not all and (prefers-reduced-data), (prefers-reduced-data) {
  .text {
    color: blue;
  }
}
```

- No support:
  not all and (prefers-reduced-data): false,
  (prefers-reduced-data): false,
  Combined: false.
- Support, but off:
  not all and (prefers-reduced-data): true,
  (prefers-reduced-data): false,
  Combined: true.
- Support, and on:
  not all and (prefers-reduced-data): false,
  (prefers-reduced-data): true,
  Combined: true.

Detecting media query support in JavaScript:

```ts
const query = '(prefers-reduced-data)'

// window.matchMedia(query).media return 'not all' or original query string
const resolvedMediaQuery = window.matchMedia(query).media

const isSupported = query === resolvedMediaQuery
```

:::
