---
sidebar_position: 17
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Observer

- 被观察者 (`Subject`) 维护一组观察者列表,
  每当被观察者状态改变时,
  调用 `notify` 函数,
  此函数遍历调用观察者 (`Observer`) 的 `update` 函数 (自定义逻辑).
- Decouple `Subject` and `Observer`:
  each depends on `Abstraction` not `Implementation`.
- 摆脱持续轮询模式, 在合适时机发布消息.

:::tip[Observer Use Case]

- Decouple.
- 跨层级通信.
- Message channel.
- 异步编程.
- Event handling.

:::

```ts
class ObserverList {
  constructor() {
    this.observerList = []
  }

  add(obj) {
    return this.observerList.push(obj)
  }

  count() {
    return this.observerList.length
  }

  get(index) {
    if (index > -1 && index < this.observerList.length)
      return this.observerList[index]
  }

  indexOf(obj, startIndex) {
    let i = startIndex

    while (i < this.observerList.length) {
      if (this.observerList[i] === obj)
        return i

      i++
    }

    return -1
  }

  removeAt(index) {
    this.observerList.splice(index, 1)
  }
}

class Subject {
  constructor() {
    this.observers = new ObserverList()
  }

  addObserver(observer) {
    this.observers.add(observer)
  }

  removeObserver(observer) {
    this.observers.removeAt(this.observers.indexOf(observer, 0))
  }

  notify(context) {
    const observerCount = this.observers.count()

    for (let i = 0; i < observerCount; i++)
      this.observers.get(i).update(context)
  }
}

class Observer {
  update(context) {}
}
```
