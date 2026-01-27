---
sidebar_position: 13
tags: [Web, JavaScript, ECMAScript, Object]
---

# Prototype

## Object Oriented Programming

共用方法, 单独属性, 封装细节:

- 原型代理 (享元模式): 利用享元模式共享公有属性与通用方法.
- 实例状态 (原型克隆): 利用原型克隆拥有各自属性值.
- 封装性 (闭包式继承): 利用闭包方法实现属性私有化.

## Prototype Chain

![原型链](./figures/prototype.png '原型链')

- 实例化对象仅有属性`__proto__`, 没有属性`prototype`, 函数才具有属性 `prototype` (指向引擎为其自动创建的原型对象):
  `Instance.__proto__ === Constructor.prototype`.
- 所有引用类型 (包括对象/数组/函数/构造函数) 都有属性`__proto__`(隐式原型).
- 所有函数/构造函数的 `__proto__` 都指向 `Function.prototype`.
- 除`Object.prototype.__proto__`指向 null 外, 其余函数/构造函数的原型对象的`__proto__` 都指向 `Object.prototype`.
- 除`Object.create()`外, 所新建对象的 `__proto__` 指向构造该对象的构造函数的`原型对象(prototype)`.
- 除`typeof Function.prototype` 为 'function' 外, 其余函数/构造函数的原型对象都为 '对象'(`typeof` 为 'object').
- 先有`Object.prototype`(原型链顶端),
  `Function.prototype` 继承`Object.prototype`而产生,
  最后`Object/Function/Array/其它构造函数`继承`Function.prototype`而产生.

```ts
// True because of `Object` is `function Object()` and inherited from `Function.prototype`
// Object has its own `prototype` property refer to `Object.prototype`
const truthy = Object[[proto]] === Function.prototype

// True because of `Array` is `function Array()` and inherited from `Function.prototype`
// Array has its own `prototype` property refer to `Array.prototype`
const truthy = Array[[proto]] === Function.prototype

// True because of Function is `function Function()` and inherited from `Function.prototype`
// Function has its own `prototype` property refer to `Function.prototype`
const truthy = Function[[proto]] === Function.prototype

// True because of Object.prototype is the top of inheritance chains (null is Object.prototype.__proto__)
// all `object/function/array instance`.__proto__......__proto__ refer to Object.prototype
const truthy = Function[[proto]][[proto]] === Object.prototype

// True:
const truthy = Object instanceof Function
const truthy = Function instanceof Object
```

:::tip[Prototype Chain]

- `Object.__proto__` -> `Function.prototype`.
- `Function.prototype.__proto__` -> `Object.prototype`.
- `Object.prototype.__proto__` -> `null`.

:::

`__proto__`:

- `[[proto]]` getter is `Object.getPrototypeOf(object)`.
- `[[proto]]` setter is `Object.setPrototypeOf(object, prototype)`.

```ts
function Foo(value) {
  this.val = value
}

// Auto create FooPrototype
// Foo.prototype -> FooPrototype
// FooPrototype.constructor -> [function Foo]
// foo.__proto__ -> FooPrototype
const foo = new Foo(2)
```

```ts
function Person() {}
const person1 = new Person()
const person2 = new Person()

console.log(person1 !== Person) // true
console.log(person1 !== Person.prototype) // true
console.log(Person.prototype !== Person) // true

console.log(person1.__proto__ === Person.prototype) // true
console.log(person1.__proto__.constructor === Person) // true
console.log(person1.__proto__ === person2.__proto__) // true

console.log(Person.prototype.isPrototypeOf(person1)) // true
console.log(Person.prototype.isPrototypeOf(person2)) // true
console.log(Object.getPrototypeOf(person1) === Person.prototype) // true

console.log(person1 instanceof Person) // true
console.log(person1 instanceof Object) // true
console.log(Person.prototype instanceof Object) // true
```

下面五种操作 (方法/属性/运算符) 可以触发 JS 引擎读取一个对象的原型,
可以触发 `getPrototypeOf()` 代理方法的运行:

