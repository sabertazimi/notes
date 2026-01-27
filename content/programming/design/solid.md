---
tags: [Programming, DevOps, Design Pattern, SOLID]
---

# SOLID

- Single Responsibility Principle: 单一功能原则.
- Open-closed Principle: 开闭原则.
- Liskov Substitution Principle: 里氏替换原则.
- Interface Segregation Principle: 接口隔离原则.
- Dependency Inversion Principle: 依赖反转原则.

:::tip[SOLID]

- 单一职责是所有设计原则的基础.
- 开闭原则是设计的终极目标.
- 里氏替换原则强调的是子类替换父类后程序运行时的正确性, 它用来帮助实现开闭原则.
- 接口隔离原则用来帮助实现里氏替换原则, 同时它也体现了单一职责.
- 依赖倒置原则是过程式设计与面向对象设计的分水岭, 同时它也被用来指导接口隔离原则.

:::

## Single Responsibility

Too much functionality is in one class and you modify a piece of it,
it can be difficult to understand how that will affect other dependent modules:

- Singleton pattern.
- Decorator pattern.
- Proxy pattern.
- Iterator pattern.
- Visitor pattern.

```ts
// BAD
class Animal {
  constructor(name) {
    super(name)
  }

  getAnimalName() {
    return this.name
  }

  saveAnimal(animal) {}
}

// GOOD
class Animal {
  constructor(name) {
    super(name)
  }

  getAnimalName() {
    return this.name
  }
}

class AnimalDB {
  getAnimal(animal) {}
  saveAnimal(animal) {}
}
```

:::tip[Exception Handle]

异常处理视作单独职责,
抽离 `try catch` 代码块,
使之成为单独函数.

:::

## Open-Closed

Allow users to add new functionalities without changing existing code,
open for extension, close for modification:

- Polymorphism (多态性).
- Adapter pattern.
- Decorator pattern.
- Proxy pattern.
- Chain of responsibility pattern.
- Iterator pattern.
- Pub-Sub pattern.
- State pattern.
- Strategy pattern.
- Template Method Pattern.

```ts
class Coder {
  constructor(fullName, language, hobby, education, workplace, position) {
    this.fullName = fullName
    this.language = language
    this.hobby = hobby
    this.education = education
    this.workplace = workplace
    this.position = position
  }
}

// BAD: filter by any other new property have to change CodeFilter's code.
class CoderFilter {
  filterByName(coders, fullName) {
    return coders.filter(coder => coder.fullName === fullName)
  }

  filterByLang(coders, language) {
    return coders.filter(coder => coder.language === language)
  }

  filterByHobby(coders, hobby) {
    return coders.filter(coder => coder.hobby === hobby)
  }
}

// GOOD
class CoderFilter {
  filterByProp = (array, propName, value) =>
    array.filter(element => element[propName] === value)
}
```

```ts
const animals: Array<Animal> = [new Animal('lion'), new Animal('mouse')]

function AnimalSound(a: Array<Animal>) {
  for (let i = 0; i <= a.length; i++) {
    if (a[i].name === 'lion')
      log('roar')

    if (a[i].name === 'mouse')
      log('squeak')
  }
}

AnimalSound(animals)
```

```ts
class Animal {
  makeSound()
  // ...
}

class Lion extends Animal {
  makeSound() {
    return 'roar'
  }
}

class Squirrel extends Animal {
  makeSound() {
    return 'squeak'
  }
}

class Snake extends Animal {
  makeSound() {
    return 'hiss'
  }
}

function AnimalSound(a: Array<Animal>) {
  for (let i = 0; i <= a.length; i++) log(a[i].makeSound())
}

AnimalSound(animals)
```

```ts
class Discount {
  giveDiscount() {
    if (this.customer === 'fav')
      return this.price * 0.2

    if (this.customer === 'vip')
      return this.price * 0.4
  }
}
```

```ts
class VIPDiscount extends Discount {
  getDiscount() {
    return super.getDiscount() * 2
  }
}

class SuperVIPDiscount extends VIPDiscount {
  getDiscount() {
    return super.getDiscount() * 2
  }
}
```

## Liskov Substitution

Objects of ParentType can be replaced with objects of SubType without altering.
Altering shows that SubType should not be subtype of ParentType
(break Open Closed Principle),
you should re-design ParentType and SubType.

