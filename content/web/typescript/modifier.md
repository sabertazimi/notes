---
sidebar_position: 7
tags: [Web, TypeScript, Modifier, Public, Protected, Private, Readonly]
---

# Modifiers

## Member Access

`public`, `protected` and `private`:

```ts
class Singleton {
  private static instance: Singleton
  private constructor() {
    // ..
  }

  public static getInstance() {
    if (!Singleton.instance)
      Singleton.instance = new Singleton()

    return Singleton.instance
  }

  someMethod() {}
}

const someThing = new Singleton() // Error: constructor of 'singleton' is private

const instance = Singleton.getInstance() // do some thing with the instance
```

## Readonly

`readonly`:

```ts
interface Foo {
  readonly bar: number
  readonly bas: number
}

// 初始化
const foo: Foo = { bar: 123, bas: 456 }

// 不能被改变
foo.bar = 456 // Error: foo.bar 为仅读属性
```

`readonly` indexable signature:

```ts
type Foo = Readonly<Record<number, number>>

// 使用

const foo: Foo = { 0: 123, 2: 345 }
console.log(foo[0]) // ok (读取)
foo[0] = 456 // Error: 属性只读
```

`readonly` class properties:

```ts
class Foo {
  readonly bar = 1 // OK
  readonly baz: string
  constructor() {
    this.baz = 'hello' // OK
  }
}
```

`readonly` generic type:

```ts
interface Foo {
  bar: number
  bas: number
}

type FooReadonly = Readonly<Foo>

const foo: Foo = { bar: 123, bas: 456 }
const fooReadonly: FooReadonly = { bar: 123, bas: 456 }

foo.bar = 456 // ok
fooReadonly.bar = 456 // Error: bar 属性只读
```

`readonly` `React` props:

```ts
class Something extends React.Component<{ foo: number }, { baz: number }> {
  someMethod() {
    this.props.foo = 123 // Error: props 是不可变的
    this.state.baz = 456 // Error: 你应该使用 this.setState()
  }
}
```

`readonly` is shallow:

```ts
const dates: readonly Date[] = [new Date()]
dates.push(new Date()) // Error
dates[0].setFullYear(2037) // OK
```
