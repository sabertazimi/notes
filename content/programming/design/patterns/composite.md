---
sidebar_position: 8
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Composite

- 封装: 组合模式将对象组合成树形结构, 以表示 `部分+整体` 的层次结构.
- 多态: 组合模式通过对象的多态性表现, 使得用户对单个对象和组合对象的使用具有一致性.
- 扩展: 通过将简单可组合的对象组合起来, 构成一个完整的对象,
  这个对象的能力将会超过这些组成部分的能力的总和, 产生新的能力.
- 组合模式是一种 `HAS-A` (聚合) 的关系, 而不是 `IS-A`:
  组合对象包含一组叶对象, 但 Leaf 并不是 Composite 的子类 (尽管称为父子节点).
  组合对象把请求委托给它所包含的所有叶对象,
  它们能够合作的关键是拥有**相同的接口**.

:::tip[Composite Use Case]

- Graphics and UI Frameworks: e.g. DOM.
- File Systems: e.g. directory tree.
- Organization Structures.
- AST.

:::

树形结构:

- 根结点:
  - Component 抽象对象/接口 采用最大宽接口,定义内点和叶点的操作.
  - 将内点特有的操作集设为缺省操作集 (空实现).
- 内点:
  - 持有父结点和子节点的引用 (可使用 Flyweight 模式实现共享).
  - 操作集: 内点操作集 (可添加/删除组件).
- 叶点:
  - 持有父结点引用.
  - 操作集: 叶点操作集 (不可添加/删除组件).

```ts
interface Component {
  add: (Component) => void
  remove: (Component) => void
  do: (Context) => void
}

class Composite implements Component {
  add(child: Component) {
    console.log('Add child')
  }

  remove(child: Component) {
    console.log('Remove child')
  }

  do(context: Context) {
    console.log('Do composite work')

    for (const child of this.children) child.do(context)
  }
}

class Leaf implements Component {
  add(child: Component) {
    throw new UnsupportedOperationException()
  }

  remove(child: Component) {
    if (this.parent === null)
      return
    console.log('Remove self')
  }

  do(context: Context) {
    console.log('Do leaf work')
  }
}

const root = new Composite()
const c1 = new Composite()
const c2 = new Composite()
const leaf1 = new Leaf()
const leaf2 = new Leaf()
root.add(c1)
root.add(c2)
c1.add(leaf1)
c1.add(leaf2)
root.do()
```
