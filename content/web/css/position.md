---
sidebar_position: 12
tags: [Web, CSS, Layout, Position, Static, Relative, Absolute, Fixed, Sticky, Anchor]
---

# Position

## Static

- Normal flow.
- `top`/`bottom`/`left`/`right`/`inset`/`z-index` have **no effect**.

## Relative

- 使元素相对于 `static` 布局.
- 可使用 `top`/`bottom`/`left`/`right`/`inset` 属性进行定位.
- 相对方向 (opposite) 的定位同时设置: `top` 覆盖 `bottom`, `left` 覆盖 `right`.
- 初始位置被保留 (仍占用原始空间), 不脱离文档流.

## Absolute

- 使元素相对于 [`containing block`](https://developer.mozilla.org/docs/Web/CSS/Containing_block#identifying_the_containing_block)
  布局:
  - Non-`static` `position` element.
  - `transform` element.
  - `perspective` element.
  - `will-change: transform`/`will-change: perspective` element.
  - `filter` element.
  - `backdrop-filter` element.
  - `contain` `strict`/`content`/`paint` element.
- 若祖先全为无法构成 `containing block` 的元素, 则使元素相对于浏览器窗口布局.
- 可使用 `top`/`bottom`/`left`/`right`/`inset` 属性进行定位.
- 相对方向 (opposite) 的定位同时设置:
  若未显示设置该方向的元素大小, 则元素具有流动性, 受 `containing block` 影响其大小,
  `.fluid { position: absolute; left: 0; right: 0; }`.
- 初始位置不被保留, 脱离文档流.
- `float` computed to `float: none`.
- `display`:
  - `inline-table` computed to `table`.
  - `inline`/`inline-block`/`table-*` computed to `block`.

```css
.tooltip {
  position: absolute;
}

.form-alert,
.form-warning,
.form-info {
  position: absolute;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -50;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 50%);
}
```

可以利用 `absolute` 模拟 `fixed` 布局:

```html
<html>
  <body>
    <div class="page">滚动内容区域</div>
    <div class="fixed">固定定位元素</div>
  </body>
  <style>
    html,
    body {
      height: 100%;
      overflow: hidden;
    }

    .page {
      height: 100%;
      overflow: auto;
    }

    .fixed {
      position: absolute;
    }
  </style>
</html>
```

## Fixed

- 使元素相对于 [`containing block`](https://developer.mozilla.org/docs/Web/CSS/Containing_block#identifying_the_containing_block)
  布局:
  - Initial `containing block`: 浏览器窗口, 且不受滑动条影响.
  - `transform` element.
  - `perspective` element.
  - `will-change: transform`/`will-change: perspective` element.
  - `filter` element.
  - `backdrop-filter` element.
  - `contain` `strict`/`content`/`paint` element.
- 可使用 `top`/`bottom`/`left`/`right`/`inset` 属性进行定位.
- 初始位置不被保留, 脱离文档流.
- `float` computed to `float: none`.
- `display`:
  - `inline-table` computed to `table`.
  - `inline`/`inline-block`/`table-*` computed to `block`.

## Sticky

[`position: sticky` + `top: XXX`](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Positioning#sticky_positioning):

- 使元素相对于 non-`visible` `overflow` 祖先 (nearest **scrolling** ancestor) 布局:
  要利用 `position: sticky` 实现视窗定位效果, 最好保证祖先全为 `overflow: visible` 元素,
  使得视窗成为其 nearest **scrolling** ancestor.
- 若祖先全为 `overflow: visible` 元素, 则使元素相对于浏览器窗口与 `containing block` 布局:
  - `containing block` 为 BFC creation element:
    - Block container.
    - Table container.
    - Flex container.
    - Grid container.
  - 粘性定位元素在它距离视窗顶部大于 `XXX` 时, 会按照默认布局, 表现为 `relative` position.
  - 一旦其距离顶部的距离等于 `XXX`, 元素会固定在窗口顶部, 表现为 `fixed` position.
- 粘性定位元素不能超出**粘性约束矩形**范围的限制:
  - 当 `containing block` 移动到窗口外时,
    粘性定位元素也会[跟着消失](https://demo.cssworld.cn/new/3/4-2.php).
  - [黏性定位元素在同一个容器下会重叠, 在不同容器下则会依次推开](https://demo.cssworld.cn/new/3/4-3.php):
    黏性定位元素分布在一个容器时, 共用一个巨大的黏性约束矩形,
    黏性定位元素分布在不同容器时, 存在多个竖直排列的黏性约束矩形.
  - 若粘性定位元素父元素的高度和粘性定位元素的高度相同,
    则垂直滚动时, 粘性定位效果始终不会出现.
  - 可以利用这一特性, 实现层次滚动/视差滚动效果 (`Parallax`).

```css
.sticky {
  position: sticky;
  top: 0;
  margin-top: 50px;
}
```

## Percentage

Positioned elements percentage `top`/`bottom`/`left`/`right`/`inset`
calculate by containing block `height`:

If `containing block` `height` is `auto`, it calculated to `0`.

## Anchor

### Area

[Anchor area](https://chrome.dev/anchor-tool):

```css
.profile-button {
  anchor-name: --profile-button;
}

.profile-menu {
  position-anchor: --profile-button;
  position: absolute;
  position-area: block-end span-inline-end;
  position-try: block-end span-inline-start;
}
```

### Offset

```css
.profile-button {
  anchor-name: --profile-button;
}

.profile-menu {
  position-anchor: --profile-button;
  position: absolute;
  inset-block-start: anchor(end); /* top: anchor(--profile-button bottom) */
  inset-inline-start: anchor(start); /* left: anchor(--profile-button left) */
}
```

### Pseudo-element

Pseudo-element [anchor positioning](http://rolandfranke.nl/frontend-stories/drawing-connections-with-css-anchor-positioning):

```css
.comment {
  anchor-name: --comment;
}

.reply {
  anchor-name: --reply;
  anchor-scope: --reply;
}

.reply::after {
  position: absolute;
  inset-block: anchor(--comment end) anchor(--reply center);
  inset-inline: calc(anchor(--comment start) + 1.5rem) anchor(--reply start);
  content: '';
  border: 1px solid var(--text);
  border-block-start-color: transparent;
  border-inline-end-color: transparent;
  border-radius: 0 0 0 0.75rem;
}
```

## References

- Anchor positioning [guide](https://web.dev/learn/css/anchor-positioning).
- Anchor positioning [introduction](http://webkit.org/blog/17240/a-gentle-introduction-to-anchor-positioning).
- Layout [fundamentals](https://polypane.app/blog/understanding-the-fundamentals-of-css-layout).