```ts
const obj = {}
const p = new Proxy(obj, {
  getPrototypeOf(target) {
    return Array.prototype
  },
})

console.log(
  Object.getPrototypeOf(p) === Array.prototype, // true
  Reflect.getPrototypeOf(p) === Array.prototype, // true
  Array.prototype.isPrototypeOf(p), // true
  p.__proto__ === Array.prototype, // true
  p instanceof Array // true
)
```

Set the inherited property will **create own property**
(**overrides** value of inherited property):

```ts
const proto = {
  protoProp: 'a',
}

const obj = {
  __proto__: proto,
  objProp: 'b',
}

// In the beginning, obj has one own property:
assert.deepEqual(Object.keys(obj), ['objProp'])

obj.protoProp = 'x'

// Created a new own property:
assert.deepEqual(Object.keys(obj), ['objProp', 'protoProp'])

// The inherited property itself is unchanged:
assert.equal(proto.protoProp, 'a')

// The own property overrides the inherited property:
assert.equal(obj.protoProp, 'x')
```

## Conversion

对象转换为布尔值:

- 直接转换为 true (包装类型也一样), 不调用 valueOf 和 toString.

对象转换为数字:

- 如果对象具有 valueOf 方法 (返回原始值),
  则将该原始值转换为数字 (转换失败会返回 NaN), 并返回这个数字.
- 如果对象具有 toString 方法 (返回原始值),
  则将该原始值转换为数字 (转换失败会返回 NaN), 并返回这个数字.
- 转换失败, 抛出 `TypeError`.

对象转换为字符串:

- 如果对象具有 toString 方法 (返回原始值),
  则将该原始值转换为字符串, 并返回该字符串.
- 如果对象具有 valueOf 方法 (返回原始值),
  则将该原始值转换为字符串, 并返回该字符串.
- 转换失败, 抛出 `TypeError`.

| `x`         | `Object(x)`                                      |
| ----------- | ------------------------------------------------ |
| `undefined` | `{}`                                             |
| `null`      | `{}`                                             |
| `boolean`   | `new Boolean(x)`                                 |
| `number`    | `new Number(x)`                                  |
| `bigint`    | An instance of BigInt (`new` throws `TypeError`) |
| `string`    | `new String(x)`                                  |
| `symbol`    | An instance of Symbol (`new` throws `TypeError`) |
| `object`    | `x`                                              |

```ts
// 保存原始的valueOf
const valueOf = Object.prototype.valueOf
const toString = Object.prototype.toString

// 添加valueOf日志
Object.prototype.valueOf = function () {
  console.log('valueOf')
  return valueOf.call(this)
}

// 添加toString日志
Object.prototype.toString = function () {
  console.log('toString')
  return toString.call(this)
}

const a = {}
const b = new Boolean(false)

if (a) {
  console.log(1)
}

if (b) {
  console.log(2)
}

// output:
// 1
// 2
// 未调用valueOf和toString, 符合 [对象到布尔值] 的转换规则
```

```ts
// 保存原始的valueOf
const valueOf = Object.prototype.valueOf
const toString = Object.prototype.toString

// 添加valueOf日志
Object.prototype.valueOf = function () {
  console.log('valueOf')
  return valueOf.call(this)
}

// 添加toString日志
Object.prototype.toString = function () {
  console.log('toString')
  return toString.call(this)
}

let a = {}
console.log(++a)

// output:
// valueOf
// toString
// NaN
// 1. valueOf方法返回的是对象本身, 不是原始值, 继续执行
// 2. toString方法返回的是”[object Object]”, 是原始值(字符串), 将字符串转换为数字NaN
```

```ts
// 保存原始的valueOf
const valueOf = Object.prototype.valueOf
const toString = Object.prototype.toString

// 添加valueOf日志
Object.prototype.valueOf = function () {
  console.log('valueOf')
  return '1' // 强制返回原始值
}

// 添加toString日志
Object.prototype.toString = function () {
  console.log('toString')
  return toString.call(this)
}

let a = {}
console.log(++a)

// output:
// valueOf
// 2
// valueOf 返回原始值(字符串), 直接将该字符串转换为数字, 得到 1
```

