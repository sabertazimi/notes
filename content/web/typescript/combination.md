---
sidebar_position: 10
tags: [Web, TypeScript, Combination, Union, Intersection]
---

# Combination

## Union

```ts
function formatCommandLine(command: string[] | string) {
  let line = ''

  if (typeof command === 'string')
    line = command.trim()
  else
    line = command.join(' ').trim()

  // Do stuff with line: string
}
```

## Discriminated Union

```ts
interface Square {
  kind: 'square'
  size: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

interface Circle {
  kind: 'circle'
  radius: number
}

type Shape = Square | Rectangle | Circle

function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size
    case 'rectangle':
      return s.width * s.height
    case 'circle':
      return Math.PI * s.radius ** 2
    default: {
      const _exhaustiveCheck: never = s
      return _exhaustiveCheck
    }
  }
}
```

`IteratorResult` discriminated union:

```ts
interface IteratorYieldResult<TYield> {
  done?: false // boolean literal type
  value: TYield
}

interface IteratorReturnResult<TReturn> {
  done: true // boolean literal type
  value: TReturn
}

type IteratorResult<T, TReturn = any>
  = | IteratorYieldResult<T>
    | IteratorReturnResult<TReturn>
```

Rust-style discriminated union:

```ts
type Option<T> = Some<T> | None
interface Some<T> {
  kind: 'Some'
  value: T
}
interface None {
  kind: 'None'
}

type Result<TResult, TError> = Success<TResult> | Failure<TError>
interface Success<T> {
  kind: 'Success'
  value: T
}
interface Failure<T> {
  kind: 'Failure'
  error: T
}
```

Prefer `Unions of Interfaces` to `Interfaces of Unions`:

```ts
// BAD design.
interface BadLayer {
  layout: FillLayout | LineLayout | PointLayout
  paint: FillPaint | LinePaint | PointPaint
}

// GOOD design.
interface FillLayer {
  type: 'fill'
  layout: FillLayout
  paint: FillPaint
}

interface LineLayer {
  type: 'line'
  layout: LineLayout
  paint: LinePaint
}

interface PointLayer {
  type: 'point'
  layout: PointLayout
  paint: PointPaint
}

type GoodLayer = FillLayer | LineLayer | PointLayer
```

## Intersection

`intersection` type 具有所有类型的功能:

```ts
function extend<T, U>(first: T, second: U): T & U {
  const result = {} as T & U
  for (const id in first) {
    ;(result as T)[id] = first[id]
  }
  for (const id in second) {
    if (!Object.prototype.hasOwnProperty.call(result, id)) {
      ;(result as U)[id] = second[id]
    }
  }

  return result
}

const x = extend({ a: 'hello' }, { b: 42 })

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a
const b = x.b
```
