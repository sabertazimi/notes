---
tags: [Programming, DevOps, Design Pattern, Refactoring]
---

# Refactoring

- Extract function: 复用代码.
- Inline function: 简化代码.
- Extract variable: 引入解释性变量.
- Inline variable: 简化代码.
- Change function declaration: 优化可读性.
- Rename variable: 优化可读性.

## Encapsulation

- Introduce parameter object: 减少函数参数, 封装数据.
- Encapsulate record: 将键值对封装成对象.
- Encapsulate Collection: 将集合封装成对象.
- Encapsulate primitive: 将基本类型封装成对象.
- Combine function into class.
- Combine function into transform.
- Extract class: 模块化代码.
- 字段与方法的上移: 复用代码.
- 字段与方法的下移: 接口隔离.
- 用组合 (Composite) 与委托 (Delegate) 代替继承 (Extend):
  将紧耦合转化为松耦合.

## Condition

- Decompose conditional statement: 引入解释性条件语句或函数.
- Use guard clause and assertion: 消除复杂嵌套条件语句.
- 消除不必要条件语句:
  - Introduce special case.
  - Polymorphism: e.g. strategy pattern.

## API

- Split query from modifier: 提取副作用语句.
- Parameterize function:
  两个函数逻辑非常相似, 只有一些字面量值不同,
  可以将其合并成一个函数, 以参数的形式传入不同的值, 从而消除重复代码.
- Remove flag argument:
  针对参数的每一种可能值, 新建一个明确函数, 优化可读性.
- Factory pattern: 封装构造函数.
- command pattern: 封装普通函数.
