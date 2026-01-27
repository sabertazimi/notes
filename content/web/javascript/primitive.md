---
sidebar_position: 1
tags: [Web, JavaScript, ECMAScript, Primitive]
---

# Primitives

## TC39

[![TC39](./figures/tc39.png)](https://github.com/tc39/proposals)

- [Technical Committees 39](https://www.ecma-international.org/technical-committees/tc39)
- [TC39 Process](http://tc39.github.io/process-document)
- [ES2015](https://exploringjs.com/es6/ch_overviews.html)
- [WinterCG: Web-interoperable Runtime Community Group](https://github.com/wintercg)

JavaScript = ECMAScript + DOM + BOM:

- ECMAScript: ECMA-262.
- DOM: DOM Core + DOM HTML (`document`).
- BOM: Browser Object Model API (HTML5)
  (`window`/`navigator`/`location`/`screen`/`performance` etc).

## Types

Primitive data types:

- Undefined.
- Null.
- Boolean.
- Number.
- String.
- Symbol.
- BigInt.

## Undefined

- 对象属性未定义时, 该属性值为 `undefined`.
- 未初始化变量的初值为 `undefined` (表示等待被赋值).

## Null

当引用为空或引用对象不存在时, 值为 `null`.
`null` 值表示一个空对象指针.

:::danger[Null]

`typeof null` -> `object`.

:::

## Boolean

### Zero Value

零值表达式:

- `undefined`.
- `null`.
- `false`.
- `NaN`.
- `0`
- `0n`.
- `''`.

### Conversion

| `x`         | `Boolean(x)`                   |
| ----------- | ------------------------------ |
| `undefined` | `false`                        |
| `null`      | `false`                        |
| `boolean`   | `x`                            |
| `number`    | `0` → `false`, `NaN` → `false` |
|             | Other numbers → `true`         |
| `bigint`    | `0n` → `false`                 |
|             | Other numbers → `true`         |
| `string`    | `''` → `false`                 |
|             | Other strings → `true`         |
| `symbol`    | `true`                         |
| `object`    | `true`                         |

## Wrapper Objects

Using the wrapper function without the new keyword
is a useful way of coercing a value into a primitive type.

```ts
// Not recommended (primitive object wrapper):
const objectType = typeof new String(37) // object

// Safe (type coercion with wrapper function):
const stringType = typeof String(37) // string

// Object-wrapped string:
const falsy = new String(37) === '37' // false

// Type-coerced string:
const truthy = String(37) === '37' // true

// BAD!
const falseObject = new Boolean(false)
const result = falseObject && true
console.log(result) // true
console.log(typeof falseObject) // object
console.log(falseObject instanceof Boolean) // true

const prim = true
assert.equal(typeof prim, 'boolean')
assert.equal(prim instanceof Boolean, false)

const wrapped = Object(prim)
assert.equal(typeof wrapped, 'object')
assert.equal(wrapped instanceof Boolean, true)
assert.equal(wrapped.valueOf(), prim) // unwrap
```

**Box and Unbox** for primitive values:

- 自动创建的原始值包装对象可以让原始值拥有对象的行为.
- 自动创建的原始值包装对象只存在于访问它的那行代码执行期间.
- 常数值**加括号**可转化为对象.
- 可以对 primitive values 进行 ES6 解构语法.

```ts
const s1 = 'some text'
const s2 = s1.substring(2) // Call method on primitive string.
// let _s1 = new String(s1);
// const s2 = _s1.substring(2);
// _s1 = null;

const s3 = 'some text'
s3.color = 'red'
console.log(s3.color) // undefined
```

```ts
// primitive string
const greet = 'Hello there'
// primitive is converted to an object
// in order to use the split() method
const hello = greet.split(' ')[0] // "Hello"
// attempting to augment a primitive is not an error
greet.smile = true
// but it doesn't actually work
const undef = typeof greet.smile // "undefined"
```

不使用 new 关键字,包装类构造函数返回值为基本类型

```ts
const numberType = typeof Number(1) // "number"
const numberType = typeof Number('1') // "number"
const numberType = typeof Number(new Number()) // "number"
const stringType = typeof String(1) // "string"
const booleanType = typeof Boolean(1) // "boolean"
```
