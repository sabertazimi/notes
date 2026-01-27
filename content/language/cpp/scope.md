---
sidebar_position: 13
tags: [Language, C++, Scope]
---

# Scope

- 标识符的作用域越小,访问的优先级别越高
- 单目运算符 `::` 可访问全局符号 e.g. `::process++ // 自加全局变量 process`

## 面向过程

- 作用于表达式内
- 作用于函数内
- 作用于程序文件内
- 作用于整个程序

## 面向对象

- 作用于**函数成员**内
- 作用于**类/派生类**内
- 作用于**基类**内
- 作用于**虚基类**内

## 命名空间

- 指定一个完全的命名空间时, 不会将任何标识符加入当前作用域. 可**重新定义**同名局部符号

```cpp
namespace A {
    int a = 0;
    namespace B {
        int a = 0;
    }
    namespace C {

    }
    namespace D {

    }
    using namespace B;
    using namespace C;
}

using namespace A;
int a = 5;      ///< Right: 全局变量 a 与 A中的a 同名
```

- 指定一个命名空间的具体成员时, 会将成员符号加入当前作用域

```cpp
namespace A {
    float a = 0,
          b = 0;
    float d(float y) {
        return y;
    }
}

namespace B {
    void g(void) {
        cout<<"B\n";
    }
}

int main(void) {
    using A::a;
    using A::d;
    using B::g;

    long a = 1;     ///< Error: a 已被加入当前 main 函数作用域(A::a), 不可重复定义
    a = d(2.1);     ///< Right: A::a = A::d(2.1);

    return 0;
}
```

- 可以为嵌套命名空间定义别名

```cpp
namespace A {
    namespace B {
        namespace C {
            int k = 4;
        }
    }
}

namespace ABCD = A::B::C;

using ABCD::k;      ///< refer to A::B::C::k
```
