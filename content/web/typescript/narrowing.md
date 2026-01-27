---
sidebar_position: 16
tags: [Web, TypeScript, Narrowing, Inference, Infer, Guard]
---

# Narrowing

## Type Inference

类型系统在获得足够的信息后,
能将 [`infer`](https://github.com/microsoft/TypeScript/pull/21496) 后跟随的类型参数推导出来,
最后返回这个推导结果:

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

type ConstructorParameters<T extends new (...args: any) => any>
  = T extends new (...args: infer P) => any ? P : never

type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any

type InstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer R
  ? R
  : any
```

在协变位置上, 若同一个类型变量存在多个候选者, 则最终的类型将被推断为联合类型:

```ts
type PropertyType<T> = T extends { id: infer U, name: infer U } ? U : never

type InferType = PropertyType<{
  id: number
  name: string
}>
// string | number
```

在逆变位置上, 若同一个类型变量存在多个候选者, 则最终的类型将被推断为交叉类型:

```ts
type PropertyType<T> = T extends {
  a: (x: infer U) => void
  b: (x: infer U) => void
}
  ? U
  : never

type InferType = PropertyType<{
  a: (x: string) => void
  b: (x: number) => void
}>
// string & number

type UnionToIntersection<U> = (
  U extends any ? (arg: U) => void : never
) extends (arg: infer R) => void
  ? R
  : never

type UnionType = { a: 'a' } | { b: 'b' }
type IntersectionType = UnionToIntersection<UnionType>
// { a: 'a' } & { b: 'b' }
```

## Type Guard

### In

```ts
interface Fish {
  swim: () => void
}
interface Bird {
  fly: () => void
}

function move(animal: Fish | Bird) {
  if ('swim' in animal)
    return animal.swim()

  return animal.fly()
}
```

### Instance

```ts
function logValue(x: Date | string) {
  if (x instanceof Date)
    console.log(x.toUTCString())
  else
    console.log(x.toUpperCase())
}
```

### TypeOf

```ts
function fn(x: string | number) {
  if (typeof x === 'string')
    return x.length
  else
    return x + 1
}
```

```ts
function getScore(value: number | string): number {
  switch (typeof value) {
    case 'number':
      // %inferred-type: number
      return value + 1
    case 'string':
      // %inferred-type: string
      return value.length
    default:
      throw new Error(`Unsupported value: ${value}`)
  }
}
```

```ts
function contains(text: string, terms: string | string[]) {
  const termList = Array.isArray(terms) ? terms : [terms]
  console.log(termList) // string[]
}
```

### Discriminated Union

```ts
interface Teacher {
  kind: 'Teacher'
  teacherId: string
}

interface Student {
  kind: 'Student'
  studentId: string
}

type Attendee = Teacher | Student

function getId(attendee: Attendee) {
  switch (attendee.kind) {
    case 'Teacher':
      // %inferred-type: { kind: "Teacher"; teacherId: string; }
      return attendee.teacherId
    case 'Student':
      // %inferred-type: { kind: "Student"; studentId: string; }
      return attendee.studentId
    default:
      throw new Error('Unsupported type')
  }
}
```

### Never

- The `never` type is assignable to every type.
- No type is assignable to `never` (except `never` itself).

```ts
interface Triangle {
  kind: 'triangle'
  sideLength: number
}

type Shape = Circle | Square | Triangle

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
    default: {
      // Type 'Triangle' is not assignable to type 'never'.
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
    }
  }
}
```

:::tip[Never and Void]

- 当一个函数返回空值时, 它的返回值为 `void` 类型.
- 当一个函数**永不返回**时 (或者总是抛出错误), 它的返回值为 `never` 类型.
- 在 `strictNullChecking` 为 `false` 时, `void` 类型可以被赋值.
- 除了 `never` 本身以外, 其他任何类型不能赋值给 `never`.

```ts
function fail(message: string): never {
  throw new Error(`Invariant failure: ${message}.`)
}

