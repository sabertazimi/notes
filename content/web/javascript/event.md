---
sidebar_position: 34
tags: [Web, JavaScript, ECMAScript, DOM, Event]
---

# Event

- `event.preventDefault()`.
- `event.stopPropagation()`.
- By default, event handlers are executed in the **bubbling** phase
  (unless set `useCapture` to `true`).
- `element.dispatchEvent(event)` to trigger events.

## Properties

| Property                   | Type         |                                |
| -------------------------- | ------------ | ------------------------------ |
| type                       | String       | 被触发的事件类型               |
| trusted                    | Boolean      | 浏览器生成/JavaScript 创建     |
| View                       | AbstractView | 事件所发生的 window 对象       |
| currentTarget              | Element      | Event handler binding          |
| target                     | Element      | Event trigger                  |
| bubbles                    | Boolean      | 事件是否冒泡                   |
| cancelable                 | Boolean      | 是否可以取消事件的默认行为     |
| eventPhase                 | Number       | 捕获阶段/到达目标/冒泡阶段     |
| defaultPrevented           | Boolean      | `preventDefault()` called      |
| preventDefault()           | Function     | 用于取消事件的默认行为         |
| stopPropagation()          | Function     | 用于取消所有后续事件捕获或冒泡 |
| stopImmediatePropagation() | Function     | 用于取消所有后续事件捕获或冒泡 |

## Checker

```ts
function handleEvent(event) {
  node.matches(event.target) // return false or true
  node.contains(event.target) // return false or true
}
```

## Global

`DOMContentLoaded`:

- 当文档中没有脚本时, 浏览器解析完 `HTML` 文档便能触发 `DOMContentLoaded` 事件.
- 如果文档中包含脚本, 则脚本会阻塞文档的解析,
  脚本需要等 `CSSOM` 构建完成才能执行:
  - 在 `DOM`/`CSSOM` 构建完毕, `async` 脚本执行完成之后, `DOMContentLoaded` 事件触发.
  - `HTML` 文档构建不受 `defer` 脚本影响,
    不需要等待 `defer` 脚本执行与样式表加载,
    `HTML` 解析完毕后, `DOMContentLoaded` 立即触发.
- 在任何情况下, `DOMContentLoaded` 的触发不需要等待图片等其他资源加载完成.
- 当 `HTML` 文档解析完成就会触发 `DOMContentLoaded`,
  **所有资源**加载完成之后, **load** 事件才会被触发.

```ts
function ready(fn) {
  if (document.readyState !== 'loading')
    fn()
  else
    document.addEventListener('DOMContentLoaded', fn)
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed.')
})
```

`readystatechange`:

```ts
document.addEventListener('readystatechange', (event) => {
  // HTML5 readyState
  if (
    document.readyState === 'interactive'
    || document.readyState === 'complete'
  ) {
    console.log('Content loaded')
  } else if (document.readyState === 'loading') {
    console.log('Loading')
  }
})
```

`load` (加载完成):

```ts
window.addEventListener('load', () => {
  const image = document.createElement('img')
  image.addEventListener('load', (event) => {
    console.log(event.target.src)
  })
  document.body.appendChild(image)
  image.src = 'smile.gif'

  const script = document.createElement('script')
  script.addEventListener('load', (event) => {
    console.log('Loaded')
  })
  script.src = 'example.js'
  script.async = true
  document.body.appendChild(script)

  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.addEventListener('load', (event) => {
    console.log('css loaded')
  })
  link.href = 'example.css'
  document.getElementsByTagName('head')[0].appendChild(link)
})
```

`visibilitychange`, 切换标签页时改变网页标题/声音/视频:

```ts
window.addEventListener('visibilitychange', () => {
  switch (document.visibilityState) {
    case 'hidden':
      console.log('Tab隐藏')
      break
    case 'visible':
      console.log('Tab被聚焦')
      break
    default:
      throw new Error('Unsupported visibility!')
  }
})
```

