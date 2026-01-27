---
sidebar_position: 32
tags: [Web, CSS, Responsive, Container]
---

# Container Query

## Size

当组件出现在同一视口大小 (viewport) 页面下的不同地方时,
e.g. `.main > .button` vs `.sidebar > .button`,
此时 `@media` 无法有效实现响应式组件,
使用 `@container` 可以有效实现响应式组件:

```css
.sidebar {
  container-name: sidebar;
  container-type: inline-size;
}

@container sidebar (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
```

## Style

[`style`](https://una.im/style-queries) query direct parent:

```css
@container style(color: hotpink) {
  .card {
    background: white;
  }
}

@container style(font-style: italic) {
  span,
  i,
  .etc {
    background: lavender;
  }
}

@container style(border-color: lightblue) {
  button {
    border-color: royalblue;
  }
}

@container style(--theme: dark) {
  .card {
    color: white;
    background: royalblue;
    border-color: navy;
  }

  .card button {
    color: white;
    background-color: dodgerblue;
    border-color: navy;
  }
}

/* Update the theme on hover */
.card:hover,
.card:focus {
  --theme: dark-hover;
}

/* Apply darkHover theme styles */
@container style(--theme: dark-hover) {
  .card {
    background: dodgerblue;
    border-color: navy;
  }

  .card button {
    background-color: royalblue;
    border-color: lightblue;
  }
}

@container (min-width: 420px) and style(--highlight: true) {
  /* Styles for only highlight components at a minimum width of 420px */
  .title {
    color: var(--highlight-color);
  }
}
```

Non-direct parent:

```html
<ul class="card-list">
  <li class="card-container">
    <div class="card"></div>
  </li>
</ul>

<style>
  .card-list {
    container-name: cards;
  }

  @container cards style(--theme: warm) {
    .card {
      background-color: wheat;
    }
  }
</style>
```

Use style query to
[implement `toggle()` function](https://kizu.dev/alternating-style-queries):

```css
:is(i, em, blockquote, code) {
  font-style: var(--font-style);

  --font-style: italic;

  @container style(--font-style: italic) {
    --font-style: normal;
  }
}
```

## Scroll

[`scroll-state`](https://developer.chrome.com/blog/css-scroll-state-queries)
query:

```css
.parent {
  container-type: scroll-state;
}

.child {
  /* styles */

  @container scroll-state(<type>: <value>) {
    /* scroll-based styles */
  }
}
```

### Stuck

停滞 (边缘固定) 时:

```css
.stuck-top {
  position: sticky;
  top: 0;
  container-type: scroll-state;

  @supports (container-type: scroll-state) {
    > nav {
      @container scroll-state(stuck: top) {
        color: var(--color-highlight-foreground);
        background: var(--color-highlight);
      }
    }
  }
}
```

### Snapped

已贴靠 (轴上对齐) 时:

```css
.hidden-not-snapped {
  overflow: auto hidden;
  scroll-snap-type: x mandatory;

  > article {
    container-type: scroll-state;
    scroll-snap-align: center;

    @supports (container-type: scroll-state) {
      > * {
        transition: opacity 0.5s ease;

        @container not scroll-state(snapped: x) {
          opacity: 0.25;
        }
      }
    }
  }
}
```

### Scrollable

可滚动 (内容溢出) 时:

```css
.scroll-container {
  container-type: scroll-state size;
  overflow: auto;

  &::after {
    content: ' ';
    background: var(--shadow-top), var(--shadow-bottom);
    transition:
      --scroll-shadow-color-1-opacity 0.5s ease,
      --scroll-shadow-color-2-opacity 0.5s ease;

    @container scroll-state(scrollable: top) {
      --scroll-shadow-color-1-opacity: var(--shadow-color-opacity, 25%);
    }

    @container scroll-state(scrollable: bottom) {
      --scroll-shadow-color-2-opacity: var(--shadow-color-opacity, 25%);
    }
  }
}
```

### Scrolled

[已滚动](https://una.im/scroll-state-scrolled)时:

```css
html {
  container-type: scroll-state;
}

header {
  @container (not scroll-state(scrolled: none)) {
    position: sticky;
    top: 0;
    transition: translate 0.2s;
  }

  /* Hide when scroll down */
  @container scroll-state(scrolled: bottom) {
    translate: 0 -100%;
  }

  /* Appear when scroll up */
  @container scroll-state(scrolled: top) {
    translate: 0 0;
  }
}
```

## References

- Interactive and comprehensive CSS container queries [guide](https://ishadeed.com/article/css-container-query-guide).
