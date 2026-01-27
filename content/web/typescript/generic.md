---
sidebar_position: 11
tags: [Web, TypeScript, Generic]
---

# Generics

## Function

```ts
function reverse<T>(items: T[]): T[] {
  const toReturn = []
  for (let i = items.length - 1; i >= 0; i--)
    toReturn.push(items[i])

  return toReturn
}
```

## Parameters

```ts
type Event
  = | {
    type: 'LogIn'
    payload: {
      userId: string
    }
  }
  | {
    type: 'SignOut'
  }

function sendEvent<Type extends Event['type']>(
  ...args: Extract<Event, { type: Type }> extends { payload: infer Payload }
    ? [type: Type, payload: Payload]
    : [type: Type]
) {
  // Send event ...
}
```

## Class

```ts
// 创建一个泛型类
class Queue<T> {
  private data = []
  push = (item: T) => this.data.push(item)
  pop = (): T => this.data.shift()
}

// 简单的使用
const queue = new Queue<number>()
queue.push(0)
queue.push('1') // Error：不能推入一个 `string`，只有 number 类型被允许
```

```ts
interface Listener<T> {
  (event: T): any
}

interface Disposable {
  dispose: () => any
}

class TypedEvent<T> {
  private listeners: Listener<T>[] = []
  private listenersOnce: Listener<T>[] = []

  public on = (listener: Listener<T>): Disposable => {
    this.listeners.push(listener)

    return {
      dispose: () => this.off(listener),
    }
  }

  public once = (listener: Listener<T>): void => {
    this.listenersOnce.push(listener)
  }

  public off = (listener: Listener<T>) => {
    const callbackIndex = this.listeners.indexOf(listener)
    if (callbackIndex > -1)
      this.listeners.splice(callbackIndex, 1)
  }

  public emit = (event: T) => {
    this.listeners.forEach(listener => listener(event))

    this.listenersOnce.forEach(listener => listener(event))
    this.listenersOnce = []
  }

  public pipe = (te: TypedEvent<T>): Disposable => {
    return this.on(e => te.emit(e))
  }
}
```

## Type Alias

```ts
type CreatesValue<Input, Output> = (input: Input) => Output

// Type: (input: string) => number
let creator: CreatesValue<string, number>

creator = text => text.length // Ok

creator = text => text.toUpperCase()
//                ~~~~~~~~~~~~~~~~~~
// Error: Type 'string' is not assignable to type 'number'.
```

## Discriminated Union

```ts
type Result<Data> = FailureResult | SuccessfulResult<Data>

interface FailureResult {
  error: Error
  succeeded: false
}

interface SuccessfulResult<Data> {
  data: Data
  succeeded: true
}

function handleResult(result: Result<string>) {
  if (result.succeeded) {
    // Type of result: SuccessfulResult<string>
    console.log(`We did it! ${result.data}`)
  } else {
    // Type of result: FailureResult
    console.error(`Em... ${result.error}`)
  }

  console.log(result.data)
  //                 ~~~~
  // Error: Property 'data' does not exist on type 'Result<string>'.
  //   Property 'data' does not exist on type 'FailureResult'.
}
```

## Explicit

```ts
class Foo<T> {
  foo: T
}

const FooNumber = Foo as { new (): Foo<number> } // ref 1

function id<T>(x: T) {
  return x
}

const idNum = id as { (x: number): number }
```

## Default

```ts
interface Quote<T = string> {
  value: T
}

const explicit: Quote<number> = { value: 123 }
const implicit: Quote = {
  value: 'Be yourself. The world worships the original.',
}
const mismatch: Quote = { value: 123 }
//                                     ~~~
// Error: Type 'number' is not assignable to type 'string'.

interface KeyValuePair<Key, Value = Key> {
  key: Key
  value: Value
}

// Type: KeyValuePair<string, number>
const allExplicit: KeyValuePair<string, number> = {
  key: 'rating',
  value: 10,
}

// Type: KeyValuePair<string>
const oneDefaulting: KeyValuePair<string> = {
  key: 'rating',
  value: 'ten',
}

const firstMissing: KeyValuePair = {
  //            ~~~~~~~~~~~~
  // Error: Generic type 'KeyValuePair<Key, Value>'
  // requires between 1 and 2 type arguments.
  key: 'rating',
  value: 10,
}
```

## Constrained

Constrained union types:

```ts
interface Lengthwise {
  length: number
}

function createList<T extends number | Lengthwise>(): T[] {
  return [] as T[]
}

const numberList = createList<number>() // ok
const stringList = createList<string>() // ok
const arrayList = createList<any[]>() // ok
const boolList = createList<boolean>() // error
```

Constrained template literal types:

```ts
type RemoveMapsHelper<T> = T extends `maps:${infer U}` ? U : T
type RemoveMaps<T> = {
  [K in keyof T as RemoveMapsHelper<K>]: T[K]
}

interface Data {
  'maps:longitude': string
  'maps:latitude': string
  'awesome': boolean
}
type ShapedData = RemoveMaps<Data>
// type ShapedData = {
//   longitude: string;
//   latitude: string;
//   awesome: boolean;
// }
```

Constrained index types:

```ts
function getValue<T, Key extends keyof T>(container: T, key: Key) {
  return container[key]
}

const roles = {
  favorite: 'Fargo',
  others: ['Almost Famous', 'Burn After Reading', 'NorthLand'],
}

const favorite = getValue(roles, 'favorite') // Type: string
const others = getValue(roles, 'others') // Type: string[]
const missing = getValue(roles, 'extras')
//                         ~~~~~~~~
// Error: Argument of type '"extras"' is not assignable
// to parameter of type '"favorite" | "others"'.

function getDeepValue<
  T,
  FirstKey extends keyof T,
  SecondKey extends keyof T[FirstKey],
>(target: T, firstKey: FirstKey, secondKey: SecondKey): T[FirstKey][SecondKey] {
  return target[firstKey][secondKey]
}

const target = {
  foo: {
    a: true,
    b: 2,
  },
  bar: {
    c: 'cool',
    d: 2,
  },
}

const result1 = getDeepValue(target, 'foo', 'a') // boolean
const result2 = getDeepValue(target, 'bar', 'c') // string
```

Constrained default types:

```ts
interface Props {
  a1: 'Foo'
  a2: 'Bar'
  a3: 'FooBar'
  b1: 'b1'
  b2: 'b2'
  b3: 'b3'
}

type ExtractValues<T, Keys extends keyof T = Extract<keyof T, `a${string}`>> = {
  [K in Keys]: T[K]
}[Keys]

type Values = ExtractValues<Props>
// type Values = 'Foo' | 'Bar' | 'FooBar'
```

## Gymnastics

在类型编程里, 泛型就是变量:

```ts
function pick<T extends object, U extends keyof T>(obj: T, keys: U[]): T[U][] {
  return keys.map(key => obj[key])
}
```

:::tip[Generic Golden Rule]

[Type `T` parameters should appear twice](https://effectivetypescript.com/2020/08/12/generics-golden-rule):

If a type parameter only appears in one location,
strongly **reconsider** if actually need it.

:::
