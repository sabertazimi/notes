---
sidebar_position: 31
tags: [Web, CSS, Component, Link]
---

# Link

Styling [links](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Styling_links):

```css
a {
  padding: 2px 1px 0;
  text-decoration: none;
  outline: none;
}

a:link {
  color: #265301;
}

a:visited {
  color: #437a16;
}

a:focus {
  background: #bae498;
  border-bottom: 1px solid;
}

a:hover {
  background: #cdfeaa;
  border-bottom: 1px solid;
}

a:active {
  color: #cdfeaa;
  background: #265301;
}

a[href^='http'] {
  padding-right: 19px;
  background: url('external-link-52.png') no-repeat 100% 0;
  background-size: 16px 16px;
}
```

## Hidden

```css
a {
  text-decoration: none;
  pointer-events: none;
  cursor: default;
  opacity: 0;
}
```

## Animation

Change bottom border:

```css
a {
  position: relative;
  padding-bottom: 5px;
  color: #008080;
  text-decoration: none;
}

a::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  content: '';
  background-color: #22313f;
  transform-origin: bottom center;
}

a:hover,
a:focus {
  color: #22313f;
}

a:hover::after,
a:focus::after {
  width: 100%;
}
```

## GitHub

```html
<a href="https://github.com/Trevald/WhatTheTag.com" class="github-corner" aria-label="View source on GitHub">
  <svg
    width="80"
    height="80"
    viewBox="0 0 250 250"
    style="position: absolute; top: 0; right: 0; color: #2d3748; border: 0; fill: #718096"
    aria-hidden="true"
  >
    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
    <path
      d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
      fill="currentColor"
      style="transform-origin: 130px 106px"
      class="octo-arm"
    />
    <path
      d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
      fill="currentColor"
      class="octo-body"
    />
  </svg>
</a>
```

```css
.github-corner:focus .octo-arm,
.github-corner:hover .octo-arm {
  animation: none;
}

@media (prefers-reduced-motion: no-preference) {
  .github-corner:focus .octo-arm,
  .github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }

  20%,
  60% {
    transform: rotate(-25deg);
  }

  40%,
  80% {
    transform: rotate(10deg);
  }
}
```
