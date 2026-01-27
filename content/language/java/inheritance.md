---
sidebar_position: 11
tags: [Language, Java, Inheritance]
---

# Inheritance

## 属性

- 可继承: 公有域
- 不可继承: 私有域、静态域、实例域初始化块
- 若要访问(修改)父类私有域, 必须使用调用公有的 super.get()方法得到父类私有域
- 初始化父类私有域: super(ParamList); 调用父类构造方法进行初始化

## 方法

- 可继承: 公有方法
- 不可继承: 私有方法、静态方法、构造器方法

### 覆盖

标签相同(不可降低父类方法可见性)

### 重载

标签不同, 属于新加方法

## `super`

不是隐式参数, 是提示编译器执行的特殊关键字

## 父类与子类的转换

`Is-A` 关系,
Subclass must be superclass,superclass may not be subclass.

- 可将子类引用赋值给父类变量(Upcasting)或替换父类作参数

```java
Person p = new Student();  //p仍是父类变量
```

> 注: 若父类变量和子类变量引用同一个子类对象实例时, 父类某些操作可能引起内存混乱
> 例如: 先调用父类构造器方法构造子类, 再调用子类扩展方法访问子类扩展私有域(根本未分配内存空间)

- 不可将父类引用赋值给子类变量

```java
Student s = new Person();  //ERROR:e.g. s.getStuID();
```

## Object

### Equals

- 子类中覆盖(@override)父类 equals 方法: super.equals(superClassName other);
- 显式参数名: Object otherObject
- if (this == otherObject) return true;
- if (otherObject == null) return false;
- if (getClass != otherObject.getClass()) return false;
- ClassName other = (ClassName) otherObject;
- return field == other.field

### Hash Code

- String 类 hashCode: `ΣStringChar[i]^(n-i-1), (i:0~(n-1))`.
- Object 对象 hashCode: 内部 ID(存储地址)
- 若重写 equals 方法, 也应重写 hashCode 方法, 使对象实例 hashCode 分布散列化
  - return 各域 hashCode 值加权和:31x+y rule
    - 引用类型、包装类: hashCode()
    - 数组: Arrays.deepHashCode()
  - return Objects.hash(field1,..,fieldN); //自动组合各域 hashCode
  - hash 值: return (key.hashCode() & 0x7fffffff) % M;

### ToString

- 设计 `return getClass().getName() + "[" + field + "]";`
- Object 类 toString 方法: 用于输出 ClassName 和 hashCode
- 数组直接继承 Object 类 toString 方法, 输出数组需调用 Arrays.(deep)toString();
- 自动调用: + 字符串连接符、println(obj)

## 访问控制符

public>protected(包作用域+)>默认(包作用域)>private(类作用域)

最大限度: 不同包的非子类(所有类)、同一个包/不同包的子类、同一个包、同一个类

## abstract

### abstract 方法

语法形式: `abstract + MethodName(ParamList);`.

### abstract 类

- 定义
  - 若一个类包含 abstract 方法, 则必须是 abstract 类
  - 一个 abstract 类可以不包含 abstract 方法
  - 一个 abstract 类可以包含具体数据和具体方法
- 构造器方法
  - 需要实现构造器方法
  - 构造器方法可以被非 abstract 子类调用
  - 不能使用 new 构造 abstract 类对象实例

## final

### final 局部变量

方法内的变量: 只读常量, 必须进行一次初始化

### final 实例域

- 必须进行一次(类定义/构造器)初始化
- final 引用类型实例域的引用不可更改, 但所引用对象的状态(State)可被更改

### final 方法

可继承, 不可重写

### final 类

- 不可继承
- 实例域可以不是 final 实例域, 方法自动成为 final 方法

## static

### static 实例域

类域:

- 属于类整体, 保存在类的内存区域的公共存储单元(不可继承)
- 可通过类名/对象实例名访问该属性

### static 方法

- 类方法, 属于类整体(不可继承).
- 没有隐式参数(this/super).
- 只能处理该类中的 static 实例域/调用该类中的 static 方法.
- 既可通过类名调用该方法(推荐), 又可通过对象实例名调用 static 方法.

:::tip[工厂模式]

利用 static 方法可模拟构造器方法, 可自定义构造器名和返回对象类型.

:::

### static final 实例域

- 默认初始化(数值型为 0, 布尔型为 false, 引用型为 null)
- 常结合 public 将变量设置为全局静态常量 e.g. e、PI

## 接口

`interface` 类型是引用类型, 不能创建实例, 只能被其他类实现:

```java
 [修饰符(public)]interface 接口名 [extends 父接口名列表(多个接口)] {
//常量声明, 可为多个
[public] [static] [final] type constantName= Value;
//方法声明, 可为多个
[public] [abstract] returnType methodName( [paramList] );
}
```

### Methods

自动默认: public abstract 方法(声明时无需关键字)

### Implements

在类中必须实现(override)接口中的所有方法

### 方法参数

- 设计此类方法时:
  - 可调用接口中公有静态常量/公有方法(interfaceVariableName.invokeMethod)
  - 可将接口参数传递给其他接口作参数的方法, 调用其他方法
- 实际调用方法时: 将实现了该接口的类作为参数传递给方法, 可提高方法的灵活性

例子: `Comparable` 接口和 `sort` 静态方法

### 接口变量

- 不可创建 interface 实例(即不可用 new 关键字)
- 可声明一个 interface 变量, 并使其引用实现了该接口的对象实例

```java
//TimePrinter: 实现了ActionListener接口的类
ActionListener myListener = new TimePrinter();
```
