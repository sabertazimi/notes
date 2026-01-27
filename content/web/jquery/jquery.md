---
tags: [Web, jQuery]
---

# jQuery

## Callbacks Queue

callback queue use `Observer` pattern to
add callbacks to callback queue,
fire callbacks when events happen.

```ts
function Callbacks(options) {
  let list = []
  const self = {
    add(fn) {
      if (options === 'unique') {
        if (!list.includes(fn))
          list.push(fn)
      } else {
        list.push(fn)
      }
    },
    fire(args) {
      list.forEach((fn) => {
        fn(args)
      })

      if (options === 'once')
        list = undefined
    },
  }

  return self
}
```

## Deferred Queue

Same to `Promise`

```ts
class Promise {
  // `executor` takes 2 parameters, `resolve()` and `reject()`. The executor
  // function is responsible for calling `resolve()` or `reject()` to say that
  // the async operation succeeded (resolved) or failed (rejected).
  constructor(executor) {
    if (typeof executor !== 'function')
      throw new TypeError('Executor must be a function')

    // Internal state. `$state` is the state of the promise, and `$chained` is
    // an array of the functions we need to call once this promise is settled.
    this.$state = 'PENDING'
    this.$chained = []

    // Implement `resolve()` and `reject()` for the executor function to use
    const resolve = (res) => {
      // A promise is considered "settled" when it is no longer
      // pending, that is, when either `resolve()` or `reject()`
      // was called once. Calling `resolve()` or `reject()` twice
      // or calling `reject()` after `resolve()` was already called
      // are no-ops.
      if (this.$state !== 'PENDING')
        return

      // If `res` is a "thenable", lock in this promise to match the
      // resolved or rejected state of the thenable.
      const then = res != null ? res.then : null
      if (typeof then === 'function') {
        // In this case, the promise is "resolved", but still in the 'PENDING'
        // state. This is what the ES6 spec means when it says "A resolved promise
        // may be pending, fulfilled or rejected" in
        // http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
        return then(resolve, reject)
      }

      this.$state = 'FULFILLED'
      this.$internalValue = res

      // If somebody called `.then()` while this promise was pending, need
      // to call their `onFulfilled()` function
      for (const { onFulfilled } of this.$chained) onFulfilled(res)

      return res
    }

    const reject = (err) => {
      if (this.$state !== 'PENDING')
        return

      this.$state = 'REJECTED'
      this.$internalValue = err

      for (const { onRejected } of this.$chained) onRejected(err)
    }

    // Call the executor function with `resolve()` and `reject()` as in the spec.
    try {
      // If the executor function throws a sync exception, we consider that
      // a rejection. Keep in mind that, since `resolve()` or `reject()` can
      // only be called once, a function that synchronously calls `resolve()`
      // and then throws will lead to a fulfilled promise and a swallowed error
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  // `onFulfilled` is called if the promise is fulfilled, and `onRejected`
  // if the promise is rejected. For now, you can think of 'fulfilled' and
  // 'resolved' as the same thing.
  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      // Ensure that errors in `onFulfilled()` and `onRejected()` reject the
      // returned promise, otherwise they'll crash the process. Also, ensure
      // that the promise
      const _onFulfilled = (res) => {
        try {
          // If `onFulfilled()` returns a promise, trust `resolve()` to handle
          // it correctly.
          // store new value to new Promise
          resolve(onFulfilled(res))
        } catch (err) {
          reject(err)
        }
      }

      const _onRejected = (err) => {
        try {
          // store new value to new Promise
          reject(onRejected(err))
        } catch (_err) {
          reject(_err)
        }
      }

      if (this.$state === 'FULFILLED') {
        _onFulfilled(this.$internalValue)
      } else if (this.$state === 'REJECTED') {
        _onRejected(this.$internalValue)
      } else {
        this.$chained.push({
          onFulfilled: _onFulfilled,
          onRejected: _onRejected,
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}
```

## Sizzle Selector Engine

- runtime tokenizer and parser
- api from `querySelectorAll`

## DOM

`createDocumentFragment`:

多次使用节点方法(如：appendChild)绘制页面，每次都要刷新页面一次。
使用 document_createDocumentFragment()创建一个文档碎片，把所有的新结点附加在其上，
然后把文档碎片的内容一次性添加到 document 中，提升性能

