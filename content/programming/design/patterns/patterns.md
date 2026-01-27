---
tags: [Programming, DevOps, Design Pattern]
---

# Patterns

:::tip[Design Patterns]

Software design is the art of managing dependencies and abstractions.

:::

- Minimizing dependencies.
- Introduce fitting abstractions.

![Common Design Patterns](./figures/design-patterns.png 'Common Design Patterns')

## Creation

- [Factory Method](./factory-method.md) (工厂方法): 通过将数据和事件接口化来构建若干个子类.
- [Abstract Factory](./abstract-factory.md) (抽象工厂): 建立若干族类的一个实例, 这个实例不需要具体类的细节信息 (抽象类).
- [Builder](./builder.md) (建造者): 将对象的构建方法和其表现形式分离开来, 总是构建相同类型的对象.
- [Prototype](./prototype.md) (原型): 一个完全初始化的实例, 用于拷贝或者克隆.
- [Singleton](./singleton.md) (单例): 一个类只有唯一的一个实例, 这个实例在整个程序中有一个全局的访问点.

## Structural

- [Adapter](./adapter.md) (适配器模式): 将不同类的接口进行匹配与调整, 使得内部接口不兼容的类可以协同工作.
- [Bridge](./bridge.md) (桥接模式): 将对象的接口从其实现中分离出来, 这样对象的实现和接口可以独立的变化.
- [Composite](./composite.md) (组合模式):
  通过将简单可组合的对象组合起来, 构成一个完整的对象,
  这个对象的能力将会超过这些组成部分的能力的总和, 产生新的能力.
- [Decorator](./decorator.md) (装饰器): 动态给对象增加一些可替换的处理流程.
- [Facade](./facade.md) (外观模式): 一个类隐藏了内部子系统的复杂度, 只暴露出一些简单的接口.
- [Flyweight](./flyweight.md) (享元模式) 一个细粒度对象, 用于将包含在其它地方的信息 在不同对象之间高效地共享.
- [Proxy](./proxy.md) (代理模式): 一个充当占位符的对象用来代表一个真实的对象.

## Behavioral

- [Chain of Responsibility](./chain-of-responsibility.md) (响应链): 一种将请求在一串对象中传递的方式, 寻找可以处理这个请求的对象.
- [Command](./command.md) (命令): 封装命令请求为一个对象, 从而使记录日志, 队列缓存请求, 未处理请求进行错误处理 这些功能称为可能.
- Interpreter (解释器): 将语言元素包含在一个应用中的一种方式, 用于匹配目标语言的语法.
- [Iterator](./iterator.md) (迭代器): 在不需要直到集合内部工作原理的情况下, 顺序访问一个集合里面的元素.
- [Mediator](./mediator.md) (中介者模式): 在类之间定义简化的通信方式, 用于避免类之间显式的持有彼此的引用.
- [Observer](./observer.md) (观察者模式): 用于将变化通知给多个类的方式, 可以保证类之间的一致性.
- [State](./state.md) (状态): 当对象状态改变时, 改变对象的行为.
- [Strategy](./strategy.md) (策略): 将算法封装到类中, 将选择和实现分离开来.
- [Template Method](./template-method.md) (模板方法): 在一个方法中为某个算法建立一层外壳, 将算法的具体步骤交付给子类去做.
- [Visitor](./visitor.md) (访问者): 为类增加新的操作而不改变类本身.

## Dependency

- [IoC and DI](./ioc-di.md) (控制反转与依赖注入模式):
  将组件间的依赖关系从程序内部提到外部来管理, 将组件的依赖通过外部以参数或其他形式注入.
- [Mixin](./mixin.md) (混入模式): 将多个对象的属性混入同一个对象, 达到继承/扩展/组合的效果.

## References

- JavaScript [patterns](https://www.patterns.dev).
- JavaScript design [patterns](http://www.dofactory.com/javascript/design-patterns).
- Refactoring design [patterns](https://refactoring.guru/design-patterns).
