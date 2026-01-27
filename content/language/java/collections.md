---
sidebar_position: 15
tags: [Language, Java, Collection]
---

# Collections

## Abstract

将 size 和 iterator 抽象化, 将 contains、toString 具体化

## Iteration

### Iterator

- 工作位置: 迭代器位于两元素间
- 工作机制
  - previous 方法: 迭代器越过前一元素, 并将该元素的引用作为返回值
  - next 方法: 迭代器越过下一元素, 并将该元素的引用作为返回值
- 工作方法
  - add 方法: 将新元素的引用插入至迭代器当前位置
  - remove 方法: 与 previous/next 相互依赖, 删除前一次越过元素(不可连续调用 remove 方法)
  - next->( remove )->next->remove
- 使用原则
  - 给容器附加多个只读迭代器, 单独附加唯一一个读写迭代器
  - 并发修改检测: 只检测结构性改变(改变长度),不检测数值性改变(如 set 方法)

### Iterable

任何实现了 Iterable 接口及其子接口(如 Collection 接口)的对象都可使用 for each 循环

```java
public interface Iterable<E>
{
    Iterator<E> iterator();
}
```

## Comparison

### Comparable

```java
// A<B负值, A==B零, A>B正值(B代表other)
public interface Comparable<T>
{
    int compareTo(T other);
}
```

### Comparator

```java
// A<B负值, A==B零, A>B正值
public interface Comparator<T>
{
    int compare(T a, T b);
}

SortedSet<Item> setSortedByName = new TreeSet<>(Comparator comp); //实现比较器的类
```

## Random Access

`RandomAccess`: 标记接口, 无任何方法, 标记一个集合是否支持高效的随机访问

## 数组列表

ArrayList implements List:

- 随机访问: 利用索引值访问元素
- get/set(int Index)方法: 效率高

## 链表

LinkedList implements List, Deque:

- 非随机存取: 必须从头/尾开始遍历链表访问元素
- E get(int Index)方法: 效率极低

ListIterator:

- add 方法: 依赖于迭代器位置
- remove 方法: 依赖于迭代器状态
- previousIndex 方法: 返回迭代器前一元素的整数索引
- nextIndex 方法: 返回迭代器后一元素的整数索引

## 散列集

HashSet implements Set: 无序无重复元素集, 基于 HashTable

- 散列表: 列表/链表数组(多个列表/链表), 每个列表/链表成为桶(bucket)
  - 元素的桶的整数索引: 元素散列码 mod 桶的总数(余数)
  - 桶数: 预计元素个数的 75%~150% e.g. 标准类库桶数为 2 的 n 次方, 默认值 16
  - 散列冲突(hash collision): 目标桶已满
  - 再散列(rehashed): 创建大通数(如双倍桶数)的新散列表, 丢弃原散列表
  - 装填因子(load factor): 再散列时机决定因素, 一般为 0.75(75%桶中含有至少一个元素)
  - hash 值: return (key.hashCode() & 0x7fffffff) % M;
- 方法
  - add: 先查找对象存在性, 不存在则添加元素
  - contains: 重写方法
- 散列集迭代器: 依次访问所有桶

## 树集

TreeSet implements SortedSet, NavigableSet: 有序集

## 队列

- 双端队列: ArrayDeque 类与 LinkedList 类
- 优先级队列: PriorityQueue 类, 未对所有元素进行排序
  - add 和 remove 方法: 引用最小元素
- Deque extends Queue extends Collection

## 映射表

实现 Map 接口, 未实现 Collection 接口

- 散列/比较函数只作用于键 key
- 添加/删除/检索对象时, 必须提供键 key
- 键 key 具有唯一性
