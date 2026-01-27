---
sidebar_position: 20
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Strategy

- 改变对象的内核/算法, 一个 Strategy 对象封装一个算法, 相互可以替换.
- 利用组合 + 委托 + 多态, 避免复杂的分支语句.
- 将单个策略进行抽象封装:
  - 解耦.
  - 复用.
- JS 中, 函数作为参数与返回值时, 可以实现隐式的策略模式:
  函数作为第一公民, 无需将 Strategy 封装成策略对象, 可以直接传递或返回策略函数.

:::tip[Strategy Use Case]

- 布局管理器:
  - 环境对象：面板.
  - 抽象策略：抽象布局管理接口.
  - 具体策略：具体布局管理类.
- 表单验证 (Validator).
- 动画策略.
- 存在大量 if-else 场景.
- 重构代码.
- Algorithm selection.
- Testing and mocking.

:::

Change strategy:

```ts
const OutputFormat = Object.freeze({
  markdown: 0,
  html: 1,
})

class ListStrategy {
  start(buffer) {}
  end(buffer) {}
  addListItem(buffer, item) {}
}

class MarkdownListStrategy extends ListStrategy {
  addListItem(buffer, item) {
    buffer.push(` * ${item}`)
  }
}

class HtmlListStrategy extends ListStrategy {
  start(buffer) {
    buffer.push('<ul>')
  }

  end(buffer) {
    buffer.push('</ul>')
  }

  addListItem(buffer, item) {
    buffer.push(`  <li>${item}</li>`)
  }
}

class TextProcessor {
  constructor(outputFormat) {
    this.buffer = []
    this.setOutputFormat(outputFormat)
  }

  setOutputFormat(format) {
    switch (format) {
      case OutputFormat.markdown:
        this.listStrategy = new MarkdownListStrategy()
        break
      case OutputFormat.html:
        this.listStrategy = new HtmlListStrategy()
        break
      default:
        throw new Error('Unsupported output format!')
    }
  }

  appendList(items) {
    this.listStrategy.start(this.buffer)
    for (const item of items) this.listStrategy.addListItem(this.buffer, item)
    this.listStrategy.end(this.buffer)
  }

  clear() {
    this.buffer = []
  }

  toString() {
    return this.buffer.join('\n')
  }
}

const tp = new TextProcessor()
tp.setOutputFormat(OutputFormat.markdown)
tp.appendList(['one', 'two', 'three'])
console.log(tp.toString())

tp.clear()
tp.setOutputFormat(OutputFormat.html)
tp.appendList(['one', 'two', 'three'])
console.log(tp.toString())
```

Remove `if-else` statements:

```ts
// 违反开放封闭原则
function activity(type, price) {
  if (type === 'pre')
    return price * 0.95
  else if (type === 'onSale')
    return price * 0.9
  else if (type === 'back')
    return price * 0.85
  else if (type === 'limit')
    return price * 0.8
}

// 利用 Strategy 进行重构
const activity = new Map([
  ['pre', price => price * 0.95],
  ['onSale', price => price * 0.9],
  ['back', price => price * 0.85],
  ['limit', price => price * 0.8],
])

const getActivityPrice = (type, price) => activity.get(type)(price)

// 新增新手活动
activity.set('newcomer', price => price * 0.7)
```

```ts
module.exports = (function () {
  const manager = {}

  // command to be encapsulated
  manager.isNull = function (nu) {
    return toString.apply(nu) === '[object Null]'
  }
  manager.isArray = function (arr) {
    return toString.apply(arr) === '[object Array]'
  }
  manager.isString = function (str) {
    return toString.apply(str) === '[object String]'
  }

  // public api
  function execute(command, ...args) {
    return manager[command] && manager[command](...args)
  }

  function run(command) {
    return manager[command] && manager[command]()
  }

  return {
    execute,
    run,
  }
})()
```

Form validator:

```ts
const errorMsg = rules[rule](element, limits)
```
