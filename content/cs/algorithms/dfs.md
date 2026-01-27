---
sidebar_position: 13
tags: [CS, Algorithm, Graph, Search, DFS]
---

# Depth-First Search

Using recursion/stack.

## Color

- white: 未被发现/访问
- gray: 已被发现, 未二次访问
- black: 已被发现, 二次访问(比其深的所有结点皆被发现)

当第一个访问 edge(u,v) 时:

- v.color == white: 树边
- v.color == gray : 后向边(v 为 深度优先*森林*的祖父结点)
- v.color == black: 前向边/横向边(v 为较深的结点/子结点)
- 无向图深度优先遍历不会出现 前向边/横向边

## Parent

比 v 浅的结点(比 v 更早被发现的结点)

## Distance

- v.d = ++time: 被发现的时间戳(入栈)
- v.f = ++time: 被二次访问的时间戳(出栈)
- time`<`v.d, white; v.d`<`time`<`v.f, gray: time`>`v.f, black

## Mark and Recursion

Using mark array, mark stack, and recursion:

- Longest Paths.
