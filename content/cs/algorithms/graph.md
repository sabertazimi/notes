---
sidebar_position: 11
tags: [CS, Algorithm, Graph]
---

# Graph

## Representation

- 邻接链表法
- 邻接矩阵法

### Sparse Matrix

```cpp
unordered_map< int, unordered_map<int, int> > // => (row, (col, val))
```

## Topological Sort

目标集合: 拓扑排序后集合, 先入顶点高序, 后入顶点低序.

### Kahn

不断将图中入度为 0 的点移入目标集合.

### Depth-First

当深度遍历至较深处, 并开始回溯时, 将此时访问的顶点加入目标集合(v.f 降序)

## Single-Source Shortest Paths

```cpp
void Relax(int u, int v, int w) {
    if v.d > u.d + w[u][v] {
        v.pi = u;
        v.d = v.pi.d + w[v.pi][v];
    }
}
```

### DAG

先将图进行拓扑排序(深度优先遍历), 再按照拓扑排序顺序, 依次对每个结点(拓扑排序)的邻接边进行 relax

> a -> b -> c --> d, 且 a--b, a--c, b--d, c--d:
> relax(a, b), relax(a, c), relax(b, d), relax(c, d)

### Bellman-Ford

对每条边进行 n 次(结点总数) relax

### Dijkstra

贪心算法: 每次选取不属于 S 集合(white) 且 v.d 最小(gray)的结点, 对其所有邻接边进行 relax, 并将其加入 S 集合(black)

- white: 不属于 S 集合
- gray: 不属于 S 集合 且 v.d 最小
- black: 属于 S 集合

## All-Pairs Shortest Paths

动态规划: l^m(i, j) = min(l^m-1(i, j), min(1 `<=` k `<=` n)`{l^m-1(i, k)+w(k, j)}`)

> m: 中间结点个数

### Floyd-Warshall

d^k(i, j) = w(i, j), k = 0
| min(d^k-1(i, j), d^k-1(i, k) + d^k-1(k, j)), k >= 1

pi^(i, j) = pi^k-1(i, j) or pi^k-1(k, j)

> k: 中间结点个数

```cpp
Matrix floyd_warshall(Matrix W) {
    int n = W.rows;
    Matrix D^0 = W;

    for (int k = 1;k < n+1; k++) {
        D^k = new Matrix(n);

        for (int i = 1; i < n+1; i++) {
            for (int j = 1; j < n+1; J++) {
                d^k[i][j] = min(d^k-1[i][j], d^k-1[i][k]+d^k-1[k][j]);
            }
        }
    }

    return D^n;
}
```

## Maximum Flow Problem

Max flow Problem:

![Ford Fulkerson Algorithm](./figures/graph/ford-fulkerson-algorithm.png 'Ford Fulkerson Algorithm')

### Model

最大流模型必须满足以下条件:

- 无双向边
- 唯一的源点 s 和 唯一的汇点 t

对于不符合该模型的问题可进行简单转化:

- 双向边: 添加额外结点, 切割双向边的其中一条, 使得双向边变成 3 条单向边

> a --> b, b --> a: a --> c, c --> b, b --> a

- 多源点/汇点: 添加一个总源点/汇点

### Residual Network

- 若原图 u --> v 总容量 > 0, 则残存网络中 边 u --> v:剩余容量, 边 v --> u: 已用容量
- 增广路径: 残差网络中一条可行通路

### Theorem

MaxFlow-MinCut theorem:

- 切割的净流量: 流出-流入
- 切割的容量: 流出总容量(无需减流入总容量)
- 最小切割: 容量最小的切割

最大流最小割定理: 以下三个命题等价

- f 是 G 的一个最大流
- 残存网络 Gf 不含增广路径
- |f| = c(S, T)(切割的容量): |f| `<=` c(S, T)(流网络中任意流 f `<=` 任意切割容量 c(S, T))

### Ford-Fulkerson

不断寻找增广路径

## Minimal Spanning Tree

### Kruskal

- Kruskal (tFind/tUnion)

## Connected Component

### Strongly Connected Component

- Tarjan Algorithm(v.index(DFS 时此点被访问的顺序) == v.lowLink(从 v 出发经有向边可达到的所有结点中最小的 index))

### Union Find

Quickly figure out connection of map.
