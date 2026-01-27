---
sidebar_position: 12
tags: [CS, Algorithm, Graph, Search, BFS]
---

# Breadth-First Search

## Color

- white: 未被发现/访问
- gray: 已被发现(进入队列), 邻接结点未全部发现
- black: 已被发现, 邻接结点全部发现

## Parent

广度优先树父结点

## Distance

距离 = v.pi.d + 1

## Queue

Using mark array and queue:

- Shortest Paths.
- Diameter of Tree (树直径): two pass for BFS.
