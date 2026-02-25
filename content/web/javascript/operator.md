---
sidebar_position: 10
tags: [Web, JavaScript, ECMAScript, Operator]
---

# Operators

## Loose Comparison

`==` 与 `!=` [loose comparison](https://mp.weixin.qq.com/s/05m6vw__X4P7gwgKcGlhzw):

- Type conversion first, then comparison.
- Return comparison between `ToNumber(x)` and `ToPrimitive(y)`.

```ts
/** Loose equality (==) */
function abstractEqualityComparison(x, y) {
  if (TypeOf(x) === TypeOf(y)) {
    // Use strict equality (===)
    return strictEqualityComparison(x, y)
  }

  // Comparing null with undefined
  if (x === null && y === undefined)
    return true

  if (x === undefined && y === null)
    return true

  // Comparing a number and a string
  if (TypeOf(x) === 'number' && TypeOf(y) === 'string')
    return abstractEqualityComparison(x, Number(y))

  if (TypeOf(x) === 'string' && TypeOf(y) === 'number')
    return abstractEqualityComparison(Number(x), y)

  // Comparing a bigint and a string
  if (TypeOf(x) === 'bigint' && TypeOf(y) === 'string') {
    const n = StringToBigInt(y)

    if (Number.isNaN(n))
      return false

    return abstractEqualityComparison(x, n)
  }
  if (TypeOf(x) === 'string' && TypeOf(y) === 'bigint')
    return abstractEqualityComparison(y, x)

  // Comparing a boolean with a non-boolean
  if (TypeOf(x) === 'boolean')
    return abstractEqualityComparison(Number(x), y)

  if (TypeOf(y) === 'boolean')
    return abstractEqualityComparison(x, Number(y))

  // Comparing an object with a primitive
  // (other than undefined, null, a boolean)
  if (
    ['string', 'number', 'bigint', 'symbol'].includes(TypeOf(x))
    && TypeOf(y) === 'object'
  ) {
    return abstractEqualityComparison(x, ToPrimitive(y))
  }

  if (
    TypeOf(x) === 'object'
    && ['string', 'number', 'bigint', 'symbol'].includes(TypeOf(y))
  ) {
    return abstractEqualityComparison(ToPrimitive(x), y)
  }

  // Comparing a bigint with a number
  if (
    (TypeOf(x) === 'bigint' && TypeOf(y) === 'number')
    || (TypeOf(x) === 'number' && TypeOf(y) === 'bigint')
  ) {
    if (
      [Number.NaN, +Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].includes(x)
      || [Number.NaN, +Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].includes(y)
    ) {
      return false
    }

    if (isSameMathematicalValue(x, y))
      return true
    else
      return false
  }

  return false
}
```

## Strict Comparison

`===` 与 `!==`:

- Strings: same length, same characters in corresponding positions.
- Numbers: numerically equal.
- Objects: refer to same Object.
- Positive and negative `0` are equal to one another.
- `NaN` is not equal to anything, including `NaN`.
- `null` and `undefined` types are not equal with `===`, but equal with `==`.

```ts
// eslint-disable-next-line eqeqeq -- for demonstration of loose equality
const true1 = 0 == false // true
const false1 = 0 === false // false
// eslint-disable-next-line eqeqeq -- for demonstration of loose equality
const true2 = 1 == '1' // true
const false2 = 1 === '1' // false
const true3 = undefined == null // true
const false3 = undefined === null // false
// eslint-disable-next-line eqeqeq -- for demonstration of loose equality
const true4 = '0' == false // true
const false4 = '0' === false // false
// eslint-disable-next-line eqeqeq -- for demonstration of loose equality
const false5 = [] == [] // false, refer different objects in memory
const false6 = [] === [] // false, refer different objects in memory
// eslint-disable-next-line eqeqeq -- for demonstration of loose equality
const false7 = {} == {} // false, refer different objects in memory
const false8 = {} === {} // false, refer different objects in memory
```

`Object.is`:

```ts
// Case 1: Evaluation result is the same as using ===
Object.is(25, 25) // true
Object.is('foo', 'foo') // true
Object.is('foo', 'bar') // false
Object.is(null, null) // true
Object.is(undefined, undefined) // true
Object.is(window, window) // true
Object.is([], []) // false
const foo = { a: 1 }
const bar = { a: 1 }
Object.is(foo, foo) // true
Object.is(foo, bar) // false: different reference pointers.

// Case 2: Signed zero
Object.is(0, -0) // false
Object.is(+0, -0) // false
Object.is(-0, -0) // true
Object.is(0n, -0n) // true

// Case 3: NaN
Object.is(Number.NaN, 0 / 0) // true
Object.is(Number.NaN, Number.NaN) // true
```

```ts
if (!Object.is) {
  Object.defineProperty(Object, 'is', {
    value: (x, y) => {
      // SameValue algorithm
      if (x === y) {
        // return true if x and y are not 0, OR
        // if x and y are both 0 of the same sign.
        // This checks for cases 1 and 2 above.
        return x !== 0 || 1 / x === 1 / y
      } else {
        // return true if both x AND y evaluate to NaN.
        // The only possibility for a variable to not be strictly equal to itself
        // is when that variable evaluates to NaN (example: Number.NaN, 0/0, NaN).
        // This checks for case 3.
        return x !== x && y !== y
      }
    },
  })
}
```

## Conditional

养成使用分号结束句子的习惯, 需分行显示的语句必须确保单行不会形成完整语义:

```ts
const i = a ? 1 : b ? 2 : c ? 3 : 4
```

## Logical

- Optional Chaining Operator `?.`:
  Legible property chains that don't throw an error
  if a requested reference is missing.
- Nullish coalescing operator `??`:
  Binary operator.
  If the value of left side expression is `null` or `undefined`,
  right side of the operator is evaluated.
- Logical assignment operators: `&&=`, `||=`, `??=`.

| Assignment Operator | Equivalent To    | Only Assigns When `a` |
| ------------------- | ---------------- | --------------------- |
| `a \|\|= b`         | `a \|\| (a = b)` | Falsy                 |
| `a &&= b`           | `a && (a = b)`   | Truthy                |
| `a ??= b`           | `a ?? (a = b)`   | Nullish               |

## Dot

`.` 优先级高于 `=`:
`el.data` 优先求值, 引用 `old`, 指向 `old.data`.
`5` => `el`, `5` => `el.data` (`old.data`).

```ts
let el = { data: 1 }
const old = el

el.data = el = 5
console.log(el) // 5
console.log(el.data) // undefined
console.log(old) // { data: 5 }
console.log(old.data) // 5
```

## Add

`a + b`:

- 如果有一个是对象, 则遵循对象对原始值的转换过程:
  - Date 对象直接调用 toString 完成转换.
  - 其他对象通过 valueOf 转化,
    如果转换不成功则调用 toString.
- 如果两个都是对象, 两个对象都遵循步骤 1 转换到字符串.
- 两个数字, 进行算数运算.
- 两个字符串, 直接拼接.
- 一个字符串一个数字, 直接拼接为字符串.

## Delete

`delete` operator returns a boolean value:

- `true` on a successful deletion.
- `false` on a failed deletion:
  `var`/`let`/`const` variables cannot be deleted using `delete` operator.

```ts
const name = 'Lydia'
age = 21

// eslint-disable-next-line no-delete-var -- false for failed deletion
console.log(delete name) // false
// eslint-disable-next-line no-delete-var -- true for successful deletion
console.log(delete age) // true
```

## References

- Operator [lookup](https://www.joshwcomeau.com/operator-lookup).