```ts
function domManipulation(parentElements, target, callback) {
  const fragment = buildFragment([target], parentElements)
  callback.call(parentElements)
}

function after(...args) {
  return this.domManipulation(...args, function (elem) {
    this.parentNode.insertBefore(elem, this.nextSibling)
  })
}
```

### Structure

```ts
$('selector').html('tag+text')
$('selector').text('text')

$('selector').clone()
$('selector').remove()
$('selector').appendTo('selector')

$('selector').parent()
$('selector').children()
```

```ts
$('selector').index()
```

### Class

```ts
$('selector').addClass('')
$('selector').removeClass('')
$('selector').hidden()
```

### Style

```ts
$('selector').css('color', 'red')
$('selector').prop('disable', 'true')
```

### APIs

```ts
$(selector).data()
$(selector).html()
$(selector).css()
$(document).ready(() => {})
```

## Events

1. 通过 on 绑定事件，分析传递的数据，加工变成 add 能够识别的数据
2. 通过 add 把数据整理放到数据缓存中保存，通过 addEventListener 绑定事件
3. 触发事件执行 addEventListener 回调 dispatch 方法
4. 修正事件对象存在的问题，通过 fix 生成一个可写的事件对象
5. 引入 handlers 把委托和原生事件（例如"click"）绑定区分对待
6. 执行数据缓存的事件回调，传入内部产生的事件对象

### Mouse

- click
- dbclick
- mouseenter
- mouseleave

### Keyboard

- keypress
- keydown
- keyup

### Form

- submit
- change
- focus
- blur

### Document and Window

- load
- resize
- scroll
- unload

```ts
$(window).scroll((event) => {})
$(document).height() // 返回整个网页的高度
$(window).height() // 返回窗口高度
$(window).scrollTop() // 返回滚动条距网页顶部距离
```

## JSON

`$.getJSON`:

```ts
$.getJSON(url, data, success(data, statusCode, xhr))

$.getJSON('test.js', (json) => {
  alert(`JSON Data: ${json.users[3].name}`)
})
```

## AJAX

`$.ajax`:

```ts
$.ajax({
  url: 'http://localhost:3000',
  type: 'GET' / 'POST' / 'PUT' / 'DELETE',
  data: dataSchema,
  dataType: 'json',
  success: successCallback,
  error: errorHandle,
})
```

## Animation

- 通过多个 animate 方法形成动画链，那么这个动画链其实都是会加入到 queue 队列里面
- 在每一次 queue 方法中会把动画数据写到队列中，然后取出队列中的第一个序列通过 dequeue 方法执行
- 开始执行之前写一个进程锁 `inProgress` 到 queue 里面， 代表这个动画还在执行中，
  防止同个序列的多个动画重复执行，这个就是异步执行同步收集的处理方案
- 此时动画开始了，这里注意动画是在异步执行的同步的代码，继续调用下一个 animate
- 执行同样的 animate 方法逻辑但是此时问题来了，
  动画可能还在执行可是后续的 animate 还在继续调用，所以这个时候后面的动画代码就需要等待了（进程锁）
- 队列头是有一把 `inProgress` 进程锁的，那么这时候动画只需要加入队列，
  但是可以通过 `inProgress` 是否存在来判断是否执行
- 所有的 animate 方法在加入队列都是按照以上的逻辑依次执行，
  动画执行完毕了就会有一个结束通知，然后从 queue 取出第一个队列继续执行了，如此循环

### Tween Object

通过一个 Tween 类构造出来的缓动对象，其实就是针对每一个属性的封装对象，
这样我们只需要设计一个定时器，在指定的时间内调用 Tween 生成的这些对象就可以了，
Tween 内部控制着各自属性的状态改变。

具体右边的实现代码涉及了如下几个部分了：

- Animation 函数，入口函数用来做一些参数的初始化工作，整个动画的开始调度
- animation 对象就是实际的动画对象了，通过 Animation 函数创建，这个对象上实现了所有属性与方法
- new Tween() 通过 Tween 创建每一个属性对象相关的数据
- animation.tweens 保存了每一个属性对象的容器
- Animation.fx 就是具体开始动画执行的调用的一个调度对象了
- 定时器都是执行一个回调函数的，tick 就是定时器执行的回调，
  tick 函数中通过计算出变化数据，然后通过循环 animation.tweens 中的每一个动画属性对象，来实现改变
