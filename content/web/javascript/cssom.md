---
sidebar_position: 33
tags: [Web, JavaScript, ECMAScript, DOM, CSSOM]
---

# CSSOM

[CSS Object Model](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)
is a set of APIs allowing the manipulation of CSS from JavaScript.
It is much like the DOM, but for the CSS rather than the HTML.
It allows users to read and modify CSS style dynamically.

## Getter and Setter

- `cssText`: 一次生效.
- `length`.
- `getPropertyValue(name)`.
- `getPropertyPriority`: return `''` or `important`.
- `item(index)`.
- `setProperty(name, value, priority)`.
- `removeProperty(name)`.

```ts
const box = document.querySelector('.box')

box.style.setProperty('color', 'orange')
box.style.setProperty('font-family', 'Georgia, serif')
op.innerHTML = box.style.getPropertyValue('color')
op2.innerHTML = `${box.style.item(0)}, ${box.style.item(1)}`

box.style.setProperty('font-size', '1.5em')
box.style.item(0) // "font-size"

document.body.style.removeProperty('font-size')
document.body.style.item(0) // ""

myDiv.style.cssText = 'width: 25px; height: 100px; background-color: green'

for (let i = 0, len = myDiv.style.length; i < len; i++)
  console.log(myDiv.style[i]) // 或者用 myDiv.style.item(i)
```

## Inline Styles

```ts
interface Element {
  style: CSSStyleDeclaration
}

const style = element.style.XX
const font = element.style.fontFamily
const mt = element.style.marginTopWidth
```

## Computed Styles

- Shorthand style for full property.
- Longhand style for specific property.
- `getPropertyValue` can get css variables.
- 在所有浏览器中计算样式都是**只读**的, 不能修改 `getComputedStyle()` 方法返回的对象.

```ts
const background = window.getComputedStyle(document.body).background

// dot notation, same as above
const backgroundColor = window.getComputedStyle(el).backgroundColor

// square bracket notation
const backgroundColor = window.getComputedStyle(el)['background-color']

// using getPropertyValue()
// can get css variables property too
window.getComputedStyle(el).getPropertyValue('background-color')
```

## Class List

```ts
element.classList.add('class')
element.classList.remove('class')
element.classList.toggle('class')
element.classList.contains('class')
```

```ts
function addClassPolyfill(element, value) {
  if (!element.className) {
    element.className = value
  } else {
    newClassName = element.className
    newClassName += ' '
    newClassName += value
    element.className = newClassName
  }
}
```

## Rules

以下是 `CSSStyleSheet` 从 `StyleSheet` 继承的属性:

- disabled: Boolean, 表示样式表是否被禁用了 (设置为 true 会禁用样式表).
- href: `<link>` URL/null.
- media: 样式表支持的媒体类型集合.
- ownerNode: 指向拥有当前样式表的节点 `<link>`/`<style>`/null (`@import`).
- title: ownerNode 的 title 属性.
- parentStyleSheet: `@import` parent.
- type: 样式表的类型 (`'text/css'`).
- cssRules: 当前样式表包含的样式规则的集合.
- ownerRule: 如果样式表是使用 `@import` 导入的, 则指向导入规则.
- `deleteRule(index)`: 在指定位置删除 cssRules 中的规则.
- `insertRule(rule, index)`: 在指定位置向 cssRules 中插入规则.

### Definition

`CSSRule`:

- type of `CSSRule`:
  STYLE_RULE (1), IMPORT_RULE (3), MEDIA_RULE (4), KEYFRAMES_RULE (7).
- cssText: 返回整条规则的文本.
- selectorText: 返回规则的选择符文本.
- style: 返回 CSSStyleDeclaration 对象, 可以设置和获取当前规则中的样式.
- parentRule: 如果这条规则被其他规则 (如 `@media`) 包含, 则指向包含规则.
- parentStyleSheet: 包含当前规则的样式表.

