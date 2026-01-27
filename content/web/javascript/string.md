---
sidebar_position: 3
tags: [Web, JavaScript, ECMAScript, String]
---

# String

## Primitive

作为基本变量:

- `delete` 无法删除某位字符.

## Reference

- 赋值与传参: 传递 string 字符串常量的引用.
- 所有 string 字面量都是不可变量,
  当对 string 进行操作后, 将先会在堆区创建副本,
  再通过副本进行修改, 并返回副本的索引.
- `for...in`: 返回下标数字.
- `for...of`: 对字符串字符进行遍历.
- 没有被任何变量引用的 string: 垃圾回收.

```ts
const goodString = 'I\'ve been a good string'
console.log(typeof goodString) // string
console.log(goodString instanceof String) // false
console.log(Object.prototype.toString.call(goodString)) // [object String]

const badString = new String('I\'ve been a naughty string')
console.log(typeof badString) // object
console.log(badString instanceof String) // true
console.log(Object.prototype.toString.call(badString)) // [object String]

const isPrimitiveString = value => typeof value === 'string'
console.log(isPrimitiveString(goodString)) // true
console.log(isPrimitiveString(badString)) // false

const isObjectWrappedString = value => value instanceof String
console.log(isObjectWrappedString(goodString)) // false
console.log(isObjectWrappedString(badString)) // true

const isString = value => typeof value === 'string' || value instanceof String
console.log(isString(goodString)) // true
console.log(isString(badString)) // true

function isStringAlternative(value) {
  return Object.prototype.toString.call(badString) === '[object String]'
}
console.log(isStringAlternative(goodString)) // true
console.log(isStringAlternative(badString)) // true
```

## Conversion

| `x`         | `String(x)`                                             |
| ----------- | ------------------------------------------------------- |
| `undefined` | `'undefined'`                                           |
| `null`      | `'null'`                                                |
| `boolean`   | `false` → `'false'`, `true` → `'true'`                  |
| `number`    | `123` → `'123'`                                         |
| `bigint`    | `123n` → `'123'`                                        |
| `string`    | `x`                                                     |
| `symbol`    | `Symbol('abc')` → `'Symbol(abc)'`                       |
| `object`    | Configurable (`toPrimitive`/`toStringTag`/`toString()`) |

## Unicode

```ts
const truthy = '\x7A' === 'z' // true
const truthy = '\u007A' === 'z' // true
const truthy = '\u{7A}' === 'z' // true
```

## Char Code

- `string.charAt(index)`.
- `string.charCodeAt(index)`.
- `string.fromCharCode(charCode)`.
- `string.codePointAt(index)`: 正确处理 4 字节存储字符.
- `string.fromCodePoint(codePoint)`: 正确处理 4 字节存储字符.

```ts
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF
}

const truthy = String.fromCodePoint(0x78, 0x1F680, 0x79) === 'x\uD83D\uDE80y'

const after = before.charAt(0).toUpperCase() + before.slice(1)
```

## Slice and Merge

- `string.slice()`.
- `string.substring()`.
- `string.substr()`.
- `string.split(separator)`: 选择割断符, 返回字符串数组.
- `Array<string>.join(separator)`: 将字符串数组连接成字符串.

```ts
const stringValue = 'hello world'
console.log(stringValue.slice(3)) // "lo world"
console.log(stringValue.substring(3)) // "lo world"
console.log(stringValue.substr(3)) // "lo world"
console.log(stringValue.slice(3, 8)) // "lo wo"
console.log(stringValue.substring(3, 8)) // "lo wo"
console.log(stringValue.substr(3, 8)) // "lo world"
console.log(stringValue.slice(-3)) // "rld"
console.log(stringValue.substring(-3)) // "hello world"
console.log(stringValue.substr(-3)) // "rld"
console.log(stringValue.slice(3, -4)) // "lo w"
console.log(stringValue.substring(3, -4)) // "hel"
console.log(stringValue.substr(3, -4)) // "" (empty string)
```

## Query

- `string.includes(substr)`.
- `string.startsWith(substr)`.
- `string.endsWith(substr)`.
- 使用第二个参数 n 时, endsWith 针对前 n 个字符, 其他两个方法针对从第 n 个位置直到字符串结束.

```ts
const s = 'Hello world!'

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false

// Arrays difference
;[
  [1, 2, 3, 4, 5],
  [5, 2, 10],
].reduce((a, b) => a.filter(c => !b.includes(c)))
// [1, 3, 4]

// Arrays intersection
;[
  [1, 2, 3],
  [101, 2, 1, 10],
  [2, 1],
].reduce((a, b) => a.filter(c => b.includes(c)))
// [1, 2]
```

- `string.match(RegExp): string[] | null`.
- `string.matchAll(RegExp): string[] | null`.

```ts
interface RegExpMatchArray extends Array<string> {
  index: number
  input: string
  groups: Record<string, string> | undefined
}
```

- `string.search(string | RegExp): number`.

```ts
'a2b'.search(/\d/)
// 1
'a2b'.search('[0-9]')
// 1
```

## Replace

- `string.replace(string | RegExp, replaceValue | replacerFunction)`.
- `string.replaceAll(string | RegExp, replaceValue | replacerFunction)`.

```ts
const regexp = /foo[a-z]*/g
const str = 'table football, foosball'
const matches = str.matchAll(regexp)

for (const match of matches) {
  console.log(
    `Found ${match[0]} start=${match.index} end=${
      match.index + match[0].length
    }.`
  )
}
// expected output: "Found football start=6 end=14."
// expected output: "Found foosball start=16 end=24."

// matches iterator is exhausted after the for..of iteration
// Call matchAll again to create a new iterator
Array.from(str.matchAll(regexp), m => m[0])
// Array [ "football", "foosball" ]
```

