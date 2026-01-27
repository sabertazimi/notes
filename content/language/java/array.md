---
sidebar_position: 4
tags: [Language, Java, Array]
---

# Array

## Declaration

- 类型(包括类/对象) + `[]` + 标识符.
- 类型(包括类/对象) + 标识符 + `[]`.
- `int a[N]` 非法 数组是引用类型.
- 不可对数组名进行自增操作(尽管 `[]` 与 `*` 具有类似作用).

## Initialization

- 默认初始化数值类型为 `0`/`false`, 引用类型为 `null`.
- 使用 `new` 分配内存单元.

两种不同初始化方式:

- 声明时: `MyDate[] dates = {new MyDate(),……};`
- 赋值时: `MyDate[] dates = new MyDate[] (匿名数组){new MyDate(),…..};`

## APIs

- 属性:arrayName.length
- 打印:arrays.toString 方法
- 复制:arrayName.Copy( source, 0, destination, 0, source.length);

```java
Arrays.copyOf(ArrayName, Array.length); //可用来增长数组长度
```

- 比较:Arrays.equals(type[] a,type[] b);

## Command Line

字符串数组 String[] args,
args 数组不包括程序名.

## Sort

Arrays.sort(ArrayName)快速排序方法

## Multiple Dimension

- 多维数组的声明和初始化应按从高维到低维的顺序进行:
  - 声明与初始化: `int[][] t = new int[3][];`.
  - 子数组交换: `temp = a[i];a[i]=a[i+1];a[i+1]=temp;`.
- 子数组长度可不一致: 可先构造一维长度, 再使用循环构造子数组各自长度.
