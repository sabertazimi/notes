---
sidebar_position: 10
tags: [Language, Java, OOP, Object, Class]
---

# 对象与类

## 特征

### 封装性

- 模块化 + 信息隐蔽:
  隐藏细节 (`private`), 只提供受保护的访问接口 (`public`).
- 只可通过方法改变对象实例的状态 (`State`/`Instance Field`).

### 继承性

父类和子类共享数据和方法 (提高代码重用率和可维护性):

- 可继承成员: 公有域, 公有方法.
- 不可继承成员: 私有域, 静态域, 实例域初始化块, 私有方法, 静态方法, 构造器方法.

### 多态性

不同的对象收到同一个消息 (method 调用) 可产生不同效果 (由对象内封装的细节决定):

- 编译时多态: 重载 (Overload).
- 运行时多态: 覆盖 (Override).
- 根据对象实例的类型进行动态绑定 (Dynamic Binding).
- 虚方法调用 (Virtual Method Invoking):
  - 在调用方法时, 程序会正确地调用子类对象的方法.
  - 无法进行虚方法调用情况.
- `static` 方法: 以声明类型 (标识符前的类型) 为准, 无关实例类型.
- `final`/`private` 方法: 子类无法覆盖/继承父类同名方法, 不存在虚化问题.

## Design

### Data Encapsulation

保持封装性

### Data Initialization

不依赖实例域默认值, 且应进行数据合法化检查

### Instance Field Encapsulation

过多相关的基本类型实例域可封装成一个轻型类

### Constructor Diversity

最低标准为显式无参构造器+一个带参数(包括合法化检查)构造器

### Clear Responsibility

一个类的方法应与类本身紧密相关, 且不过少也不过多

## JavaBean

JavaBean 是一种符合命名规范的 `class`,
它通过 `getter` 和 `setter` 来定义属性:

```java
import java.beans.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BeanInfo info = Introspector.getBeanInfo(Person.class);
        for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
            System.out.println(pd.getName());
            System.out.println("  " + pd.getReadMethod());
            System.out.println("  " + pd.getWriteMethod());
        }
    }
}

class Person {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## Class

```java
[public] [abstract|final] class className[extends superclassName]
[implements interfaceNameList] {

//成员变量声明, 可为多个:
//实例域一般添加private修饰符, 保持封装性
[public | protected | private] [static] [final] [transient] [volatile]type variableName;

//方法(包括构造方法)定义及实现, 可为多个
[public | protected | private] [static] [final | abstract] [native] [synchronized]
returnType methodName( [paramList] ) [throws exceptionList]{
    statements;
  }
}

class Class_Name{
   int/String characteristic;   //状态(State): 变量(实例域 instance field)
   constructor(){};             //标识(Identity): 构造器(constructor)
   void function(){};           //行为(Behavior): 函数(方法method)
}
```

### Accessor

只访问实例域不进行修改的方法 (accessor method):

```java
returnType get() {
    //保持封装性
    //返回引用类型对象时, 必须返回克隆体对象引用而不是实例域对象引用
  return instanceFieldVariable.clone();
}
```

### Mutator

修改实例域的方法 (mutator method): e.g. add、set.

## Methods

### Parameters

Java 所有普通方法的参数传递方式: 值传递.

- 基本类型: 传递值的拷贝.

方法中无法更改原变量的值.

- 引用类型: 传递引用的拷贝.

方法中无法更改原变量的引用 (指针指向), 只可更改引用对象的状态 (State).

### Signature

Signature:

- 方法名称.
- 方法参数.

方法返回值类型不是方法标签 (不存在同名同参而不同返回值的方法).

## Constructor

构造器方法完整定义:

```java
ClassName (ClassPropertiesVariableTable) {
    //进行输入参数合法化检查
    Property n = Variable;
    Statement Block;
}
```

### Definition

- 未定义任何构造器方法.
  系统会自动产生一个构造器方法, 称为无参空默认构造器方法 (default constructor),
  并将所有实例域初始化为默认值.
- 注意事项:
  - 不应在构造器中定义实例域同名变量.
  - 在构造器中尽量只调用 `final`/`private` 方法 (不会(继承后)被子类方法覆盖).
  - `this()` 可调用此类的其他构造方法, `this()` 必须位于构造器方法首行.

### Execution

- 构造器方法前语句/语句块将先于构造器执行.
- 编译器会在编译时在每个构造器方法内首行自动添加 `super();` (若父类没有无参构造器方法编译出错)/人工显式调用父类构造器方法,
  直至实现 Object 类(超类)的构造器方法, 再执行构造器方法语句.

## Enum

```java
// enum
public class Main {
    public static void main(String[] args) {
        Weekday day = Weekday.SUN;
        if (day.dayValue == 6 || day.dayValue == 0) {
            System.out.println("Today is " + day + ". Work at home!");
        } else {
            System.out.println("Today is " + day + ". Work at office!");
        }
    }
}

