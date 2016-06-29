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

##### 性质

引用类型(&)实质上是一种语法糖,编译器将引用变量最终全部编译为指针变量

##### 作为函数参数

向函数传递引用类型实参时,若:

-   实参与形参类型不一致 
-   实参为(右)值表达式(常量)

则会生成一个内部匿名变量,用于函数调用.此时,对参数进行的操作将无法改变实参原有值,使得 call by reference 失效.

##### 特性

-   普通全局引用变量必须初始化(左值表达式)            `int &k = j++; // error`
-   引用变量不分配存储单元: 数组元素不能作为引用变量  `int &s[4];    // error`
-   引用变量的值按字节(指针/地址)编码: 位段不能被引用 `int &w = a.j; // error`
-   引用变量不能再次引用另一个引用变量                `int &&m = j;  // error`

### Expression (表达式)

左值表达式一定可作(右)值表达式,(右)值表达式不可作左值表达式

e.g 左值表达式: bar, ++i;
    (右)值表达式: 2, i++, y+2;

### 函数

#### 参数的默认值(defalut)

-   不能在 **函数原型声明** 与 **函数定义** 中 **同时** 定义参数的默认值,会产生默认值冲突
-   所有缺省参数必须位于参数列表右边
-   不能用前一个参数初始化后一个参数

```cpp
int bar(int x , int y = 5, int z = m(u,v));
int foo(int x, int y = x++); // error
```

## 类

### 构造函数

构造函数不可被显式调用(类前缀),必须隐式调用(省略类前缀)

### 析构函数

-   析构函数即可显式调用,又可隐式调用
-   作用域结束时会自动调用析构函数
-   调用 exit/abort 时, 需手动调用析构函数释放资源

```cpp
#include <process.h>
#include "String.cpp"

#define SUCCESS 0

String x("global");

int main(void) {
    short error = 0;
    String y("local");

    // set error flag
    switch (error) {
        case 0:
            return;
        case 1:
            y.~String();
            exit(1);
        default:
            x.~String();
            y.~String();
            abort();
    }

    return SUCCESS;
}
```

-   应注意防止重复析构同一对象

```cpp
String::~String() {
    // check flag
    if (s == NULL) {
        return;
    }

    cout<<"Deconstruct:"<<s;

    free(s);

    // set flag
    s = NULL;

}
```
