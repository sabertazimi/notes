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

#### reference (引用类型)

向函数传递引用类型实参时,若:

-   实参与形参类型不一致 
-   实参为(右)值表达式(常量)

则会生成一个内部匿名变量,用于函数调用.此时,对参数进行的操作将无法改变实参原有值,使得 call by reference 失效.

### Expression (表达式)

左值表达式一定可作(右)值表达式,(右)值表达式不可作左值表达式

e.g 左值表达式: bar, ++i;
    (右)值表达式: 2, i++, y+2;

