---
sidebar_position: 11
tags: [Web, JavaScript, ECMAScript]
---

# Destructuring

- **建议只要有可能, 就不要在模式中放置圆括号**.
- 赋值语句的非模式部分, 可以使用圆括号.
- Every time access value via `.`:
  stop and think whether use destructuring instead.
- Destructure as early as possible.
- Remember to include default values, especially in nested destructuring.

## Default Value

- ES6 内部使用严格相等运算符 (===), 判断一个位置是否有值. 若此位置无值, 则使用默认值.
- 如果一个数组成员不严格等于 undefined, 默认值不会生效.

```ts
const [x = 1] = [undefined]
console.log(x) // 1

const [x = 1] = [null]
console.log(x) // null
```

```ts
let [x = 1, y = x] = [] // x=1; y=1
let [x = 1, y = x] = [2] // x=2; y=2
let [x = 1, y = x] = [1, 2] // x=1; y=2
let [x = y, y = 1] = [] // ReferenceError
```

## Object

- 解构赋值的规则: 只要等号右边的值不是对象, 就先将其**转为对象**.
- `undefined`/`null` 无法转化为对象:

```ts
const { prop: x } = undefined // TypeError
const { prop: y } = null // TypeError
```

```ts
const { bar, foo } = { foo: 'aaa', bar: 'bbb' }
console.log(foo) // "aaa"
console.log(bar) // "bbb"

const { baz } = { foo: 'aaa', bar: 'bbb' }
console.log(baz) // undefined
```

- 真正被赋值的是后者, 而不是前者:

```ts
const { foo: baz } = { foo: 'aaa', bar: 'bbb' }
console.log(baz) // "aaa"

const { first: f, last: l } = { first: 'hello', last: 'world' }
console.log(f) // 'hello'
console.log(l) // 'world'
```

- Left-hand side of a normal assignment:

```ts
const obj = {}
;[first, ...obj.prop] = ['a', 'b', 'c']
// first = 'a'; obj.prop = ['b', 'c']

const arr = []
;({ bar: arr[0] } = { bar: true })
console.log(arr) // [true]
```

### JSON

```ts
const jsonData = {
  id: 42,
  status: 'OK',
  data: [867, 5309],
}

const { id, status, data: number } = jsonData

console.log(id, status, number)
// 42, "OK", [867, 5309]
```

### Import

```ts
const { SourceMapConsumer, SourceNode } = require('source-map')
```

### Number and Boolean

`number`/`boolean` 会自动构造原始值包装对象:

```ts
let { toString: s } = 123
const truthy = s === Number.prototype.toString // true

let { toString: s } = true
const truthy = s === Boolean.prototype.toString // true
```

## Iterator

等号右边必须为数组等实现了 Iterator 接口的对象, 否则报错:

- Array.
- Set.
- Generator function.

```ts
const [foo, [[bar], baz]] = [1, [[2], 3]]
console.log(foo) // 1
console.log(bar) // 2
console.log(baz) // 3

const [, , third] = ['foo', 'bar', 'baz']
console.log(third) // "baz"

const [x, , y] = [1, 2, 3]
console.log(x) // 1
console.log(y) // 3

const [head, ...tail] = [1, 2, 3, 4]
console.log(head) // 1
console.log(tail) // [2, 3, 4]

const [x, y, ...z] = ['a']
console.log(x) // "a"
console.log(y) // undefined
console.log(z) // []

// Generator 函数
function* fibs() {
  let a = 0
  let b = 1

  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

const [first, second, third, fourth, fifth, sixth] = fibs()
console.log(sixth) // 5
```

- Left-hand side of a normal assignment:

```ts
let x = 1
let y = 2
;[x, y] = [y, x]
```

### Map and List

- `for index in Iterable<T>`: key.
- `for [key, value] of Iterable<T>`: entry.

```ts
const map = new Map()
map.set('first', 'hello')
map.set('second', 'world')

for (const [key, value] of map)
  console.log(`${key} is ${value}`)

// first is hello
// second is world

// 获取键名
for (const [key] of map) {
  // ...
}

// 获取键值
for (const [, value] of map) {
  // ...
}
```

### String

```ts
const [a, b, c, d, e] = 'hello'
console.log(a) // "h"
console.log(b) // "e"
console.log(c) // "l"
console.log(d) // "l"
console.log(e) // "o"

const { length: len } = 'hello'
console.log(len) // 5
```

## Parameters

- 可用于工厂 (`factory`) / 设置 (`options`) 模式传参一般为 `options` 对象,
- 具有固定的属性名.
- 一次性定义多个参数.
- 一次性定义多个参数的默认值.

```ts
// 参数是一组有次序的值
function f1([x, y, z]) {}
f1([1, 2, 3])

// 参数是一组无次序的值
function f2({ x, y, z }) {}
f2({ z: 3, y: 2, x: 1 })

// 可省略 const foo = config.foo || 'default foo';
jQuery.ajax = function (
  url,
  {
    async = true,
    beforeSend = function () {},
    cache = true,
    complete = function () {},
    crossDomain = false,
    global = true,
    // ... more config
  }
) {
  // ... do stuff
}
```

## Return Value

返回多个值:

```ts
// 返回一个数组
function example1() {
  return [1, 2, 3]
}

const [a, b, c] = example1()

// 返回一个对象
function example2() {
  return {
    foo: 1,
    bar: 2,
  }
}

const { foo, bar } = example2()
```
