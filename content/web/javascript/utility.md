---
sidebar_position: 27
tags: [Web, JavaScript, ECMAScript]
---

# Utility

## Strict Mode

[Strict Mode](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode):

- `this` is `null` in non-method functions.
- Variables must be declared (`Reference Error`).
- Functions must be declared at the top level of a scope (`Syntax Error`).
- Forbidden unqualified identifiers deletion (`Type Error`).
- Forbidden setting and deleting immutable properties (`Type Error`).
- Forbidden access `arguments.callee`/`arguments.caller` (`Type Error`).
- Forbidden variables escaped from `eval()` (`Reference Error`).
- Forbidden set `eval`/`arguments` to variable identifiers (`Syntax Error`).
- Forbidden `with` statement (`Syntax Error`).
- Forbidden octal numbers (`Syntax Error`).
- ES6 classes are automatically in strict mode.
- ES6 modules are automatically in strict mode.

## Timer

- setTimeout.
- setImmediate.
- setInterval: 完全无法保证两个 timer 执行时间间隔 (可能连续执行, 也可能间隔过长).
- requestAnimationFrame.
- requestIdleCallback.

Combine `setInterval`/`setTimeout` function with closure function,
implement **time slicing scheduler**.

```ts
function processArray(items, process, done) {
  const todo = items.slice()

  setTimeout(function task() {
    process(todo.shift())

    if (todo.length > 0)
      setTimeout(task, 25)
    else
      done(items)
  }, 25)
}
```

:::tip[`this` Binding in Timer Function]

所有超时执行的代码 (函数) 都会在全局作用域中的一个匿名函数中运行,
因此函数中的 `this` 值在非严格模式下始终指向 `window`, 在严格模式下是 `undefined`.
若给 `setTimeout()` 提供了一个箭头函数, 则 `this` 会保留为定义它时所在的词汇作用域.

:::

`requestAnimationFrame` game loop:

```ts
function runAnimation(frameFunc) {
  let lastTime = null

  function frame(time) {
    if (lastTime !== null) {
      const timeStep = Math.min(time - lastTime, 100) / 1000
      if (frameFunc(timeStep) === false)
        return
    }

    lastTime = time
    requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}
```

## Math

- `Math.max`.
- `Math.min()`.
- `Math.ceil()`: 向上舍入为最接近的整数.
- `Math.floor()`: 向下舍入为最接近的整数.
- `Math.round()`: 四舍五入.
- `Math.fround()`: 返回数值最接近的单精度 (32 位) 浮点值表示.
- `Math.abs(x)`: 返回 x 的绝对值.
- `Math.exp(x)`: 返回 `Math.E` 的 x 次幂.
- `Math.expm1(x)`: 等于 `Math.exp(x) - 1`.
- `Math.log(x)`: 返回 x 的自然对数.
- `Math.log1p(x)`: 等于 `1 + Math.log(x)`.
- `Math.pow(x, power)`: 返回 x 的 power 次幂.
- `Math.hypot(...nums)`: 返回 nums 中每个数平方和的平方根.
- `Math.clz32(x)`: 返回 32 位整数 x 的前置零的数量.
- `Math.sign(x)`: 返回表示 x 符号的 `1`/`0`/`-0`/`-1`.
- `Math.trunc(x)`: 返回 x 的整数部分, 删除所有小数.
- `Math.sqrt(x)`: 返回 x 的平方根.
- `Math.cbrt(x)`: 返回 x 的立方根.
- `Math.acos(x)`: 返回 x 的反余弦.
- `Math.acosh(x)`: 返回 x 的反双曲余弦.
- `Math.asin(x)`: 返回 x 的反正弦.
- `Math.asinh(x)`: 返回 x 的反双曲正弦.
- `Math.atan(x)`: 返回 x 的反正切.
- `Math.atanh(x)`: 返回 x 的反双曲正切.
- `Math.atan2(y, x)`: 返回 `y/x` 的反正切.
- `Math.cos(x)`: 返回 x 的余弦.
- `Math.sin(x)`: 返回 x 的正弦.
- `Math.tan(x)`: 返回 x 的正切.

```ts
const epsilon = Math.E
const log10 = Math.LN10
const log2 = Math.LN2
const log2e = Math.LOG2E
const log10e = Math.LOG10E
const pi = Math.PI
const squareRoot = Math.SQRT1_2
const squareRoot2 = Math.SQRT2

Math.abs(num)
Math.exp(num)
Math.log(num)
Math.sqrt(num)
Math.acos(x)
Math.asin(x)
Math.atan(x)
Math.atan2(y, x)
Math.cos(x)
Math.sin(x)
Math.tan(x)
```

```ts
console.log(Math.max(3, 54, 32, 16)) // 54
console.log(Math.min(3, 54, 32, 16)) // 3
console.log(Math.ceil(25.9)) // 26
console.log(Math.ceil(25.5)) // 26
console.log(Math.ceil(25.1)) // 26
console.log(Math.round(25.9)) // 26
console.log(Math.round(25.5)) // 26
console.log(Math.round(25.1)) // 25
console.log(Math.fround(0.4)) // 0.4000000059604645
console.log(Math.fround(0.5)) // 0.5
console.log(Math.fround(25.9)) // 25.899999618530273
console.log(Math.floor(25.9)) // 25
console.log(Math.floor(25.5)) // 25
console.log(Math.floor(25.1)) // 25
```

