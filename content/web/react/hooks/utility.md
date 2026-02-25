---
sidebar_position: 10
tags: [Web, React, Hook]
---

# Utility

## useImperativeHandle

```tsx
interface MyInputHandles {
  focus: () => void
}

const MyInput: RefForwardingComponent<MyInputHandles, MyInputProps> = (
  props,
  ref
) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current)
        inputRef.current.focus()
    },
  }))

  return <input {...props} ref={inputRef} />
}

const ForwardMyInput = React.forwardReft(MyInput)
export default ForwardMyInput
```

## useDebugValue

```ts
function App() {
  const date = new Date()
  useDebugValue(date, date => date.toISOString())
}
```

## useId

Generating unique IDs on client and server
(每个 ID 代表该组件在组件树中的层级结构):

```tsx
export default function Checkbox() {
  const id = useId()

  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input type="checkbox" name="react" id={id} />
    </>
  )
}
```

## useEvent

Extracting non-reactive logic out of `useEffect`,
[put them into `useEvent`](https://react.dev/learn/separating-events-from-effects),
call `useEvent` from inside `useEffect`.

Event functions let you split an `Effect`
into reactive parts (which should "react" to reactive values and their changes)
and non-reactive parts (which only read their latest values):

```ts
import { useCallback, useEffect, useInsertionEffect, useRef } from 'react'

function useEvent(fn) {
  const ref = useRef(null)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])
  return useCallback((...args) => {
    const f = ref.current // Get latest snapshot, break out closure.
    return f(...args)
  }, [])
}

function ChatRoom({ roomId, theme }) {
  const onConnected = useEvent((connectedRoomId) => {
    // Non-reactive to `theme`.
    showNotification(`Welcome to ${connectedRoomId}`, theme)
  })

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.on('connected', () => {
      onConnected(roomId)
    })
    connection.connect()
    return () => connection.disconnect()
  }, [roomId, onConnected]) // Linter will allow [roomId] in the future.
}
```

Reusable [behavior hooks](https://jser.dev/react/2022/02/18/reusable-behavior-hooks-through-ref)
through ref:

```tsx
function useEvent(event, handler, option = {}) {
  const prevRef = useRef()
  const attach = useCallback(
    (el) => {
      el.addEventListener(event, handler, option)
      prevRef.current = el
    },
    [handler]
  )
  const detach = useCallback(
    (el) => {
      prevRef.current.removeEventListener(event, handler)
      prevRef.current = null
    },
    [handler]
  )
  const ref = (el) => {
    if (el === null) {
      detach()
    } else {
      attach(el)
    }
  }
  return ref
}

function App() {
  const onScroll = () => {}
  const onClick = () => {}
  const refScroll = useEvent('scroll', onScroll, ({ onScroll }))
  const refClick = useEvent('click', onClick)
  const mergedRefs = mergeRefs(refScroll, refClick)
  return (<div ref={mergedRefs}>some content</div>)
}
```
