---
tags: [Programming, DevOps, Design Pattern, Paradigm]
---

# Paradigms

## Programming

Each programming language realizes one or more paradigms.
Each paradigm is defined by a set of programming concepts.
每个范式都约束了某种编写代码的方式:

- 结构化编程是对程序控制权的直接转移的限制.
- 面向对象编程是对程序控制权的间接转移的限制.
- 函数式编程是对程序中赋值操作的限制.

## Taxonomy

![Taxonomy of Programming Paradigms](./figures/programming-paradigms.jpg 'Taxonomy of Programming Paradigms')

Nondeterminism is important for real-world interaction.
Named state is important for modularity.

### Observable Nondeterminism

During the execution, this choice is made by
a part of the run-time system called the scheduler.
The nondeterminism is observable
if a user can see **different results** from executions
that start at the **same internal configuration**.

- concurrency or race condition (timing effects)
- shared-state concurrency or message-passing concurrency
- concurrent programming language e.g. Java

### Named State

State is the ability to remember information (a sequence of values in time).
Distinguish three axes of expressiveness, depending on whether the state is:

- Unnamed or named.
- Deterministic or nondeterministic.
- Sequential or concurrent.
- Named, nondeterministic and concurrent paradigm
  as the most expressiveness of state.
- Named state for updatable memory (mutable state) and modularity.

The least expressive combination is functional programming
(threaded state: unnamed, deterministic, sequential).
Adding concurrency gives declarative concurrent programming
(synchronous cells: unnamed, deterministic, concurrent).
Adding nondeterministic choice gives concurrent logic programming
(stream mergers: unnamed, nondeterministic, concurrent).
Adding ports or cells, gives message passing or shared state
(named, nondeterministic, concurrent).

## Object-Oriented Programming

- 封装: 模块化代码, 信息隐蔽.
- 继承: 父类和子类共享数据和方法, 高代码重用率和可维护性.
- 多态.

## Functional Programming

Based on the concept of first-class function or closure,
which makes it equivalent to the λ-calculus which is `Turing complete`.

## Framework

- full-featured frameworks vs composing micro-libs
- JSX vs templates

Evan You on Vue.js: **Seeking the Balance in Framework Design**
on [JSConf.Asia 2019](https://www.youtube.com/watch?v=ANtSWq-zI0s):

- `Functional Logic` vs `Imperative Logic`.
- `Declarative UI` vs `Imperative UI`.
- `Immutable Data` vs `Mutable Data`.
- `Referential Equality Testing` vs `Change Tracking`.
- `Runtime` vs `Compilation`.

> 打破框架的范式之争, 其实是改变思路. 从思考不同范式之间的竞争关系, 转变成思考多个范式之间的协同关系.
> UseRef in React, Composition in Vue

### Third-party Libraries

- Look for Libraries that Have Accessibility Built in.
- Limit the Number of Third-party Libraries Use.
- Wrap Third-party Dependencies:

```tsx
import { DatePicker as LibraryXDatePicker } from 'LibraryX'

function DatePicker(props) {
  return <LibraryXDatePicker {...props} />
}

export default DatePicker
```

:::tip[Frameworks]

- 初始渲染: Virtual DOM > 脏检查 >= 依赖收集.
- 小量数据更新: 依赖收集 >> Virtual DOM + 优化 > 脏检查（无法优化） > Virtual DOM 无优化.
- 大量数据更新: 脏检查 + 优化 >= 依赖收集 + 优化 > Virtual DOM（无法/无需优化）>> MVVM 无优化.
- Angular: 脏检查, React: Virtual DOM, Vue: Watch.

:::

## MVC

组件三要素: 状态、外观、行为:

- 模型类: 存储状态 (state getter/setter).
- 视图类: 显示状态对应外观, 一个模型可以有多个视图 (模型的不同部分/形式).
- 控制器类: 处理用户输入事件 (点击鼠标、敲击键盘), 改变模型类/视图类状态, 调用模型类/视图类中方法.

在 MVC 中, 视图位于我们架构的顶部, 其背后是控制器.
模型在控制器后面, 而因此我们的视图了解得到我们的控制器, 而控制器了解得到模型.
这里, 我们的视图有对模型的直接访问.
然而将整个模型完全暴露给视图可能会有安全和性能损失,
这取决于我们应用程序的复杂性.
MVVM 则尝试去避免这些问题.

在 MVP 中, 控制器的角色被代理器所取代, 代理器和视图处于同样的地位,
视图和模型的事件都被它侦听着并且接受它的调解.
不同于 MVVM, 没有一个将视图绑定到视图模型的机制, 因此我们转而依赖于每一个视图都实现一个允许代理器同视图去交互的接口.

MVVM 进一步允许我们创建一个模型的特定视图子集, 包含了状态和逻辑信息,
避免了将模型完全暴露给视图的必要.
不同于 MVP 的代理器, 视图模型并不需要去引用一个视图.
视图可以绑定到视图模型的属性上面, 视图模型则去将包含在模型中的数据暴露给视图.
像我们所提到过的, 对视图的抽象意味着其背后的代码需要较少的逻辑.

### Controller

- 处理请求的参数.
- 渲染和重定向.
- 选择 Model 和 Service.
- 处理 Session 和 Cookies.

## MVVM

- `View` and `ViewModel` communicate using data-bindings and events.
- `ViewModel` can expose `Model` attributes for data-binding.
- `ViewModel` can contain interfaces
  for fetching and manipulating properties exposed in `View`.

## AOP

AOP (Aspect Oriented Programming)
把通用逻辑抽离出来,
通过切面的方式添加到某个地方,
可以复用和动态增删切面逻辑:

- Chain of responsibility pattern.
- Decorator pattern.
- Proxy pattern.

Nest.js:
Middleware, Guard, Interceptor, Pipe, ExceptionFilter 通过 AOP 思想,
灵活地作用在某个路由或者全部路由.

Middleware 在最外层, 到达某个路由之后,
先调用 Guard, Guard 用于判断路由有没有权限访问,
再调用 Interceptor, 对 Controller 前后扩展一些逻辑,
在到达目标 Controller 之前, 会调用 Pipe 来对参数做验证和转换.
所有的 HttpException 的异常都会被 ExceptionFilter 处理, 返回不同的响应.

Nest.js 通过 AOP 的架构方式, 实现了松耦合, 易于维护与扩展的架构.

## jQuery

- Adapter pattern:
  adapted `$.css()` API.
- Facade pattern:
  simple `$.get()`/`$.post()` API over complicated `$.ajax()` API.
- Pub-Sub pattern:
  - `$.on()`/`$.off()`/`$.trigger()` event system.
  - AJAX callback.
- Iterator pattern:
  iterable `$.each()` API.
- Proxy pattern:
  `$.proxy()` context binding.
- Builder pattern:
  `$.text()`/`$.appendTo()` DOM builder.
- Dependency injection pattern:
  custom plugin system.

## References

- Even You presentation on [JSConf Asia 2019](https://www.youtube.com/watch?v=ANtSWq-zI0s).
- Framework paradigms [guide](https://mp.weixin.qq.com/s/mZ7KuFjyCWNCAq7HnXg96A).
