---
sidebar_position: 40
tags: [Web, CSS, Component, Background]
---

# Background

## Gradient Border

[Gradient border image](https://codepen.io/Chokcoco/pen/povBORP):

```css
.gradient-border {
  width: 200px;
  height: 100px;
  margin: auto;
  border: 10px solid;
  border-image: linear-gradient(45deg, gold, deeppink) 1;
  filter: hue-rotate(360deg);
  clip-path: inset(0 round 10px);
  animation: hue 6s infinite linear;
}

@keyframes hue {
  0% {
    filter: hue-rotate(0deg);
  }

  100% {
    filter: hue-rotate(360deg);
  }
}
```

Transparent border with background image, origin and clip:

```css
.card {
  /**
   * background-origin: padding-box, border-box;
   * background-clip: padding-box, border-box;
   */
  background:
    radial-gradient(circle at 50% 250%, var(--bg-primary), var(--bg-background)) padding-box,
    linear-gradient(red, blue) border-box;

  /** transparent border */
  border: 1px solid transparent;
  border-radius: 1rem;
}
```

Transparent border with mask composite:

```css
.card {
  position: relative;
  background-color: transparent;
  border-radius: 1rem;
}

.card::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';

  /** mock border */
  background: linear-gradient(red, blue) border-box;

  /** transparent border */
  border: 1px solid transparent;
  border-radius: 1rem;

  /** mask */
  mask:
    linear-gradient(black, black) border-box,
    linear-gradient(black, black) padding-box;
  mask-composite: subtract;
}
```

## Gradient Box Shadow

[Gradient box shadow](https://alvarotrigo.com/shadow-gradients):

```css
.box::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background: linear-gradient(-45deg, #ff3d00 0%, #0400ff 100%);
  border-radius: inherit;
  opacity: 0.7;
  filter: blur(20px);
  transform: translate3d(0, 20px, 0) scale(0.95);
  transition: opacity 0.3s;
}

/**
 * Prevents issues when the parent creates a  stacking context:
 * For example, using the `transform` property.
 */
.box::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background: inherit;
  border-radius: inherit;
}
```

## References

- Gallery for [background patterns](https://github.com/LeaVerou/css3patterns).
