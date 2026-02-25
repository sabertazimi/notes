---
sidebar_position: 9
tags: [Web, JavaScript, ECMAScript]
---

# Variable

## Hoisting

- 一方面规定, `var`/`function` 声明的全局变量,
  依旧是全局对象的属性, 意味着会`Hoisting`.
- 另一方面规定, `let`/`const`/`class` 声明的全局变量,
  不属于全局对象的属性, 意味着不会`Hoisting`.
- `var` 只有函数作用域, `let`/`const` 拥有块级作用域.
- `var` 表达式和 `function` 声明都将会被提升到当前作用域 (**全局作用域/函数作用域**) 顶部,
  其余表达式顺序不变.

|            | Hoisting           | Scope         | Creates Global Properties |
| ---------- | ------------------ | ------------- | ------------------------- |
| `var`      | Declaration        | Function      | Yes                       |
| `let`      | Temporal dead zone | Block         | No                        |
| `const`    | Temporal dead zone | Block         | No                        |
| `class`    | Temporal dead zone | Block         | No                        |
| `function` | Complete           | Block         | Yes                       |
| `import`   | Complete           | Module-global | No                        |

```ts
// 我们知道这个行不通 (假设没有未定义的全局变量)
function example() {
  console.log(notDefined) // => throws a ReferenceError
}

// 在引用变量后创建变量声明将会因变量提升而起作用.
// 注意: 真正的值 `true` 不会被提升.
function example() {
  console.log(declaredButNotAssigned) // => undefined
  // eslint-disable-next-line no-var, vars-on-top -- for demonstration of variable hoisting
  var declaredButNotAssigned = true
}

// 解释器将变量提升到函数的顶部
// 这意味着我们可以将上边的例子重写为:
function example() {
  let declaredButNotAssigned
  console.log(declaredButNotAssigned) // => undefined
  declaredButNotAssigned = true
}

// 使用 const 和 let
function example() {
  console.log(declaredButNotAssigned) // => throws a ReferenceError
  console.log(typeof declaredButNotAssigned) // => throws a ReferenceError
  const declaredButNotAssigned = true
}
```

```ts
function example() {
  console.log(named) // => undefined

  named() // => TypeError named is not a function

  superPower() // => ReferenceError superPower is not defined

  // eslint-disable-next-line no-var, vars-on-top -- for demonstration of variable hoisting
  var named = function superPower() {
    console.log('Flying')
  }
}
```

## Let

- 块级作用域内定义的变量/函数, 在块级作用域外 ReferenceError.
- 不存在变量提升, 导致暂时性死区 (Temporal Dead Zone).
- `let` variable in `for-loop` closure,
  every closure for each loop
  binds the block-scoped variable.

```ts
const a = 1

b = 3 // temporal dead zone: throw reference error

let b = 2
```

`let` 变量拥有块级作用域 (每个 `setTimeout` 引用的都是不同的变量实例):

```ts
// for (var i = 0; i < 5; ++i) {
//   setTimeout(() => console.log(i), 0);
// }
// Output 5, 5, 5, 5, 5.
// 所有的 i 都是同一个变量, 输出同一个最终值.

for (let i = 0; i < 5; ++i)
  setTimeout(() => console.log(i), 0)

// Output: 0, 1, 2, 3, 4.
// JavaScript 引擎会为每个迭代循环声明一个新的迭代变量.
// 每个 setTimeout 引用的都是不同的变量实例.
```

## Const

- const 一旦声明变量, 就必须立即初始化, 不能留到以后赋值.
- 引用一个`Reference`变量时, 只表示此变量地址不可变, 但所引用变量的值/属性可变
  (`xxx *const`, 即`const`指针, 指向一个变量).
- 块级作用域.
- 不存在变量提升, 导致暂时性死区 (Temporal Dead Zone).

```ts
const f = () => g()
const g = () => 123

// We call f() after g() was declared:
assert.equal(f(), 123)
```

```ts
funcDecl()

const MY_STR = 'abc'
function funcDecl() {
  assert.throws(() => MY_STR, ReferenceError)
}
```

## Type Detection

```ts
function typeOf(o) {
  const _toString = Object.prototype.toString
  const _type = {
    'undefined': 'undefined',
    'number': 'number',
    'boolean': 'boolean',
    'string': 'string',
    '[object Function]': 'function',
    '[object GeneratorFunction]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regexp',
    '[object Error]': 'error',
    '[object JSON]': 'json',
  }

  return _type[typeof o] || _type[_toString.call(o)] || (o ? 'object' : 'null')
}
```

```ts
function type(item) {
  const reTypeOf = /^\[object\s(.*?)\]$/

  return Object.prototype.toString
    .call(item)
    .replace(reTypeOf, '$1')
    .toLowerCase()
}
```

### Null

不应使用 typeof 检测 null, 应使用 `===`/`!==`.

```ts
/*
 * ECMAScript 标准的重大 bug
 */
const objectType = typeof null // => object
```

