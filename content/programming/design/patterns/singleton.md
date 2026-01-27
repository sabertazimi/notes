---
sidebar_position: 5
tags: [Programming, Design, Design Pattern, Creation Pattern]
---

# Singleton

:::tip[Singleton Use Case]

- Redux/VueX global store.
- Window 对象.
- 全局配置.
- 全局缓存.
- 线程池.
- 内存池.

:::

## Class

```ts
class Singleton {
  constructor() {
    const instance = this.constructor.instance
    if (instance)
      return instance
    this.constructor.instance = this
  }

  say() {
    console.log('Saying...')
  }
}

class Singleton {
  private static instance: Singleton
  private constructor() {}

  public static getInstance() {
    if (!Singleton.instance)
      Singleton.instance = new Singleton()

    return Singleton.instance
  }

  someMethod() {}
}

const instance = Singleton.getInstance()
```

## Closure

```ts
const createLoginLayer = (function (creator) {
  let singleton

  return function () {
    if (!singleton)
      singleton = creator()
    return singleton
  }
})(loginCreator)
```
