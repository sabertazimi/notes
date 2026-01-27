---
sidebar_position: 1
tags: [Language, C++, Primitive]
---

# Primitive

## Union

匿名联合具有以下性质:

- 没有对象的全局匿名联合必须 static
- 只可定义 public 成员
- 数据成员与联合本身作用域相同
- 数据成员共享存储空间

### 位段

class/struct/union 都可定义位段成员, 但类型必须为 char/short/int/enum, 不可为 long/float/array/class