```ts
const videoElement = document.getElementById('videoElement')

// AutoPlay the video if application is visible
if (document.visibilityState === 'visible')
  videoElement.play()

// Handle page visibility change events
function handleVisibilityChange() {
  if (document.visibilityState === 'hidden')
    videoElement.pause()
  else
    videoElement.play()
}

document.addEventListener('visibilitychange', handleVisibilityChange, false)
```

`pageshow` (e.g. [BFCache compatible](https://www.sabatino.dev/bfcache-explained)):

```ts
window.addEventListener('pageshow', (event) => {
  if (event.persisted)
    console.log('Page was loaded from cache.')
})
```

- `beforeunload`.
- `unload`: 卸载完成.
- `abort`: 提前终止.
- `error`.
- `select`: 在文本框 (`<input>` 或 `textarea`) 上选择字符.
- `resize`: 缩放.
- `scroll`: 滚动.

## Form

- `submit`/`reset`.
- [FromData API](https://developer.mozilla.org/docs/Web/API/FormData)
- [CheckValidity API](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/checkValidity)

```ts
// <form className='validated-form' noValidate onSubmit={onSubmit}>

function onSubmit(event) {
  event.preventDefault()

  const form = event.target
  const isValid = form.checkValidity() // returns true or false
  const formData = new FormData(form)

  const validationMessages = Array.from(formData.keys()).reduce((acc, key) => {
    acc[key] = form.elements[key].validationMessage
    return acc
  }, {})

  setErrors(validationMessages)

  console.log({
    validationMessages,
    data,
    isValid,
  })

  if (isValid) {
    // here you do what you need to do if is valid
    const data = Array.from(formData.keys()).reduce((acc, key) => {
      acc[key] = formData.get(key)
      return acc
    }, {})
  } else {
    // apply invalid class
    Array.from(form.elements).forEach((i) => {
      if (i.checkValidity()) {
        // field is valid
        i.parentElement.classList.remove('invalid')
      } else {
        // field is invalid
        i.parentElement.classList.add('invalid')
        console.log(i.validity)
      }
    })
  }
}
```

```ts
document.querySelector('form').addEventListener('submit', (event) => {
  const form = event.target
  const url = new URL(form.action || window.location.href)
  const formData = new FormData(form)
  const searchParameters = new URLSearchParams(formData)

  const options = {
    method: form.method,
  }

  if (options.method === 'post') {
    // Modify request body to include form data
    options.body
      = form.enctype === 'multipart/form-data' ? formData : searchParameters
  } else {
    // Modify URL to include form data
    url.search = searchParameters
  }

  fetch(url, options)
  event.preventDefault()
})
```

```tsx
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    // Do something with data. Most likely, send it to the server using fetch

    // Redirect the user to the new page
    router.push('/thank-you')
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Input

- `blur`/`focus`/`focusin`/`focusout`.
- `input`/`change`.
- `select`: 在文本框 (`<input>` 或 `textarea`) 上选择字符.
- [`composition`](https://developer.mozilla.org/docs/Web/API/CompositionEvent):
  中文输入事件.

### Focus

HTML5 focus management:

- 在页面完全加载之前, `document.activeElement` 为 null.
- 默认情况下, `document.activeElement` 在页面刚加载完之后会设置为 `document.body`.

```ts
document.getElementById('myButton').focus()
console.log(document.activeElement === button) // true
console.log(document.hasFocus()) // true
```

:::tip[Focus Events]

当焦点从页面中的一个元素移到另一个元素上时, 会依次发生如下事件:

1. `focusout`: 在失去焦点的元素上触发.
2. `focusin`: 在获得焦点的元素上触发
3. `blur`: 在失去焦点的元素上触发
4. `DOMFocusOut`: 在失去焦点的元素上触发
5. `focus`: 在获得焦点的元素上触发
6. `DOMFocusIn`: 在获得焦点的元素上触发.

:::

### Change

- `input`:
  - `<input type="text" />`.
  - `<input type="password"/>`.
  - `<textarea />`.
- `change`:
  - `<input type="checkbox" />`.
  - `<input type="radio" />`.
  - `<input type="file" />`.
  - `<input type="file" multiple />`.
  - `<select />`.

```ts
const input = document.querySelector('input')

input.addEventListener('change', () => {
  for (const file of Array.from(input.files)) {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      console.log('File', file.name, 'starts with', reader.result.slice(0, 20))
    })
    reader.readAsText(file)
  }
})
```

### Select

```ts
const input = document.querySelector('input')

input.addEventListener('select', (event) => {
  const log = document.getElementById('log')
  const selection = event.target.value.substring(
    event.target.selectionStart,
    event.target.selectionEnd
  )
  log.textContent = `You selected: ${selection}`
})
```

## Clipboard

[Clipboard API](https://developer.mozilla.org/docs/Web/API/Clipboard_API)
(modern alternative for `document.execCommand(command)`):

- `copy`.
- `cut`.
- `paste`.

```ts
const source = document.querySelector('div.source')

source.addEventListener('copy', (event) => {
  const selection = document.getSelection()
  event.clipboardData.setData(
    'text/plain',
    selection.toString().concat('copyright information')
  )
  event.preventDefault()
})
```

## Mouse

- `mousedown`.
- `mouseup`.
- `click`:
  - `mousedown` 与 `mouseup` 都触发后, 触发此事件.
  - `event.clientX`/`event.clientY`.
  - `event.pageX`/`event.pageY`.
  - `event.screenX`/`event.screenY`.
  - `event.shiftKey`/`event.ctrlKey`/`event.altKey`/`event.metaKey`.
- `dbclick`: `click` 两次触发后, 触发此事件.
- `mousemove`.
- `mouseenter`.
- `mouseleave`:
  pointer has exited the element and all of its descendants.
- `mouseout`:
  pointer leaves the element or leaves one of the element's descendants.
- `mouseover`.
- [`wheel`](https://developer.mozilla.org/docs/Web/API/Element/wheel_event)
  (replace deprecated `mousewheel`).

For `click`, no need for X/Y to judge internal/outside state.
Use `element.contains` to check is a better way.

```ts
window.addEventListener('click', (event) => {
  if (document.getElementById('main').contains(event.target))
    process()
})
```

[Drag Event](https://developer.mozilla.org/docs/Web/API/DragEvent):

- dragstart: start point.
- dragend
- dragenter: call `event.preventDefault()` in drop zone.
- dragover: call `event.preventDefault()` in drop zone.
- dragleave
- drop: end point.

Key point for implementing DnD widget is
[DataTransfer](https://developer.mozilla.org/docs/Web/API/DataTransfer):

- Bindings between Drag Zone and Drop Zone.
- `DataTransfer.dropEffect` and `DataTransfer.effectAllowed` to define DnD UI type.
- `DataTransfer.getData` and `DataTransfer.setData` to transfer data.
- `DataTransfer.files` and `DataTransfer.items` to transfer data.

[Context Menu Event](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event):

```ts
const noContext = document.getElementById('noContextMenu')

noContext.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
```

## Keyboard

`keydown`/`keypress`/`keyup`:

```ts
const textbox = document.getElementById('myText')

textbox.addEventListener('keyup', (event) => {
  console.log(event.charCode || event.keyCode)
})
```

[`event.key`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key/Key_Values)
(replace deprecated `event.keyCode`):

```ts
'Alt'
'CapsLock'
'Control'
'Fn'
'Numlock'
'Shift'
'Enter'
'Tab'
' ' // space bar

'ArrowDown'
'ArrowLeft'
'ArrowRight'
'ArrowUp'
'Home'
'End'
'PageDOwn'
'PageUp'

'Backspace'
'Delete'
'Redo'
'Undo'
```

## Device

- `deviceorientation`.
- `devicemotion`.

Animating with mobile accelerometers:

```ts
// call on user gesture
async function enableMotion() {
  // Check if the browser requires explicit permission (iOS 13+)
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission()

      if (permissionState === 'granted') {
        window.addEventListener('devicemotion', handleMotion)
      } else {
        console.warn('Permission denied by user')
      }
    } catch (error) {
      console.error('DeviceMotion prompt failed', error)
    }
  } else {
    // Non-iOS devices or older browsers
    window.addEventListener('devicemotion', handleMotion)
  }
}

