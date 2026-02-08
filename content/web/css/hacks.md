---
sidebar_position: 62
tags: [Web, CSS, Internals]
---

# Hacks

## Property

利用低版本浏览器无法识别新的属性值:

```css
.loading {
  background: url('/images/loading.gif');
  background: url('/images/loading.png'), linear-gradient(transparent, transparent);
}

.shadow {
  border: 1px solid #ddd;
  border: 1px solid rgb(0 0 0 / 0%);
  box-shadow: 2px 2px;
}
```

## Selector

利用低版本浏览器无法识别新的选择器 (`,`):

```css
/* Webkit */
:-webkit-any(tag-not-found),
.class {
  font-size: 1rem;
}

/* Firefox */
tag-not-found::-moz-progress-bar,
.class {
  font-size: 1rem;
}

/* Chromium Edge */
tag-not-found::-ms-any,
.class {
  font-size: 1rem;
}

/* IE9+ */
:checked,
:disabled,
tag-not-found::before,
tag-not-found::after,
tag-not-found::selection,
.class {
  font-size: 1rem;
}

/* IE10+ */
:valid,
:invalid,
:required,
:optional,
.class {
  font-size: 1rem;
}

/* IE11+ */
tag-not-found::backdrop,
.class {
  font-size: 1rem;
}
```

## Background

```css
.container {
  /* for IE8 */

  /* background: url('data:image/png;base64,iVB...g=='); */

  /* for IE9+ */

  /* background: rgb(0 0 0 / 50%), none; */
}
```

## References

- Browser [hacks](https://github.com/4ae9b8/browserhacks).
