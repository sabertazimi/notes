---
sidebar_position: 1
tags: [Web, CSS, Cascading, Layer, Scope, Specificity, Inheritance]
---

# Cascading

## CSS Working Group

- CSS working group: [CSS WG](https://www.w3.org/Style/CSS).
- W3C standard [types](https://www.w3.org/standards/types):
  - ED: `Editor's Draft`.
  - FPWD: `First Public Working Draft`.
  - WD: `Working Draft`.
  - CR: `Candidate Recommendation`.
  - PR: `Proposed Recommendation`.
  - REC: a W3C `Recommendation` is a [W3C Technical Report](https://www.w3.org/TR).

[![W3C Standard Process](./figures/w3c-standard-process.svg)](https://www.w3.org/Consortium/Process)

## Order

1. Inherit styles.
2. User agent normal styles.
3. User normal styles.
4. Author `@layer` normal styles.
5. Author normal styles.
6. Animation styles.
7. Author `!important` styles.
8. Author `@layer` `!important` styles.
9. User `!important` styles.
10. User agent `!important` styles.
11. Transition styles.

> Transition > Animation > Normal > `@layer` > User > User Agent > Inherit

:::tip[Important Styles Reversion]

- 级联水平高的 styles 应用 !important 后, 其优先级变低.
- 级联水平低的 styles 应用 !important 后, 其优先级变高.

:::

[![CSS Cascading](./figures/cascading.png)](https://developer.mozilla.org/docs/Web/CSS/Cascade)

## Layer

### Formal Syntax

[`@layer`](https://developer.mozilla.org/docs/Web/CSS/@layer) formal syntax:

```css
@layer base;
@layer theme, layout, components, utilities;

@layer base {
  html {
    font-size: 1rem;
  }
}

@layer {
  html {
    font-size: 1rem;
  }
}
```

```css
@layer reset, externals, base, components, utilities;

@import 'reset.css' layer(reset);
@import 'carousel.css' layer(externals);
@import 'map.css' layer(externals);
```

```html
<link rel="stylesheet" href="reset.css" layer="reset" media="supports(at-rule(@layer))" />
```

### Priority

```css
/* utilities > components > layout > theme */
@layer theme, layout, components, utilities;

/* c > c.d > a > a.b */
@layer a {
  p {
    color: red;
  }

  @layer b {
    p {
      color: green;
    }
  }
}

@layer c {
  p {
    color: orange;
  }

  @layer d {
    p {
      color: blue;
    }
  }
}
```

![Layer Priority](./figures/layer-priority.png 'Layer Priority')

## Scope

[`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope):

- 局部上下文: 生效元素必须为 `@scope` 的子元素
- 规则完整性: 规则中的每一行代码, 必须属于一个完整的规则, 不能是一条单独的 CSS 声明.

```html
<section class="scope-root">
  <h3>Scope Root</h3>
  <p>Paragraph 1</p>
  <!-- Selected -->
  <img src="image.jpg" alt="Image" />
  <p>Paragraph 2</p>
  <figure class="scope-limit">
    <!-- Not selected -->
    <img src="image.jpg" alt="Image" />
    <figcaption>Figure Caption</figcaption>
  </figure>
</section>
```

```css
@scope (.scope-root) to (.scope-limit) {
  img {
    background-color: red;
  }

  /* stylelint-disable-next-line no-duplicate-selectors */
  & img {
    background-color: red;
  }

  :scope img {
    background-color: red;
  }
}
```

## Nesting

[`&` nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting):

```css
ul {
  & + & {
    font-weight: bold;
    color: red;
  }
}
```

## Specificity

[Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity)
(`Selector Priority`) has 4 bits,
thousands, hundreds, tens, ones `0000`:

- Thousands: inline-style.
- Hundreds: ID selector (实际开发中一般用 `[id="Id"]` 代替优先级过高的 ID selector).
- Tens: class selector, attribute selector, pseudo class(`:`).
- Ones: type selector, pseudo element(`::`).

:::tip[Zero Specificity]

- Universal selector (`*`),
  combinators (`+`, `>`, `~`, `a b`)
  and `:where()`
  have no effect on specificity.
- [`:not()`/`:is()`/`:has()`](https://meyerweb.com/eric/thoughts/2018/06/05/specificity-in-not-has-and-matches)
  have no effect on specificity,
  but selectors in it have effect on specificity.

:::

```html
<!-- specificity: 1000 -->
<h1 style="color: black">Hello</h1>
```

```css
/* specificity: 0001 */
h1 {
  color: red;
}

/* specificity: 0100 */
#id {
  color: green;
}

/* specificity: 0003 */
h1 + p::first-letter {
  color: blue;
}

/* specificity: 0022 */
li > a[href*='link-url'] > .inline-warning {
  color: yellow;
}

/* specificity: 0023 */
div li:nth-child(2) a:hover,
div li:nth-child(2) a:focus {
  border: 10px dashed black;
}

/* specificity: 0024 */
div div li:nth-child(2) a:hover,
div div li:nth-child(2) a:focus {
  border: 10px solid black;
}

/* specificity: 0033 */
div div .nav:nth-child(2) a:hover,
div div .nav:nth-child(2) a:focus {
  border: 10px double black;
}

/* specificity: 0101 */
#outer a {
  background-color: red;
}

/* specificity: 0104 */
#outer div ul li a {
  color: yellow;
}

/* specificity: 0113 */
#outer div ul .nav a {
  color: white;
}

/* specificity: 0201 */
#outer #inner a {
  background-color: blue;
}
```

Styles for a directly targeted element will
always take precedence over inherited styles,
regardless of the specificity of the inherited rule:

```css
#parent {
  color: green;
}

/* <h1> element will be purple */
h1 {
  color: purple;
}
```

Increasing specificity by **duplicating selector**:

```css
.my-class.my-class.my-class span {
  /* 0-3-1 */
  color: white;
}

:is(.my-class.my-class.my-class, span) {
  /* 0-3-0 */
  color: white;
}
```

## Inheritance

- Most CSS properties that affect the text node are inherited properties:
  color, font-size, font-family, etc.
- Most CSS properties that affect the element node are non-inherited properties.
- When the `unset` value is set on an inherited property,
  it resets the property value to its inherited value.
- `unset` value resets a non-inherited property to its `initial` value.
- `revert` reverses the CSS default values to the browser user-agent styles.

Inheritable Properties:

- [visibility](https://developer.mozilla.org/docs/Web/CSS/visibility)
- [cursor](https://developer.mozilla.org/docs/Web/CSS/cursor)
- [color](https://developer.mozilla.org/docs/Web/CSS/color)
- [direction](https://developer.mozilla.org/docs/Web/CSS/direction)
- [font-family](https://developer.mozilla.org/docs/Web/CSS/font-family)
- [font-size](https://developer.mozilla.org/docs/Web/CSS/font-size)
- [font-style](https://developer.mozilla.org/docs/Web/CSS/font-style)
- [font-variant](https://developer.mozilla.org/docs/Web/CSS/font-variant)
- [font-weight](https://developer.mozilla.org/docs/Web/CSS/font-weight)
- [font](https://developer.mozilla.org/docs/Web/CSS/font)
- [line-height](https://developer.mozilla.org/docs/Web/CSS/line-height)
- [letter-spacing](https://developer.mozilla.org/docs/Web/CSS/letter-spacing)
- [word-spacing](https://developer.mozilla.org/docs/Web/CSS/word-spacing)
- [white-space](https://developer.mozilla.org/docs/Web/CSS/white-space)
- [text-align](https://developer.mozilla.org/docs/Web/CSS/text-align)
- [text-indent](https://developer.mozilla.org/docs/Web/CSS/text-indent)
- [text-transform](https://developer.mozilla.org/docs/Web/CSS/text-transform)
- [border-collapse](https://developer.mozilla.org/docs/Web/CSS/border-collapse)
- [border-spacing](https://developer.mozilla.org/docs/Web/CSS/border-spacing)
- [caption-side](https://developer.mozilla.org/docs/Web/CSS/caption-side)
- [empty-cells](https://developer.mozilla.org/docs/Web/CSS/empty-cells)
- [list-style-image](https://developer.mozilla.org/docs/Web/CSS/list-style-image)
- [list-style-position](https://developer.mozilla.org/docs/Web/CSS/list-style-position)
- [list-style-type](https://developer.mozilla.org/docs/Web/CSS/list-style-type)
- [list-style](https://developer.mozilla.org/docs/Web/CSS/list-style)
- [orphans](https://developer.mozilla.org/docs/Web/CSS/orphans)
- [quotes](https://developer.mozilla.org/docs/Web/CSS/quotes)
- [widows](https://developer.mozilla.org/docs/Web/CSS/widows)
