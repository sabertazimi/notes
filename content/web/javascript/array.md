---
sidebar_position: 6
tags: [Web, JavaScript, ECMAScript, Array]
---

# Array

- 与 Object 同源.
- 关联数组: `arrayName["string"] = value;` 实际为 Array 对象添加属性`{string:value}`.
- 缓存数组长度:`int l = list.length`(访问`length`造成运算).
- `[]`数组, `{}`对象.
- 数组在数值运算环境中转化为 0 (空数组)/ num (单一元素数组)/NaN (多元素数组/NaN 数组).

```ts
const array = [...Array.from({ length: 5 }).keys()] // => [0, 1, 2, 3, 4]
```

## Length

- 数组下标满足 [0, 2^32-1) 即可
- 运用大于 length 的下标, length 自动增大, 不会发生数组边界错误
- length 等于 数组最后一个整数属性名+1, length 不一定等于 数组中有效元素个数

## Literals

不使用构造函数,使用数组字面量创建数组

```ts
const arr1 = Array.from({ length: 3 }) // 数组长度
const arr2 = Array.from({ length: 3.14 }) // RangeError
```

```ts
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function (arg) {
    // 其余对象返回值 [object Object/Number/String/Boolean]
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}
```

## Of

```ts
Array.of(1) // [1]
Array.of(1, 2, 3) // [1, 2, 3]
Array.of(undefined) // [undefined]
```

## From

强大的**函数式**方法:

- 伪数组对象 (Array-like object).
- 可枚举对象 (Iterable object).
- 浅克隆数组 (Shallow Clone).
- `map` 函数.

```ts
interface ArrayLike<T> {
  length: number
  [n: number]: T
}

interface Array {
  from: (<T>(iterable: Iterable<T> | ArrayLike<T>) => T[]) & (<T, U>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapFunc: (v: T, i: number) => U,
    thisArg?: any
  ) => U[])
}
```

```ts
// Set
// Map

// NodeList 对象
const ps = document.querySelectorAll('p')
Array.from(ps).forEach((p) => {
  console.log(p)
})

// arguments 对象
function foo() {
  // eslint-disable-next-line prefer-rest-params -- arguments is not an array
  const args = Array.from(arguments)
  // ...
}

Array.from('hello')
// => ['h', 'e', 'l', 'l', 'o']

const namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

// 克隆数组
Array.from([1, 2, 3])
// => [1, 2, 3]

Array.from(arrayLike, x => x * x)
// =>
Array.from(arrayLike).map(x => x * x)

Array.from([1, 2, 3], x => x * x)
// [1, 4, 9]

// random array generation
Array.from(Array.from({ length: 5 }).keys())
// [0, 1, 2, 3, 4]

// Typed array initialization
Array.from<T>({ length: maxSize }).fill(initValue)
```

## Fill

```ts
const numbers = [1, 2, 3, 4]
numbers.fill(1, 2)
console.log(numbers.toString()) // 1, 2, 1, 1
numbers.fill(0, 1, 3)
console.log(numbers.toString()) // 1, 0, 0, 1
numbers.fill(1)
console.log(numbers.toString()) // 1, 1, 1, 1
```

## CopyWithin

`copyWithin(dest, start, end)`, 替换数组元素, **修改原数组**:

```ts
;[1, 2, 3, 4, 5].copyWithin(0, 3)
// => [4, 5, 3, 4, 5]
;[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// -2相当于3号位, -1相当于4号位
// => [4, 2, 3, 4, 5]

// 将2号位到数组结束, 复制到0号位
const i32a = new Int32Array([1, 2, 3, 4, 5])
i32a.copyWithin(0, 2)
// => Int32Array [3, 4, 5, 4, 5]
```

## Stack

```ts
arr.unshift(value) // 添加数组首元素
arr.push(value) // 添加数组尾元素
arr.shift() // 删除数组首元素
arr.pop() // 删除数组尾元素
```

## Slice and Merge

- slice 不改变原数组, splice 改变原数组.

```ts
;[].slice(start, end) // [start] - [end - 1]
;[].splice(startIndex, lengthToDelete, insertElements) // 功能强大的多态方法
;[].concat(otherArray)
;[].join(separator)
```

## Query

```ts
;[].at(index) // ES2022
;[].includes(element) // boolean.
;[].find(callback) // element.
;[].findIndex(callback) // element index.
;[].indexOf(element) // -1 or other.
;[].lastIndexOf(element) // -1 or other.
```

```ts
// console.log([NaN].indexOf(NaN));
// -1

console.log([Number.NaN].includes(Number.NaN))
// true
```

## Filter

相当于 Haskell 中的 List Filter:

```ts
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
const filterResult = numbers.filter((item, index, array) => item > 2)
console.log(filterResult) // 3,4,5,4,3
```

## Every

`Array.every(filer)`:

```ts
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
const result = numbers.every((item, index, array) => item > 2)
console.log(result) // false
```

## Some

`Array.some(filer)`:

```ts
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
const result = numbers.some((item, index, array) => item > 2)
console.log(result) // true
```

## With

[Array.prototype.with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with):

