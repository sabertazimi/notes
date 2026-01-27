---
sidebar_position: 4
tags: [Language, C++, Expression]
---

# Expressions

左值表达式一定可作(右)值表达式, (右)值表达式不可作左值表达式:

- 左值表达式 : 变量, 赋值表达式, 前缀自操作表达式, 返回值为引用类型的函数调用

```cpp
bar;
y = 6;
i -= 10;
++i;

int &f(void);
f() = j;
```

- (右)值表达式: 常量, 强制类型转换表达式, 后缀自操作表达式, 算数表达式

```cpp
20;
(type)x;
i++;
y + 2;
```
