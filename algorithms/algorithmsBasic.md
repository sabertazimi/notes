# Algorithm Basic Notes

## Sorting Algorithm

1. Selection Sort
2. Insertion Sort-Shell Sort
3. Merge Sort
4. Quick Sort
5. Heap Sort(Priority Queue)

> Sorting Algorithms Performance

![Performance](img/SortingPerformance.png)

## Search Algorithm

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


## Map Algorithm

### MaxFLow Problem
![Ford Fulkerson Algorithm](img/FordFulkersonAlgorithm.png)

1. MaxFlow-Mincut Theorem 最大流最小割定理
2. Radix-Sorts 基数排序(可用于混乱shuffle数组)
  - 从个位到高位放入桶
  - 从高位到个位放入桶

## Useful Java Functions 

### String

-   new String()
-   new StringBuilder(string)
-   append(string)
-   subString(start, end)
-   charAt(index)
-   indexOf(char)
-   length()
-   toString()
-   toCharArray()

```java
String s1 = new String();
String s2 = "billryan";
int s2Len = s2.length();
s2.substring(4, 8); // return "ryan"
StringBuilder s3 = new StringBuilder(s2.substring(4, 8));
s3.append("bill");
String s2New = s3.toString(); // return "ryanbill"
// convert String to char array
char[] s2Char = s2.toCharArray();
// char at index 4
char ch = s2.charAt(4); // return 'r'
// find index at first
int index = s2.indexOf('r'); // return 4. if not found, return -1
```
