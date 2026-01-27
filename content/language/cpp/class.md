---
sidebar_position: 11
tags: [Language, C++, Class]
---

# Class

## 初始化与回收

- Treat global program as a object: 开工函数与收工函数
- Normal Object: 构造函数与析构函数

## Access Control

public > protected > private + friend > private

## 构造函数

### 调用形式

构造函数不可被显式调用(类前缀), 必须隐式调用(省略类前缀)

### 函数体

- 构造函数体前: 初始化只读成员、引用成员、对象成员、其他数据成员, 初始化顺序以**定义顺序**为准, **无关构造函数体前出现顺序**
- 构造函数体内: 再次赋值其他数据成员(不可再次只读成员、引用成员、对象成员)

### 默认无参

- 当定义了含参构造函数后, 编译器将不会再为对象自动添加无参构造函数
- 默认无参构造函数不会初始化只读/引用成员, 且只会调用对象成员的无参构造函数(若对象成员没有无参构造函数,则编译器报错)
- 对于局部对象, 将随机初始化普通数据成员; 对于全局对象, 将普通数据成员初始化为 0.
  由于默认无参构造函数的存在, 当对象只含有普通数据成员(无只读/引用/指针成员, 且对象成员有无参构造函数), 可以不显式定义构造函数

```cpp
class Foo {
    const int b;
    int c, &d, e, f;
    String g, h;

public:
    // 初始化顺序: b, c, d, e, f, g, h
    Foo(int bar): d(c), c(bar), g(bar), b(bar), e(bar) {
        c += bar;
        f = bar;
    }
};
```

```cpp
B z(7, 8); => B z(7, 8);    ///< 2 参
B z = (7, 8); => B z(8);    ///< 1 参
```

### 顺序

- 同一派生树上所有虚基类(自左向右, 自下向上)(递归)
- (继承顺序)直接基类(递归)
- (定义顺序)所有成员
- 构造函数体

### 深拷贝

- 形式为 Foo:Foo(Foo &obj) 的构造函数,可使得对象作为实参传递时自动进行深拷贝复制

```cpp
ARRAY::ARRAY(ARRAY &r) {
    p = new int[size = r.size];

    for (int i = 0;i < size; i++) {
        p[i] = r.p[i];
    }
}
```

### Move

```cpp
class A {
  A(const A&& a) {
    // move constructor
    // set a == null_ptr
  }
}
```

## 析构函数

- 析构函数即可显式调用,又可隐式调用
- 析构函数与全局 main 函数 没有重载函数
- 作用域结束时会自动调用析构函数
- 调用 exit/abort 时, 需手动调用析构函数释放资源

```cpp
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

    return 0;
}
```

- 设置 **析构标志** 防止重复析构同一对象

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

## 构造与析构函数

- 按定义顺序自左下至右上地构造**所有**虚基类
- 按定义顺序构造直接基类
- 按定义顺序构造数据成员(对象/const/引用/普通成员)
- 执行类构造函数体
- 递归执行以上过程

### 派生树

- 一个对象/对象成员一颗单独的派生树
- 单独的派生树中, 合并同名虚基类, 不合并同名基类,
  并 `{ name(type), ...}` 标示数据成员

## New and Delete

### Stack and Heap

