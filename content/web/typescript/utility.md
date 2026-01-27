---
sidebar_position: 15
tags: [Web, TypeScript, Utility]
---

# Utility

## Null

```ts
type Nullish = null | undefined
type Nullable<T> = T | null
type NonUndefinedable<A> = A extends undefined ? never : A
type NonNullable<T> = T extends null | undefined ? never : T
```

## Boolean

```ts
type Falsy = false | '' | 0 | null | undefined
const isFalsy = (val: unknown): val is Falsy => !val
```

## Primitive

```ts
type Primitive = string | number | boolean | bigint | symbol | null | undefined

function isPrimitive(val: unknown): val is Primitive {
  if (val === null || val === undefined)
    return true

  const typeDef = typeof val

  const primitiveNonNullishTypes = [
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol',
  ]

  return primitiveNonNullishTypes.includes(typeDef)
}
```

## Promise

```ts
// TypeScript 4.5.
// Get naked Promise<T> type.
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

// A = string.
type A = Awaited<Promise<string>>

// B = number.
type B = Awaited<Promise<Promise<number>>>

// C = boolean | number.
type C = Awaited<boolean | Promise<number>>
```

```ts
type Sync<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<infer Result>
    ? (...args: Parameters<T[K]>) => Result
    : T[K]
}

interface AsyncInterface {
  compute: (arg: number) => Promise<boolean>
  createString: () => Promise<string>
}

type SyncInterface = Sync<AsyncInterface>
// type SyncInterface = {
//     compute: (arg: number) => boolean;
//     createString: () => String;
// }
```

Better types for [`Promise.all()`](https://spin.atomicobject.com/better-promise-all):

```ts
type ShallowPromisify<T>
  = T extends Array<infer V>
    ? Array<Promise<V>>
    : T extends object
      ? { [K in keyof T]: Promise<T[K]> }
      : Promise<T>

type ShallowSettled<T>
  = T extends Array<infer V>
    ? Array<PromiseSettledResult<V>>
    : T extends object
      ? { [K in keyof T]: PromiseSettledResult<T[K]> }
      : PromiseSettledResult<T>

type DeepAwaited<T>
  = T extends Promise<infer U>
    ? DeepAwaited<U>
    : T extends Array<infer V>
      ? Array<DeepAwaited<V>>
      : T extends object
        ? { [K in keyof T]: DeepAwaited<T[K]> }
        : T

type DeepSettled<T>
  = T extends Promise<infer U>
    ? PromiseSettledResult<DeepSettled<U>>
    : T extends Array<infer V>
      ? Array<DeepSettled<V>>
      : T extends object
        ? { [K in keyof T]: DeepSettled<T[K]> }
        : T
```

## Proxy

```ts
interface Proxy<T> {
  get: () => T
  set: (value: T) => void
}

type Proxify<T> = { [P in keyof T]: Proxy<T[P]> }
```

## Recursive

```ts
type DeepReadonly<T> = {
  +readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P]
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object | undefined ? DeepRequired<T[P]> : T[P]
}
```

## Nominal Brand

[Nominal type system](https://github.com/microsoft/TypeScript/issues/202):

```ts
interface FooId extends string {
  _fooIdBrand: string
}

interface BarId extends string {
  _barIdBrand: string
}

let fooId: FooId
let barId: BarId

// 类型安全
fooId = barId // error
barId = fooId // error
fooId = barId as FooId // error
barId = fooId as BarId // error
```

```ts
const typeSym = Symbol('type')
const valueSym = Symbol('value')

type Brand<B extends string, T> = T extends
  | undefined
  | null
  | number
  | boolean
  | bigint
  ? { [typeSym]: B, [valueSym]: T }
  : T & { [typeSym]: B }

type Flavor<F extends string, T> = T & {
  [typeSym]?: F
}
```

## Lodash

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type
```
