---
sidebar_position: 28
tags: [Web, JavaScript, ECMAScript, Functional Programming]
---

# Functional JavaScript

- Avoid mutation.
- First class functions.
- Recursive data structures and recursive functions.
- Laziness.

:::tip[Functional JavaScript]

Functional programming is the art of composing higher-order functions
to advance the state of a program in a pure manner:

- Pure Functions and Immutability:
  Pure functions ensure that functions have no side effects
  and return the same output for the same inputs,
  which is complemented by immutability that prevents data from being changed unexpectedly.
  Together, they ensure a predictable and stable code base.
- Currying and Memoization:
  Currying allows functions to be broken down into simpler, single-argument functions
  that are easier to manage and memoize.
  Memoization can then be applied to these curried functions to cache their results,
  optimizing the application's performance by avoiding repeated calculations.
- Monads and Pure Functions:
  Monads help manage side effects in a controlled manner,
  which allows pure functions to remain pure
  even when dealing with operations like I/O or state transitions.
  This encapsulation of side effects preserves the integrity of the functional architecture.

:::

:::tip[Pros]

- Predictable: explicit flow of data.
- Safety: type safety, state safety, and concurrency safety.
- Transparent: pure and immutable.
- Modular: composite with currying and monads.

:::

:::caution[Cons]:

- Verbose.
- More object creation.
- More garbage collection.
- More memory usage.

:::

With help of `immutable.js`/`immer.js`,
object creation/garbage collection/memory usage can be alleviated.

For example, in vanilla.js, `map2 === map1` become `false`,
but in immutable.js `map2 === map1` become `true`
(copy free due to immutable data).

```ts
const map1 = { b: 2 }
const map2 = map1.set('b', 2)
```

## Formal Proof

- Syntactic: syntax rules.
- Semantic: type checking rules.
- Runtime: evaluation rules.

```haskell
Syntax: if e1 then e2 else e3
Type: e1 = bool,  e2 = e3 = any
Evaluation: e1 ? e2 : e3
```

## Lambda Calculus

### Expression

- Variable: x
- Abstraction: λx.M
- Application: M N

> e.g. λx.y λx.(λy.xy)

- 变量 x 本身就是一个有效的 lambda 项
- 如果 t 是一个 lambda 项，而 x 是一个变量，则 λx.t 是一个 lambda 项（称为 lambda 抽象）
- 如果 t 和 s 是 lambda 项，那么 (ts) 是一个 lambda 项（称为应用）

### Reduction

#### α 转换

`α: λx.x ≡ λy.y` 等价变量替换

#### β 归约

`β: ((λV.E) E′) ≡ E[V := E′]` 函数抽象应用(apply)于参数的过程

#### η 归约

`λx.M x ≡ M` 用于清除 lambda 表达式中存在的冗余函数抽象

### Church Numerals

按照皮亚诺公理可得自然数集合表示为 `{0, S(0), S(S(0)), ...}`, 于是得到如下定义:

```haskell
S ≡ λn.λf.λx.f (n f x)

0 ≡ λf.λx.x
1 ≡ λf.λx.f x
2 ≡ λf.λx.f (f x)
3 ≡ λf.λx.f (f (f x))
...
```

对后继函数 S 和丘奇数的简单验证如下：

```haskell
S 0
≡ (λn.λf.λx.f (n f x)) λf.λx.x
= (λn.λg.λy.g (n g y)) λf.λx.x    // alpha
= (λf.λx.f (n f x))[n := λf.λx.x] // beta
= λg.λy.g ((λf.λx.x) g y)         // substitute
= λg.λy.g (x[f := g, x := y])     // beta
= λg.λy.g y                       // substitute
= λf.λx.f x                       // alpha
≡ 1
```

## Datatype

### Binding

Tagged union, every constructor name as tag,
fields for different constructors can't exist at the same time.

### Tagged Constructor

- `NONE`
- `SOME i`
- `[]`
- `x :: xs` (infix constructor)
- `()`

### Type Constructor

Type constructor, datatype bindings with variables:

```haskell
datatype 'a myList = EMPTY | CONS of 'a * 'a myList
myList isn't a type, int list is a type
```

- 'a , 'a equivalent/different
- 'a, 'b different
- ''a, ''a equivalent

## Pattern Matching

- `null`/`isSome`: check tag part (variant).
- `hd`/`tl`/`valOf`: check data part (extract data).

```haskell
case e of
      p1 => e1
    | pn => en

val p = e (* declare multiple variables once time in p(pattern) *)

(* declare multiple callee arguments(hidden to caller) once time in p(pattern) *)
fun foo p = e
```

In SML, all functions only take 1 argument, a tuple/record:

