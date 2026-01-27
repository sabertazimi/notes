---
sidebar_position: 3
tags: [Web, CSS, Value]
---

# Values

## Data Types

CSS [data types](https://developer.mozilla.org/docs/Web/CSS/CSS_Types)
define typical [values](https://github.com/frenic/csstype)
(including keywords and units)
accepted by CSS properties and functions:

- Textual data [types](https://developer.mozilla.org/docs/Web/CSS/CSS_Types#textual_data_types).
- Numeric data [types](https://developer.mozilla.org/docs/Web/CSS/CSS_Types#numeric_data_types).
- [Quantities](https://developer.mozilla.org/docs/Web/CSS/CSS_Types#quantities).
- Combinations of [types](https://developer.mozilla.org/docs/Web/CSS/CSS_Types#combinations_of_types).
- Color data [types](https://developer.mozilla.org/docs/Web/CSS/color_value).
- Image data [types](https://developer.mozilla.org/docs/Web/CSS/image).
- 2D [`<position>`](https://developer.mozilla.org/docs/Web/CSS/position_value).

CSS data types list:

- CSS [formal syntax](https://github.com/mdn/data/blob/main/css/syntaxes.json).
- CSS [values](https://www.zhangxinxu.com/wordpress/2019/11/css-value-type).
- CSS [units](https://developer.mozilla.org/docs/Web/CSS/CSS_Values_and_Units).
- CSS [functions](https://developer.mozilla.org/docs/Web/CSS/CSS_Functions).

## Inherit

Inherit from parent.

## Initial

The initial value of a CSS property is its default value,
as listed in its **standard** definition table.

## Revert

Revert to **user agent** built in styles.

```css
@supports (-webkit-overflow-scrolling: touch) {
  progress {
    all: revert;
  }
}
```

## Unset

Reset to `inherit` or `initial` value.

```css
dialog {
  all: unset; /* Exclude `unicode-bidi`, `direction`, custom variables */
}
```

## Specified

The specified value of a CSS property is the value
it receives from the document's style sheet

## Computed

The computed value of a CSS property is the value that
is transferred from parent to child during inheritance.
It is calculated from the specified value by:

1. Handling the special values `inherit`, `initial`, `unset`, and `revert`
2. Doing the computation needed to reach the value described in the
   "Computed value" line in the property's definition table

```css
span {
  /* display computed to `block` */
  position: absolute;
}
```

## Used

The used value of a CSS property is its value after all calculations
have been performed on the computed value:

- The used values of dimensions (e.g., width, line-height) are in pixels
- The used values of shorthand properties (e.g., background)
  are consistent with those of their component properties
  (e.g., background-color or background-size) and with position and float

## Actual

The actual value of a CSS property is the used value of that property
after any necessary approximations have been applied

The user agent performs four steps to calculate a property's actual (final) value:

1. the specified value is determined based on the result of
   cascading, inheritance, or using the initial value.
2. the computed value is calculated according to the specification
   (for example, a span with position:
   absolute will have its computed display changed to block)
3. layout is calculated, resulting in the used value
4. the used value is transformed according to
   the limitations of the local environment,
   resulting in the actual value

:::tip[CSS Value Transform]

1. initial.
2. specified.
3. computed.
4. used.
5. actual value.

:::

## Logical

In `position`/`size`/`margin`/`padding`/`border`/`text alignment`:

- `block-start` for `top`.
- `block-end` for `bottom`.
- `block` for vertical.
- `inline-start` for `left`.
- `inline-end` for `right`.
- `inline` for horizontal.

```css
.logical {
  /* stylelint-disable shorthand-property-no-redundant-values */
  inset-block: 0 0;
  inset-inline: 0 0;
  inline-size: fit-content;
  min-inline-size: min-content;
  max-inline-size: max-content;
  block-size: fit-content;
  min-block-size: min-content;
  max-block-size: max-content;
  padding-block: 1rem 1rem;
  padding-inline: 1rem 1rem;
  margin-block: 1rem 1rem;
  margin-inline: 1rem 1rem;
  border-block-start: 1px solid blue;
  border-block-end: 1px solid blue;
  border-inline-start: 1px solid blue;
  border-inline-end: 1px solid blue;
  /* stylelint-enable shorthand-property-no-redundant-values */
}
```

[![Logical Properties](./figures/logical-properties.webp)](https://web.dev/learn/css/logical-properties)

## References

- MDN CSS value [formal syntax](https://developer.mozilla.org/docs/Web/CSS/Value_definition_syntax).
- W3C CSS logical [draft](https://drafts.csswg.org/css-logical).
- CSS logical properties [guide](https://css-tricks.com/css-logical-properties-and-values).
