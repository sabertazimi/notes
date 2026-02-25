---
sidebar_position: 2
tags: [Web, Performance, JavaScript]
---

# Effective JavaScript

## Memory Leak

- Useless global vars (bind to window or document).
- Useless DOM reference.
- Incorrect closure.
  - Unnecessary closure creation:
    闭包会保留它们包含函数的作用域, 所以比其他函数更占用内存.
  - Useless callback functions.
  - Forgotten timer from `setTimeout`/`setInterval`:
    clear with `clearTimeout`/`clearInterval`.
- Forgotten tick timer.
- Forgotten event listener:
  clear with `removeEventListener`.
- Forgotten subscriber:
  clear with `unsubscribe(id)`.
- Forgotten console log:
  clear with `babel`/`tsc`.
- Forgotten `Set`/`Map`:
  `WeakSet`/`WeakMap` don't bother GC.
- Circular reference.
- Bad `delete` Operator:
  `delete` 操作符并不会释放内存,
  而且会使得附加到对象上的
  `hidden class` (`V8` 为了优化属性访问时间而创建的隐藏类) 失效,
  让对象变成 `slow object`.

:::danger[Anti Patterns]

- `eval()`.
- `with () {}`.
- `new Function()`.

:::

## Function

### Local Variables

- 局部变量引用全局变量/全局变量作为参数传入函数: 加快符号解析.
- 局部变量缓存 DOM 元素.
- 局部变量缓存布局信息.
- 局部变量引用嵌套成员: 加快原型链查找.
- 局部变量引用方法时, 应注意会动态改变 this 指针.

```ts
const DOM = tazimi.util.Dom

DOM.method.call(/* 关注 this 指针 */)
```

### Scope Chain

由于作用域链的关系, 标识符解析时,
寻找局部变量速度远快于寻找全局变量速度 (作用域链越长, 查找变量所需时间越长).
故应将全局变量作为参数传入函数进行调用, 不但效率高, 而且易于维护与测试.
即**利用局部变量引用全局变量, 加快标识符解析**.

### Memoization

```ts
function memoize(fn) {
  return (
    (cache = Object.create(null)) =>
      (...args) => {
        return cache[args] || (cache[args] = fn(...args))
      }
  )()
}

const memoizedGetDistance = memoize(getDistance)

memoizedGetDistance('Murcia', 'Madrid') // => computed, slow
memoizedGetDistance('Murcia', 'Madrid') // => cached, fast!
```

## Loop

倒序循环可提升性能:

```ts
for (let i = item.length; i--;) {
  process(items[i])
}

let j = items.length
while (j--) {
  process(items[i])
}

let k = items.length
do {
  process(items[k])
} while (k--)
```

Duff's Device:

```ts
let i = items.length % 8

while (i) {
  process(items[i--])
}

i = Math.floor(items.length / 8)

while (i) {
  process(items[i--])
  process(items[i--])
  process(items[i--])
  process(items[i--])
  process(items[i--])
  process(items[i--])
  process(items[i--])
  process(items[i--])
}
```

## Math

### Bit Operators

- `i%2` => `i&0x1`.
- 位掩码

```ts
const OPTION_A = 1
const OPTION_B = 2
const OPTION_C = 4
const OPTION_D = 8
const OPTION_E = 16

const options = OPTION_A | OPTION_C | OPTION_D
```

## Repeat

Reduce repeat:

- 特性/浏览器检测代码只运行一次.
- 惰性定义模式/自定义模式.

## Timer

JavaScript 代码与 UI 共享线程.

`setTimeout`/`setInterval`:

- 第二个参数: 不是执行时间, 是加入执行队列时间.
- 若其他位于执行队列中的函数执行时间超过延时, 则用户感觉不到延时的存在.
- 模拟有间隙的循环, 使得 UI 更新得以进入浏览器线程的执行队列中.
- 通过 MicroTask/MicroTask 实现时间分片调度器,
  使得长任务不阻塞页面操作 (60 FPS):
  e.g. React Scheduler and Reconciler, Vue `nextTick` API.

```ts
const button = document.getElementById('myButton')

button.onclick = function () {
  oneMethod()

  setTimeout(() => {
    document.getElementById('notice').style.color = 'red'
  }, 250)
}
```

