---
sidebar_position: 14
tags: [Language, Java, Generic]
---

# Generics

## 类

自定义类型 `Class Person<T> {}`

## 方法

自定义方法 `[修饰符] <T> T PeronMethod(Param) {}`

## 类型变量

```java
<T extends SuperClass & Interface>
```

类型变量用 `,` 分隔, 限定类型用 `&` 分隔(一个父类+多个接口)

```java
<T extends Comparable & Serializable>
```

## 数组列表

`ArrayList<ClassName> VariableName = new ArrayList<>()`;

- toArray(ArrayName)转化为同类型普通数组存至 ArrayName: 可以创建一个 ArrayList, 再转化为数组, 方便使用[]下标操作
- 插入、删除操作时间复杂度高(数据元素左/右移)

## 代码

翻译关键: 擦除类型参数, 用 Object/限定类型代换

- 虚拟机中没有泛型
- 多态性: 合成桥方法
- 类型安全性: 必要时插入强制类型转换

## 限制

- T 类型变量: 不可为基本类型, 必须为引用类型
- 类型查询(getClass()/instanceof): 返回原始类型(如 Person), 不返回 T 类型
- 不可创建参数化类型的数组(如 `Person<T>[]`)
- 不可实例化类型变量(如 new T()、new T[])
- 不可在静态域/方法中引用类型变量(如 private static T variableName)
- 泛型类不可扩展 Throwable 及其子类(因此泛型类不可被抛出/捕获)

## 通配符

```java
<? extends SuperClass>
<? super SubClass>
```
