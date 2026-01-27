---
sidebar_position: 24
tags: [Web, CSS, Object]
---

# Object

## Fit

[`object-fit`](https://developer.mozilla.org/docs/Web/CSS/object-fit)
只对替换元素
([`replaced element`](https://developer.mozilla.org/docs/Web/CSS/Replaced_element))
有作用:

- `input`.
- `select`.
- `textarea`.
- `img`.
- `video`.
- `iframe`.
- `embed`.
- `object`.

[`object-fit`](https://developer.mozilla.org/docs/Web/CSS/object-fit)
是作用于 `replaced element` 的 `background-size`,
可以处理图片拉伸变形与 `Cumulative Layout Shift` 问题:

- `fill`.
- `contain`.
- `cover`.
- `none`.
- `scale-down`.

```css
.image-container {
  position: relative;
  padding-bottom: calc(2 / 3 * 100%); /* (height / width) ratio */
  overflow: hidden;
}

.image-container > img {
  position: absolute;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-container > .aspect-ratio {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.flexbox-container {
  display: flex;
  gap: var(--space-gutter-s);
  align-items: flex-start;
  font-size: var(--text-size-meta);
}

.flexbox-container img.aspect-ratio {
  flex-shrink: 0;
  width: clamp(4rem, 30%, 6rem);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}
```

## Position

[`object-position`](https://developer.mozilla.org/docs/Web/CSS/object-position)
是作用于 `replaced element` 的 `background-position`:

```css
img {
  /* <percentage> values */
  object-position: 25% 75%;

  /* Keyword values */
  object-position: top;
  object-position: bottom;
  object-position: left;
  object-position: right;
  object-position: center;

  /* <length> values */
  object-position: 0 0;
  object-position: 1cm 2cm;
  object-position: 10ch 8em;

  /* Edge offsets values */
  object-position: bottom 10px right 20px;
  object-position: right 3em bottom 10px;
  object-position: top 0 right 10px;
}
```

## Replaced Elements

[Replaced](https://developer.mozilla.org/en-US/docs/Glossary/Replaced_elements) media size
[normalize style](./toolchain.md#normalize):

```css
input,
textarea,
img,
video,
object {
  box-sizing: border-box;
  max-width: 100%;
  height: auto;
}
```

## Embed Container

```html
<div class="embed-container">
  <iframe src="http://www.youtube.com/embed/B1_N28DA3gY" frameborder="0" allowfullscreen></iframe>
</div>

<style>
  .embed-container {
    position: relative;
    max-width: 100%;
    height: 0;
    height: auto;
    padding-bottom: 56.25%;
    overflow: hidden;
  }

  .embed-container iframe,
  .embed-container object,
  .embed-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
```
