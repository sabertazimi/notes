---
tags: [Web, Angular]
---

# Angular

## Commands

[Commands](https://angular.io/cli):

```bash
npm install -g @angular/cli
```

```bash
ng new my-app
ng add <package-name>
ng serve --open
ng lint
ng test
ng e2e
```

production build: suffix `/` is required

```bash
ng build --prod true --outputPath ./build --baseHref https://tazimi.dev/hust-web/angular/learn/
```

```bash
ng generate --help
```

## Module

Angular 需要知道如何把应用程序的各个部分组合到一起,
以及该应用需要哪些其它文件和库,
这些信息被称为元数据（metadata.
有些元数据位于`@Component`装饰器中, 你会把它加到组件类上.
另一些关键性的元数据位于`@NgModule`装饰器中.

NgModule 为其中的组件提供了一个编译上下文环境.
根模块总会有一个根组件, 并在引导期间创建它.
任何模块都能包含任意数量的其它组件,
这些组件可以通过路由器加载, 也可以通过模板创建.
那些属于这个 NgModule 的组件会共享同一个编译上下文环境.

## Component

### Props

```ts
import { Input } from '@angular/core'

class InputComponent {
  @Input() hero: Hero
}
```

private props

```ts
import type { HeroService } from '../hero.service'

class HeroComponent {
  constructor(private heroService: HeroService) {}
}
```

### Event

Parent:

```ts
import type { OnInit } from '@angular/core'
import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `<app-child (valueChange)="displayCounter($event)"></app-child>`,
})
export class AppComponent implements OnInit {
  ngOnInit() {}

  displayCounter(count) {
    console.log(count)
  }
}
```

Child:

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-child',
  template: `<button class="btn btn-primary" (click)="handleClick()">
    Click me
  </button>`,
})
export class AppChildComponent {
  @Output() valueChange: EventEmitter<number> = new EventEmitter()
  counter = 0

  handleClick() {
    this.counter += 1
    this.valueChange.emit(this.counter)
  }
}
```

### Attributes

Angular 只会绑定到组件的公共属性

```ts
import type { MessageService } from '../message.service'

class MessageComponent {
  constructor(public messageService: MessageService) {}
}
```

```html
<div *ngIf="messageService.messages.length">
  <h2>Messages</h2>
  <button class="clear" (click)="messageService.clear()">Clear</button>
  <div *ngFor="let message of messageService.messages">{{message}}</div>
</div>
```

### Reference

`#` refer to DOM

```html
<div>
  <label
    >Hero name:
    <input #heroName />
  </label>
  <button (click)="add(heroName.value); heroName.value=''">add</button>
</div>
```

## Pipe

### Pure

Angular 只有在它检测到输入值发生了纯变更时才会执行纯管道.
纯变更是指对原始类型值 (String、Number、Boolean、Symbol) 的更改,
或者对对象引用 (Date、Array、Function、Object) 的更改.
Higher performance.

### Impure

Angular 会在每个组件的变更检测周期中执行非纯管道.
非纯管道可能会被调用很多次,
和每个按键或每次鼠标移动一样频繁.

### Async

```html
<!-- heroes$ is a Observable -->
<li *ngFor="let hero of heroes$ | async">{{hero.name}}</li>
```

## Service

### Injection Provider

```ts
@Injectable({
  providedIn: 'root',
})
class Logger {}
```

## RxJS

