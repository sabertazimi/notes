---
sidebar_position: 16
tags: [Web, JavaScript, ECMAScript, Class]
---

# Class

## Prototype

- `Class` 定义不能提升.
- `Class` 具有块作用域.
- `Class` 内部为严格模式.
- `Class` 内部定义方法不可枚举.
- `Class` 所有方法 (包括静态方法和实例方法) 都没有原型对象 `.prototype`,
  没有 `[[construct]]`, 不能使用 `new` 调用.
- `Class` 必须使用 `new` 调用, 否则会报错.
- `typeof Class`: `function`.

```ts
class A {
  constructor(value) {
    this.val = value
  }
}

class B extends A {
  constructor(value) {
    super(value)
    console.log('New')
  }
}

const b = new B(6)

console.log(B[[proto]] === A) // true
console.log(B.prototype.constructor === B) // true
console.log(B.prototype[[proto]] === A.prototype) // true
console.log(b[[proto]] === B.prototype) // true

function AA(value) {
  this.val = value
}

function BB(value) {
  AA.call(this, value)
}

BB.prototype = Object.create(AA.prototype)
BB.prototype.constructor = BB

const bb = new BB(6)

console.log(BB[[proto]] === Function.prototype) // true (not consistence to Class)
console.log(BB.prototype.constructor === BB) // true
console.log(BB.prototype[[proto]] === AA.prototype) // true
console.log(bb[[proto]] === BB.prototype) // true
```

|                                        | Writable | Enumerable | Configurable |
| -------------------------------------- | -------- | ---------- | ------------ |
| `Foo.prototype`                        | false    | false      | false        |
| `Foo.prototype.constructor`            | false    | false      | true         |
| Static properties `Foo.*`              | true     | false      | true         |
| Prototype properties `Foo.prototype.*` | true     | false      | true         |

## Inheritance

- 隔离: 添加到 `this` 的所有属性都会存在于不同的实例上.
- 共享:
  - 在类块中定义的所有方法都会定义在类的原型上.
  - 静态属性定义在类本身上.

```ts
class Person {
  constructor() {
    // 添加到 this 的所有内容都会存在于不同的实例上
    this.locate = () => console.log('instance', this)
  }

  // 在类块中定义的所有内容都会定义在类的原型上
  locate() {
    console.log('prototype', this)
  }

  // 定义在类本身上
  static locate() {
    console.log('class', this)
  }
}

const p = new Person()
p.locate() // instance, Person {}
Person.prototype.locate() // prototype, {constructor: ... }
Person.locate() // class, class Person {}
```

[![Class Inheritance](./figures/class-inheritance.png)](https://exploringjs.com/es6/ch_classes.html#_prototype-chains)

| `Class` Definition | `Class` Prototype    | `Class.prototype` Prototype |
| ------------------ | -------------------- | --------------------------- |
| `C`                | `Function.prototype` | `Object.prototype`          |
| `C extends null`   | `Function.prototype` | `null`                      |
| `C extends Object` | `Object`             | `Object.prototype`          |
| `C extends B`      | `B`                  | `B.prototype`               |

:::tip[ES5 vs ES6 Inheritance]

- ES5 继承先创造子类实例对象 `this`,
  然后再将父类的属性与方法添加到 `this` 上 (`Parent.apply(this)`),
  **实例在前继承在后**.
- ES6 继承先将父类的属性与方法添加到 `this` 上 (必须先调用 `super()` 方法),
  然后再用子类的构造函数修改 `this`,
  **继承在前实例在后**.
- ES5 继承 `Child.__proto__ === Function.prototype`.
- ES6 继承 `Child.__proto__ === Parent`, 子类可以直接通过 `[[proto]]` 寻址到父类.

:::

### Super

`super`:

- `super` 只能在派生类构造函数和静态方法中使用.
- 不能单独引用 `super` 关键字, 要么用它调用构造函数, 要么用它引用静态方法.
- 调用 `super()` 会调用父类构造函数, 并将返回的实例赋值给 `this`.
- 在类构造函数中, 不能在调用 `super()` 之前引用 `this`.
- `super()` 等价于调用构造函数, 若需给父类构造函数传参, 则需手动传入.
- 若没有显式定义派生类构造函数, 在实例化派生类时会自动调用 `super()`, 且会自动传入所有传给派生类的参数.
- 若显式定义了派生类构造函数, 则必须在其中调用 `super()` , 或返回一个对象.
- 实例化时检测 `new.target` 是不是抽象基类, 可以阻止对抽象基类的实例化.

### Abstract

```ts
class Shape {
  constructor() {
    if (new.target === Shape)
      throw new TypeError('This class cannot be instantiated directly.')
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super()
    this.length = length
    this.width = width
  }
}

const x = new Shape() // throws error
const y = new Rectangle(3, 4) // no error
console.log(y instanceof Shape) // true
```

## Expression

```ts
// Anonymous class expression
const Person = class {}

// Named class expression
const Person = class PersonName {
  identify() {
    console.log(Person.name, PersonName.name)
  }
}

const p = new Person()
p.identify() // PersonName PersonName
console.log(Person.name) // PersonName
console.log(PersonName) // ReferenceError: PersonName is not defined
```

## Constructor

```ts
class A {
  constructor() {
    console.log(new.target.name)
  }
}

class B extends A {
  constructor() {
    super()
    console.log('New')
  }
}

const a = new A() // logs "A"
const b = new B() // logs "B"

class C {
  constructor() {
    console.log(new.target)
  }
}

class D extends C {
  constructor() {
    super()
    console.log('New')
  }
}

const c = new C() // logs class C{constructor(){console.log(new.target);}}
const d = new D() // logs class D extends C{constructor(){super();}}
```

## Private

- Private access.
- Aren't stored in `.prototype`.
- Aren't create instance own properties.

```ts
class Dong {
  constructor() {
    this.#name = 'dog'
    this.#age = 20
    this.friend = 'cat'
  }

  hello() {
    return `I'm ${this.#name} ${this.#age} years old`
  }
}
```

Private member can only be accessed inside body of its class,
can’t even access it from a subclass:

```ts
class SuperClass {
  #superProp = 'superProp'
}