```ts
function random(a = 1, b = 0) {
  const lower = Math.min(a, b)
  const upper = Math.max(a, b)
  return lower + Math.random() * (upper - lower)
}

function randomInt(a = 1, b = 0) {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}
```

|              | -2.9 | -2.5 | -2.1 | 2.1 | 2.5 | 2.9 |
| ------------ | ---- | ---- | ---- | --- | --- | --- |
| `Math.floor` | -3   | -3   | -3   | 2   | 2   | 2   |
| `Math.ceil`  | -2   | -2   | -2   | 3   | 3   | 3   |
| `Math.round` | -3   | -2   | -2   | 2   | 3   | 3   |
| `Math.trunc` | -2   | -2   | -2   | 2   | 2   | 2   |

## Atomics

[Atomics API](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Atomics):

```ts
const sharedArrayBuffer = new SharedArrayBuffer(4)
const dataView = new Uint32Array(sharedArrayBuffer)

const index = 0
const increment = 5

Atomics.add(dataView, index, increment)
Atomics.sub(dataView, index, increment)
Atomics.or(dataView, index, 0b1111)
Atomics.and(dataView, index, 0b1100)
Atomics.xor(dataView, index, 0b1111)
Atomics.load(dataView, index)
Atomics.store(dataView, index, 3)
Atomics.exchange(dataView, index, 4)
Atomics.compareExchange(dataView, index, expect, 6)
```

## Signals

