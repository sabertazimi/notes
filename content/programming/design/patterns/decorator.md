---
sidebar_position: 9
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Decorator

- 重写/重载/扩展对象原有的行为 (Methods), 但不改变对象原有属性.
- 可以添加新属性, 并围绕新属性扩展对象的原行为 e.g. 原对象只会说中文, 装饰后同时说中文与英文.
- 避免了通过继承来为类型添加新职责, 通过继承的方式容易造成子类的膨胀.
- 保持接口的一致性, **动态**改变对象的外观/职责.
- ConcreteDecorator 类: `private ClassName component` 拥有一个对象引用.
- 在 JS 中, 可以利用 `Closure` (闭包) + `Higher Order Function` (高阶函数) 快速实现装饰器模式.
- 符合开放封闭原则和单一职责模式.

:::tip[Decorator Use Case]

- Graphics and UI Frameworks: e.g. extended React HOC components.
- ES2016 and TypeScript `@decorator`.
- Guard: form validator.
- Interceptor:
  - HTTP request and response decorator.
  - Web statistic tool.
- Transformer.
- AOP: Aspect Oriented Programming.

:::

```ts
function __decorate(decorators, target) {
  const decorateTarget = target

  for (const decorator of decorators)
    decorateTarget = decorator(decorateTarget) || decorateTarget

  return decorateTarget
}
```

```ts
class MacBook {
  constructor() {
    this.cost = 997
    this.screenSize = 11.6
  }

  getCost() {
    return this.cost
  }

  getScreenSize() {
    return this.screenSize
  }
}

// Decorator 1
class Memory extends MacBook {
  constructor(macBook) {
    super()
    this.macBook = macBook
  }

  getCost() {
    return this.macBook.getCost() + 75
  }
}

// Decorator 2
class Engraving extends MacBook {
  constructor(macBook) {
    super()
    this.macBook = macBook
  }

  getCost() {
    return this.macBook.getCost() + 200
  }
}

// Decorator 3
class Insurance extends MacBook {
  constructor(macBook) {
    super()
    this.macBook = macBook
  }

  getCost() {
    return this.macBook.getCost() + 250
  }
}

let mb = new MacBook()
mb = new Memory(mb)
mb = new Engraving(mb)
mb = new Insurance(mb)

console.log(mb.getCost())
// Outputs: 1522
console.log(mb.getScreenSize())
// Outputs: 11.6
```
