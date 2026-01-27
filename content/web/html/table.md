---
sidebar_position: 13
tags: [Web, HTML, Table]
---

# Table

`<table>` 元素添加了以下属性和方法:

- `caption`: 指向 `<caption>` 元素的指针 (如果存在).
- `tBodies`: 包含 `<tbody>` 元素的 HTMLCollection.
- `tFoot`: 指向 `<tfoot>` 元素 (如果存在).
- `tHead`: 指向 `<thead>` 元素 (如果存在).
- `rows`: 包含表示所有行的 HTMLCollection.
- `createTHead()`: 创建 `<thead>` 元素, 放到表格中, 返回引用.
- `createTFoot()`: 创建 `<tfoot>` 元素, 放到表格中, 返回引用.
- `createCaption()`: 创建 `<caption>` 元素, 放到表格中, 返回引用.
- `deleteTHead()`: 删除 `<thead>` 元素.
- `deleteTFoot()`: 删除 `<tfoot>` 元素.
- `deleteCaption()`: 删除 `<caption>` 元素.
- `deleteRow(pos)`: 删除给定位置的行.
- `insertRow(pos)`: 在行集合中给定位置插入一行.

`<tbody>` 元素添加了以下属性和方法:

- `rows`: 包含 `<tbody>` 元素中所有行的 HTMLCollection.
- `deleteRow(pos)`: 删除给定位置的行.
- `insertRow(pos)`: 在行集合中给定位置插入一行, 返回该行的引用.

`<tr>` 元素添加了以下属性和方法:

- `cells`: 包含 `<tr>` 元素所有表元的 HTMLCollection.
- `deleteCell(pos)`: 删除给定位置的表元.
- `insertCell(pos)`: 在表元集合给定位置插入一个表元, 返回该表元的引用.

```ts
// 创建表格
const table = document.createElement('table')
table.border = 1
table.width = '100%'

// 创建表体
const tbody = document.createElement('tbody')
table.appendChild(tbody)

// 创建第一行
tbody.insertRow(0)
tbody.rows[0].insertCell(0)
tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell 1, 1'))
tbody.rows[0].insertCell(1)
tbody.rows[0].cells[1].appendChild(document.createTextNode('Cell 2, 1'))

// 创建第二行
tbody.insertRow(1)
tbody.rows[1].insertCell(0)
tbody.rows[1].cells[0].appendChild(document.createTextNode('Cell 1, 2'))
tbody.rows[1].insertCell(1)
tbody.rows[1].cells[1].appendChild(document.createTextNode('Cell 2, 2'))

// 把表格添加到文档主体
document.body.appendChild(table)
```
