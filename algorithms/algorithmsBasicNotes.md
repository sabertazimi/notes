* [Algorithm Basic Notes](#algorithm-basic-notes)
	* [Sorting Algorithm](#sorting-algorithm)
	* [Tree Algorithm](#tree-algorithm)
		* [Binary Search Tree](#binary-search-tree)
		* [2-3Tree Banlance Tree](#2-3tree-banlance-tree)
		* [Red-Black BST](#red-black-bst)
			* [基本性质](#基本性质)
			* [基本操作](#基本操作)
		* [K-Dimensional Tree](#k-dimensional-tree)
	* [Search Algorithm](#search-algorithm)
		* [Fisrt Search](#fisrt-search)
		* [cycle detection](#cycle-detection)
	* [Dynamic Programming](#dynamic-programming)
		* [子问题](#子问题)
		* [范例](#范例)
	* [Greedy Algorithm](#greedy-algorithm)
	* [Map Algorithm](#map-algorithm)
		* [MaxFLow Problem](#maxflow-problem)

------

# Algorithm Basic Notes

## Sorting Algorithm

1. Selection Sort
2. Insertion Sort-Shell Sort
3. Merge Sort
4. Quick Sort
5. Heap Sort(Priority Queue)

> Sorting Algorithms Performance

![Performance](img/SortingPerformance.png)

## Tree Algorithm

### Binary Search Tree
Hibbard Deletion

### 2-3Tree Banlance Tree

1. 插入:
  - 1+1=2node -> 3node
  - **1+2=3node -> 4node** -> 2node
  - 将4node结点中间元素移至父结点，其余2元素分离为子2node节点

### Red-Black BST

- 基于2-3Tree，将3node用红色标记
- 关键：将红色标记向上传递至根部

#### 基本性质

1. 非红即黑
2. 根黑
3. 叶黑          e.g T.null 黑哨兵
4. 红父孩子黑
5. 简单路径同黑
6. 右孩子不红    e.g 父黑两孩红 -> 父红两孩黑(flip); 父黑右红 -> 父左旋变红, 右孩子变黑(left-rotate)

#### 基本操作

1. 插入(插入红点, 旋转+重新着色(反色)保持红黑性质)
2. 删除(删除红点, 旋转+重新着色(反色)保持红黑性质)

### K-Dimensional Tree

- 分隔空间数据

e.g 左子树：左下方   右子树：右上方

## Search Algorithm

### Fisrt Search
- DFS(深度优先)：栈实现
- BFS(广度优先)：队列实现

![Search Algorithm Performance](img/SearchPerformance.jpg)

### cycle detection
- 许多图论算法不适用于存在环路的复杂图,故使用循环检测剔除意外情况

**处理方法：可将环路元素(如强联通分支)视作单一元素，忽视其内部结构**
```java
a = b+1;b = c+1;c = a+1;
//a extends b;b extends c;c extends a;
```

## Dynamic Programming

-   最优解结构特征: 一个选择 + 子问题的最优解 - 所有(可**重复求解**)子问题的最优解可**独立求解**(不互相影响)
-   递归定义最优解: 列出递归表达式
-   自底向上求解最优解
-   构造最优解(额外信息数组)

### 子问题

-   子问题可映射为有向图, 并对其进行拓扑排序: 共有 O(n) 个子问题, 每个子问题最多 O(n) 种选择, 则算法时间复杂度为 O(n^2).其对应子问题图有 n 个顶点, 每个顶点最多有 n-1 条边.
-   递归生成可以重复求解的子问题,而不是不断生成新的子问题

### 范例

-   切割钢条问题: max{p[i], r[n-i]}
-   矩阵相乘链问题
-   最大公共子序列问题: r[i, j] = max{r[i, j-1], r[i-1, j]}
-   无权最短路径: path[i, j] = min{path[i, r], [r, j]}

## Greedy Algorithm

-   最优解结构特征: 一个选择 + 子问题的最优解 - 所有(可**重复求解**)子问题的最优解可**独立求解**(不互相影响)
-   递归定义最优解: 列出递归表达式
-   自底向上求解最优解: 每次不进行多次选择, 只进行一次 **贪心选择**
-   构造最优解(额外信息数组)

## Map Algorithm

### MaxFLow Problem

![Ford Fulkerson Algorithm](img/FordFulkersonAlgorithm.png)

-   MaxFlow-Mincut Theorem 最大流最小割定理
-   Radix-Sorts 基数排序(可用于混乱shuffle数组)
    -   从个位到高位放入桶
    -   从高位到个位放入桶
