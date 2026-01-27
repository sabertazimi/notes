---
sidebar_position: 6
tags: [Language, Java, Control Flow]
---

# Control Flow

合法语句: 赋值语句和方法调用语句

## 块作用域

- 不允许内层块与外层块变量同名(无 C 语言中的可见性)
- 块内声明变量不允许在块外使用: if 块、for 块、while 块、普通 block

## Switch

case 标签变量类型: 字符型(包装类)、三整型(包装类)、枚举常量、字符串类

## Loop

- 初始化部分(init_statement);
- 循环条件部分(test_explanation);
- 循环体部分(body_statement);
- 迭代部分(alter_statement):自加/自减运算符改变条件变量
- 结束后处理

### For Each

```java
//只读遍历; 变量age只作用于for循环体
for (int age : arrayName) {}
```

## Break

```java
label:
{
break label;
} //可跳出任意语句块: 跳至标签块末尾
```

## Continue

```java
  label:
  {
continue label;
} //跳至循环块首部
```