enum Weekday {
    MON(1, "星期一"), TUE(2, "星期二"), WED(3, "星期三"), THU(4, "星期四"), FRI(5, "星期五"), SAT(6, "星期六"), SUN(0, "星期日");

    public final int dayValue;
    private final String chinese;

    private Weekday(int dayValue, String chinese) {
        this.dayValue = dayValue;
        this.chinese = chinese;
    }

    @Override
    public String toString() {
        return this.chinese;
    }
}
```

## Record

`record` 类:

- 使用 `record` 定义的是不变类.
- 可以编写 `Compact Constructor` 对参数进行验证.
- 可以定义静态方法.

```java
public record Point(int x, int y) {
    public Point {
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException();
        }
    }

    public static Point of() {
        return new Point(0, 0);
    }

    public static Point of(int x, int y) {
        return new Point(x, y);
    }
}
```

## 对象包装器与自动装箱

| 基本类型  | 对应的引用类型        |
| --------- | --------------------- |
| `void`    | `java.lang.Void`      |
| `boolean` | `java.lang.Boolean`   |
| `char`    | `java.lang.Character` |
| `byte`    | `java.lang.Byte`      |
| `short`   | `java.lang.Short`     |
| `int`     | `java.lang.Integer`   |
| `long`    | `java.lang.Long`      |
| `float`   | `java.lang.Float`     |
| `double`  | `java.lang.Double`    |

### 父类

`Number`.

### Final 类

所有的包装类型都是不变类 (强不可变类):

- 无子类, 不可改变数.
- 对于较小的数, `Integer.valueOf()` 静态工厂方法始终返回相同的实例.
- `Byte.valueOf()` 静态工厂方法返回的实例全部是缓存实例.

### 编译器特性

- 自动装箱 (auto-boxing)

```java
Integer I = 10;
myArrayList.add(10);
```

- 自动拆箱 (auto-unboxing)

```java
int i= I;
```

- 自动装箱+拆箱

```java
Integer I = 0;I++;

// 实际译为:
Integer I = Integer.valueOf(10);
myArrayList.add(Integer.valueOf(10));
Int I =  I.intValue();
```

### APIs

- `Boolean.TRUE`/`Boolean.FALSE`.
- `Long.SIZE`/`Long.BYTES`.
- `Integer.MAX_VALUE`/`Integer.MIN_VALUE`.
- `Integer.parseInt()`.
- `Integer.toString()`/`Integer.toHexString()`/`Integer.toOctalString()`/`Integer.toBinaryString()`.

## Reflection

### Mechanism

- 运行中分析 类的能力
- 运行中查看对象
- 实现通用的数组操作代码
- 利用 Method 对象

### Functions

- 分析类的能力
- 分析对象
- 泛型数组实现
- 函数指针: 调用任意方法

## 对象克隆

### Interface

标签接口(tagging interface)之一: 无方法

### Object

浅拷贝: 无法克隆目标对象实例域中的对象成员

### Custom

鉴于默认 clone 方法的局限性, 需自定义用户需要的 clone 方法

- 实现接口: implements Cloneable
- 改变可见性&抛出异常: `public <returnType> clone() throws CloneNotSupportedException {};`
- 自定义克隆体: 克隆子对象

## 内部类

- 定义: 应使用 private 关键字
- 访问实例域/方法:
  - 内部类: this.fieldName/methodName
  - 外部类: OuterClass.this.fieldName/methodName
- 声明与构造(实例化):

```java
OuterClass.InnerClass variableName = OuterClass/this.new InnerClass();
```

### 局部

- 定义在方法中的内部类
- 修饰符: 无/abstract/final
- 可访问外围类成员/final 局部变量

### 匿名

在实际`构造父类/实现接口`时定义在构造器方法中的内部类

- 外围为父类: 内部类需要扩展该父类

```java
new SuperType (construction parameters)
{
    inner class methods and data{};  //直接定义实例域和方法, 构造器参数传递给父类构造器
}
```

- 外围为接口: 内部类需要实现该接口

```java
new InterfaceType () //一对括号
{
    Inner class methods and data{};  //需实现接口中的所有抽象方法
}
```

- 例子: 积分、线程、回调函数(HookFunction)、事件处理(ActionListener)

### 静态

- 只可访问外围类的静态域/静态方法(可视作不可访问外围类)
- 实例化: new OuterClass.InnerClass()