fun f (x, y, z) = x + y + z seems that takes 3 arguments,
but truly owing to pattern matching only takes 1 tuple argument
Likewise, fun f () = 0 takes 1 empty tuple argument.

Further more, tuples is syntactic sugar for records.

> As a whole: all functions only take 1 record argument owing to pattern matching.

## Partial Application

```ts
function partialFromBind(fn, ...args) {
  return fn.bind(null, ...args)
}

function partial(fn, ...args) {
  return (...rest) => {
    return fn(...args, ...rest)
  }
}
```

## Currying

Chain of multiple single argument functions:

```ts
function curry(fn, ...stored_args) {
  return function (...new_args) {
    const args = stored_args.concat(new_args)
    return fn(...args)
  }
}

const add = x => y => x + y

const addOne = curry(add, 1)
// addOne(3) === 4;
const addFive = curry(addOne, 1, 3)
// addFive(4) === 9;
```

## Compose

```ts
function compose(...fns) {
  return x =>
    fns.reduceRight((promise, fn) => promise.then(fn), Promise.resolve(x))
}

const addTwo = x => x + 2
const addThree = x => x + 3
const addFive = x => x + 5
const addTen = compose(addTwo, addThree, addFive)

addTen(8).then(console.log) // 18
```

## Flow

```ts
function flow(...fns) {
  return x =>
    fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}

const addTwo = x => x + 2
const addThree = x => x + 3
const addFive = x => x + 5
const addTen = flow(addTwo, addThree, addFive)

addTen(8).then(console.log) // 18
```

## Pipe

```ts
function pipe(x, ...fns) {
  return fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}

const addTwo = x => x + 2
const addThree = x => x + 3
const addFive = x => x + 5
const addTen = pipe(8, addTwo, addThree, addFive)

addTen.then(console.log) // 18
```

## Immutable

Immutable data structure:

- Reused reference: one address represent one data.
- Quick comparison: different address represent different data.
- Fast recovery and snapshot: reuse previous data.

### Array

```ts
const RE_INDEX_PROP_KEY = /^\d+$/
const ALLOWED_PROPERTIES = new Set(['length', 'constructor', 'slice', 'concat'])

function createImmutableArray(arrayLike, mapFn) {
  const arr = Array.from(arrayLike, mapFn)

  const handler = {
    get(target, propKey, receiver) {
      if (RE_INDEX_PROP_KEY.test(propKey) || ALLOWED_PROPERTIES.has(propKey))
        return Reflect.get(target, propKey, receiver)

      throw new TypeError(`Property "${propKey}" can’t be accessed`)
    },
    set(target, propKey, value, receiver) {
      throw new TypeError('Setting is not allowed')
    },
    deleteProperty(target, propKey) {
      throw new TypeError('Deleting is not allowed')
    },
  }

  return new Proxy(arr, handler)
}

const array = createImmutableArray(['a', 'b', 'c'])

// Non-destructive operations are allowed:
assert.deepEqual(array.slice(1), ['b', 'c'])
assert.equal(array[1], 'b')

// Destructive operations are not allowed:
assert.throws(() => (array[1] = 'x'), /^TypeError: Setting is not allowed$/)
assert.throws(
  () => array.shift(),
  /^TypeError: Property "shift" can’t be accessed$/
)
```

### Map

```ts
class ImmutableMap {
  #map

  constructor(iterable) {
    this.#map = new Map(iterable)
  }

  static _setUpPrototype() {
    // Only forward non-destructive methods to the map:
    for (const methodName of ['get', 'has', 'keys', 'size']) {
      ImmutableMap.prototype[methodName] = function (...args) {
        return this.#map[methodName](...args)
      }
    }
  }
}

ImmutableMap._setUpPrototype()

const map = new ImmutableMap([
  [false, 'no'],
  [true, 'yes'],
])

// Non-destructive operations work as usual:
assert.equal(map.get(true), 'yes')
assert.equal(map.has(false), true)
assert.deepEqual([...map.keys()], [false, true])

// Destructive operations are not available:
assert.throws(
  () => map.set(false, 'never!'),
  /^TypeError: map.set is not a function$/
)
assert.throws(() => map.clear(), /^TypeError: map.clear is not a function$/)
```

### Class

Copying class instances without side effects:

```ts
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  clone() {
    return new Point(this.x, this.y)
  }

  static from(other) {
    return new Point(other.x, other.y)
  }
}

class Color {
  constructor(name) {
    this.name = name
  }

  clone() {
    return new Color(this.name)
  }

  static from(other) {
    return new Color(other.name)
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y)
    this.color = color
  }

  clone() {
    return new ColorPoint(this.x, this.y, this.color.clone())
  }

  static from(other) {
    return new ColorPoint(other.x, other.y, Color.from(other.color))
  }
}
```

