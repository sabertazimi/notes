---
sidebar_position: 10
tags: [Web, CSS, Component, Utility]
---

# Utility

## Resizable

[Resizable `div`](https://codepen.io/ZeroX-DG/pen/vjdoYe):

```ts
// bottom-right:
new_width = element_original_width + (mouseX - original_mouseX)
new_height = element_original_height + (mouseY - original_mouseY)

// bottom-left:
new_width = element_original_width - (mouseX - original_mouseX)
new_height = element_original_height + (mouseY - original_mouseY)
new_x = element_original_x - (mouseX - original_mouseX)

// top-right:
new_width = element_original_width + (mouseX - original_mouseX)
new_height = element_original_height - (mouseY - original_mouseY)
new_y = element_original_y + (mouseY - original_mouseY)

// top-left:
new_width = element_original_width - (mouseX - original_mouseX)
new_height = element_original_height - (mouseY - original_mouseY)
new_x = element_original_x + (mouseX - original_mouseX)
new_y = element_original_y + (mouseY - original_mouseY)
```

## Hidden

- `display: none`: 元素不在 DOM 流.
- `visibility: hidden`: 元素在 DOM 流, 隐藏不可见, 不可触发事件.
- `opacity: 0`: 元素在 DOM 流, 透明度为 0, 可触发事件.

```css
.hidden-overflow {
  max-height: 0;
  overflow: hidden;
}

.hidden-opacity {
  position: absolute;
  opacity: 0;
  filter: opacity(0%);
}

.hidden-stacking {
  position: relative;
  z-index: -1;
}

.hidden-clip {
  position: absolute;
  clip-path: rect(0 0 0 0);
}

.hidden-visibility {
  position: absolute;
  visibility: hidden; /* visibility 具有继承性 */
}

.hidden-display {
  display: none;
}
```

## Typography

### Flexible Heading

```css
h1 {
  display: flex;
  align-items: center;
  width: 100%;
}

h1::before,
h1::after {
  flex: 1;
  height: 0.1em;
  margin: 0.2em;
  content: '';
  background-color: gray;
}
```

### Text Presets

```css
.text-primary {
  font-family: sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100px;
  color: black;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  text-decoration: none;
  font-display: swap;
}
```

## References

- CSS [tricks](https://github.com/l-hammer/You-need-to-know-css).
- CSS [inspiration](https://github.com/chokcoco/CSS-Inspiration).
