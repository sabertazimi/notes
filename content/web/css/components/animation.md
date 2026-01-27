---
sidebar_position: 60
tags: [Web, CSS, Component, Animation]
---

# Animation

## Dots

```css
.dot {
  display: inline-block;
  height: 1em;
  overflow: hidden;
  line-height: 1;
  vertical-align: -0.25ex;
  text-align: left;
}

@media only screen and (prefers-reduced-motion: no-preference) {
  .dot::before {
    animation: dot1 3s infinite step-start both;
  }
}

.dot::before {
  display: block;
  white-space: pre-wrap;
  content: '...\A..\A.';
}

@keyframes dot1 {
  33% {
    transform: translateY(-2em);
  }

  66% {
    transform: translateY(-1em);
  }
}
```

## Hover

- Hover button effects using [background](https://css-tricks.com/cool-hover-effects-using-background-properties).
- Hover button effects using [text shadow](https://css-tricks.com/cool-hover-effects-that-use-css-text-shadow).
- Hover button effects using [clip and mask](https://css-tricks.com/css-hover-effects-background-masks-3d).

## Fade

```css
.dropdown-drawer {
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.2s linear,
    visibility 0s linear 0.2s;
}

.is-open .dropdown-drawer {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}
```

### In

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: rotateX(-90deg);
  }

  to {
    opacity: 1;
    transform: rotateX(0deg);
  }
}
```

### In Out

```css
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
```

### Mask

[Fade text](https://codepen.io/Chokcoco/pen/OJbxZLM):

```css
p {
  margin: auto;
  font-family: 'Reggae One', cursive;
  font-size: 48px;
  color: #fff;
  mask: radial-gradient(circle at 0 50%, #000, transparent 10%, transparent 0);
  mask-size: 100%;
  animation: scale 5s infinite;
}

.radial {
  mask: radial-gradient(circle at 50% 0, #000, transparent 20%, transparent 0);
  mask-size: 100% 100%;
  animation: scale 5s infinite;
}

@keyframes scale {
  50%,
  100% {
    mask-size: 100% 2000%;
  }
}
```

## Bounce

```css
/* transform-origin: top center */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(-30px);
  }

  80% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: 1;
    transform: rotateY(0) translateY(0);
  }
}
```

## Rotate

```css
/* transform-origin: top center */
@keyframes horizontal-rotate-in {
  0% {
    opacity: 0;
    transform: rotateY(-90deg) translateY(30px);
  }

  100% {
    opacity: 1;
    transform: rotateY(0) translateY(0);
  }
}

/* transform-origin: top right */
@keyframes rotate-right-in {
  0% {
    opacity: 0;
    transform: rotate(-30deg) translateX(30px);
  }

  100% {
    opacity: 1;
    transform: rotate(0) translateX(0);
  }
}
```

### Circular Spin

```css
/**
 * @see {@link play.csssecrets.io/circular}
 */
@keyframes spin {
  from {
    transform: rotate(0turn) translateY(-150px) translateY(50%) rotate(1turn);
  }

  to {
    transform: rotate(1turn) translateY(-150px) translateY(50%) rotate(0turn);
  }
}

.avatar {
  width: 50px;
  overflow: hidden;
  border-radius: 50%;
  animation: spin 3s infinite linear;
}
```

## Fold Flip

```css
/* transform-origin: top center */
@keyframes fold-flip {
  0% {
    opacity: 0;
    transform: rotateX(-90deg);
  }

  60% {
    transform: rotateX(50deg);
  }

  100% {
    opacity: 1;
    transform: rotateX(0);
  }
}
```

## Accordion

```css
@media only screen and (prefers-reduced-motion: reduce) {
  .menu {
    transition: none;
  }
}

.menu {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s,
    opacity 0.3s;
}

.menu:focus-within,
.container:hover .menu {
  max-height: 1em;
  opacity: 1;
}
```

## Slide

```css
.slide {
  width: 500%;
  overflow: hidden;
}

@keyframes slide {
  0% {
    margin-left: 0;
  }

  10% {
    margin-left: 0;
  }

  12% {
    margin-left: -100%;
  }

  22% {
    margin-left: -100%;
  }

  24% {
    margin-left: -200%;
  }

  34% {
    margin-left: -200%;
  }

  36% {
    margin-left: -300%;
  }

  46% {
    margin-left: -300%;
  }

  48% {
    margin-left: -400%;
  }

  58% {
    margin-left: -400%;
  }

  60% {
    margin-left: -300%;
  }

  70% {
    margin-left: -300%;
  }

  72% {
    margin-left: -200%;
  }

  82% {
    margin-left: -200%;
  }

  84% {
    margin-left: -100%;
  }

  94% {
    margin-left: -100%;
  }

  96% {
    margin-left: 0;
  }
}
```

## Scale Up

```css
@media only screen and (prefers-reduced-motion: reduce) {
  .div {
    transition: none;
  }
}

.div {
  transform: scaleX(0);
  transition: transform 0.5s ease;
}

.div:hover,
.div:focus {
  transform: scaleX(1);
}
```

## Clear Splash

```css
.cube {
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  perspective: 1000px;
  backface-visibility: hidden;
}
```

## Tooltip

```css
@keyframes tooltip {
  0% {
    opacity: 0;
    transform: scale(0.1) rotate(30deg) translateY(50px) rotateX(90deg);
  }

  50% {
    opacity: 1;
    transform: rotate(-10deg) rotateX(-2deg);
  }

  70% {
    transform: rotate(3deg);
  }

  100% {
    transform: scale(1);
  }
}
```

## Breath

```css
.breath {
  animation: breath 7s infinite;
}

@keyframes breath {
  0%,
  100% {
    opacity: 0;
  }

  70% {
    opacity: 1;
  }
}
```

## Pulse

```css
@keyframes radial-pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(0 0 0 / 50%);
  }

  100% {
    box-shadow: 0 0 0 30px rgb(0 0 0 / 0%);
  }
}

/* origin opacity is 0 */
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(0);
  }

  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}
```

## Clock

```css
.clock-pendulum {
  transform-origin: top;
  animation: pendulum 1s infinite alternate ease-in-out;
}

@keyframes pendulum {
  0% {
    transform: rotate(-10deg);
  }

  100% {
    transform: rotate(10deg);
  }
}
```

## Typewriter

```css
@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes caret {
  50% {
    border-right-color: transparent;
  }
}

h1 {
  width: 15ch;
  overflow: hidden;
  font:
    bold 200% Consolas,
    Monaco,
    monospace;
  white-space: nowrap;
  border-right: 0.05em solid;
  animation:
    typing 8s steps(15),
    caret 1s steps(1) infinite;
}
```
