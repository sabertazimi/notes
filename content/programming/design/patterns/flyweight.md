---
sidebar_position: 11
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Flyweight

减小内存开销 (**Performance Optimization**):

- **内部**信息: 对象中的内部方法所需信息/属性, 一个单独的享元可替代大量具有相同内在信息的对象.
- **外部**状态: 作为方法参数, 使之适应不同的外部状态 (Context), 实例对象差异.
- 某个类型的对象有大量的实例, 对这些实例进行分类, 合并相同分类的对象, 只创建少量实例 (享元).
- 通过享元工厂来管理一组享元:
  - 当所需享元已存在时, 返回已存在享元.
  - 当所需享元不存在时, 创建新享元.

:::tip[Flyweight Use Case]

- Objects pool: e.g. text processing.
- DOM nodes pool: e.g. user interface.
- Event delegation.
- Reduce similar object instances.
- Caching.

:::

## Factory

```ts
class Flyweight {
  constructor(make, model, processor) {
    this.make = make
    this.model = model
    this.processor = processor
  }
}

class FlyweightFactory {
  static flyweights = new Map()

  static get(make, model, processor) {
    const id = make + model

    if (FlyweightFactory.flyweights.has(id))
      return FlyweightFactory.flyweights.get(id)

    const flyweight = new Flyweight(make, model, processor)
    FlyweightFactory.flyweights.set(id, flyweight)
    return flyweight
  }

  static getCount() {
    return FlyweightFactory.flyweights.size
  }
}

class Computer {
  constructor(make, model, processor, memory, tag) {
    this.flyweight = FlyweightFactory.get(make, model, processor)
    this.memory = memory
    this.tag = tag
    this.getMake = function () {
      return this.flyweight.make
    }
  }
}

class ComputerCollection {
  computers = new Map()

  add(make, model, processor, memory, tag) {
    this.computers.set(tag, new Computer(make, model, processor, memory, tag))
  }

  get(tag) {
    return this.computers.get(tag)
  }

  getCount() {
    return this.computers.size
  }
}

const computers = new ComputerCollection()

computers.add('Dell', 'Studio XPS', 'Intel', '5G', 'Y755P')
computers.add('Dell', 'Studio XPS', 'Intel', '6G', 'X997T')
computers.add('Dell', 'Studio XPS', 'Intel', '2G', 'NT777')
computers.add('Dell', 'Studio XPS', 'Intel', '2G', '0J88A')
computers.add('HP', 'Envy', 'Intel', '4G', 'CNU883701')
computers.add('HP', 'Envy', 'Intel', '2G', 'TXU003283')

console.log(`Computers: ${computers.getCount()}`) // 6.
console.log(`Flyweights: ${FlyweightFactory.getCount()}`) // 2.
```

## Pool

DOM pool:

```ts
class ObjectPool<T, P> {
  objectFactory: () => T
  objectPool: [T]

  constructor(objectFactory: () => T) {
    this.objectFactory = objectFactory
    this.objectPool = []
  }

  create(...args: P) {
    return objectPool.length === 0 ? objectFactory(args) : objectPool.shift()
  }

  recover(obj: T) {
    objectPool.push(obj)
  }
}

const iframeFactory = new ObjectPool(() => {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  iframe.onload = function () {
    iframe.onload = null
    iframeFactory.recover(iframe)
  }
  return iframe
})

const iframe1 = iframeFactory.create()
iframe1.src = 'http:// baidu.com'
const iframe2 = iframeFactory.create()
iframe2.src = 'http:// QQ.com'
setTimeout(() => {
  const iframe3 = iframeFactory.create()
  iframe3.src = 'http:// 163.com'
}, 3000)
```