[Signals](https://github.com/tc39/proposal-signals)
create a universal standard for state management across frameworks.
It use the so-called `pull-push` model:

- `push` phase:
  When Signal becomes `dirty` (its value has changed),
  it recursively passes `dirty` state to all dependent Signals.
- `pull` phase:
  All potential recalculations are deferred until value of Signal is explicitly requested.

Lazy evaluation brings:

- Automated tracking:
  Eliminates complexity of manual updates and enhances reactive programming capabilities.
- Performance optimization:
  Calculated only when necessary avoiding unnecessary computations and updates.
- Consistency:
  State is updated synchronously in corresponding UI render or any dependency evaluation.
- Easy integration:
  Signals can be easily integrated into various JavaScript libraries and frameworks.

```ts
const counter = new Signal.State(0)
const isEven = new Signal.Computed(() => (counter.get() & 1) === 0)
const parity = new Signal.Computed(() => isEven.get() ? 'even' : 'odd')

effect(() => element.textContent = parity.get())
```

```ts
/**
 * Class auto-accessor decorator
 * @see https://github.com/tc39/proposal-decorators?tab=readme-ov-file#class-auto-accessors
 */
function signal(target) {
  const { get } = target

  return {
    init(value) {
      return new Signal.State(value)
    },
    get() {
      return get.call(this).get()
    },
    set(value) {
      get.call(this).set(value)
    },
  }
}

class Counter {
  @signal
  count = 0 // This will be automatically turned into a Signal state.

  increment() {
    this.count++ // Behind the scenes, this updates the Signal's value.
  }

  decrement() {
    this.count-- // Similarly, this updates the Signal's value.
  }

  @signal
  get isEven() {
    return this.count % 2 === 0
  }

  @signal
  get parity() {
    return this.isEven ? 'even' : 'odd'
  }
}

// Usage
const myCounter = new Counter()
console.log(myCounter.count) // Outputs: 0

myCounter.increment()
console.log(myCounter.count) // Outputs: 1
console.log(myCounter.parity) // Outputs: "odd"

myCounter.increment()
console.log(myCounter.count) // Outputs: 2
console.log(myCounter.isEven) // Outputs: true
```

## URI and URL

- `encodeURI()`: 不会编码属于 URL 组件的特殊字符, 比如冒号/斜杠/问号.
- `encodeURIComponent()`: 编码它发现的所有非标准字符.

```ts
const uri = 'http://www.foo.com/illegal value.js#start'
// "http://www.foo.com/illegal%20value.js#start"
console.log(encodeURI(uri))
// "http%3A%2F%2Fwww.foo.com%2Fillegal%20value.js%23start"
console.log(encodeURIComponent(uri))
```

```ts
const uri = 'http%3A%2F%2Fwww.foo.com%2Fillegal%20value.js%23start'
// http%3A%2F%2Fwww.foo.com%2Fillegal value.js%23start
console.log(decodeURI(uri))
// http:// www.foo.com/illegal value.js#start
console.log(decodeURIComponent(uri))
```

[URL](https://developer.mozilla.org/docs/Web/API/URL):

- `hash`.
- `host`.
- `hostname`.
- `href`.
- `pathname`.
- `port`.
- `protocol`.
- `search`: [USVString](https://developer.mozilla.org/docs/Web/API/USVString).
- `searchParams`: URL search map.
- `username`.
- `password`.
- `origin`: read only.

```ts
const href = new URL('other.mjs', 'https://example.com/code/main.mjs').href
// 'https://example.com/code/other.mjs'
const href = new URL('../other.mjs', 'https://example.com/code/main.mjs').href
// 'https://example.com/other.mjs'

const blob = new Blob(['export const itsAModule = true'], {
  type: 'text/javascript',
})

const blobUrl = URL.createObjectURL(blob)
```

[Download files](https://www.amitmerchant.com/create-and-download-text-files-using-javascript):

```ts
function saveTextAsFile(textToWrite, fileNameToSaveAs, fileType) {
  const textFileAsBlob = new Blob([textToWrite], { type: fileType })
  const downloadLink = document.createElement('a')
  downloadLink.innerHTML = 'Download File'
  downloadLink.download = fileNameToSaveAs

  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob)
    downloadLink.onclick = destroyClickedElement // document.body.removeChild(downloadLink);
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
  }

  downloadLink.click()
}
```

[URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams):

```ts
// window.location.search
const qs = '?q=javascript&num=10'
const searchParams = new URLSearchParams(qs)

for (const param of searchParams)
  console.log(param)

// ["q", "javascript"]
// ["num", "10"]

alert(searchParams.toString()) // " q=javascript&num=10"
searchParams.has('num') // true
searchParams.get('num') // 10
searchParams.set('page', '3')
alert(searchParams.toString()) // " q=javascript&num=10&page=3"
searchParams.delete('q')
alert(searchParams.toString()) // " num=10&page=3"
```

## Encoding and Decoding

[TextEncoder API](https://developer.mozilla.org/docs/Web/API/TextEncoder):

```ts
const textEncoder = new TextEncoder()
const decodedText = 'foo'
const encodedText = textEncoder.encode(decodedText)
// f 的 UTF-8 编码是 0x66 (即十进制 102)
// o 的 UTF-8 编码是 0x6F (即二进制 111)
console.log(encodedText) // Uint8Array(3) [102, 111, 111]
```

```ts
const textEncoder = new TextEncoder()
const fooArr = new Uint8Array(3)
const fooResult = textEncoder.encodeInto('foo', fooArr)
console.log(fooArr) // Uint8Array(3) [102, 111, 111]
console.log(fooResult) // { read: 3, written: 3 }
```

```ts
async function* chars() {
  const decodedText = 'foo'
  for (const char of decodedText)
    yield await new Promise(resolve => setTimeout(resolve, 1000, char))
}

const decodedTextStream = new ReadableStream({
  async start(controller) {
    for await (const chunk of chars())
      controller.enqueue(chunk)

    controller.close()
  },
})

const encodedTextStream = decodedTextStream.pipeThrough(new TextEncoderStream())

const readableStreamDefaultReader = encodedTextStream.getReader()

while (true) {
  const { done, value } = await readableStreamDefaultReader.read()

  if (done)
    break
  else
    console.log(value)
}
// Uint8Array[102]
// Uint8Array[111]
// Uint8Array[111]
```

[TextDecoder API](https://developer.mozilla.org/docs/Web/API/TextDecoder):

```ts
const textDecoder = new TextDecoder()
// f 的 UTF-8 编码是 0x66 (即十进制 102)
// o 的 UTF-8 编码是 0x6F (即二进制 111)
const encodedText = Uint8Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)
console.log(decodedText) // foo
```

```ts
const response = await fetch(url)
const stream = response.body.pipeThrough(new TextDecoderStream())
const decodedStream = stream.getReader()

for await (const decodedChunk of decodedStream)
  console.log(decodedChunk)
```

## Web Stream

- Web streams complete [guide](https://2ality.com/2022/06/web-streams-nodejs.html).

## Internationalization

### Number

```ts
const nfFrench = new Intl.NumberFormat('fr')
nf.format(12345678901234567890n)
// => 12 345 678 901 234 567 890
```

### String

```ts
const lfEnglish = new Intl.ListFormat('en')
// const lfEnglish = new Intl.ListFormat('en', { type: 'disjunction' }); => 'or'

lfEnglish.format(['Ada', 'Grace', 'Ida'])
// => 'Ada, Grace and Ida'

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
})
console.log(formatter.format(vehicles))
// expected output: "Motorcycle, Bus, and Car"

const formatter2 = new Intl.ListFormat('de', {
  style: 'short',
  type: 'disjunction',
})
console.log(formatter2.format(vehicles))
// expected output: "Motorcycle, Bus oder Car"

const formatter3 = new Intl.ListFormat('en', { style: 'narrow', type: 'unit' })
console.log(formatter3.format(vehicles))
// expected output: "Motorcycle Bus Car"
```

### Time

```ts
const rtfEnglish = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

rtf.format(-1, 'day') // 'yesterday'
rtf.format(0, 'day') // 'today'
rtf.format(1, 'day') // 'tomorrow'
rtf.format(-1, 'week') // 'last week'
rtf.format(0, 'week') // 'this week'
rtf.format(1, 'week') // 'next week'
```

```ts
const dtfEnglish = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

dtfEnglish.format(new Date()) // => 'May 7, 2019'
dtfEnglish.formatRange(start, end) // => 'May 7 - 9, 2019'
```
