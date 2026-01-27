---
sidebar_position: 12
tags: [Web, TypeScript, Conditional, Gymnastics]
---

# Conditional

- Basic conditional types
  just like `if else` statement.
- Nested conditional types
  just like `switch case` statement.
- Distributive conditional types
  just like `map` statement (`loop` statement) on `union` type.
- Conditional types make `TypeScript` become real programming type system:
  `TypeScript` type system is [Turing Complete](https://github.com/microsoft/TypeScript/issues/14833).

```ts
interface Animal {
  live: () => void
}
interface Dog extends Animal {
  woof: () => void
}

type Example1 = Dog extends Animal ? number : string
// => type Example1 = number

type Example2 = RegExp extends Animal ? number : string
// => type Example2 = string
```

## Nested

- Conditional types can be nested.
- 通过嵌套条件类型, 可以将类型约束收拢到精确范围.

```ts
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends undefined
        ? 'undefined'
        : T extends Function
          ? 'function'
          : 'object'
```

## Index

Conditional types are able to access members of provided types:

```ts
interface QueryOptions {
  throwIfNotFound: boolean
}

type QueryResult<Options extends QueryOptions>
  = Options['throwIfNotFound'] extends true ? string : string | undefined

declare function retrieve<Options extends QueryOptions>(
  key: string,
  options?: Options
): Promise<QueryResult<Options>>

// Returned type: string | undefined
await retrieve('1')

// Returned type: string | undefined
await retrieve('2', { throwIfNotFound: Math.random() > 0.5 })

// Returned type: string
await retrieve('3', { throwIfNotFound: true })
```

## Mapped

```ts
type MakeAllMembersFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : () => T[K]
}

type MemberFunctions = MakeAllMembersFunctions<{
  alreadyFunction: () => string
  notYetFunction: number
}>
// Type:
// {
//   alreadyFunction: () => string,
//   notYetFunction: () => number,
// }
```

## Distributive

Type distributivity:

- Conditional types in which checked type is `naked type parameter` are called DCT.
- DCT are automatically distributed over union types during instantiation.
- When conditional types act on a generic type,
  they become distributive when given a union type.
- `( A | B | C ) extends T ? X : Y` 相当于
  `(A extends T ? X : Y) | (B extends T ? X : Y) | (B extends T ? X : Y)`.
- 没有被额外包装的联合类型参数, 在条件类型进行判定时会将联合类型分发, 分别进行判断.

```ts
// "string" | "function"
type T1 = TypeName<string | (() => void)>

// "string" | "object"
type T2 = TypeName<string | string[]>

// "object"
type T3 = TypeName<string[] | number[]>
```

```ts
type Naked<T> = T extends boolean ? 'Y' : 'N'
type Wrapped<T> = [T] extends [boolean] ? 'Y' : 'N'

/*
 * 先分发到 Naked<number> | Naked<boolean>
 * 结果是 "N" | "Y"
 */
type Distributed = Naked<number | boolean>

/*
 * 不会分发 直接是 [number | boolean] extends [boolean]
 * 结果是 "N"
 */
type NotDistributed = Wrapped<number | boolean>
```
