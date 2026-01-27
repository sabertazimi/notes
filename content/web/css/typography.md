---
sidebar_position: 7
tags: [Web, CSS, Typography]
---

# Typography

- The typeface (font-family).
- Type (modular) scale.
- Responsiveness of the text (size unit and breakpoints).
- Spacing and vertical rhythm.
- Colors (theming).

> Refer to: font-family, font-size, spacing, color.

[![Typography Properties](./figures/typography-properties.png)](https://material.io/design/typography/understanding-typography.html#type-properties)

## Size

- Set a base-size.
- Multiples of base-size.
- Use `rem` for most font-size, use `em` for some spacing (needing responsive design).
- `rem` is better.
- `em` for responsive layout: e.g. layer2 font based-on layer1 font in dropdown menu.
- Make text legible: at least `16px`.

```scss
$xs: $base / $ratio / $ratio;
$sm: $base / $ratio;
$md: $base;
$lg: $base * $ratio;
$xl: $base * $ratio * ratio;
```

## Typeface

Prefer [web fonts](https://pimpmytype.com/web-safe-fonts):

- Especially in headings, because of consistency.
- Keep it to 2 to 5 font files or below 100 kb.
- Use system fonts for body text or UI text, if you have to.

## Spacing

Make text breathe:

- `margin/padding`: at least `15px`.
- `line-height`: `1.4`.
- `word-spacing`.
- `letter-spacing`.
- 60-100 characters per line.

## Vertical Rhythms

Keep vertical spaces between elements on a page
[consistent](https://zellwk.com/blog/why-vertical-rhythms)
(and relative) to each other:

- Set the vertical white space between elements to a multiple of base-size.
- Set the line-height of all text elements to a multiple of base-size.
- Set `margin-top` and `margin-bottom` to `<h1>` ~ `<h6>`/`<hr>` elements
  set `margin-bottom` to normal elements.

## Line Length

The optimal line length for body text is `50`–`75` characters:

- Shorter or longer line lengths can hurt readability.

```css
.line-length {
  margin-top: 2em;
  line-height: 1.5em;
  word-spacing: 0.16em;
  letter-spacing: 0.12em;
}
```

## Table

- Remove fills, grid lines, border and bolding.
- Left-align text, right-align numbers
  and align headings with data.
- Put white space to work to group and separate.

## References

- Understanding typography [guide](https://material.io/design/typography/understanding-typography).
- Practical typography [guide](https://practicaltypography.com).
- Golden rules of web typography [reference](https://noti.st/rar/mz1rIY/golden-rules-of-typography-on-the-web).
- Typeface [font matrix](https://pimpmytype.com/font-matrix/).
