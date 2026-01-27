---
sidebar_position: 3
tags: [Web, TypeScript, Primitive]
---

# Primitives

- `boolean`.
- `number`.
- `string`.
- `array`.
- `tuple`:
  - **Fixed number** of elements whose types are known.
  - Variable length `array` types aren’t assignable to `tuple` types.
- `enum`.
- `null`.
- `undefined`.
- `void`.
- `any`.
- `unknown`: 任何类型都能分配给 `unknown`, 但 `unknown` 不能分配给其他基本类型.
- `never`:
  - `switch` default case guard (exhaustiveness check).
  - Reduce `never` intersection type.
  - Ignored in union type:
    - mapped conditional type.
    - distributive conditional type.

```ts
let num: number
let str: string
let bool: boolean
let boolArray: boolean[]
let tuple: [string, number]
let power: any

// 赋值任意类型
power = '123'
power = 123

// 它也兼容任何类型
power = num
num = power

function log(message: string): void {
  console.log(message)
}
```

```ts
function unknownColor(x: never): never {
  throw new Error('unknown color')
}

type Color = 'red' | 'green' | 'blue'

function getColorName(c: Color): string {
  switch (c) {
    case 'red':
      return 'is red'
    case 'green':
      return 'is green'
    default:
      return unknownColor(c)
  }
}
```
