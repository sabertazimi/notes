---
sidebar_position: 4
tags: [Programming, Design, Design Pattern, Creation Pattern]
---

# Prototype

可以使用原型模式来减少创建新对象的成本:

- `Object.create()`.
- Object shallow clone.

```ts
class Car {
  constructor(name, model) {
    this.name = name
    this.model = model
  }

  SetName(name) {
    console.log(`${name}`)
  }

  clone() {
    return new Car(this.name, this.model)
  }
}

const car = new Car()
car.SetName('Audi')

const car2 = car.clone()
car2.SetName('BMW')
```
