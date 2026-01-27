---
sidebar_position: 4
tags: [Web, JavaScript, ECMAScript, Symbol]
---

# Symbol

- A Symbol is a **unique** and **immutable** primitive value
  and may be used as the key of an Object property.
- Symbols don't auto-convert to strings and can't convert to numbers.
- `Symbol.for(key)` create global Symbol registry.

```ts
// eslint-disable-next-line symbol-description -- empty symbol description
const genericSymbol = Symbol()
// eslint-disable-next-line symbol-description -- empty symbol description
const otherGenericSymbol = Symbol()
console.log(genericSymbol === otherGenericSymbol) // false

const fooSymbol = Symbol('foo')
const otherFooSymbol = Symbol('foo')
console.log(fooSymbol === otherFooSymbol) // false

const fooGlobalSymbol = Symbol.for('foobar') // 创建新符号
const otherFooGlobalSymbol = Symbol.for('foobar') // 重用已有符号
console.log(fooGlobalSymbol === otherFooGlobalSymbol) // true
```

Symbol [methods](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol#static_properties):

- `[Symbol.iterator]()`: `for of`.
- `[Symbol.asyncIterator]()`: `for await of`.
- `[Symbol.match/replace/search/split](target)`: `string.match/replace/search/split(classWithSymbolFunction)`.
- `[Symbol.hasInstance](instance)`: `instance of`.
- `[Symbol.species]()`: constructor for making derived objects.
- `[Symbol.toPrimitive](hint)`: 强制类型转换.
- `[Symbol.toStringTag]()`: string used by `Object.prototype.toString()`.

## Conversion

| Convert To | Explicit Conversion       | Coercion (Implicit Conversion) |
| ---------- | ------------------------- | ------------------------------ |
| `boolean`  | `Boolean(sym)` → OK       | `!sym` → OK                    |
| `number`   | `Number(sym)` → TypeError | `sym * 2` → TypeError          |
| `string`   | `String(sym)` → OK        | `'' + sym` → TypeError         |
|            | `sym.toString()` → OK     | `${sym}` → TypeError           |
| `object`   | `Object(sym)` → OK        | `Object.keys(sym)` → OK        |

## Iterator

```ts
const arr = ['a', 'b', 'c']
const iter = arr[Symbol.iterator]()

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

## HasInstance

```ts
class Bar {}
class Baz extends Bar {
  static [Symbol.hasInstance](instance) {
    return false
  }
}

const b = new Baz()

console.log(Bar[Symbol.hasInstance](b)) // true
console.log(b instanceof Bar) // true
console.log(Baz[Symbol.hasInstance](b)) // false
console.log(b instanceof Baz) // false

const ReferenceType = {
  [Symbol.hasInstance](value) {
    return (
      value !== null
      && (typeof value === 'object' || typeof value === 'function')
    )
  },
}

const obj1 = {}
console.log(obj1 instanceof Object) // true
console.log(obj1 instanceof ReferenceType) // true

const obj2 = Object.create(null)
console.log(obj2 instanceof Object) // false
console.log(obj2 instanceof ReferenceType) // true
```

## Species

```ts
class MyClass {
  static get [Symbol.species]() {
    return this
  }

  constructor(value) {
    this.value = value
  }

  clone() {
    return new this.constructor[Symbol.species](this.value)
  }
}

class MyDerivedClass1 extends MyClass {
  // empty
}

class MyDerivedClass2 extends MyClass {
  static get [Symbol.species]() {
    return MyClass
  }
}

const instance1 = new MyDerivedClass1('foo')
const instance2 = new MyDerivedClass2('bar')
const clone1 = instance1.clone()
const clone2 = instance2.clone()

console.log(clone1 instanceof MyClass) // true
console.log(clone1 instanceof MyDerivedClass1) // true
console.log(clone2 instanceof MyClass) // true
console.log(clone2 instanceof MyDerivedClass2) // false
```

## ToPrimitive

```ts
class Temperature {
  constructor(degrees) {
    this.degrees = degrees
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'string':
        return `${this.degrees}\u00B0` // degrees symbol
      case 'number':
        return this.degrees
      case 'default':
        return `${this.degrees} degrees`
    }
  }
}

const freezing = new Temperature(32)

console.log(`${freezing}!`) // "32 degrees!"
console.log(freezing / 2) // 16
console.log(String(freezing)) // "32째"
```

## ToStringTag

```ts
class Person {
  constructor(name) {
    this.name = name
  }

  get [Symbol.toStringTag]() {
    return 'Person'
  }
}

const me = new Person('Me')

console.log(me.toString()) // "[object Person]"
console.log(Object.prototype.toString.call(me)) // "[object Person]"
```

| Value                     | `toString` Tag |
| ------------------------- | -------------- |
| undefined                 | `Undefined`    |
| null                      | `Null`         |
| Array object              | `Array`        |
| string object             | `String`       |
| arguments                 | `Arguments`    |
| callable                  | `Function`     |
| error object              | `Error`        |
| boolean object            | `Boolean`      |
| number object             | `Number`       |
| date object               | `Date`         |
| regular expression object | `RegExp`       |
| (Otherwise)               | `Object`       |