```ts
const arr = [1, 2, 3, 4, 5]
console.log(arr.with(2, 6)) // [1, 2, 6, 4, 5]
console.log(arr) // [1, 2, 3, 4, 5]

const arr = [1, 2, 3, 4, 5]
console.log(arr.with(2, 6).map(x => x ** 2)) // [1, 4, 36, 16, 25]

const frameworks = ['Nuxt', 'Remix', 'SvelteKit', 'Ember']
console.log(frameworks.with(-1, 'React'))
// ✅ Returns a copy with the change: ['Nuxt', 'Remix', 'SvelteKit', 'React'].
```

## Map

相当于 Haskell 中的 List Map:

```ts
;[].map(item => item + 1) // map over
```

## Flat

`[2, [2, 2]] => [2, 2, 2]`

## FlatMap

map + flat.

```ts
function flattenDeep(arr) {
  return Array.isArray(arr)
    ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
    : [arr]
}

flattenDeep([1, [[2], [3, [4]], 5]])
// => [1, 2, 3, 4, 5]

// ES2019
;[1, [2, [3, [4]], 5]].flat(Number.POSITIVE_INFINITY)
// => [1, 2, 3, 4, 5]

function flattenDeep(arr) {
  return arr.flatMap((subArray, index) =>
    Array.isArray(subArray) ? flattenDeep(subArray) : subArray
  )
}

flattenDeep([1, [[2], [3, [4]], 5]])
// => [1, 2, 3, 4, 5]
```

## Reduce

`reduce`/`reduceRight`:

- Accumulator: initial value, otherwise `array[0]`.
- Current value: `array[0]`, otherwise `array[1]`.
- Implement array sets manipulation (`reduce`/`filter`/`includes`).
- Implement `XXXBy` functional methods.

```ts
;[].reduce(
  (previous, current, currentIndex, arr) => current + previous,
  initial
) // fold function
```

Implement `groupBy`:

```ts
const groupByLength = ['one', 'two', 'three'].reduce(
  (acc, current, _index, _array) => {
    const key = current.length
    ;(acc[key] || (acc[key] = [])).push(current)
    return acc
  },
  {}
)
// {3: ["one", "two"], 5: ["three"]}

const groupByFunction = [1.3, 2.1, 2.4].reduce(
  (acc, current, _index, _array) => {
    const key = Math.floor(current)
    ;(acc[key] || (acc[key] = [])).push(current)
    return acc
  },
  {}
)
// {1: [1.3], 2: [2.1, 2.4]}
```

## Traversal

```ts
array.forEach((val) => {}) // 遍历数组所有元素.
```

## Sort

`toExchange`:

- `return 1`: a, b 交换位置.
- `return -1`: a, b 不交换位置.

```ts
arr.sort(toExchange)
strings.sort((a, b) => a.localeCompare(b))
strings.sort((a, b) => new Intl.Collator('en').compare(a, b))
```

## Reverse

```ts
;[].reverse()
```

```ts
// 反转字符串
const reverseStr = normalizedStr.split('').reverse().join('')
```

## Spread

- Shallow Clone.
- Iterable Consumer.

```ts
arr2.push(...arr1)
```

```ts
const obj = { x: 1, y: 2, z: 3 }

obj[Symbol.iterator] = function* () {
  yield 1
  yield 2
  yield 3
}

const array = [...obj] // print [1, 2, 3]
```

## Deep Clone

```ts
const nestedArray = [1, [2], 3]
const arrayCopy = JSON.parse(JSON.stringify(nestedArray))

// Make some changes
arrayCopy[0] = '1' // change shallow element
arrayCopy[1][0] = '3' // change nested element
console.log(arrayCopy) // [ '1', [ '3' ], 3 ]

// Good: Nested array NOT affected
console.log(nestedArray) //  1, [ 2 ], 3 ]
```

## Buffer

[`Typed Array`](https://exploringjs.com/es6/ch_typed-arrays.html)
是 `ArrayBuffer` (用于 Web GL 高效率内存操作) 其中一种视图:

- File.
- XMLHttpRequest.
- Fetch.
- Web Worker.
- WebSocket.
- Canvas.
- WebGL.
- Web Audio.

```ts
// 第一个参数是应该返回的数组类型
// 其余参数是应该拼接在一起的定型数组
function typedArrayConcat(TypedArrayConstructor, ...typedArrays) {
  // 计算所有数组中包含的元素总数
  const numElements = typedArrays.reduce((x, y) => (x.length || x) + y.length)
  // 按照提供的类型创建一个数组, 为所有元素留出空间
  const resultArray = new TypedArrayConstructor(numElements)
  // 依次转移数组
  let currentOffset = 0
  typedArrays.forEach((x) => {
    resultArray.set(x, currentOffset)
    currentOffset += x.length
  })
  return resultArray
}

const concatArray = typedArrayConcat(
  Int32Array,
  Int8Array.of(1, 2, 3),
  Int16Array.of(4, 5, 6),
  Float32Array.of(7, 8, 9)
)

console.log(concatArray) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(concatArray instanceof Int32Array) // true
```

```ts
const view = new Int16Array([25, 50])
console.log(view instanceof Int16Array) // true
console.log(view instanceof Array) // false
console.log(Array.isArray(view)) // false
```
