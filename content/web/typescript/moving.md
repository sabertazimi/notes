---
sidebar_position: 14
tags: [Web, TypeScript, Moving, Typeof, Keyof]
---

# Moving

## Typeof

```ts
// 捕获字符串的类型与值
const foo = 'Hello World'

// 使用一个捕获的类型
let bar: typeof foo

// bar 仅能被赋值 'Hello World'
bar = 'Hello World' // ok
bar = 'anything else' // Error
```

## Keyof

`keyof foo` get literal types of `foo` keys (`Object.keys`):

```ts
const colors = {
  red: 'red',
  blue: 'blue',
}

type Colors = keyof typeof colors

let color: Colors // color 的类型是 'red' | 'blue' (literal types)
color = 'red' // ok
color = 'blue' // ok
color = 'anythingElse' // Error
```