// Mapping rotation rate to CSS variables
function handleMotion(event) {
  const rotation = event.rotationRate
  const acceleration = event.acceleration

  // We multiply by 0.2 to dampen the effect for a smoother feel.
  // A higher number will make the rotation more intense.
  // Notice that the Y-axis is multiplied by a negative number to align with physical movement.
  rings.style.setProperty('--rotateX', `${rotation.alpha * 0.2}deg`)
  rings.style.setProperty('--rotateY', `${rotation.beta * -0.2}deg`)
  rings.style.setProperty('--rotateZ', `${rotation.gamma * 0.2}deg`)

  // Translation logic: moving the object in space
  rings.style.setProperty('--translateX', `${acceleration.x * -25}px`)
  rings.style.setProperty('--translateY', `${acceleration.y * 25}px`)
  rings.style.setProperty('--translateZ', `${acceleration.z * -25}px`)
}
```

## Touch

- `touchstart`.
- `touchmove`.
- `touchend`.
- `touchcancel`.

Use [`touch`](https://developer.mozilla.org/docs/Web/API/Touch_events) events:

- Dispatch custom `tap`/`press`/`swipe`/`pinch`/`drag`/`drop`/`rotate`.
- Dispatch standard `click`/`dbclick`/`mousedown`/`mouseup`/`mousemove`.

```ts
interface Pointer {
  startTouch: Touch
  startTime: number
  status: string
  element: TouchEventTarget
  lastTouch?: Touch
  lastTime?: number
  deltaX?: number
  deltaY?: number
  duration?: number
  distance?: number
  isVertical?: boolean
}

