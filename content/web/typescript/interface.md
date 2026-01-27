---
sidebar_position: 6
tags: [Web, TypeScript, Interface]
---

# Interface

```ts
interface Name {
  first: string
  second: string
}

let name: Name
name = {
  first: 'John',
  second: 'Doe',
}

name = {
  // Error: 'Second is missing'
  first: 'John',
}

name = {
  // Error: 'Second is the wrong type'
  first: 'John',
  second: 1337,
}
```

## Function

- Use a method function for class instances (`this` binding to function).
- Use a property function otherwise.

```ts
interface HasBothFunctionTypes {
  method: () => string
  property: () => string
}
```

## Implements

Implementing interface is purely safety check,
does not copy any interface members onto class definition:

```ts
interface Crazy {
  new (): {
    hello: number
  }
}

class CrazyClass implements Crazy {
  constructor() {
    return { hello: 123 }
  }
}

// Because
const crazy = new CrazyClass() // crazy would be { hello:123 }
```

## Extends

### Overridden Properties

Overridden property must be assignable to its base property
(ensure derived interface assignable to base interface):

```ts
interface WithNullableName {
  name: string | null
}

interface WithNonNullableName extends WithNullableName {
  name: string
}

interface WithNumericName extends WithNullableName {
  name: number | string
}
// Error: Interface 'WithNumericName' incorrectly
// extends interface 'WithNullableName'.
//   Types of property 'name' are incompatible.
//     Type 'string | number' is not assignable to type 'string | null'.
//       Type 'number' is not assignable to type 'string'.
```

### Merging

Interface merging isn’t used often in day-to-day `TypeScript` development,
but useful for augmenting interfaces from
external 3rd-party packages (e.g. `Cypress`) or built-in global interfaces (e.g. `Window`):

```ts
// Lib a.d.ts
interface Point {
  x: number
  y: number
}
declare const myPoint: Point

// Lib b.d.ts
interface Point {
  z: number
}

// Your code
const z = myPoint.z // Allowed!
```

Extend 3rd-party module interface:

```ts
declare module '3rd-party-module' {
  export interface Interface {
    foo: { title: string }
  }
}
```

## Type Alias

- Type aliases may not participate in declaration merging, but interfaces can.
- Interfaces may only be used to declare the shapes of object, not re-name primitives.
- The key distinction is that a type cannot be re-opened to add new properties,
  an interface which is always extendable.

```ts
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"'
window.ts.transpileModule(src, {})
```
