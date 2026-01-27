---
sidebar_position: 22
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Visitor

Separating an algorithm from an object structure on which it operates.

:::tip[Visitor Use Case]

- Data structures: e.g. Tree, Graph.
- Document processing: e.g. DOM tree, reporting and analysis.
- Compiler: e.g. abstract syntax tree.

:::

```ts
class NumberExpression {
  constructor(value) {
    this.value = value
  }

  print(buffer) {
    buffer.push(this.value.toString())
  }
}

class AdditionExpression {
  constructor(left, right) {
    this.left = left
    this.right = right
  }

  print(buffer) {
    buffer.push('(')
    this.left.print(buffer)
    buffer.push('+')
    this.right.print(buffer)
    buffer.push(')')
  }
}

const e = new AdditionExpression(
  new NumberExpression(5),
  new AdditionExpression(new NumberExpression(1), new NumberExpression(9))
)
const buffer = []
e.print(buffer)
```