function workWithUnsafeParam(param: unknown) {
  if (typeof param !== 'string')
    fail(`Param should be a string, not ${typeof param}`)

  // Here, param is known to be type string
  param.toUpperCase() // Ok
}
```

:::

### Exhaustiveness

Exhaustiveness check using `never` in `switch` statement:

```ts
class UnsupportedValueError extends Error {
  constructor(value: never) {
    super(`Unsupported value: ${value}`)
  }
}

function toGerman4(value: NoYesStrings): string {
  switch (value) {
    case 'Yes':
      return 'Ja'
    default:
      // @ts-expect-error: Argument of type '"No"'
      // is not assignable to parameter of type 'never'. (2345)
      throw new UnsupportedValueError(value)
  }
}
```

### Excess Property

Excess property check:
types check on assigning object literal to variable/function parameter.

```ts
interface Room {
  numDoors: number
  ceilingHeightFt: number
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
  // Excess property check:
  // Object literal may only specify known properties,
  // and 'elephant' does not exist in type 'Room'.
}

enterRoom({
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
})
// Excess property check:
// Object literal may only specify known properties,
// and 'elephant' does not exist in type 'Room'.

// Normal structural types check
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
}

// OK
const r: Room = obj
```

### Type Predicate Signature

`is` keyword for `value` type predicate:

```ts
type Falsy = false | '' | 0 | null | undefined

const isFalsy = (val: unknown): val is Falsy => !val

const isDefined = <T>(x: T | undefined): x is T => x !== undefined
```

```ts
function isNotNullish<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null
}

// %inferred-type: (number | null | undefined)[]
const mixedValues = [1, undefined, 2, null]

// %inferred-type: number[]
const numbers = mixedValues.filter(isNotNullish)
```

```ts
/**
 * A partial implementation of the `typeof` operator.
 */
function isTypeof(value: any, typeString: 'boolean'): value is boolean
function isTypeof(value: any, typeString: 'number'): value is number
function isTypeof(value: any, typeString: 'string'): value is string

const value: unknown = {}

if (isTypeof(value, 'boolean')) {
  // %inferred-type: boolean
  console.log(value)
}
```

## Type Assertion

### As

```ts
let foo: any
const bar = foo as string // 现在 bar 的类型是 'string'

function handler(event: Event) {
  const mouseEvent = event as MouseEvent
}
```

### Const

```ts
const v1 = {
  x: 1,
  y: 2,
} // { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
} // { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const // { readonly x: 1; readonly y: 2; }

const a1 = [1, 2, 3] // number[]

const a2 = [1, 2, 3] as const // readonly [1, 2, 3]
```

Const assertion `readonly` tuples are convenient for function returns
(returned tuples are often destructured immediately):

```ts
// Return type: readonly [string, number]
function firstCharAndSizeAsConst(input: string) {
  return [input[0], input.length] as const
}

// firstChar type: string
// size type: number
const [firstChar, size] = firstCharAndSizeAsConst('Sabertaz')
```

### Assertion Signature

Boolean assertion signature

```ts
function assert(condition: any, msg?: string): asserts condition {
  if (!condition)
    throw new AssertionError(msg)
}

function yell(str) {
  assert(typeof str === 'string')
  return str.toUppercase()
  //         ~~~~~~~~~~~
  // error: Property 'toUppercase' does not exist on type 'string'.
  //        Did you mean 'toUpperCase'?
}
```

String assertion signature

```ts
function assertIsString(val: any): asserts val is string {
  if (typeof val !== 'string')
    throw new AssertionError('Not a string!')
}

function yell(str: any) {
  assertIsString(str)
  // Now TypeScript knows that 'str' is a 'string'.
  return str.toUppercase()
  //         ~~~~~~~~~~~
  // error: Property 'toUppercase' does not exist on type 'string'.
  //        Did you mean 'toUpperCase'?
}
```

Generics assertion signature

```ts
function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError(
      `Expected 'val' to be defined, but received ${val}`
    )
  }
}
```
