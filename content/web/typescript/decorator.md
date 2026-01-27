---
sidebar_position: 20
tags: [Web, TypeScript, Decorator]
---

# Decorators

- Attaching to a class:
  access to the class prototype and its member properties.
- Attaching to a class property:
  access to the name and value of that property,
  along with its class prototype `target`.
- Attaching to a class method parameter:
  access to that parameter’s index, name and value.
- Attaching to a class method:
  access to the method’s parameters, the metadata associated with the method object,
  along with its class prototype `target`.

```ts
// class definitions
@decorator
class MyComponent extends React.Component<Props, State> {
  // class properties
  @decorator
  private static api_version: string

  // class method parameters
  private handleFormSubmit1(@decorator myParam: string) {}

  // class methods
  @decorator
  private handleFormSubmit2() {}

  // accessors
  @decorator
  public myAccessor() {
    return this.privateProperty
  }
}
```

:::tip[Pros]

- 实现 Open-closed 原则.
- 分离辅助性功能逻辑 (Before/After 钩子, Trace, Log, Report, Debounce/Throttle)
  与业务逻辑.
- 抽象公有功能函数.
- 装饰器模式是 Class 继承的一个替代模式.
  (类似于组合模式)

:::

```ts
type Decorator = (value: Input, context: {
  kind: string
  name: string | symbol
  access: {
    get?: () => unknown
    set?: (value: unknown) => void
  }
  private?: boolean
  static?: boolean
  addInitializer: (initializer: () => void) => void
}) => Output | void

type ClassDecorator = (value: Function, context: {
  kind: 'class'
  name: string | undefined
  addInitializer: (initializer: () => void) => void
}) => Function | void

type ClassMethodDecorator = (value: Function, context: {
  kind: 'method'
  name: string | symbol
  access: { get: () => unknown }
  static: boolean
  private: boolean
  addInitializer: (initializer: () => void) => void
}) => Function | void

type ClassGetterDecorator = (value: Function, context: {
  kind: 'getter'
  name: string | symbol
  access: { get: () => unknown }
  static: boolean
  private: boolean
  addInitializer: (initializer: () => void) => void
}) => Function | void

type ClassSetterDecorator = (value: Function, context: {
  kind: 'setter'
  name: string | symbol
  access: { set: (value: unknown) => void }
  static: boolean
  private: boolean
  addInitializer: (initializer: () => void) => void
}) => Function | void

type ClassFieldDecorator = (value: undefined, context: {
  kind: 'field'
  name: string | symbol
  access: { get: () => unknown, set: (value: unknown) => void }
  static: boolean
  private: boolean
  addInitializer: (initializer: () => void) => void
}) => (initialValue: unknown) => unknown | void

type ClassAutoAccessorDecorator = (
  value: {
    get: () => unknown
    set: (value: unknown) => void
  },
  context: {
    kind: 'accessor'
    name: string | symbol
    access: { get: () => unknown, set: (value: unknown) => void }
    static: boolean
    private: boolean
    addInitializer: (initializer: () => void) => void
  }
) => {
  get?: () => unknown
  set?: (value: unknown) => void
  init?: (initialValue: unknown) => unknown
} | void
```

## Class

```ts
type Constructor<T = object> = new (...args: any[]) => T

function toString<Class extends Constructor>(
  Value: Class,
  context: ClassDecoratorContext<Class>
) {
  return class extends Value {
    constructor(...args: any[]) {
      super(...args)
      console.log(JSON.stringify(this))
      console.log(JSON.stringify(context))
    }
  }
}

@toString
class Person {
  name: string

  constructor(name: string) {
    this.name = name
  }

  greet() {
    return `Hello, ${this.name}`
  }
}
const person = new Person('Simon')
/**
 * Logs:
 * {"name":"Simon"}
 * {"kind":"class","name":"Person"}
 */
```

## Property

```ts
function upperCase<T>(
  target: undefined,
  context: ClassFieldDecoratorContext<T, string>
) {
  return function (this: T, value: string) {
    return value.toUpperCase()
  }
}

class MyClass {
  @upperCase
  prop1 = 'hello!'
}

console.log(new MyClass().prop1) // Logs: HELLO!
```

## Method

```ts
function log<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  const methodName = String(context.name)

  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`)
    const result = target.call(this, ...args)
    console.log(`LOG: Exiting method '${methodName}'.`)
    return result
  }

  return replacementMethod
}

class MyClass {
  @log
  sayHello() {
    console.log('Hello!')
  }
}

new MyClass().sayHello()
```

## Getter and Setter

```ts
function range<This, Return extends number>(min: number, max: number) {
  return function (
    target: (this: This) => Return,
    context: ClassGetterDecoratorContext<This, Return>
  ) {
    return function (this: This): Return {
      const value = target.call(this)

      if (value < min || value > max) {
        throw new Error('Invalid')
      }

      Object.defineProperty(this, context.name, {
        value,
        enumerable: true,
      })
      return value
    }
  }
}

class MyClass {
  private _value = 0

  constructor(value: number) {
    this._value = value
  }

  @range(1, 100)
  get getValue(): number {
    return this._value
  }
}

const obj = new MyClass(10)
console.log(obj.getValue) // Valid: 10

const obj2 = new MyClass(999)
console.log(obj2.getValue) // Throw: Invalid!
```

## Reflect Metadata

IoC and DI implementation:

```ts
const INJECTIONS = new WeakMap()

function createInjections() {
  const injections = []

  function injectable(Class) {
    INJECTIONS.set(Class, injections)
  }

  function inject(injectionKey) {
    return function applyInjection(v, context) {
      injections.push({ injectionKey, set: context.access.set })
    }
  }

  return { injectable, inject }
}

class Container {
  registry = new Map()

  register(injectionKey, value) {
    this.registry.set(injectionKey, value)
  }

  lookup(injectionKey) {
    this.registry.get(injectionKey)
  }

  create(Class) {
    const instance = new Class()

    for (const { injectionKey, set } of INJECTIONS.get(Class) || [])
      set.call(instance, this.lookup(injectionKey))

    return instance
  }
}

class Store {}

const { injectable, inject } = createInjections()

@injectable
class C {
  @inject('store') store
}

const container = new Container()
const store = new Store()

container.register('store', store)

const c = container.create(C)

c.store === store // true
```

AOP programming:

```ts
const PATH_METADATA = 'path'
const METHOD_METADATA = 'method'

function Controller(path: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(PATH_METADATA, path, target)
  }
}

function createMappingDecorator(method: string) {
  return (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
      Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value)
    }
  }
}

const Get = createMappingDecorator('GET')
const Post = createMappingDecorator('POST')

function mapRoute(instance: object) {
  const prototype = Object.getPrototypeOf(instance)

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    item => !isConstructor(item) && isFunction(prototype[item])
  )
  return methodsNames.map((methodName) => {
    const fn = prototype[methodName]

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn)
    const method = Reflect.getMetadata(METHOD_METADATA, fn)

    return {
      route,
      method,
      fn,
      methodName,
    }
  })
}

@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world'
  }

  @Post('/b')
  somePostMethod() {}
}

Reflect.getMetadata(PATH_METADATA, SomeClass) // '/test'

mapRoute(new SomeClass())
/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 *
 */
```
