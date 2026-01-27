---
sidebar_position: 23
tags: [Programming, Design, Design Pattern, Dependency Pattern]
---

# IoC and DI

- IoC (Inversion of Control) 控制反转模式: 将组件间的依赖关系从程序内部提到外部来管理.
- DI (Dependency Injection) 依赖注入模式: 将组件的依赖通过外部以参数或其他形式注入.

A 依赖 B, 若在 A 中实例化 B,
则会形成 A 与 B 间的高度耦合,
使得 A 可测试性与可维护性变差.

将 A 对 B 的控制权抽离出来,
把控制权反转给第三方 (IoC Container),
实现控制反转 (IoC).

IoC Container 将 B 实例化后,
通过构造函数/接口方法/设置属性/工厂模式等方法注入 A 中,
实现依赖注入 (DI).

## Inversion of Control

```ts
class Component {
  // 构造函数注入.
  constructor(dep) {
    this.dep = dep
  }

  // 接口方法注入.
  run(context, options = {}) {
    const dep1 = context.getDep1()
    const dep2 = context.getDep2()
    dep1.run()
    dep2.run()
  }

  // 设置属性注入.
  getDep(dep) {
    this.dep = dep
  }

  // 工厂模式注入.
  static createComponent(dep) {
    return new Component(dep)
  }

  action() {
    this.dep.run()
  }
}

// IoC.
const s1 = new Service('s1')
const s2 = Container.getService('s2')
const s3 = Context.getDep('s3')
const s4 = Context.getInstance()

// DI.
const c1 = new Component(s1)
c1.action() // s1 run.
c1.getDep(s2)
c1.action() // s2 run.
const c2 = Component.createComponent(s3)
c2.action() // s3 run.
c2.run(s4) // s4 run.
```

## Depends on Abstraction

```ts
interface Database {
  query: () => void
}

class DbMysql extends Database {
  public query() {
    console.log('Querying by MySQL')
  }
}

class Controller {
  private db: Database

  public constructor(db: Database) {
    this.db = db
  }

  public action() {
    this.db.query()
  }
}

const db = new DbMysql()
const c = new Controller(db)
c.action()
```

## Injection Container

```tsx
import type { IProvider } from './providers'
import * as React from 'react'

class Injector {
  private static container = new Map<string, any>()

  static resolve<T>(Target: Type<T>): T {
    if (Injector.container.has(Target.name))
      return Injector.container.get(Target.name)

    const tokens = Reflect.getMetadata('design:types', Target) || []
    const injections = tokens.map((token: Type<any>): any =>
      Injector.resolve(token)
    )
    const instance = new Target(...injections)
    Injector.container.set(Target.name, instance)
    return instance
  }
}

export interface IProvider<T> {
  provide: () => T
}

@injectable()
export class NameProvider implements IProvider<string> {
  provide() {
    return 'World'
  }
}

export class Hello extends React.Component {
  private readonly nameProvider: IProvider<string>

  render() {
    return (
      <h1>
        Hello
        {this.nameProvider.provide()}
        !
      </h1>
    )
  }
}
```
