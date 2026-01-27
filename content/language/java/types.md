---
sidebar_position: 2
tags: [Language, Java, Types, Primitive]
---

# Data Types

## 整型

### 类型

- byte 型:1 字节 -128~127
- short 型:2 字节 -2^15~2^15 -1
- int 型:4 字节 -2^31~2^31 -1(20 亿)
- long 型:8 字节 -2^63~2^63 -1

### 前/后缀

- 二进制前缀 0b/0B
- 八进制前缀 0
- 十六进制前缀 0x/0X
- 长整型后缀 l/L

## 浮点型

### float 型

后缀 F:4 字节 -3403E38~3.403E38(有效位数 6~7 位)

```java
float f = 1.2;    //ERROR
float f = 1.2F;   //OK
```

### double 型

后缀 D(默认型):8 字节 -1798E308~1.798E308(有效位数 15 位)

科学计数法: 指数均为十进制, 符号为 e(尾数为十进制)/p(尾数为十六进制)

Double.POSITIVE_INFINITY, Double.NEGATIVE_INFINITY, Double.isNaN() 检测 NaN 值

千分位下划线分隔法 e.g. 123_456.789_000

## 字符型

- 1 个 char 型占 2 个字节(Unicode 编码)
- ''(定界符)内可用八/十六进制转义字符表示字符

- 八: `\xxx`
- 十六: `\uxxxx` (`\u` 转义序列可出现在任何地方) e.g. `'\u0061'`

改进的 Unicode 字符集:

- 代码点(前缀 U+)分为 17 个代码级别(code plane)
- 第一个级别为经典 Unicode 代码,
- 其余附加级别 U+10000 至 U+10FFFF.

## 布尔型

只允许赋值为 true、false(不可取 0 或非 0 值), 不可与整型相互转换

## 引用类型

### Array

字符串 String: 不可变性(需要修改变量名所引用值, 必须重新创建一个 String 对象例)

旧的对象实例若被判定为垃圾便会被系统自动回收

### Class

### Interface
