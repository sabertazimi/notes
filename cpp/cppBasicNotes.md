# C++ Basic Notes

## Basic Workflow

### 初始化与回收

-   Treat global program as a object: 开工函数与收工函数
-   Normal Object: 构造函数与析构函数

## 变量、类型与函数

### 变量

const 变量 代替 #define 宏定义

### 指针 

-   只读指针可赋值为 普通对象地址
-   普通指针不可赋值为 只读对象地址

### 类型

#### volatile

表示可被其他线程/进程改变的变量.volatile 变量常作为全局变量,用于同步各进程.

```cpp
volatile int x;

x = 3;

if (4 == x) {
    cout << "X changed by other routines.";
}
```
