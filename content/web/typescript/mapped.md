---
sidebar_position: 13
tags: [Web, TypeScript, Mapped, Gymnastics]
---

# Mapped

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Partial<T> = { [P in keyof T]?: T[P] }
type ReadonlyPartial<T> = { readonly [P in keyof T]?: T[P] }
type Required<T> = { [P in keyof T]-?: T[P] }
type Nullable<T> = { [P in keyof T]: T[P] | null }
type NonNullable<T> = T extends null | undefined ? never : T
type Clone<T> = { [P in keyof T]: T[P] }
type Stringify<T> = { [P in keyof T]: string }
```

## Union

With distributive conditional type:

```ts
type Extract<T, U> = T extends U ? T : never
type Exclude<T, U> = T extends U ? never : T
```

## Key

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type Record<K extends keyof any, T> = { [P in K]: T }
```

## Function

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

type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any
  ? U
  : unknown
```

## Gymnastics

Combine with:

- `in keyof`.
- `readonly`.
- `?`.
- `-`.
- `as`.
- Template literal types.
- Conditional types.
- Builtin types.
- Other mapped types.
- Other custom types.

```ts
// Removes 'readonly' attributes from a type's properties
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type DeepImmutable<T> = {
  readonly [K in keyof T]: keyof T[K] extends undefined ? T[K] : Immutable<T[K]>
}

interface LockedAccount {
  readonly id: string
  readonly name: string
}

type UnlockedAccount = Mutable<LockedAccount>
// type UnlockedAccount = {
//   id: string;
//   name: string;
// };
```

```ts
// Mapped types via `as` type
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property]
}

interface Person {
  name: string
  age: number
  location: string
}

type LazyPerson = Getters<Person>
// type LazyPerson = {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```

```ts
// Remove the 'kind' property
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property]
}

interface Circle {
  kind: 'circle'
  radius: number
}

type KindlessCircle = RemoveKindField<Circle>
// type KindlessCircle = {
//   radius: number;
// }
```

```ts
// Mapped type via conditional type
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false
}

interface DBFields {
  id: { format: 'incrementing' }
  name: { type: string, pii: true }
}

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>
// type ObjectsNeedingGDPRDeletion = {
//   id: false;
//   name: true;
// }
```

## References

- [Builtin](https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L1519-L1667) mapped types.
