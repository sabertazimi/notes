---
sidebar_position: 5
tags: [Web, JavaScript, ECMAScript, BigInt]
---

# BigInt

- Decimal: `123n`.
- Binary: `0b1101n`.
- Octal: `0o777n`.
- Hexadecimal: `0xFFn`.

```ts
/**
 * Takes a bigint as an argument and returns a bigint
 */
function nthPrime(nth) {
  if (typeof nth !== 'bigint')
    throw new TypeError('Not bigint')

  function isPrime(p) {
    for (let i = 2n; i < p; i++) {
      if (p % i === 0n)
        return false
    }

    return true
  }

  for (let i = 2n; ; i++) {
    if (isPrime(i)) {
      if (--nth === 0n)
        return i
    }
  }
}

assert.deepEqual(
  [1n, 2n, 3n, 4n, 5n].map(nth => nthPrime(nth)),
  [2n, 3n, 5n, 7n, 11n]
)
```

## Conversion

| `x`         | `BigInt(x)`                                         |
| ----------- | --------------------------------------------------- |
| `undefined` | Throws TypeError                                    |
| `null`      | Throws TypeError                                    |
| `boolean`   | `false` → `0n`, `true` → `1n`                       |
| `number`    | `123` → `123n`                                      |
|             | Non-integer → throws RangeError                     |
| `bigint`    | `x`                                                 |
| `string`    | `'123'` → `123n`                                    |
|             | Unparsable → throws SyntaxError                     |
| `symbol`    | Throws TypeError                                    |
| `object`    | Configurable (`[Symbol.toPrimitive]()`/`valueOf()`) |

```ts
BigInt(undefined)
// TypeError: Cannot convert undefined to a BigInt
BigInt(null)
// TypeError: Cannot convert null to a BigInt
BigInt('abc')
// SyntaxError: Cannot convert abc to a BigInt
BigInt('123n')
// SyntaxError: Cannot convert 123n to a BigInt
BigInt('123')
// 123n
BigInt('0xFF')
// 255n
BigInt('0b1101')
// 13n
BigInt('0o777')
// 511n
BigInt(123.45)
// RangeError: The number 123.45 cannot be converted to a BigInt
BigInt(123)
// 123n
BigInt({
  valueOf() {
    return 123n
  },
})
// 123n
```

| Convert To | Explicit Conversion     | Coercion (Implicit Conversion) |
| ---------- | ----------------------- | ------------------------------ |
| `boolean`  | `Boolean(0n)` → `false` | `!0n` → `true`                 |
|            | `Boolean(int)` → `true` | `!int` → `false`               |
| `number`   | `Number(7n)` → `7`      | `+int` → `TypeError`           |
| `string`   | `String(7n)` → `'7'`    | `''+7n` → `'7'`                |

## Static Properties

- `BigInt.asIntN(width, theInt)`:
  Casts theInt to width bits (signed).
- `BigInt.asUintN(width, theInt)`:
  Casts theInt to width bits (unsigned).

```ts
const uint64a = BigInt.asUintN(64, 12345n)
const uint64b = BigInt.asUintN(64, 67890n)
const result = BigInt.asUintN(64, uint64a * uint64b)
```