class SubClass extends SuperClass {
  getSuperProp() {
    return this.#superProp
  }
}
// SyntaxError: Private field '#superProp'
// must be declared in an enclosing class

class Color {
  #name

  constructor(name) {
    this.#name = name
  }

  static getName(obj) {
    return obj.#name
  }
}

class Person {
  #name

  constructor(name) {
    this.#name = name
  }
}

// Can’t access the private slot #name of a Person:
assert.equal(Color.getName(new Color('green')), 'green')
assert.throws(() => Color.getName(new Person('Jane')), {
  name: 'TypeError',
  message:
    'Cannot read private member #name from'
    + ' an object whose class did not declare it',
})
```

Private member never clash,
they aren't stored in `.prototype` objects and aren't inherited:

```ts
class SuperClass {
  #privateField = 'super'

  getSuperPrivateField() {
    return this.#privateField
  }
}

class SubClass extends SuperClass {
  #privateField = 'sub'

  getSubPrivateField() {
    return this.#privateField
  }
}

const inst = new SubClass()
assert.equal(inst.getSuperPrivateField(), 'super')
assert.equal(inst.getSubPrivateField(), 'sub')
```

Private member can't be accessed by `Reflect.ownKeys()`:

```ts
class InstPrivateClass {
  #privateField1 = 'private field 1'
  #privateField2
  constructor(value) {
    this.#privateField2 = value
  }
}

// No instance properties were created
const inst = new InstPrivateClass('constructor argument')
assert.deepEqual(Reflect.ownKeys(inst), [])
```

Private member `WeakMap` polyfill:

```ts
function classPrivateFieldGet(receiver, state) {
  return state.get(receiver)
}

function classPrivateFieldSet(receiver, state, value) {
  state.set(receiver, value)
}

const dongName = new WeakMap()
const dongAge = new WeakMap()

class Dong {
  constructor() {
    classPrivateFieldSet(this, dongName, 'dong')
    classPrivateFieldSet(this, dongAge, 20)
  }

  hello() {
    return `I'm ${classPrivateFieldGet(this, dongName)}, ${classPrivateFieldGet(
      this,
      dongAge
    )} years old`
  }
}
```

## Public

```ts
class SuperClass {
  superProp = console.log('superProp')

  constructor() {
    console.log('super-constructor')
  }
}

class SubClass extends SuperClass {
  subProp = console.log('subProp')

  constructor() {
    console.log('BEFORE super()')
    super()
    console.log('AFTER super()')
  }
}

const sub = new SubClass()
// Output:
// 'BEFORE super()'
// 'superProp'
// 'super-constructor'
// 'subProp'
// 'AFTER super()'
```

## Static

Static blocks have access to class private member.
Its mainly useful whenever set up multiple static fields.

```ts
class Foo {
  static #count = 0

  get count() {
    return Foo.#count
  }

  static {
    try {
      const lastInstances = loadLastInstances()
      Foo.#count += lastInstances.length
    } catch {}
  }
}
```

```ts
class Translator {
  static translations = {
    yes: 'ja',
  }

  static englishWords = []
  static germanWords = []
  static {
    for (const [english, german] of Object.entries(translations)) {
      this.englishWords.push(english)
      this.germanWords.push(german)
    }
  }
}
```

```ts
class SuperClass {
  static superField1 = console.log('superField1')
  static {
    assert.equal(this, SuperClass)
    console.log('static block 1 SuperClass')
  }

  static superField2 = console.log('superField2')
  static {
    console.log('static block 2 SuperClass')
  }
}

class SubClass extends SuperClass {
  static subField1 = console.log('subField1')
  static {
    assert.equal(this, SubClass)
    console.log('static block 1 SubClass')
  }

  static subField2 = console.log('subField2')
  static {
    console.log('static block 2 SubClass')
  }
}

// Output:
// 'superField1'
// 'static block 1 SuperClass'
// 'superField2'
// 'static block 2 SuperClass'
// 'subField1'
// 'static block 1 SubClass'
// 'subField2'
// 'static block 2 SubClass'
```

## Best Practices

Avoid using `class` when:

- Singleton:
  - Only instantiate your class **once in a given runtime**.
- Stateless:
  - Data structure **no need for local state**.
  - Data structure **no need for extending**.
- Redundant:
  - Minimal public methods.
  - Constructors are only used for dependency injection.
  - Constructors are always called with same arguments.
- Want to avoid using `this`.
