---
sidebar_position: 41
tags: [Web, CSS, Component, Filter]
---

# Filter

## Dark Mode

```css
html[theme='dark'] {
  filter: invert(1) hue-rotate(180deg);
}

html[theme='dark'] img {
  filter: invert(1) hue-rotate(180deg);
}

html {
  transition:
    color 300ms,
    background-color 300ms;
}
```

## Fusion

- Parent element: `background-color` + `filter: contrast()`.
- Child element: `filter: blur()`.

[Light](https://codepen.io/Chokcoco/pen/BaaQEab),
[flame](https://codepen.io/Chokcoco/pen/jJJbmz),
[rain drop](https://codepen.io/Chokcoco/pen/gZVjJw)
emulation:

```html
<div class="container">
  <div class="circle circle-1"></div>
  <div class="circle circle-2"></div>
</div>

<style>
  .container {
    background: #fff; /* Required */
    filter: contrast(30);
  }

  .circle {
    filter: blur(10px);
  }
</style>
```

## Frosted Glass

毛玻璃效果 (`bg-white/30 shadow-lg backdrop-blur-sm`):

```css
body {
  background-image: url('https://images.unsplash.com/image');
  background-position: center;
}

.card {
  background-color: rgb(17 25 40 / 54%);
  border: 1px solid rgb(255 255 255 / 12.5%);
  border-radius: 12px;
  backdrop-filter: blur(12px) saturate(200%);
}

.hero {
  --inset-shadow: inset 0 0 1px 1px hsl(204deg 100% 90% / 100%);
  --shadow: 10px 10px 60px 20px hsl(194deg 100% 9% / 50%);

  background-color: hsl(27deg 10% 90% / 90%);
  border: 1px solid hsl(176deg 87% 7% / 60%);
  border-radius: 5px;
  box-shadow: var(--inset-shadow), var(--shadow);
}

@supports (backdrop-filter: blur(25px) brightness(170%)) {
  .hero {
    background-color: hsl(27deg 10% 90% / 50%);
    backdrop-filter: blur(25px) brightness(170%);
  }
}
```

Tweaked frosted glass header menu:

```html
<style>
  .backdrop {
    position: absolute;
    inset: 0;
    height: 200%;
    pointer-events: none;
    background: hsl(0deg 0% 100% / 10%);
    border-radius: 4px;
    backdrop-filter: blur(16px);
    mask-image: linear-gradient(to bottom, black 0, black 50%, transparent 50%);
  }

  .backdrop-edge {
    /* Set this to whatever you want for the edge thickness: */
    --thickness: 6px;

    position: absolute;
    inset: 0;

    /*
      Only a few pixels will be visible, but we’ll
      set the height by 100% to include nearby elements.
    */
    height: 100%;
    pointer-events: none;
    background: hsl(0deg 0% 100% / 10%);
    backdrop-filter: blur(8px) brightness(120%);

    /*
      We mask out everything aside from the first few
      pixels, specified by the --thickness variable:
    */
    mask-image: linear-gradient(to bottom, black 0, black var(--thickness), transparent var(--thickness));

    /*
      Shift down by 100% of its own height, so that the
      edge stacks underneath the main <header>:
    */
    transform: translateY(100%);
  }
</style>

<header>
  <div class="backdrop"></div>
  <div class="backdrop-edge"></div>
</header>
```

## Liquid Glass

Simple [liquid glass](https://designfast.io/liquid-glass 'Liquid Glass') effect:

```html
<!-- @see {@link https://www.liquid-glass.pro} -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Liquid Glass Button Demo</title>
    <style>
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        margin: 0;
        overflow: hidden;
        background-image: url('https://static.liquid-glass.pro/img/background-5.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      .liquid-glass {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        height: 60px;
        padding: 0;
        margin: 0;
        text-decoration: none;
        cursor: pointer;
        background: none;
        border: none;
        border-radius: 16.8px;
        box-shadow: 0 6px 24px rgb(0 0 0 / 20%);
        isolation: isolate;
      }

      .liquid-glass:focus {
        outline: none;
      }

      .liquid-glass::before {
        position: absolute;
        inset: 0;
        z-index: 0;
        content: '';
        background-color: rgb(255 255 255 / 0%);
        border-radius: 16.8px;
        box-shadow: inset 0 0 15px -5px #000;
      }

      .liquid-glass::after {
        position: absolute;
        inset: 0;
        z-index: -1;
        content: '';
        border-radius: 16.8px;
        filter: url('#glass-distortion');
        backdrop-filter: blur(0);
      }

      .glass-text {
        position: relative;
        font-family: Georgia, 'Microsoft YaHei', '微软雅黑', serif;
        font-size: 24px;
        font-weight: 400;
        color: #fff;
        text-shadow: 0 2px 4px rgb(0 0 0 / 20%);
        opacity: 1;
        transform: translate(0, 0);
      }
    </style>
  </head>
  <body>
    <button class="liquid-glass">
      <div class="glass-text">Login</div>
    </button>

    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      <defs>
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  </body>
</html>
```

Advanced [liquid glass](https://kube.io/blog/liquid-glass-css-svg) effect with CSS and SVG refraction:

```html
<!-- Red Channel for displacement in X axis -->
<!-- Green Channel for displacement in Y axis -->
<svg colorInterpolationFilters="sRGB">
  <filter id="{id}">
    <feImage
      href="{displacementMapDataUrl}"
      x="{0}"
      y="{0}"
      width="{width}"
      height="{height}"
      result="displacement_map"
    />
    <feDisplacementMap
      in="SourceGraphic"
      in2="displacement_map"
      scale="{scale}"
      xChannelSelector="R"
      yChannelSelector="G"
    />
  </filter>
</svg>

<style>
  .glass-panel {
    backdrop-filter: url('#liquidGlassFilterId');
  }
</style>

<script>
  // Surface function
  const height = f(distanceFromSide)
  const delta = 0.001 // Small value to approximate derivative
  const y1 = f(distanceFromSide - delta)
  const y2 = f(distanceFromSide + delta)
  const derivative = (y2 - y1) / (2 * delta)
  const normal = { x: -derivative, y: 1 } // Derivative, rotated by -90 degrees

  // Normalize vector
  const maximumDisplacement = Math.max(...displacementMagnitudes)
  const displacementVector_normalized = {
    angle: normalAtBorder,
    magnitude: magnitude / maximumDisplacement,
  }

  // Vector to Read-Green values
  const x = Math.cos(angle) * magnitude
  const y = Math.sin(angle) * magnitude
  const result = {
    r: 128 + x * 127, // Red channel is the X component, remapped to 0-255
    g: 128 + y * 127, // Green channel is the Y component, remapped to 0-255
    b: 128, // Blue channel is ignored
    a: 255, // Alpha channel is fully opaque
  }
</script>
```

## Gradient Text

[Gradient text](https://codepen.io/Chokcoco/pen/Rwoybzr):

```css
.gradient-text {
  position: relative;
  color: black;
  background: #fff;
}

.gradient-text::before {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(to right, deepskyblue, deeppink);
  mix-blend-mode: lighten;
}

.gradient-stroked-text {
  position: relative;
  color: #191325;
  text-shadow:
    1px 1px #fff,
    -1px -1px #fff,
    1px -1px #fff,
    -1px 1px #fff;
  background: #191325;
}

.gradient-stroked-text::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(315deg, #78e56c, #127ac9);
  mix-blend-mode: darken;
}

/**
 * @see {@link https://codepen.io/Chokcoco/pen/jOwEqvR}
 */
.gradient-wave-text {
  position: relative;
  overflow: hidden;
  font-size: 120px;
  font-weight: bold;
  color: #000;
  background: #fff;
}

.gradient-wave-text::before,
.gradient-wave-text::after {
  position: absolute;
  top: -923px;
  left: 50%;
  z-index: 1;
  width: 2000px;
  height: 2000px;
  content: '';
  background: rgb(3 169 244 / 85%);
  border-radius: 45% 48% 43% 47%;
  mix-blend-mode: lighten;
  transform: translate(-50%, -50%);
  animation: rotate 10s infinite linear;
}

.gradient-wave-text::after {
  border-radius: 43% 47% 44% 48%;
  animation: rotate 10s infinite 0.5s linear;
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
```

## Sun

```css
.sun-rise {
  filter: contrast(0.34) brightness(1.6) sepia(1) hue-rotate(10deg);
  filter: sepia(1) saturate(4) hue-rotate(295deg);
}
```

## Night

```css
.night {
  background-color: rgb(0 40 140 / 60%);
  background-image: url('./house-bed.jpg');
  background-size: 100%;
  background-blend-mode: darken;
  filter: brightness(80%) grayscale(20%) contrast(1.2);
}
```

## Movie

```css
.movie {
  background-blend-mode: soft-light;
  filter: contrast(1.1);
}
```

## Old

```css
.old-1977 {
  position: relative;
  filter: contrast(1.1) brightness(1.1) saturate(1.3);
}

.old-1977::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  content: '';
  background: rgb(243 106 188 / 30%);
  mix-blend-mode: screen;
}
```

## Sketch

```css
.sketch {
  width: 256px;
  height: 171px;
  background:
    url('10.jpg') -2px -2px,
    url('10.jpg');
  background-size: 258px 173px;
  background-blend-mode: difference;
  filter: brightness(3) invert(1) grayscale(1);
}
```