type TouchEventTarget = HTMLDivElement | EventTarget
type TouchEventHandler = (pointer: Pointer, touch: Touch) => void

class Recognizer {
  pointers: Map<Touch['identifier'], Pointer>

  constructor() {
    this.pointers = new Map()
  }

  start(event: TouchEvent, callback?: TouchEventHandler) {
    // touches: 当前屏幕上所有触摸点的列表.
    // targetTouches: 当前对象上所有触摸点的列表.
    // changedTouches: 涉及当前事件的触摸点的列表.
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      const pointer: Pointer = {
        startTouch: touch,
        startTime: Date.now(),
        status: 'tapping',
        element: event.target,
      }
      this.pointers.set(touch.identifier, pointer)
      if (callback)
        callback(pointer, touch)
    }
  }

  move(event: TouchEvent, callback?: TouchEventHandler) {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      const pointer = this.pointers.get(touch.identifier)

      if (!pointer)
        return

      if (!pointer.lastTouch) {
        pointer.lastTouch = pointer.startTouch
        pointer.lastTime = pointer.startTime
        pointer.deltaX = 0
        pointer.deltaY = 0
        pointer.duration = 0
        pointer.distance = 0
      }

      let time = Date.now() - pointer.lastTime

      if (time > 0) {
        const RECORD_DURATION = 70

        if (time > RECORD_DURATION)
          time = RECORD_DURATION

        if (pointer.duration + time > RECORD_DURATION)
          pointer.duration = RECORD_DURATION - time

        pointer.duration += time
        pointer.lastTouch = touch
        pointer.lastTime = Date.now()
        pointer.deltaX = touch.clientX - pointer.startTouch.clientX
        pointer.deltaY = touch.clientY - pointer.startTouch.clientY
        const x = pointer.deltaX * pointer.deltaX
        const y = pointer.deltaY * pointer.deltaY
        pointer.distance = Math.sqrt(x + y)
        pointer.isVertical = x < y

        if (callback)
          callback(pointer, touch)
      }
    }
  }

  end(event: TouchEvent, callback?: TouchEventHandler) {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      const id = touch.identifier
      const pointer = this.pointers.get(id)

      if (!pointer)
        continue
      if (callback)
        callback(pointer, touch)

      this.pointers.delete(id)
    }
  }

  cancel(event: TouchEvent, callback?: TouchEventHandler) {
    this.end(event, callback)
  }

  fire(elem: TouchEventTarget, type: string, props: EventInit) {
    if (elem) {
      const event = new Event(type, {
        bubbles: true,
        cancelable: true,
        ...props,
      })
      elem.dispatchEvent(event)
    }
  }

  static bind(el: TouchEventTarget, recognizer: Recognizer) {
    function move(event: TouchEvent) {
      recognizer.move(event)
    }

    function end(event: TouchEvent) {
      recognizer.end(event)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', end)
      document.removeEventListener('touchcancel', cancel)
    }

    function cancel(event: TouchEvent) {
      recognizer.cancel(event)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', end)
      document.removeEventListener('touchcancel', cancel)
    }

    el.addEventListener('touchstart', (event: TouchEvent) => {
      recognizer.start(event)
      document.addEventListener('touchmove', move)
      document.addEventListener('touchend', end)
      document.addEventListener('touchcancel', cancel)
    })
  }
}