### Property

- 由于属性值可能为零值值表达式, 不应使用零值表达式(`0`/`NaN`/`''`/`null`/`undefined`) 检测属性值.
- 应使用 `for in` 进行属性检测.

### Object

- `object instanceof Constructor`:
  在原型链上查找**构造器的原型对象** (`Constructor.prototype`).
- `prop in object`: 查找原型链属性名.

```ts
/**
 * L 表示左表达式, R 表示右表达式: L 为变量, R 为类型.
 */
function instanceOf(L, R) {
  const prototype = R.prototype
  let chain = L[[proto]]

  while (true) {
    if (chain === null)
      return false

    if (prototype === chain)
      return true

    chain = chain[[proto]]
  }
}
```

## Type Conversion

### Context

- 字符串 -> 整数: `+string`/`Number(string)`/`parseInt(string, arg1)`.
- any -> `bool`: `!!any`.
- const -> `object`: `(const)`.
- `parseInt(str, base)`:
  - 遇到非数字字符立即停止运行, 返回当前转化值.
  - 将 0 开头字符串解析为八进制数, 0x 开头字符串解析为十六进制数.
- `boolean`在`数值运算`环境中 true => 1, false => 0.
- `数组`在`数值运算`环境中转化为 0 (空数组)/num (单一元素数组)/NaN (多元素数组/NaN 数组).
- `对象`在`逻辑运算`环境中转化为 true , 包括 false 的封装对象.
- `对象`在`数值运算`环境中先利用 valueOf(object), 再利用 toString() 转化为数字, 若转化失败, 则返回 NaN.
- `对象`与`数值`加号运算: 先数值加, (**失败后**)再字符串加.

```ts
// good
const totalScore = String(this.reviewScore)

// good
const val = Number(inputValue)

// good
const val = Number.parseInt(inputValue, 10)

// good
const hasAge = Boolean(age)

// best
const hasAge = !!age
```

### Algorithm

```ts
function ToString(argument) {
  if (argument === undefined) {
    return 'undefined'
  } else if (argument === null) {
    return 'null'
  } else if (argument === true) {
    return 'true'
  } else if (argument === false) {
    return 'false'
  } else if (TypeOf(argument) === 'number') {
    return Number.toString(argument)
  } else if (TypeOf(argument) === 'string') {
    return argument
  } else if (TypeOf(argument) === 'symbol') {
    return Symbol.toString(argument)
  } else if (TypeOf(argument) === 'bigint') {
    return BigInt.toString(argument)
  } else {
    // argument is an object
    const primValue = ToPrimitive(argument, 'string')
    return ToString(primValue)
  }
}
```

```ts
function ToPropertyKey(argument) {
  const key = ToPrimitive(argument, 'string') // (A)

  if (TypeOf(key) === 'symbol')
    return key

  return ToString(key)
}
```

```ts
function ToNumeric(value) {
  const primValue = ToPrimitive(value, 'number')

  if (TypeOf(primValue) === 'bigint')
    return primValue

  return ToNumber(primValue)
}
```

```ts
function ToNumber(argument) {
  if (argument === undefined) {
    return Number.NaN
  } else if (argument === null) {
    return +0
  } else if (argument === true) {
    return 1
  } else if (argument === false) {
    return +0
  } else if (TypeOf(argument) === 'number') {
    return argument
  } else if (TypeOf(argument) === 'string') {
    return parseTheString(argument) // not shown here
  } else if (TypeOf(argument) === 'symbol') {
    throw new TypeError('Failed!')
  } else if (TypeOf(argument) === 'bigint') {
    throw new TypeError('Failed!')
  } else {
    // argument is an object
    const primValue = ToPrimitive(argument, 'number')
    return ToNumber(primValue)
  }
}
```

`ToPrimitive`:

- `[Symbol.toPrimitive]()`.
- `toString()`.
- `valueOf()`.

```ts
/**
 * @param input input string
 * @param hint Which type is preferred for the result string, number etc.
 */
function ToPrimitive(
  input: any,
  hint: 'string' | 'number' | 'default' = 'default'
) {
  if (TypeOf(input) === 'object') {
    const exoticToPrim = input[Symbol.toPrimitive] // (A)

    if (exoticToPrim !== undefined) {
      const result = exoticToPrim.call(input, hint)

      if (TypeOf(result) !== 'object')
        return result

      throw new TypeError('[Symbol.toPrimitive]() failed!')
    }

    if (hint === 'default')
      hint = 'number'

    return OrdinaryToPrimitive(input, hint)
  } else {
    // input is already primitive
    return input
  }
}

function OrdinaryToPrimitive(O: object, hint: 'string' | 'number') {
  const methodNames
    = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString']

  for (const name of methodNames) {
    const method = O[name]

    if (IsCallable(method)) {
      const result = method.call(O)

      if (TypeOf(result) !== 'object')
        return result
    }
  }

  throw new TypeError('Conversion failed!')
}
```