## Tail Call Optimization

Recursive definition for tail position:

- if E isn't in tail position, then sub expressions of E aren't in tail position
- if E is in tail position, then some sub expressions of E are in tail position

```haskell
if eb then e1 else e2
```

is in tail position, then e1 and e2 are in tail position, not eb:

```haskell
f (x, e)
```

is in tail position, then f is in tail position(tail call), not x and e:

```haskell
fun factorial n =
    let
        fun aux(n, acc) =
            if
                n = 0
            then
                acc
            else
                aux (n-1, n*acc)
    in
        aux (n,1)
    end
```

## Lodash

- chunk.
- shuffle.
- take.
- difference.
- intersection.
- isEmpty.
- orderBy.
- merge.
- cloneDeep.
- debounce.
- throttle.
- startCase.
- kebabCase.
- snakeCase.
- camelCase.

## RxJS

- Async iteration: pull streams and single consumers.
- Reactive programming: push streams and potentially multiple consumers.

![Data Stream](./figures/data-stream.png 'Data Stream')

### Stream

```ts
class PushArray extends Array {
  static EVENT_NAME = 'new_value'
  #eventEmitter = new EventEmitter()

  push(value) {
    this.#eventEmitter.emit(PushArray.EVENT_NAME, value)
    return super.push(value)
  }

  subscribe({ next }) {
    this.#eventEmitter.on(PushArray.EVENT_NAME, (value) => {
      next(value)
    })
  }

  unsubscribe() {
    this.#eventEmitter.removeAllListeners(PushArray.EVENT_NAME)
  }
}

// Source
const pushArray = new PushArray(1, 2, 3)

// Consumer
pushArray.subscribe({
  next(value) {
    console.log('New value:', value)
  },
})

// Producer
pushArray.push(4)
pushArray.push(5)
pushArray.unsubscribe()
pushArray.push(6)
```

### Observable

```ts
interface Observer<T> {
  next: (value: T) => void
  error?: (error: Error) => void
  complete?: () => void
}

interface Subscription {
  unsubscribe: () => void
}

class Observable<T> {
  constructor(subscriber: (observer: Observer<T>) => Subscription): Observable<T>
  observable: () => this
  readonly species: this

  of: (...items: Array<mixed>) => Observable<T>
  from: (x: Observable<T> | Iterable<T>) => Observable<T>

  map: <Z>(fn: (value: T) => Z) => Observable<Z>
  reduce: <Z>(
    acc: (accumulator: Z, value: T, index?: number, array?: Array<T>) => Z,
    startsWith?: T
  ) => Observable<T>

  filter: (predicate: (value: T) => boolean) => Observable<T>
  skip: (count: number) => Observable<T>

  subscribe: (observer: Function | Observer<T>) => Subscription
}
```

```ts
const map = curry(
  (fn, stream) =>
    new Observable((observer) => {
      const subs = stream.subscribe({
        next(value) {
          try {
            observer.next(fn(value))
          } catch (err) {
            observer.error(err)
          }
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          observer.complete()
        },
      })

      return () => subs.unsubscribe()
    })
)

const reduce = curry((accumulator, initialValue, stream) => {
  let result = initialValue ?? {}

  return new Observable((observer) => {
    const subs = stream.subscribe({
      next(value) {
        result = accumulator(result, value)
      },
      error(e) {
        observer.error(e)
      },
      complete() {
        observer.next(result)
        observer.complete()
      },
    })

    return () => subs.unsubscribe()
  })
})

const filter = curry(
  (predicate, stream) =>
    new Observable((observer) => {
      const subs = stream.subscribe({
        next(value) {
          if (predicate(value))
            observer.next(value)
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          observer.complete()
        },
      })

      return () => subs.unsubscribe()
    })
)

const skip = curry((count, stream) => {
  let skipped = 0

  return new Observable((observer) => {
    const subs = stream.subscribe({
      next(value) {
        if (skipped++ >= count)
          observer.next(value)
      },
      error(e) {
        observer.error(e)
      },
      complete() {
        observer.complete()
      },
    })

    return () => subs.unsubscribe()
  })
})

class Observable {
  map(fn) {
    return map(fn, this)
  }

  reduce(accumulator, initialValue = {}) {
    return reduce(accumulator, initialValue, this)
  }

  filter(predicate) {
    return filter(predicate, this)
  }

  skip(count) {
    return skip(count, this)
  }
}
```

```ts
Observable.of(1, 2, 3, 4)
  .skip(1)
  .filter(isEven)
  .map(square)
  .reduce(add, 0)
  .subscribe({
    next: console.log,
  })
```