export default Recognizer
```

## Dispatch

Dispatch `MouseEvent`:

```ts
const btn = document.getElementById('myBtn')

// 创建 event 对象
const event = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  view: document.defaultView,
})

// 触发事件
btn.dispatchEvent(event)
```

Dispatch `KeyboardEvent`:

```ts
const textbox = document.getElementById('myTextbox')

// 按照 DOM3 的方式创建 event 对象
if (document.implementation.hasFeature('KeyboardEvents', '3.0')) {
  // 初始化 event 对象
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    view: document.defaultView,
    key: 'a',
    location: 0,
    shiftKey: true,
  })

  // 触发事件
  textbox.dispatchEvent(event)
}
```

Dispatch `CustomEvent`:

```ts
const div = document.getElementById('myDiv')
div.addEventListener('myEvent', (event) => {
  console.log(`DIV: ${event.detail}`)
})
document.addEventListener('myEvent', (event) => {
  console.log(`DOCUMENT: ${event.detail}`)
})

if (document.implementation.hasFeature('CustomEvents', '3.0')) {
  const event = new CustomEvent('myEvent', {
    bubbles: true,
    cancelable: true,
    detail: 'Hello world!',
  })
  div.dispatchEvent(event)
}
```

## Utility

```ts
class EventUtil {
  static getEvent(event) {
    return event || window.event
  }

  static getTarget(event) {
    return event.target || event.srcElement
  }

  static getRelatedTarget(event) {
    // For `mouseover` and `mouseout` event:
    if (event.relatedTarget)
      return event.relatedTarget
    else if (event.toElement)
      return event.toElement
    else if (event.fromElement)
      return event.fromElement
    else
      return null
  }

  static preventDefault(event) {
    if (event.preventDefault)
      event.preventDefault()
    else
      event.returnValue = false
  }

  static stopPropagation(event) {
    if (event.stopPropagation)
      event.stopPropagation()
    else
      event.cancelBubble = true
  }

  static addHandler(element, type, handler) {
    if (element.addEventListener)
      element.addEventListener(type, handler, false)
    else if (element.attachEvent)
      element.attachEvent(`on${type}`, handler)
    else
      element[`on${type}`] = handler
  }

  static removeHandler(element, type, handler) {
    if (element.removeEventListener)
      element.removeEventListener(type, handler, false)
    else if (element.detachEvent)
      element.detachEvent(`on${type}`, handler)
    else
      element[`on${type}`] = null
  }
}
```