```cpp
function AnimalLegCount(a: Array<Animal>) {
  for (let i = 0; i <= a.length; i++) {
    if (typeof a[i] === 'Lion') {
      log(LionLegCount(a[i]));
    }

    if (typeof a[i] === 'Mouse') {
      log(MouseLegCount(a[i]));
    }

    if (typeof a[i] === 'Snake') {
      log(SnakeLegCount(a[i]));
    }
  }
}

AnimalLegCount(animals);
```

```ts
class Animal {
  LegCount() {
    return 2
  }
}

class Lion extends Animal {
  LegCount() {
    return 4
  }
}

function AnimalLegCount(a: Array<Animal>) {
  for (let i = 0; i <= a.length; i++) a[i].LegCount()
}

AnimalLegCount(animals)
```

## Interface Segregation

- Make **fine grained** interfaces that are client specific.
- Clients should not be forced to depend upon interfaces that they do not use:
  任何层次的软件设计如果依赖了它并不需要的东西, 就会带来意料之外的麻烦.

```ts
// BAD.
interface IShape {
  drawCircle: () => any
  drawSquare: () => any
  drawRectangle: () => any
}

class Circle implements IShape {
  drawCircle() {
    // ...
  }

  drawSquare() {
    // ...
  }

  drawRectangle() {
    // ...
  }
}

class Square implements IShape {
  drawCircle() {
    // ...
  }

  drawSquare() {
    // ...
  }

  drawRectangle() {
    // ...
  }
}

class Rectangle implements IShape {
  drawCircle() {
    // ...
  }

  drawSquare() {
    // ...
  }

  drawRectangle() {
    // ...
  }
}
```

```ts
// GOOD.
interface IShape {
  draw: () => any
}

interface ICircle {
  drawCircle: () => any
}

interface ISquare {
  drawSquare: () => any
}

interface IRectangle {
  drawRectangle: () => any
}

interface ITriangle {
  drawTriangle: () => any
}

class Circle implements ICircle {
  drawCircle() {
    // ...
  }
}

class Square implements ISquare {
  drawSquare() {
    // ...
  }
}

class Rectangle implements IRectangle {
  drawRectangle() {
    // ...
  }
}

class Triangle implements ITriangle {
  drawTriangle() {
    // ...
  }
}

class CustomShape implements IShape {
  draw() {
    // ...
  }
}
```

```ts
// GOOD.
class Circle implements IShape {
  draw() {
    // ...
  }
}

class Triangle implements IShape {
  draw() {
    // ...
  }
}

class Square implements IShape {
  draw() {
    // ...
  }
}

class Rectangle implements IShape {
  draw() {
    // ...
  }
}
```

## Dependency Inversion

Dependency should be on **abstractions** not concretions:

- High-level modules should not depend upon low-level modules,
  both should depend upon **abstractions**
- Abstractions should not depend on details,
  details should depend upon abstractions

:::tip[Pros]

- Loosely coupled modules
- Better reusability
- Better testability

:::

```ts
class XMLHttpService extends XMLHttpRequestService {}

class Http {
  constructor(private xmlHttpService: XMLHttpService) {}

  get(url: string, options: any) {
    this.xmlHttpService.request(url, 'GET')
  }

  post() {
    this.xmlHttpService.request(url, 'POST')
  }
}
```

```ts
interface Connection {
  request: (url: string, opts: any) => any
}

// Abstraction not upon on details (but upon on abstractions)
class Http {
  constructor(private httpConnection: Connection) {}

  get(url: string, options: any) {
    this.httpConnection.request(url, 'GET')
  }

  post() {
    this.httpConnection.request(url, 'POST')
  }
}

class XMLHttpService implements Connection {
  xhr = new XMLHttpRequest()

  request(url: string, opts: any) {
    xhr.open()
    xhr.send()
  }
}

class NodeHttpService implements Connection {
  request(url: string, opts: any) {
    // ...
  }
}

class MockHttpService implements Connection {
  request(url: string, opts: any) {
    // ...
  }
}
```

## Least Knowledge

最少知识原则 (Law of Demeter):

- 一个软件实体 (变量/对象/类/函数/模块/系统) 应当尽可能少地与其他实体发生相互作用.
- 若两个对象无需直接通信, 则两个对象不应直接相互联系, 引入一个第三者对象承担通信作用.
- Facade pattern.
- Mediator pattern.
