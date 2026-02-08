---
sidebar_position: 33
tags: [Web, CSS, Responsive, Supports]
---

# Supports

## Feature Query

[`@supports`](https://developer.mozilla.org/docs/Web/CSS/@supports):

```css
@supports (transform-origin: 5% 5%) {
  .text {
    font-size: 1rem;
  }
}

@supports selector(A > B) {
  .text {
    font-size: 1rem;
  }
}

@supports not (not (transform-origin: 2px)) {
  .text {
    font-size: 1rem;
  }
}

@supports (display: grid) and (not (display: inline-grid)) {
  .text {
    font-size: 1rem;
  }
}

@supports (display: table-cell) and (display: flex) and (display: contents) {
  .text {
    font-size: 1rem;
  }
}

@supports (transform-style: preserve) or (-moz-transform-style: preserve) or (-o-transform-style: preserve) or
  (-webkit-transform-style: preserve) {
  .text {
    font-size: 1rem;
  }
}
```

## APIs

[`CSS.supports()`](https://developer.mozilla.org/docs/Web/API/CSS/supports):

```ts
const result = CSS.supports('text-decoration-style', 'blink')
const result = CSS.supports('display: flex')
const result = CSS.supports('(--foo: red)')
const result = CSS.supports(`
  (transform-style: preserve) or (-moz-transform-style: preserve) or
  (-o-transform-style: preserve) or (-webkit-transform-style: preserve)
`)
```
