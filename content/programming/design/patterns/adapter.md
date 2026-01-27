---
sidebar_position: 6
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Adapter

适配器通过内部使用新接口规定的属性/方法, 创建一个外观与旧接口一致的方法
(兼容旧代码):

- `old.method()`.
- `adapter.method()`:
  实现此 method 时, 使用了新接口规定的属性/方法.
- 符合开放封闭原则.

:::tip[Adapter Use Case]

- API adapter.
- 3rd-party code adapter.
- Legacy code adapter (version compatibility).
- Testing and mocking.

:::

```ts
class Calculator1 {
  constructor() {
    this.operations = function (value1, value2, operation) {
      switch (operation) {
        case 'add':
          return value1 + value2
        case 'sub':
          return value1 - value2
        default:
          throw new Error('Unsupported operations!')
      }
    }
  }
}

class Calculator2 {
  constructor() {
    this.add = function (value1, value2) {
      return value1 + value2
    }

    this.sub = function (value1, value2) {
      return value1 - value2
    }
  }
}

class CalcAdapter {
  constructor() {
    const cal2 = new Calculator2()

    this.operations = function (value1, value2, operation) {
      switch (operation) {
        case 'add':
          return cal2.add(value1, value2)
        case 'sub':
          return cal2.sub(value1, value2)
        default:
          throw new Error('Unsupported operations!')
      }
    }
  }
}
```

```ts
// old interface
function Shipping() {
  this.request = function (zipStart, zipEnd, weight) {
    // ...
    return '$49.75'
  }
}

// new interface
function AdvancedShipping() {
  this.login = function (credentials) {
    /* ... */
  }
  this.setStart = function (start) {
    /* ... */
  }
  this.setDestination = function (destination) {
    /* ... */
  }
  this.calculate = function (weight) {
    return '$39.50'
  }
}

// adapter interface
function AdapterShipping(credentials) {
  const shipping = new AdvancedShipping()

  shipping.login(credentials)

  return {
    request(zipStart, zipEnd, weight) {
      shipping.setStart(zipStart)
      shipping.setDestination(zipEnd)
      return shipping.calculate(weight)
    },
  }
}
```

```ts
const shipping = new Shipping()
const adapterShipping = new AdapterShipping(credentials)

// original shipping object and interface
let cost = shipping.request('78701', '10010', '2 lbs')
log.add(`Old cost: ${cost}`)
// new shipping object with adapted interface
cost = adapter.request('78701', '10010', '2 lbs')
```
