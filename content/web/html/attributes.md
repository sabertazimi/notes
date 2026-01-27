---
sidebar_position: 4
tags: [Web, HTML, DOM, Attribute, Property]
---

# Attributes

## Dataset

```html
<td data-row="1" data-column="1"></td>
```

```ts
function onChange(event) {
  const {
    currentTarget: {
      dataset: { row, column },
    },
  } = event
}
```

## Global

[Global attributes](https://html.spec.whatwg.org/multipage/dom.html#global-attributes)
are attributes common to all HTML elements,
they can be used on all elements,
though they may have no effect on some elements:

- `accesskey`.
- `autocapitalize`.
- `autofocus`.
- `contenteditable`: boolean.
- `dir`.
- `draggable`.
- `enterkeyhint`.
- `hidden`: boolean.
- `inert`.
- `inputmode`.
- `is`.
- `itemid`.
- `itemprop`.
- `itemref`.
- `itemscope`.
- `itemtype`.
- `lang`.
- `nonce`.
- `popover`.
- `spellcheck`: boolean.
- `style`.
- `tabindex`.
- `title`.
- `translate`.
- `on*` [event handler content attributes](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-content-attributes).

:::tip

DOM defines the user agent requirements
for the `class`, `id`, and `slot` attributes for any element in any namespace.
The `class`, `id`, and `slot` attributes may be specified on all HTML elements.

:::

### Tabindex

**-1**: 编程可获得焦点，tab 键不可获得焦点

## DOM Properties

### Differences

HTML attributes vs DOM properties [differs in](https://jakearchibald.com/2024/attributes-vs-properties):

- HTML serialization:
  attributes serialize to HTML, whereas properties don't.
- Value types:
  attribute values are always strings, whereas properties can be any type.
- Case sensitivity:
  attribute names are case-insensitive, whereas property names are case-sensitive.

```ts
// 1. HTML serialization:
const div = document.createElement('div')

div.setAttribute('foo', 'bar')
div.hello = 'world'

console.log(div.outerHTML) // '<div foo="bar"></div>'

// 2. Value types:
const div = document.createElement('div')
const obj = { foo: 'bar' }

div.setAttribute('foo', obj)
console.log(typeof div.getAttribute('foo')) // 'string'
console.log(div.getAttribute('foo')) // '[object Object]'

div.hello = obj
console.log(typeof div.hello) // 'object'
console.log(div.hello) // { foo: 'bar' }

// 3. Case sensitivity:
// <div id="test" HeLlO="world"></div>
const div = document.querySelector('#test')

console.log(div.getAttributeNames()) // ['id', 'hello']

div.setAttribute('FOO', 'bar')
console.log(div.getAttributeNames()) // ['id', 'hello', 'foo']

div.TeSt = 'value'
console.log(div.TeSt) // 'value'
console.log(div.test) // undefined
```

DOM properties come with validation and defaults, whereas HTML attributes don't:

- Omit invalid value: `input.type`.
- Normalize boolean value: `details.open`.
- Convert incoming value to number and coerce negative values to 0: `img.height`.

```ts
// Omit invalid type:
const input = document.createElement('input')

console.log(input.getAttribute('type')) // null
console.log(input.type) // 'text'

input.type = 'number'

console.log(input.getAttribute('type')) // 'number'
console.log(input.type) // 'number'

input.type = 'foo'

console.log(input.getAttribute('type')) // 'foo'
console.log(input.type) // 'text'

// Normalize non-empty string to true value:
const details = document.querySelector('details')

console.log(details.getAttribute('open')) // ''
console.log(details.open) // true

details.open = false

console.log(details.getAttribute('open')) // null
console.log(details.open) // false

details.open = 'hello'

console.log(details.getAttribute('open')) // ''
console.log(details.open) // true
```

### Reflection

For convenience, most specs will create a property equivalent for every defined attribute.
Here's the spec for [`<ol>`](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element).
The `Content attributes` section defines the HTML attributes
(`reversed`, `start`, `type`),
and the `DOM interface` defines the DOM properties:

```ts
interface OListElement extends HTMLElement {
  reversed: boolean
  start: long
  type: DOMString
};
```

If attribute (e.g. `foo=bar`) isn't a spec-defined attribute,
then there isn't a spec-defined `foo` property that reflects it:

```ts
const div = document.querySelector('div[foo=bar]')

console.log(div.getAttribute('foo')) // 'bar'
console.log(div.foo) // undefined

div.foo = 'hello world'

console.log(div.getAttribute('foo')) // 'bar'
console.log(div.foo) // 'hello world'
```

:::caution[`input.defaultValue` and `input.value` property]

[`input.defaultValue` property](https://html.spec.whatwg.org/multipage/input.html#dom-input-defaultvalue)
reflects HTML `value` attribute,
[`input.value` property](https://html.spec.whatwg.org/multipage/input.html#dom-input-value)
doesn't reflect any attribute:

```ts
class HTMLInputElement extends HTMLElement {
  get defaultValue() {
    return this.getAttribute('value') ?? ''
  }

  set defaultValue(newValue) {
    this.setAttribute('value', String(newValue))
  }

  #value = undefined

  get value() {
    return this.#value ?? this.defaultValue
  }

  set value(newValue) {
    this.#value = String(newValue)
  }

  // This happens when the associated form resets
  formResetCallback() {
    this.#value = undefined
  }
}

// <input type="text" value="default" />
const input = document.querySelector('input')

console.log(input.getAttribute('value')) // 'default'
console.log(input.value) // 'default'
console.log(input.defaultValue) // 'default'

input.defaultValue = 'new default'

console.log(input.getAttribute('value')) // 'new default'
console.log(input.value) // 'new default'
console.log(input.defaultValue) // 'new default'

// Here comes the mode switch:
input.value = 'hello!'

console.log(input.getAttribute('value')) // 'new default'
console.log(input.value) // 'hello!'
console.log(input.defaultValue) // 'new default'

input.setAttribute('value', 'another new default')

console.log(input.getAttribute('value')) // 'another new default'
console.log(input.value) // 'hello!'
console.log(input.defaultValue) // 'another new default'
```

:::