```ts
const myRules = document.styleSheets[0].cssRules
const p = document.querySelector('p')

for (i of myRules) {
  if (i.type === 1)
    p.innerHTML += `<code>${i.selectorText}</code><br>`

  if (i.selectorText === 'a:hover')
    i.selectorText = 'a:hover, a:active'

  const myStyle = i.style

  // Set the bg color on the body
  myStyle.setProperty('background-color', 'peachPuff')

  // Get the font size of the body
  myStyle.getPropertyValue('font-size')

  // Get the 5th item in the body's style rule
  myStyle.item(5)

  // Log the current length of the body style rule (8)
  console.log(myStyle.length)

  // Remove the line height
  myStyle.removeProperty('line-height')

  // log the length again (7)
  console.log(myStyle.length)

  // Check priority of font-family (empty string)
  myStyle.getPropertyPriority('font-family')
}
```

### Media

- `conditionText` property of media rule.
- Nested `cssRules`.

```ts
const myRules = document.styleSheets[0].cssRules
const p = document.querySelector('.output')

for (i of myRules) {
  if (i.type === 4) {
    p.innerHTML += `<code>${i.conditionText}</code><br>`

    for (j of i.cssRules)
      p.innerHTML += `<code>${j.selectorText}</code><br>`
  }
}
```

### Keyframe

- `name` property of keyframe rule
- `keyText` property of keyframe rule.
- Nested `cssRules`.

```ts
const myRules = document.styleSheets[0].cssRules
const p = document.querySelector('.output')

for (i of myRules) {
  if (i.type === 7) {
    p.innerHTML += `<code>${i.name}</code><br>`

    for (j of i.cssRules)
      p.innerHTML += `<code>${j.keyText}</code><br>`
  }
}
```

### Manipulation

```ts
const myStylesheet = document.styleSheets[0]
console.log(myStylesheet.cssRules.length) // 8

document.styleSheets[0].insertRule(
  'article { line-height: 1.5; font-size: 1.5em; }',
  myStylesheet.cssRules.length
)
console.log(document.styleSheets[0].cssRules.length) // 9
```

```ts
const myStylesheet = document.styleSheets[0]
console.log(myStylesheet.cssRules.length) // 8

myStylesheet.deleteRule(3)
console.log(myStylesheet.cssRules.length) // 7
```

## Typed Object Model

CSS typed object model [API](https://developer.mozilla.org/docs/Web/API/CSS_Typed_OM_API)
simplifies CSS property manipulation by exposing CSS values
as **typed JavaScript objects** rather than strings.

[`StylePropertyMap`](https://developer.mozilla.org/docs/Web/API/StylePropertyMap):

```ts
const styleMap = document.body.computedStyleMap()
const cssValue = styleMap.get('line-height')
const { value, unit } = cssValue
```

[`CSSStyleValue`](https://developer.mozilla.org/docs/Web/API/CSSStyleValue):

- [`CSSKeywordValue`](https://developer.mozilla.org/docs/Web/API/CSSKeywordValue).
- [`CSSImageValue`](https://developer.mozilla.org/docs/Web/API/CSSImageValue).
- [`CSSMathValue`](https://developer.mozilla.org/docs/Web/API/CSSMathValue).
- [`CSSNumericValue`](https://developer.mozilla.org/docs/Web/API/CSSNumericValue).
- [`CSSUnitValue`](https://developer.mozilla.org/docs/Web/API/CSSUnitValue).
- [`CSSTransformValue`](https://developer.mozilla.org/docs/Web/API/CSSTransformValue).
- [`CSSUnparsedValue`](https://developer.mozilla.org/docs/Web/API/CSSUnparsedValue).

```ts
const styleMap = document.querySelector('#myElement').attributeStyleMap
styleMap.set('display', new CSSKeywordValue('initial'))
console.log(myElement.get('display').value) // 'initial'
```
