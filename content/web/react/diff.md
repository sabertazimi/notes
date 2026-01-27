---
sidebar_position: 36
tags: [Web, React, Internals, Reconciler]
---

# Diff

Reconciler:

- O(n) incomplete tree comparison: only compare same level nodes.
- `ReactElement` + Old Children Fiber -> New Children Fiber.
- Create new children fiber (non exist/need update),
  drop useless children fiber,
  reuse old children fiber,
  set `fiber.flags`: `Placement`/`Deletion`.
  prepare for `Commit` stage.
- `key` prop to hint for Fiber nodes reuse.
- Detailed diff [algorithm](https://7kms.github.io/react-illustration-series/algorithm/diff).

## Different Types

- Rebuild element and children.

## Same Type DOM

- Only update changed attributes.
- Use `key` attribute to match children.

:::tip[Best Practice]

Give `key` to `<li>/<tr>/<tc>` elements
(stable, predictable, unique and not array indexed).

:::

## Same Type Component

- Update props to match new element.

## Array

- 第一次循环: 比较公共序列:
  - 从左到右逐一遍历, 遇到一个无法复用的节点则退出循环.
- 第二次循环: 比较非公共序列
  - 在第一次循环的基础上, 如果 oldFiber 队列遍历完成, 证明 newChildren 队列中剩余的对象全部都是新增.
  - 此时继续遍历剩余的 newChildren 队列即可, 没有额外的 diff 比较.
  - 在第一次循环的基础上, 如果 oldFiber 队列没有遍历完,
    需要将 oldFiber 队列中剩余的对象都添加到一个 Map 集合中, 以 oldFiber.key 作为键.
  - 此时继续遍历剩余的 newChildren 队列, 需要用 newChild.key 到 Map 集合中进行查找,
    将匹配上的 oldFiber 取出与 newChild 进行 diff 比较.
- 清理工作:
  - 在第二次循环结束后,
    若 Map 集合中还有剩余的 oldFiber,
    则说明 oldFiber 都是被删除的节点, 需要打上删除标记 (`Deletion`).
