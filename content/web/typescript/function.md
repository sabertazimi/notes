---
sidebar_position: 5
tags: [Web, TypeScript, Function]
---

# Function

## Interface

```ts
interface ReturnString {
  (): string
}

declare const foo: ReturnString

const bar = foo() // bar 被推断为一个字符串
```

```ts
interface Complex {
  (foo: string, bar?: number, ...others: boolean[]): number
}
```

```ts
interface Overloaded {
  (foo: string): string
  (foo: number): number
}

// 实现接口的一个例子：
function stringOrNumber(foo: number): number
function stringOrNumber(foo: string): string
function stringOrNumber(foo: any): any {
  if (typeof foo === 'number')
    return foo * foo
  else if (typeof foo === 'string')
    return `hello ${foo}`
}

const overloaded: Overloaded = stringOrNumber

// 使用
const str = overloaded('') // str 被推断为 'string'
const num = overloaded(123) // num 被推断为 'number'
```

WangCai `extends` Dog `extends` Animal.
Animal => WangCai 是 Dog => Dog 的子类型:

- 函数参数的类型兼容是反向的, 称之为逆变.
- 返回值的类型兼容是正向的, 称之为协变.

## Arrow

在一个以 number 类型为参数，以 string 类型为返回值的函数中:

```ts
const simple: (foo: number) => string = foo => foo.toString()
```

## Overload

函数签名的类型重载:

- 多个重载签名和一个实现签名.
- 定义了重载签名, 则实现签名**对外不可见**.
- 实现签名必须兼容重载签名.

```ts
// 重载
function padding(all: number)
function padding(topAndBottom: number, leftAndRight: number)
function padding(top: number, right: number, bottom: number, left: number)
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a
  } else if (c === undefined && d === undefined) {
    c = a
    d = b
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d,
  }
}

padding(1) // Okay: all
padding(1, 1) // Okay: topAndBottom, leftAndRight
padding(1, 1, 1, 1) // Okay: top, right, bottom, left
padding(1, 1, 1) // Error: Not a part of the available overloads
```

:::tip[Function Overload]

`TypeScript` 中的函数重载没有任何运行时开销.
它只允许你记录希望调用函数的方式,
并且编译器会检查其余代码.

:::

## Rest Parameters

```ts
type Arr = readonly unknown[]
function partialCall<T extends Arr, U extends Arr, R>(
  f: (...args: [...T, ...U]) => R,
  ...headArgs: T
) {
  return (...tailArgs: U) => f(...headArgs, ...tailArgs)
}

function foo(x: string, y: number, z: boolean) {}
const f1 = partialCall(foo, 100)
const f2 = partialCall(foo, 'hello', 100, true, 'oops')
const f3 = partialCall(foo, 'hello')

f3(123, true)
f3()
f3(123, 'hello')
```

## Gymnastics

- Input types tend to be **broader** than output types.
- **Optional** properties and **union** types are more common in parameter types.
- To reuse types between parameters and return types,
  introduce a canonical form (for return types) and a looser form (for parameters).

```ts
interface LngLat {
  lng: number
  lat: number
}

type LngLatLike = LngLat | { lon: number, lat: number } | [number, number]

interface Camera {
  center: LngLat
  zoom: number
  bearing: number
  pitch: number
}

interface CameraOptions extends Omit<Partial<Camera>, 'center'> {
  center?: LngLatLike
}

function createCamera(options: CameraOptions): Camera {
  return CameraFactory.create(options)
}
```
