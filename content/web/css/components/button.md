---
sidebar_position: 30
tags: [Web, CSS, Component, Button]
---

# Button

## Link

```css
a.btn-custom {
  padding: 10px 40px;
  line-height: 100px;
  text-align: center;
  background-color: #000;
  border-radius: 0;
}
```

## Gradient

### Linear

```css
.btn {
  display: inline-block;
  padding: 5px;
  color: #333;
  text-decoration: none;
  background-image: linear-gradient(to top, #333 50%, #fff 50%);
  background-size: 100% 200%;
  transition: all 0.3s;
}

.btn:hover,
.btn:focus {
  color: #fff;
  background-position: 0 100%;
}
```

```css
.btn-1 {
  background-image: linear-gradient(to right, #f6d365 0%, #fda085 51%, #f6d365 100%);
}

.btn-2 {
  background-image: linear-gradient(to right, #fbc2eb 0%, #a6c1ee 51%, #fbc2eb 100%);
}

.btn-3 {
  background-image: linear-gradient(to right, #84fab0 0%, #8fd3f4 51%, #84fab0 100%);
}

.btn-4 {
  background-image: linear-gradient(to right, #a1c4fd 0%, #c2e9fb 51%, #a1c4fd 100%);
}

.btn-5 {
  background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 51%, #ffecd2 100%);
}

.btn:hover,
.btn:focus {
  background-position: right center; /* change the direction of the change here */
}
```

### Radial

```css
.ripple-button {
  color: #fff;
  background-color: #2a80eb;
}

.ripple-button:active {
  background-image: radial-gradient(160% 100% at 50% 0%, hsl(0deg 0% 100% / 30%) 50%, hsl(0deg 0% 100% / 0%) 52%);
}

.colorful-button {
  color: #fff;
  background-color: #2a80eb;
  background-image:
    radial-gradient(farthest-side at bottom left, rgb(255 0 255/ 50%), transparent),
    radial-gradient(farthest-corner at bottom right, rgb(255 255 50/ 50%), transparent);
}
```

## 3D Shadow

```css
.shadow-3d-button {
  width: 100px;
  height: 36px;
  background-color: #f0f3f9;
  border: 1px solid #a0b3d6;
  box-shadow:
    1px 1px #afc4ea,
    2px 2px #afc4ea,
    3px 3px #afc4ea;
}

.shadow-3d-button:active {
  box-shadow:
    1px 1px #afc4ea,
    2px 2px #afc4ea;
  transform: translate(1px, 1px);
}
```

## References

- 100 modern CSS [buttons](https://github.com/ui-buttons/core).