```ts
'aabbcc'.replaceAll('b', '.')
// => 'aa..cc'

'aabbcc'.replaceAll(/b/g, '.')
// => 'aa..cc'
```

## Pad

- `string.repeat(times)`.

```ts
'hello'.repeat(2) // "hellohello"
'na'.repeat(2.9) // "nana"

'na'.repeat(-0.9) // ""
'na'.repeat(-1) // RangeError

'na'.repeat(Number.NaN) // ""
'na'.repeat(Number.POSITIVE_INFINITY) // RangeError

'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"
```

- `string.padStart(len, paddingStr)`.
- `string.padEnd(len, paddingStr)`.

```ts
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"

'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

## Trim

- `string.trimLeft()`/`string.trimStart()`: remove start whitespace.
- `string.trimRight()`/`string.trimEnd()`: remove end whitespace.

## Template Literals

`str` 表示模板字符串:

```ts
// 普通字符串
;`In JavaScript '\n' is a line-feed.``\`Yo\` World!``In JavaScript this is // 多行字符串
 not legal.``${
  x // 引用变量
} + ${y * 2} = ${x + y * 2}``${obj.x + obj.y}``foo ${
  fn() // 调用函数
} bar`
```

## Tagged Templates Literals

```ts
function boldify(parts, ...insertedParts) {
  return parts
    .map((s, i) => {
      if (i === insertedParts.length)
        return s
      return `${s}<strong>${insertedParts[i]}</strong>`
    })
    .join('')
}

const name = 'Sabertaz'
console.log(boldify`Hi, my name is ${name}!`)
// => "Hi, my name is <strong>Sabertaz</strong>!"
```

```ts
function template(strings, ...keys) {
  return function (...values) {
    const dict = values[values.length - 1] || {}
    const result = [strings[0]]
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  }
}

const t1Closure = template`${0}${1}${0}!`
t1Closure('Y', 'A') // "YAY!"
const t2Closure = template`${0} ${'foo'}!`
t2Closure('Hello', { foo: 'World' }) // "Hello World!"
```

编译模板 (小型模板引擎):

```ts
function compile(template) {
  const evalExpr = /<%=(.+?)%>/g
  const expr = /<%([\s\S]+?)%>/g

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`')

  template = `echo(\`${template}\`);`

  const script = `(function parse(data){
      let output = "";

      function echo(html){
        output += html;
      }

      ${template}

      return output;
    })`

  return script
}

const template = `
<ul>
  <% for(let i=0; i < data.supplies.length; i++) { %>
    <li><%= data.supplies[i] %></li>
  <% } %>
</ul>
`
const parse = compile(template)
div.innerHTML = parse({ supplies: ['broom', 'mop', 'cleaner'] })
// => <ul>
// =>   <li>broom</li>
// =>   <li>mop</li>
// =>   <li>cleaner</li>
// => </ul>

// 下面的hashTemplate函数
// 是一个自定义的模板处理函数
const libraryHtml = hashTemplate`
  <ul>
    #for book in ${myBooks}
      <li><i>#{book.title}</i> by #{book.author}</li>
    #end
  </ul>
`
```

国际化处理:

```ts
i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`
// "欢迎访问xxx, 您是第xxxx位访问者！"
```

XSS protection:

```ts
const message = SaferHTML`<p>${sender} has sent you a message.</p>`

function SaferHTML(templateString, ...expressions) {
  let s = templateString[0]

  for (let i = 0; i < expressions.length; i++) {
    const expression = String(expressions[i])

    // Escape special characters in the substitution.
    s += expression
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Don't escape special characters in the template.
    s += templateString[i + 1]
  }

  return s
}
```

运行代码:

```ts
jsx`
  <div>
    <input
      ref='input'
      onChange='${this.handleChange}'
      defaultValue='${this.state.value}' />
      ${this.state.value}
   </div>
`

java`
class HelloWorldApp {
  public static void main(String[] args) {
    System.out.println("Hello World!"); // Display the string.
  }
}
`
HelloWorldApp.main()
```

## Raw String

```ts
console.log(`\u00A9`) // ©
console.log(String.raw`\u00A9`) // \u00A9
```

```ts
console.log(`first line\nsecond line`)
// first line
// second line
console.log(String.raw`first line\nsecond line`)
// "first line\nsecond line"
```

```ts
function printRaw(strings) {
  console.log('Actual characters:')

  for (const string of strings)
    console.log(string)

  console.log('Escaped characters;')

  for (const rawString of strings.raw)
    console.log(rawString)
}

printRaw`\u00A9${'and'}\n`
// Actual characters:
// ©
// (换行符)
// Escaped characters:
// \u00A9
// \n
```

## Utils

```ts
function ucWords(string) {
  return string.toLowerCase().replace(/\b[a-z]/g, l => l.toUpperCase())
}

function ucFirst(string) {
  return string[0].toUpperCase() + string.substr(1)
}

function studlyCase(string) {
  return string
    .replace('-', ' ')
    .replace('_', ' ')
    .split(' ')
    .map(str => str[0].toUpperCase() + str.substr(1).toLowerCase())
    .join('')
}

function snakeCase(string, glue = '_') {
  return string
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join(glue)
}

function kebabCase(string) {
  return snakeCase(string, '-')
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .reduce((carry, key) => {
      if (obj[key] || obj[key] === 0)
        return `${carry}${key}=${obj[key]}&`

      return carry
    }, '')
    .replace(/&+$/, '')
}
```
