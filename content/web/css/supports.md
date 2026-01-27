---
sidebar_position: 33
tags: [Web, CSS, Responsive, Supports]
---

# Supports

## Feature Query

[`@supports`](https://developer.mozilla.org/docs/Web/CSS/@supports):

```css
@supports (transform-origin: 5% 5%) {
  font-size: 1rem;
}

@supports selector(A > B) {
  font-size: 1rem;
}

@supports not (not (transform-origin: 2px)) {
  font-size: 1rem;
}

@supports (display: grid) and (not (display: inline-grid)) {
  font-size: 1rem;
}

@supports (display: table-cell) and (display: flex) and (display: contents) {
  font-size: 1rem;
}

@supports (transform-style: preserve) or (-moz-transform-style: preserve) or (-o-transform-style: preserve) or
  (-webkit-transform-style: preserve) {
  font-size: 1rem;
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
