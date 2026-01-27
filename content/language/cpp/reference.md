---
sidebar_position: 2
tags: [Language, C++, Reference, Pointer]
---

# Reference

## 性质

引用类型(&)实质上是一种语法糖,编译器将引用变量最终全部编译为指针变量

## 作为函数参数

向函数传递引用类型实参时,若:

- 实参与形参类型不一致(**必须完全一致**)
- 实参为(右)值表达式

则会生成一个内部匿名变量,用于函数调用. 此时,对参数进行的操作将**无法改变实参原有值**,使得 call by reference 失效.

## 特性

- 普通全局引用变量必须在定义时初始化初始化(左值表达式)

```cpp
int &x = 1;   // warning: 引用匿名变量
int &k = j++; // warning: 引用匿名变量
```

- 引用变量不分配存储单元: 不能引用 引用变量, 不能作为指针所指对象, 不能作为数组元素

```cpp
int & &x;       // error
int & *p;       // error
int & s[4];     // error
```

- 引用变量的值按字节(指针/地址)编码: 不能引用位段(无法按字节编码)

```cpp
int &w = a.j; // error
```

- 引用变量不能引用引用变量, 只能引用另一个引用变量所引用的变量/地址

```cpp
int x = 10;
int &j = x;
int &&m = j;  // error
int &m = j;   // pass: m = j => x
```

- 引用变量可以引用 register 变量, 编译器会将其自动转为 auto 变量(为其分配地址)

```cpp
register int i = 0,
register int &j = i;
```

- 引用变量在一定程度上具有指针性质

```cpp
int x = 1;
const int &p = x;   // pass

x = 7;  // pass
p = 7;  // error
```

## Volatile

- volatile 表示可被其他线程/进程改变的变量
- volatile 变量常作为全局变量, 用于同步各进程
- const 表示不可被本线程/进程修改的变量

```cpp
volatile int x;

x = 3;

if (4 == x) {
    cout << "X changed by other routines.";
}
```

## Pointer

- 只读指针可赋值为 普通对象地址
- 普通指针不可赋值为 只读对象地址

```cpp
int *p = const int;         // x
int *p = int;               // o
const int *p = const int;   // o
const int *p = int;         // o
```