```ts
/*
 * usage: start -> stop -> getTime
 */
const Timer = {
  _data: {},
  start(key) {
    Timer._data[key] = new Date()
  },
  stop(key) {
    const time = Timer._data[key]

    if (time) {
      Timer._data[key] = new Date() - time
    }
  },
  getTime(key) {
    return Timer._data[key]
  },
}
```

```ts
function pollTimerTask(time) {
  if (timerQueue.length === 0) {
    return
  }

  while (timerQueue[0] && time >= timerQueue[0].time) {
    const timer = timerQueue.shift()

    while (timer.tickerQueue.length) {
      const { id, callback, delay, loop, defer } = timer.tickerQueue.shift()

      callback(time)

      if (loop && idPool[id].exist) {
        let nextTime = timer.time + delay

        // 当回调函数执行时间超过多个执行周期时
        if (time - nextTime > delay) {
          nextTime = nextTime + Math.floor((time - nextTime) / delay) * delay

          // 延迟执行时, 将 nextTime 推迟至下一个执行周期
          defer && (nextTime += delay)
        }

        registerTimerWithId({
          id,
          callback,
          time: nextTime,
          delay,
          loop,
          defer,
        })
      } else {
        // 当回调函数不需要周期执行或在回调函数中执行 unregister 时
        delete idPool[id]
      }
    }
  }
}
```

### Slice

```ts
function saveDocument(id) {
  // 利用闭包封装待执行任务
  const tasks = [openDocument, writeText, closeDocument, updateUI]

  setTimeout(function sliceTask() {
    // 执行下一个任务
    const task = tasks.shift()
    task(id)

    // 检查是否还有其他任务
    if (tasks.length > 0) {
      // 递归调用(每次参数不同)
      setTimeout(sliceTask, 25)
    }
  }, 25)
}
```

```ts
function processArray(items, process, callback) {
  // 克隆原数组
  const todo = items.concat()

  setTimeout(function sliceTask() {
    process(todo.shift())

    if (todo.length > 0) {
      setTimeout(sliceTask, 25)
    } else {
      callback(items)
    }
  }, 25)
}
```

### Batch and Scheduler

[Prioritized task scheduler API](https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API):

```ts
async function saveSettings() {
  const tasks = [validateForm, showSpinner, saveToDatabase, updateUI, sendAnalytics]
  let deadline = performance.now() + 50

  while (tasks.length > 0) {
    if (navigator.scheduling?.isInputPending() || performance.now() >= deadline) {
      // 1. Pending user input.
      // 2. deadline has been reached.
      // Yield here:
      await yieldToMain()

      // Extend the deadline.
      deadline += 50
      continue
    }

    // Run task.
    const task = tasks.shift()
    task()
  }
}

function yieldToMain() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}
```

### Debounce and Throttle

防抖动和节流本质是不一样的:

- `debounce`:
  防抖动是将多次执行变为最后一次执行 (可用于检测某个连续的 DOM 操作结束, 如 `resize`/`scroll` 停止).
- `throttle`:
  节流是将多次执行变成每隔一段时间执行 (保证一定时间内只执行一次).

Simple debounce:

```ts
function debounce(action, delay) {
  let timer = null

  return function () {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      action()
    }, delay)
  }
}
```

Simple throttle:

```ts
function throttle(action) {
  let isRunning = false

  return function () {
    if (isRunning) {
      return
    }

    isRunning = true

    window.requestAnimationFrame(() => {
      action()
      isRunning = false
    })
  }
}

function throttle(func, timeFrame) {
  let lastTime = 0

  return function (...args) {
    const now = new Date()

    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}
```

Lodash debounce:

```ts
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}

/**
 * 防抖函数, 返回函数连续调用时, 空闲时间必须大于或等于 wait, func 才会执行
 *
 * @param  {Function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为 true 时, 是否立即调用函数
 * @return {Function}             返回客户调用函数
 */
function debounce(func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () =>
    setTimeout(() => {
      // 延迟函数执行完毕, 清空缓存的定时器序号
      timer = null

      // 延迟执行的情况下, 函数会在延迟函数中执行
      // 使用到之前缓存的参数和上下文
      if (!immediate) {
        func.apply(context, args)
        context = args = null
      }
    }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function (...params) {
    // 如果没有创建延迟执行函数 (later), 就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行, 调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    } else {
      // 如果已有延迟执行函数 (later), 调用的时候清除原来的并重新设定一个
      // 这样做延迟函数会重新计时
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

Lodash throttle:

```ts
/**
 * Lodash 节流函数, 返回函数连续调用时, func 执行频率限定为 次 / wait
 *
 * @param  {Function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用, 传入{leading: false}.
 *                                如果想忽略结尾函数的调用, 传入{trailing: false}
 *                                两者不能共存, 否则函数不能执行
 * @return {Function}             返回客户调用函数
 */
