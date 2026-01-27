---
sidebar_position: 35
tags: [Web, JavaScript, ECMAScript, DOM, Observer]
---

# Observer

## Intersection

```ts
// <img class="lzy_img" src="lazy_img.jpg" data-src="real_img.jpg" />
document.addEventListener('DOMContentLoaded', () => {
  const imageObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target
        console.log('Lazy loading ', lazyImage)
        lazyImage.src = lazyImage.dataset.src

        // only load image once
        lazyImage.classList.remove('lzy')
        imgObserver.unobserve(lazyImage)
      }
    })
  })

  const lazyImages = document.querySelectorAll('img.lzy_img')
  lazyImages.forEach(lazyImage => imageObserver.observe(lazyImage))
})
```

## Mutation

如果文档中连续插入 1000 个 `<li>` 元素, 就会连续触发 1000 个插入事件,
执行每个事件的回调函数, 这很可能造成浏览器的卡顿;
Mutation Observer 只会在 1000 个段落都插入结束后才会触发, 且只触发一次.

Mutation Observer 有以下特点:

- 它等待所有脚本任务完成后, 才会运行, 即采用异步方式.
- 它把 DOM 变动记录封装成一个数组进行处理, 而不是一条条地个别处理 DOM 变动.
- 记录队列和回调处理的默认行为是耗尽这个队列, 处理每个 MutationRecord, 然后让它们超出作用域并被垃圾回收.
- MutationObserver 实例拥有被观察目标节点的弱引用, 不会妨碍垃圾回收程序回收目标节点.
- 它即可以观察发生在 DOM 节点的所有变动, 也可以观察某一类变动.
- 被观察子树中的节点 (`{ subtree: true }`) 被移出子树之后仍然能够触发变化事件.

```ts
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log(mutation)
  })
})

// 开始侦听页面的根 HTML 元素中的更改.
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
})
```

```ts
const target = document.querySelector('#container')
function callback(mutations, observer) {
  mutations.forEach((mutation) => {
    switch (mutation.type) {
      case 'attributes':
        // the name of the changed attribute is in
        // mutation.attributeName
        // and its old value is in mutation.oldValue
        // the current value can be retrieved with
        // target.getAttribute(mutation.attributeName)
        break
      case 'childList':
        // any added nodes are in mutation.addedNodes
        // any removed nodes are in mutation.removedNodes
        break
      default:
        throw new Error('Unsupported mutation!')
    }
  })
}

const observer = new MutationObserver(callback)
observer.observe(target, {
  attributes: true,
  attributeFilter: ['foo'], // only observe attribute 'foo'
  attributeOldValue: true,
  childList: true,
})
```

```ts
const observer = new MutationObserver(mutationRecords =>
  console.log(mutationRecords)
)

// 创建两个初始子节点
document.body.appendChild(document.createElement('div'))
document.body.appendChild(document.createElement('span'))

observer.observe(document.body, { childList: true })

// 交换子节点顺序
document.body.insertBefore(document.body.lastChild, document.body.firstChild)
// 发生了两次变化: 第一次是节点被移除, 第二次是节点被添加
// [
//   {
//     addedNodes: NodeList[],
//     attributeName: null,
//     attributeNamespace: null,
//     oldValue: null,
//     nextSibling: null,
//     previousSibling: div,
//     removedNodes: NodeList[span],
//     target: body,
//     type: childList,
//   },
//   {
//     addedNodes: NodeList[span],
//     attributeName: null,
//     attributeNamespace: null,
//     oldValue: null,
//     nextSibling: div,
//     previousSibling: null,
//     removedNodes: NodeList[],
//     target: body,
//     type: "childList",
//   }
// ]
```

## References

- [Intersection Observer](https://developer.mozilla.org/docs/Web/API/IntersectionObserver)
- [Mutation Observer](https://developer.mozilla.org/docs/Web/API/MutationObserver)
- [Resize Observer](https://developer.mozilla.org/docs/Web/API/ResizeObserver)
- [Performance Observer](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)
- [Reporting Observer](https://developer.mozilla.org/docs/Web/API/ReportingObserver)
