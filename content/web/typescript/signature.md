---
sidebar_position: 8
tags: [Web, TypeScript, Signature]
---

# Signature

## Call Signature

Call signature looks similar to a function type,
but with a `:` colon instead of an `=>` arrow:

```ts
type FunctionAlias = (input: string) => number

interface CallSignature {
  (input: string): number
}

// Type: (input: string) => number
const typedFunctionAlias: FunctionAlias = input => input.length // Ok

// Type: (input: string) => number
const typedCallSignature: CallSignature = input => input.length // Ok
```

Call signatures can be used to describe functions
that have some **additional user-defined property** on them:

```ts
interface FunctionWithCount {
  count: number
  (): void
}

let hasCallCount: FunctionWithCount

function keepsTrackOfCalls() {
  keepsTrackOfCalls.count += 1
  console.log(`I've been called ${keepsTrackOfCalls.count} times!`)
}

keepsTrackOfCalls.count = 0

hasCallCount = keepsTrackOfCalls // Ok

function doesNotHaveCount() {
  console.log('No idea!')
}

hasCallCount = doesNotHaveCount
// Error: Property 'count' is missing in type
// '() => void' but required in type 'FunctionWithCalls'
```

## Index Signature

For `JavaScript`,
implicitly calls `toString` on any object index signature:

```ts
const obj = {
  toString() {
    console.log('toString called')
    return 'Hello'
  },
}

const foo: any = {}
foo[obj] = 'World' // toString called
console.log(foo[obj]) // toString called, World
console.log(foo.Hello) // World
```

`TypeScript` will give an error to prevent beginners from doing such things,
throw **index signature error**:

```bash
Element implicitly has an 'any' type
because expression of type 'string' can't be used to index type XXX.
```

Can fixed with:

- `Record<string, T>`.
- `K extends keyof T`: explicit Constrained key type.

```ts
// propertyName should be extends keyof T
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName] // o[propertyName] is of type T[K]
}
```

### Type Check

```ts
const x: { foo: number, [x: string]: any }
x = { foo: 1, baz: 2 } // ok, 'baz' 属性匹配于索引签名
```

当你声明一个索引签名时，所有明确的成员都必须符合索引签名:

```ts
// ok
interface Foo {
  [key: string]: number
  x: number
  y: number
}

// Error
interface Bar {
  [key: string]: number
  x: number
  y: string // Error: y 属性必须为 number 类型
}
```

使用交叉类型可以解决上述问题:

```ts
interface FieldState {
  value: string
}

type FormState = { isValid: boolean } & Record<string, FieldState>
```

### Select

```ts
type Index = 'a' | 'b' | 'c'
type FromIndex = { [k in Index]?: number }

const good: FromIndex = { b: 1, c: 2 }

// Error:
// `{ b: 1, c: 2, d: 3 }` 不能分配给 'FromIndex'
// 对象字面量只能指定已知类型，'d' 不存在 'FromIndex' 类型上
const bad: FromIndex = { b: 1, c: 2, d: 3 }
```

```ts
type FromSomeIndex<K extends string> = { [key in K]: number }
```

### Symbol

Since [typescript v4.4.0](https://github.com/microsoft/TypeScript/pull/44512):

```ts
type SymbolMap<T> = Record<symbol, T>
```

```ts
interface PropertyMap {
  [key: string]: string
  [key: number]: string
  [key: symbol]: string
}
```

```ts
type Colors = Record<symbol, number>

const red = Symbol('red')
const green = Symbol('green')
const blue = Symbol('blue')

const colors: Colors = {}

colors[red] = 255 // Assignment of a number is allowed
const redVal = colors[red] // 'redVal' has the type 'number'

colors[blue] = 'da ba dee' // Error: Type 'string' is not assignable to type 'number'.
```

### Template Literal

Since [typescript v4.4.0](https://github.com/microsoft/TypeScript/pull/44512):

```ts
type DataProps = Record<`data-${string}`, string>

interface OptionsWithDataProps extends Options {
  // Permit any property starting with 'data-'.
  [optName: `data-${string}`]: unknown
}

const b: OptionsWithDataProps = {
  'width': 100,
  'height': 100,
  'data-blah': true, // Works!
  'unknown-property': true, // Error! 'unknown-property' wasn't declared in 'OptionsWithDataProps'.
}
```

```ts
type Thing<T> = Record<'a' | `foo${T}` | symbol, string>

type StringThing = Thing<string>
// => { [a: string, [x: `foo${string}`]: string, [x: symbol]: string }
type BarThing = Thing<'bar'>
// => { [a: string, foobar: string, [x: symbol]: string }
```

### Indexed Access Types

```ts
const MyArray = [
  { name: 'Alice', age: 15 },
  { name: 'Bob', age: 23 },
  { name: 'Eve', age: 38 },
]

type Person = (typeof MyArray)[number]
// type Person = {
//   name: string;
//   age: number;
// }

type Age = (typeof MyArray)[number]['age']
// type Age = number

type Age2 = Person['age']
// type Age2 = number

interface UserRoleConfig {
  visitor: ['up']
  user: ['view', 'create', 'update']
  admin: ['view', 'create', 'update', 'delete']
}

type Role = UserRoleConfig[keyof UserRoleConfig][number]
// type Role = 'up' | 'view' | 'create' | 'update' | "delete"
```

`{ [K in keyof T]: indexedType }[keyof T]` 返回键名 (键名组成的联合类型):

```ts
type PickByValueType<T, ValueType> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends ValueType ? K : never }[keyof T]
>

type OmitByValueType<T, ValueType> = Pick<
  T,
  { [K in keyof T]-?: T[K] extends ValueType ? never : K }[keyof T]
>

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]

type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never
}[keyof T]

type FunctionTypeKeys<T extends object> = {
  [K in keyof T]-?: T[K] extends Function ? K : never
}[keyof T]

type Filter<T extends object, ValueType> = {
  [K in keyof T as ValueType extends T[K] ? K : never]: T[K]
} // Filter<{name: string; id: number;}, string> => {name: string;}

type FuncName<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
```