_.throttle = function (func, wait, options) {
  let context, args, result
  let timeout = null
  // 之前的时间戳
  let previous = 0

  // 如果 options 没传则设为空对象
  if (!options) {
    options = {}
  }

  // 定时器回调函数
  const later = function () {
    // 如果设置了 leading, 就将 previous 设为 0
    // 用于下面函数的第一个 if 判断
    previous = options.leading === false ? 0 : _.now()
    // 置空一是为了防止内存泄漏, 二是为了下面的定时器判断
    timeout = null
    result = func.apply(context, args)

    if (!timeout) {
      context = args = null
    }
  }

  return function (...original_args) {
    // 获得当前时间戳
    const now = _.now()

    // 首次进入前者肯定为 true
    // 如果需要第一次不执行函数
    // 就将上次时间戳设为当前的
    // 这样在接下来计算 remaining 的值时会大于0
    if (!previous && options.leading === false) {
      previous = now
    }

    // 计算剩余时间
    const remaining = wait - (now - previous)
    context = this
    args = original_args

    // 如果当前调用已经大于上次调用时间 + wait
    // 或者用户手动调了时间
    // 如果设置了 trailing, 只会进入这个条件
    // 如果没有设置 leading, 那么第一次会进入这个条件
    // 还有一点, 你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
    // 其实还是会进入的, 因为定时器的延时
    // 并不是准确的时间, 很可能你设置了2秒
    // 但是他需要2.2秒才触发, 这时候就会进入这个条件
    if (remaining <= 0 || remaining > wait) {
      // 如果存在定时器就清理掉否则会调用二次回调
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        context = args = null
      }
    } else if (!timeout && options.trailing !== false) {
      // 判断是否设置了定时器和 trailing
      // 没有的话就开启一个定时器
      // 并且不能不能同时设置 leading 和 trailing
      timeout = setTimeout(later, remaining)
    }

    return result
  }
}
```

### Animation Frame

```ts
function useAnimation() {
  const frameIdRef = useRef(0)
  const tickingRef = useRef(false)

  const handleResize = (event) => {
    if (tickingRef.current) {
      return
    }
    tickingRef.current = true
    frameIdRef.current = requestAnimationFrame(() => handleUpdate(event))
  }

  const handleUpdate = (event) => {
    console.log('resize update')
    tickingRef.current = false
  }

  useMount(() => {
    window.addEventListener('resize', handleResize)
    handleUpdate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameIdRef.current)
    }
  })
}
```

## Event Delegate

- 事件委托利用的是事件冒泡机制, 只制定一事件处理程序, 就可以管理某一类型的所有事件.
- Increases performance and reduces memory consumption:
  - 使用事件委托, 只需在 DOM 树中尽量最高的层次上添加一个事件处理程序.
  - No need to register new event listeners for newer children.
- DOM Event:
  Event Capturing (default false) ->
  Event Target ->
  Event Bubbling (default true).

```ts
window.onload = function () {
  const oUl = document.getElementById('ul')
  const aLi = oUl.getElementsByTagName('li')

  oUl.onmouseover = function (e) {
    const e = e || window.event
    const target = e.target || e.srcElement

    // alert(target.innerHTML);

    if (target.nodeName.toLowerCase() === 'li') {
      target.style.background = 'red'
    }

    // 阻止默认行为并取消冒泡
    if (typeof e.preventDefault === 'function') {
      e.preventDefault()
      e.stopPropagation()
    } else {
      e.returnValue = false
      e.cancelBubble = true
    }
  }

  oUl.onmouseout = function (e) {
    const e = e || window.event
    const target = e.target || e.srcElement

    // alert(target.innerHTML);

    if (target.nodeName.toLowerCase() === 'li') {
      target.style.background = ''
    }

    // 阻止默认行为并取消冒泡
    if (typeof e.preventDefault === 'function') {
      e.preventDefault()
      e.stopPropagation()
    } else {
      e.returnValue = false
      e.cancelBubble = true
    }
  }
}
```
