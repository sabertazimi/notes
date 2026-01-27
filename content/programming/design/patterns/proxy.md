---
sidebar_position: 12
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Proxy

通过一个代理对象:

- 临时存储原对象方法调用产生的一系列结果 (新建对象),
  减少重复对象的产生.
- 代理对象可以为中间过程透明地增加额外逻辑: 预加载/缓存/合并/验证/转换等.
- 昂贵的对象创建或任务执行可以延迟到代理对象中执行.
- 代理类型: 远程/保护/虚拟/缓存代理.
- 符合开放封闭原则.

:::tip[Proxy Use Case]

- 远程代理:
  - 代理软件.
  - 防火墙代理.
- 保护代理:
  - 跨域处理.
  - 路由保护代理.
- 虚拟代理:
  - 图片预加载.
  - 智能引用代理: C++ smart pointer, Rust `RefCell`, Linux file descriptor.
  - 写时拷贝代理: 内存页, DLL.
- 缓存代理:
  - 缓存函数.
  - 缓存服务器: React Query (cache data).

:::

代理模式强调一种关系 (Proxy 与它的实体之间的关系), 这种关系可以静态地表达.
装饰者模式用于一开始不能确定对象的全部功能.
代理模式通常只有一层`代理-本体`的引用,
装饰者模式经常会形成一条长长的装饰链.

```ts
class Percentage {
  constructor(percent) {
    this.percent = percent
  }

  toString() {
    return `${this.percent}&`
  }

  valueOf() {
    return this.percent / 100
  }
}

const fivePercent = new Percentage(5)
console.log(fivePercent.toString())
console.log(`5% of 50 is ${50 * fivePercent}`)
```

```ts
function GeoCoder() {
  this.getLatLng = function (address) {
    if (address === 'Amsterdam')
      return '52.3700° N, 4.8900° E'
    else if (address === 'London')
      return '51.5171° N, 0.1062° W'
    else if (address === 'Paris')
      return '48.8742° N, 2.3470° E'
    else if (address === 'Berlin')
      return '52.5233° N, 13.4127° E'
    else return ''
  }
}

function GeoProxy() {
  const geocoder = new GeoCoder()
  const geocache = {}

  return {
    getLatLng(address) {
      if (!geocache[address])
        geocache[address] = geocoder.getLatLng(address)

      log.add(`${address}: ${geocache[address]}`)
      return geocache[address]
    },
    getCount() {
      let count = 0

      for (const code in geocache) count++

      return count
    },
  }
}
```

Proxy in `Vue`:

```ts
const original = { name: 'jeff' }

const reactive = new Proxy(original, {
  get(target, key) {
    console.log('Tracking: ', key)
    return target[key]
  },
  set(target, key, value) {
    console.log('updating UI...')
    return Reflect.set(target, key, value)
  },
})

console.log(reactive.name) // 'Tracking: name'
reactive.name = 'bob' // 'updating UI...'
```
