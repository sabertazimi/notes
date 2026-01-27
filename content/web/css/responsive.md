---
sidebar_position: 30
tags: [Web, CSS, Responsive]
---

# Responsive Design

[Responsive web design](https://alistapart.com/article/responsive-web-design):

- [Mobile first](https://alistapart.com/article/mobile-first-css-is-it-time-for-a-rethink):
  `@media only screen and (min-width: 768px)`.
- Media query.
- Fluid layout.
- Flexible image.

## Viewport

Disable mobile browser auto scale:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Font

- `rem`/`em` font size.

## Length

- `vw`.
- `vh`.
- `vmin`: `min(vw, vh)`.
- `vmax`: `max(vw, vh)`.

## Text

[Responsive font size](https://zellwk.com/blog/rem-vs-em);

- Size in `em` if the property scales according to it's `font-size`:
  e.g. button `padding`.
- **Modular font size**:
  Size in `em` if the `font-size` should be modular
  (relative to it's context/parent).
- Size **everything else** in `rem` (include `@media` queries).

```css
/* scales to self font-size */
.container {
  margin-top: 1.2em;
}
```

```css
/* modular font size */
.container {
  font-size: 1.2rem;
}

.container p {
  font-size: 1em;
}

.container small {
  font-size: 0.9em;
}
```

## Box

- `min-height`.
- `max-height`.
- `min-width`.
- `max-width`.

```css
/* responsive images */
img {
  display: block;
  max-width: 100%;
}
```

:::caution[Image Display]

Image `display` set to `inline` default.

:::

## Inline

use `inline-box` with `width`

```css
.element {
  display: inline-block;
  width: 80%;
}
```

## Flex

```css
.box {
  display: flex;
  flex-wrap: wrap;
}

.box > .item {
  flex: 1;
}
```

## Grid

```css
.box {
  display: grid;
  grid-template-areas:
    'hd'
    'st1'
    '.'
    'st2'
    '.';
  grid-template-columns: 1fr;
}

@media only screen and (width >= 768px) {
  .box {
    grid-template-areas:
      'hd hd'
      'st1 .'
      '. st2';
    grid-template-columns: 1fr 1fr;
  }
}

@media only screen and (width >= 1280px) {
  .box {
    grid-template-areas:
      'hd hd hd'
      'st1 . st2'
      'st1 . st2';
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media only screen and (width >= 1536px) {
  .box {
    grid-template-areas:
      'hd st1 . st2'
      'hd st1 . st2';
    grid-template-columns: 20% 1fr 1fr 1fr;
  }
}
```

## Image

```css
.responsive-image {
  display: block;
  max-width: 100%;
  height: auto;
}
```

```html
<picture>
  <source srcset="mdn-logo-wide.png" media="(min-width: 600px)" />
  <img src="mdn-logo-narrow.png" alt="MDN" />
</picture>

<img
  src="x-small.png"
  srcset="x-small.png 300w, small.png 400w, medium.png 600w, large.png 800w, x-large.png 1200w"
  sizes="
    (min-width: 70em) 12.6875em,
    (min-width: 50em) calc(25vw * 0.95 - 2.75em),
    (min-width: 35em) calc(95vw / 2 - 4.125em),
    calc(95vw - 1.375em)
  "
  alt="Dummy Image"
/>
```

## Table

```css
table {
  width: 100%;
}

@media (width <= 30em) {
  table,
  thead,
  tbody,
  tr,
  th,
  td {
    display: block;
  }

  tr {
    margin-bottom: 1em;
  }

  /* 隐藏表头 */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
}
```