- string str("sabertazimi") 创建在栈上, 自动析构
- new/malloc 返回堆指针, delete/free 的对象是**堆指针**/**(&引用变量)**, 完全由程序员管理创建与回收

```cpp
int x = 5;
int *p = &x;
int &q = x;

delete p;   // address of x
delete &q;  // address of x
```

### 指针成员

- 普通指针/不含指针成员的对象变量分配/回收内存可**混用** malloc/new/free/delete/delete []
- 创建/回收含有**指针成员**的类时,只能用 `new/delete/delete [](分配对象内存+调用构造/析构函数)`,
  不能用 malloc/free(只作用于对象本身,不调用构造/析构函数,即不为指针成员分配/回收内存), 否则会造成**指针成员**未分配内存/内存泄露
- new 对象数组实质: malloc 对象 + 调用对象无参构造函数

## This Pointer

普通函数成员比**静态函数**成员多一个隐含参数 this 指针, 其会随着函数类型的不同而改变类型

- this 指针指向对象起始地址处(对象首成员地址)
- 一般函数: `class_type *const this;`
- const 函数: `const class_type *const this;`, 可以修改 this 所指对象的**非只读静态数据成员**
- volatile 函数: `volatile class_type *const this;`
- 当 this 指针类型不同时, 亦会**产生重载函数**

## 成员指针与指针成员

### 成员指针

- 成员指针**不是地址**, 而是**偏移量**
- 考虑到越界问题,成员指针不可移动
- 成员指针不可进行类型转换, 不可将其转换为其他类型, 也不可将其他类型转换为它
- 作用: 成员别名 `(a.*pf)() => a.size()`
- 优先级: `. > * > .*`(结合性: 自左向右)

```cpp
int A::*pi = &A::i;         ///< 数据成员指针
int (A::*pf)(void) = &A::f;     ///< 函数成员指针

long x = a.*pi;     ///< x = a.*pi = a.*(&A::i) = a.A::i = a.i;
x = (a.*pf)();      ///< x = (a.*pf)() = (a.*(&A::f))() = (a.A::f)() = a.f()

pi++, pf+=1;        ///< Error: 成员指针不可移动
x = (long)pi;       ///< Error: pi 不能转换为 long int
```

### 定义含指针成员的类

- 深拷贝构造函数: T(const T &)
- 深拷贝赋值运算函数: virtual T& operator=(const T &)
- 虚析构函数: virtual ~T()
- 定义`T &p = *new T()`后, 使用`delete &p`释放内存
- 定义`T *p = new T()`后, 使用`delete p`释放内存

## Const and Volatile

- 修饰函数成员隐含参数 `*this` 对象指针,表示不可修改/挥发对象
- 被修饰函数成员不能修改对象自身(即对象的**普通数据成员**), 可以修改对象的**非只读静态**数据成员
- 构造函数/析构函数不可被 const/volatile 修饰: 在构造/析构函数中, 对象必须可以被修改(No const), 且处于稳定状态(No volatile)

## Mutable

- mutable 不可修饰引用成员
- mutable 成员不可用 const/volatile/static 修饰
- const 函数中可以修改 mutable 成员

## Static

`static`:

- 位于 class 体内: 表示该成员/方法共享存储单元(不限定作用域)
- 位于 class 体外: 表示该变量/函数具有静态存储周期(限定作用域为当前文件)

### Field

- 静态数据成员脱离对象实例存在 `Person::totalNum`
- 静态数据成员存储单元不属于任何对象实例
- 不能在**构造函数/析构函数**中**创建/释放**静态数据成员的存储单元
- 在类体内声明静态数据成员, 在类体外定义并初始化静态数据成员 `List * List::head = NULL;`(包括**私有**静态数据成员)
- **局部类/union 类不可定义静态数据成员, 局部类/union 类可以定义静态函数成员**

### Function

- 静态函数成员不含隐含参数(this 对象指针)
- 构造/析构/virtual/const/volatile 函数(均有 this 对象指针)不能定义为静态函数成员
- 体内实现为 inline 函数, 体外实现不能有 static 关键字
- 只能直接修改当前对象静态数据成员
- 可以通过静态函数成员的函数参数, 传入对象实例指针, 从而间接修改非静态数据成员
- Refer: 抽象类型 `List::sort()`, 对象实例 `list.sort()`

### Pointer

除了具有访问权限外, 静态成员指针就是普通指针(可以进行指针加减运算)

```cpp
int *d = &CROWD::number;
int (*f)() = &CROWD::getnumber;
```

## 友元

- 在重载函数中, (函数签名不一致的) 未声明的函数只能访问类的共有成员
- friend 声明不能与存储类型关键字共用(static/virtual)
- 定义友元函数(使用 friend 修饰函数声明)时: 友元函数**不是此处**的函数成员, 可随意指定 返回类型与访问控制权限

### 成员友元函数

可在 3 处实现函数体:

- 函数定义处(本类): 内联函数成员
- 友元声明处(它类): 内联友元函数(作用域局限于**当前程序文件**)
- 类体外(**不使用 friend 关键字**)

## 单继承

### 派生控制权限

- 降低/维持权限
- class 缺省为 private 派生控制, struct 缺省为 public 派生控制
- 只可恢复至基类原权限, 不可随意修改基类成员权限

### 父类与子类

- 子类对象地址可以赋值给父类指针, 子类指针可以直接赋值给父类指针
- 父类对象地址不可以赋值给子类指针, 父类指针即使强制类型转换后也不可以赋值给子类指针

## 虚函数

### 特性

- 无限传递性: 派生类中原型相同的函数自动成为虚函数
- 具有隐式参数(this 对象指针): 不能为静态函数成员(静态函数无 this 参数)/非函数成员(本类友元函数), 可以为它类成员友元函数
- 构造函数不能为虚函数, 析构函数可以为虚函数
- virtual 与 friend/static 关键字不可共用
- union 既不能定义基类也不能定义派生类, 故不能在 union 中定义虚函数

### 功能

实现运行时多态. 最好将普通函数成员**全部**定义为 虚函数

### 抽象类

- 纯虚函数具有虚函数的所有特性
- 具有纯虚函数的类自动成为抽象类

```cpp
struct A {
    virtual void f1() = 0;
    virtual void f2() = 0;
};
```

### 易错点

- virtual 关键字只能在 struct/class 体内使用, 在体外实现相应函数成员时, 应**去掉** virtual 关键字
- 当在**函数成员**中调用虚函数时, 会根据 this 所指真实对象动态调用虚函数(如在基类函数成员中调用虚函数, 可能实际调用的是子类的虚函数)
- 使用**基类指针/基类引用**指向派生类时, 只可按**基类访问控制权限**调用**基类**拥有的方法
- 不可以**new 抽象类(堆实例)/构造抽象类的栈实例**, 函数参数/返回值不可直接定义为抽象类(调用时无法构造栈实例), 但可以定义为**抽象类的引用/指针**

```cpp
Parent *p = new Child(5);
p->~Child();    // Error: method not defined
p->~Parent();   // Success: invoke Child::~Child()
```

## 多态

- 编译时多态(重载): 静态绑定(同名不同参的)重载函数 - 一个方法, 多种参数
  `(f(void) => f@, f(int) => f@i, f(int, int) => f@ii)`
- 运行时多态(多态): 动态绑定(upcasting)虚函数 - 一个接口, 多个方法(父子表现不同, 兄弟表现不同)

```cpp
Parent c = new Child();
c.speak("Hello World!") // => "Child: Hello World!"
```

- 每一行输出都为新的派生树(拥有独立的虚基类)
- 每个对象成员都为新的派生树(拥有独立的虚基类)
