---
sidebar_position: 15
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Iterator

一个 Iterator 对象封装访问和遍历一个聚集对象中的各个构件的方法:

- 任何实现 Iterable 接口的数据结构都可以被实现 Iterator 接口的结构**消费** (`Consume`).
- 迭代器 (Iterator) 是按需创建的一次性对象.
  每个迭代器都会关联一个可迭代对象, 而迭代器会暴露迭代其关联可迭代对象的 API.
- 迭代器无须了解与其关联的可迭代对象的内部结构, 只需要知道如何取得连续的值.
- 无需暴露聚集对象的内部表示, 符合开放封闭原则.
- 实现统一遍历接口, 抽离遍历逻辑与业务逻辑, 符合单一职责原则.

:::tip[Iterator Use Case]

- Collection data structure.
- 遍历对象:
  - 顺序迭代器.
  - 逆序迭代器.
  - 可中止迭代器.
- Generator.

:::

```ts
class Stuff {
  constructor() {
    this.a = 11
    this.b = 22
  }

  [Symbol.iterator]() {
    const self = this
    let i = 0

    return {
      next() {
        return {
          done: i > 1,
          value: self[i++ === 0 ? 'a' : 'b'],
        }
      },
    }
  }

  get backwards() {
    const self = this
    let i = 0

    return {
      next() {
        return {
          done: i > 1,
          value: self[i++ === 0 ? 'b' : 'a'],
        }
      },
      // Make iterator iterable
      [Symbol.iterator]() {
        return this
      },
    }
  }
}

const stuff = new Stuff()
for (const item of stuff) console.log(`${item}`)
for (const item of stuff.backwards) console.log(`${item}`)
```

Implement polyfill with iterator:

```ts
function activeXUploader() {
  try {
    return new ActiveXObject('ActiveX.Upload') // IE 上传控件.
  } catch (e) {
    return false
  }
}

function flashUploader() {
  if (supportFlash()) {
    const str = '<object type="application/x-shockwave-flash"></object>'
    return $(str).appendTo($('body'))
  }

  return false
}

function formUploader() {
  const str = '<input name="file" type="file" class="ui-file"/>' // 表单上传控件.
  return $(str).appendTo($('body'))
}

function upload(...uploaderList) {
  for (const uploader of uploaderList) {
    const uploadResult = uploader()
    if (uploadResult !== false)
      return uploadResult
  }
}

const result = upload([activeXUploader, flashUploader, formUploader])
const result = upload([activeXUploader, flashUploader])
const result = upload([activeXUploader, formUploader])
const result = upload([flashUploader, formUploader])
```