- RxJS 管理所有输入的 input -> consumer/redux action 的调度过程
- 条件变更之后的自动重新计算 (Reactive)
- 同步与异步的统一
- 获取和订阅的统一
- 现在与未来的统一
- 可组合的数据变更过程
- 数据与视图的精确绑定
- UI 变化很复杂时，用 component 归一化处理
- state 变化很复杂时，用 action/state 归一化处理
- data-input 很复杂时，用 RxJS/observable 归一化处理
- [reactive.how](https://reactive.how)

可观察对象可以发送多个任意类型的值 —— 字面量、消息、事件.
无论这些值是同步发送的还是异步发送的,
接收这些值的 API 都是一样的.
由于准备（setup）和清场（teardown）的逻辑都是由可观察对象自己处理的,
因此应用代码只管订阅并消费这些值就可以了, 做完之后, 取消订阅.
无论这个流是击键流、HTTP 响应流还是定时器,
对这些值进行监听和停止监听的接口都是一样的.

Observer（观察者）是 Observable（可观察对象）推送数据的消费者.
在 RxJS 中, Observer 是一个由回调函数组成的对象,
键名分别为 next, error, complete,
以此接受 Observable 推送的不同类型的通知 (data input).

Subscription 是一个代表可以终止资源的对象,
表示一个 Observable 的执行过程.
Subscription 有一个重要的方法: unsubscribe.
这个方法不需要传入参数,
调用后便会终止相应的资源.
Observable 当有数据产生时才会推送给订阅者,
所以它可能会无限次向订阅者推送数据.
因此在 Angular 里面创建组件的时候务必要取消订阅操作, 以避免内存泄漏.

Subject 既是可观察对象的数据源, 本身也是 Observable.
可以像订阅任何 Observable 一样订阅 Subject.
还可以通过调用它的 next(value) 方法往 Observable 中推送一些值.

```ts
// Create simple observable that emits three values
const myObservable = of(1, 2, 3)

// Create observer object
const myObserver = {
  next: x => console.log(`Observer got a next value: ${x}`),
  error: err => console.error(`Observer got an error: ${err}`),
  complete: () => console.log('Observer got a complete notification'),
}

// Execute with the observer object
const subscription = myObservable.subscribe(myObserver)
// Logs:
// Observer got a next value: 1
// Observer got a next value: 2
// Observer got a next value: 3
// Observer got a complete notification
```

```ts
class Component {
  search(term: string): void {
    this.searchTerms.next(term)
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      // return another Observable
      switchMap((term: string) => this.heroService.searchHeroes(term))
    )
  }
}
```

### Pipe Helpers

RxJS 提供了 pipe 辅助函数,
它存在于 Observable 上,
它缓解了操作符不在原型上所带来的问题.

```ts
import { of } from '@rxjs/observable'
import { map, take } from '@rxjs/operators'

map.call(take.call(of(1, 2, 3), 2), val => val + 2)

of(1, 2, 3).pipe(
  take(2),
  map(val => val + 2)
)
```

### Creation

- 单值: of, empty, never
- 多值: from
- 定时: interval, timer
- 从事件创建: fromEvent/fromEventPattern
- 从 Promise 创建: fromPromise
- 自定义创建: create

### Transformation

- map
- mapTo
- mergeMap/flatMap
- pluck
- reduce
- scan
- groupBy
- switch
- switchMap: 在每次发出时, 会取消前一个内部 Observable (所提供函数的 return value) 的订阅,
  然后订阅一个新的 observable. 即当有新的输入时便不再关心之前请求的响应结果.

借助`switchMap`操作符,
每个有效的击键事件都会触发一次`HttpClient.get()`方法调用.
即使在每个请求之间都有至少 300ms 的间隔,
仍然可能会同时存在多个尚未返回的 HTTP 请求.
`switchMap()`会记住原始的请求顺序,
只会返回最近一次 HTTP 方法调用的结果,
以前的那些请求都会被取消和舍弃.

### Filter

- audit
- auditTime
- filter
- skip
- first
- last
- take
- takeWhile
- takeUntil
- throttle
- throttleTime
- debounce
- debounceTime
- distinctUntilChanged: 只有当当前值与之前最后一个值 `!==` 时才将其发出
- bufferTime
- subscribeOn
- ObserveOn

### Combination

- concat: 保持原来的序列顺序连接两个数据流
- merge: 合并序列
- race: 预设条件为其中一个数据流完成
- forkJoin: 预设条件为所有数据流都完成
- zip: 取各来源数据流最后一个值合并为对象
- combineLatest: 取各来源数据流最后一个值合并为数组

### Multi-Cast

- MultiCast
- Publish
- Share

### Error Handling

- throw
- catch/catchError
- retry
- retryWhen
- finally

### Utilities

- do/tap
- delay
- delayWhen
- timeout
- toPromise

## Router

`<router-outlet>` 会告诉路由器要在哪里显示路由的视图.

```ts
import type { Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HeroesComponent } from './heroes/heroes.component'

const routes: Routes = [
  {
    path: 'heroes',
    component: HeroesComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Form

- `[(ngModel)]`
- `(ngSubmit)`

## Event Binding

- `()` template syntax for event binding

```html
<li (click)="onSelect($event.target.name)"></li>
<li (click)="onSelect(hero.name)"></li>
```

## Directives

### For

```html
<li *ngFor="let hero of heroes">{{hero.name}}</li>
```

### If

```html
<div *ngIf="selectedHero">Selected</div>
```

### Class

same to `[ngStyle]`

```html
<div [ngClass]="currentClasses">This div is initially saveable, unchanged, and special</div>
```

```ts
class Component {
  currentClasses

  setCurrentClasses() {
    // CSS classes: added/removed per current state of component properties
    this.currentClasses = {
      saveable: this.canSave,
      modified: !this.isUnchanged,
      special: this.isSpecial,
    }
  }
}
```

## Styles

```html
<!-- toggle the "special" class on/off with a property -->
<div [class.special]="isSpecial">The class binding is special</div>

<!-- binding to `class.special` trumps the class attribute -->
<div class="special" [class.special]="!isSpecial">This one is not so special</div>
```