```ts
// 保存原始的valueOf
const valueOf = Object.prototype.valueOf
const toString = Object.prototype.toString

// 添加valueOf日志
Object.prototype.valueOf = function () {
  console.log('valueOf')
  return valueOf.call(this)
}

// 添加toString日志
Object.prototype.toString = function () {
  console.log('toString')
  return toString.call(this)
}

const a = {}
alert(a)

// output:
// toString
// 弹出 "[object Object]"
// 调用toString方法, 返回了字符串”[object Object]”, 对象最终转换为该字符串
```

```ts
// 保存原始的valueOf
const valueOf = Object.prototype.valueOf
const toString = Object.prototype.toString

// 添加valueOf日志
Object.prototype.valueOf = function () {
  console.log('valueOf')
  return valueOf.call(this)
}

// 添加toString日志
Object.prototype.toString = function () {
  console.log('toString')
  return this
}

const a = {}
alert(a)

// output:
// toString
// valueOf
// Uncaught TypeError: Cannot convert object to primitive value
// 调用toString方法, 返回的不是 primitive value, 继续执行
// 调用valueOf方法, 返回的不是 primitive value, 继续执行
// 抛出 TypeError
```

## Constructor

- 首字母大写.
- 所有函数 (包括构造函数) 有 `prototype` 属性.

### Literal Object

对象字面量由 `Object` 构造函数隐式构造;

```ts
const obj = {
  name: 'sabertazimi',
}

console.log(obj[[proto]] === Object.prototype) // true
```

### New

`new` 构造函数作用原理如下:

- 形成原型链: 隐式原型指向构造函数的原型对象 `obj.__proto__ = constructor.prototype`
- 构造函数对象 (Constructor) 与原型对象 (Prototype) 之间形成闭环:
  - `Constructor.prototype = Prototype`.
  - `Prototype.constructor = Constructor`.

```ts
function newInstance(constructor, ...args) {
  // var this = Object.create(Person.prototype);
  // this.__proto__ = F.prototype
  // F.prototype = Person.prototype
  // 即 this.__proto__ = Person.prototype;
  const obj = {}
  obj[[proto]] = constructor.prototype
  constructor.apply(obj, args)
  return obj
}

// =>
const instance = new Constructor(arguments)
```

```ts
function Employee(name) {
  this.name = name
  this.getName = function () {
    return this.name
  }
}

const employee = newInstance(Employee, 'Jack')
// =>
const employee = new Employee('Jack')
```

`new.target`:

```ts
function Foo() {
  if (!new.target)
    throw new Error('Foo() must be called with new')
}
```

```ts
function Waffle() {
  // 当未使用 `new` 关键字时, `this` 指向全局对象
  if (!(this instanceof Waffle))
    return new Waffle()

  // 正常构造函数
  this.tastes = 'yummy'
}
```

### Create

- 原型式继承非常适合不需要单独创建构造函数, 但仍然需要在对象间共享信息的场合.
- 属性中包含的引用值始终会在相关对象间共享.

```ts
Object.create = function (o) {
  if (arguments.length > 1) {
    throw new Error(
      'Object.create implementation only accepts the first parameter.'
    )
  }

  function F() {}
  F.prototype = o
  return new F()
}
// 1. `F.prototype === o`.
// 2. `new F()` lead to `f.__proto__ === F.prototype`.
// Finally: `f.__proto__ === o`.
```

### Return Value

- 返回 `this` 或 user-defined literal object.
- 当返回值为**基本类型**时, 仍然可得到 `this` 指针指向的原有对象.

```ts
function ObjectMaker() {
  this.name = 'This is it'
  // user-defined literal object
  // 直接忽略 this.name.
  const that = {}
  that.name = 'And that\'s that'
  return that
}
```

```ts
function MyClass() {
  this.name = 'sven'
  return 'anne' // 返回 string.
}
const obj = new MyClass()
console.log(obj.name) // 输出: sven .
```

### Instance

若在实例对象的原型链 (`__proto__`) 中能找到构造函数的 `prototype` 属性 (Prototype 对象),
则返回`true`, 否则返回`false`:

```ts
// true only if
// 1. Foo.__proto__ === Bar.prototype
// 2. Foo.__proto__......__proto__ === Bar.prototype
console.log(Foo instanceof Bar)
```
