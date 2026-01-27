---
sidebar_position: 2
tags: [Web, JavaScript, ECMAScript, Number]
---

# Number

- Binary: `0b10`/`0B10`.
- Octal: `0o23`/`0O23`.
- Hex: `0xFF`.
- `**` 指数运算符.
- BigInt.

```ts
const a = 2172141653
const b = 15346349309
const c1 = a * b
// => 33334444555566670000

const c2 = BigInt(a) * BigInt(b)
// => 33334444555566667777n

const inhabitantsOfLondon = 1_335_000
const distanceEarthSunInKm = 149_600_000

const fileSystemPermission = 0b111_111_000
const bytes = 0b1111_10101011_11110000_00001101
const words = 0xF3B_F00D

const massOfElectronInKg = 9.109_383_56e-31
const trillionInShortScale = 1e1_2
```

## Conversion

| `x`         | `Number(x)`                                                 |
| ----------- | ----------------------------------------------------------- |
| `undefined` | `NaN`                                                       |
| `null`      | `0`                                                         |
| `boolean`   | `false` → `0`, `true` → `1`                                 |
| `number`    | `x`                                                         |
| `bigint`    | `-1n` → `-1`, `1n` → `1`                                    |
| `string`    | `''` → `0`                                                  |
|             | Other → parsed number, ignoring leading/trailing whitespace |
| `symbol`    | Throws TypeError                                            |
| `object`    | Configurable (`[Symbol.toPrimitive]()`/`valueOf()`)         |

```ts
assert.equal(Number(123.45), 123.45)
assert.equal(Number(''), 0)
assert.equal(Number('\n 123.45 \t'), 123.45)
assert.equal(Number('xyz'), Number.NaN)
assert.equal(Number(-123n), -123)
assert.equal(
  Number({
    valueOf() {
      return 123
    },
  }),
  123
)
```

## Static Properties

- `Number.NaN`.
- `Number.NEGATIVE_INFINITY`.
- `Number.POSITIVE_INFINITY`.
- `Number.MAX_SAFE_INTEGER`.
- `Number.MIN_SAFE_INTEGER`.
- `Number.EPSILON`.
- `Number.isNaN()`.
- `Number.isFinite()`.
- `Number.isInteger()`.
- `Number.isSafeInteger()`.
- `Number.toExponential()`.
- `Number.toFixed()`.
- `Number.toPrecision()`.
- `Number.parseInt(string, radix)`.
- `Number.parseFloat(string)`.

```ts
;(1234).toExponential()
// '1.234e+3'
;(1234).toExponential(5)
// '1.23400e+3'
;(1234).toExponential(1)
// '1.2e+3'
;(0.003).toExponential()
// '3e-3'
;(0.00000012).toFixed(10)
// '0.0000001200'
;(0.00000012).toFixed()
// '0'
;(10 ** 21).toFixed()
// '1e+21'
;(1234).toPrecision(3)
// '1.23e+3'
;(1234).toPrecision(4)
// '1234'
;(1234).toPrecision(5)
// '1234.0'
;(1.234).toPrecision(3)
// '1.23'
```

## NaN

```ts
const numberType = typeof Number.NaN // 'number'

Number.isFinite(Number.NaN)
// false
Number.isNaN(Number.NaN)
// true
Number.isNaN(123)
// false
Number.isNaN('abc')
// false

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}
```

:::danger[NaN]

`NaN === NaN` -> `false`.

:::

## Infinity

Infinity represents all values greater than 1.7976931348623157e+308.
Infinity will be converted to `null` with `JSON.stringify()`.

```ts
const largeNumber = 1.7976931348623157e308

// eslint-disable-next-line no-loss-of-precision -- Infinity
const largerNumber = 1.7976931348623157e309

console.log(largeNumber) // 1.7976931348623157e+308
console.log(largerNumber) // Infinity
console.log(46 / 0) // Infinity
console.log(Number.POSITIVE_INFINITY) // Infinity
console.log(Number.MAX_VALUE) // Infinity

// eslint-disable-next-line no-loss-of-precision -- -Infinity
console.log(-1.7976931348623157e309) // -Infinity
console.log(-46 / 0) // -Infinity
console.log(Number.NEGATIVE_INFINITY) // -Infinity
console.log(Number.MIN_VALUE) // -Infinity

console.log(Math.max()) // -Infinity
console.log(Math.min()) // Infinity

Number.isFinite(Number.POSITIVE_INFINITY)
// false
Number.isFinite(Number.NEGATIVE_INFINITY)
// false
Number.isFinite(Number.NaN)
// false
Number.isFinite(123)
// true
```

## Safety

- Safe integers:
  - Precision: 53 bits plus sign.
  - Range: (`−2^53`, `2^53`).
- Array indices:
  - Precision: 32 bits, unsigned
  - Range: [`0`, `2^32−1`).
  - Typed Arrays have a larger range of 53 bits (safe and unsigned).
- Bitwise operators:
  - Precision: 32 bits.
  - Range of unsigned right shift (`>>>`): unsigned, [`0`, `2^32`).
  - Range of all other bitwise operators: signed, [`−2^31`, `2^31`).

```ts
assert.equal(Number.MAX_SAFE_INTEGER, 2 ** 53 - 1)
assert.equal(Number.MIN_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER)

assert.equal(Number.isSafeInteger(5), true)
assert.equal(Number.isSafeInteger('5'), false)
assert.equal(Number.isSafeInteger(5.1), false)
assert.equal(Number.isSafeInteger(Number.MAX_SAFE_INTEGER), true)
assert.equal(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1), false)

Number.isInteger(-17)
// true
Number.isInteger(33)
// true
Number.isInteger(33.1)
// false
Number.isInteger('33')
// false
Number.isInteger(Number.NaN)
// false
Number.isInteger(Number.POSITIVE_INFINITY)
// false
```

## Float

- 计算浮点数时, 应先计算整数, 再利用移位/乘法/除法转化为浮点数.
- 浮点值的精确度最高可达 17 位小数.

```ts
const a = (1 + 2) / 10 // a = 0.1 + 0.2;
```
