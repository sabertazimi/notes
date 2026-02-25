---
sidebar_position: 5
tags: [Web, React, Hook, Ref]
---

# Ref

[ref](https://jser.dev/react/2021/12/05/how-does-useRef-work):

- During reconciliation, ref changes/creation will be marked on fiber in flags.
- During committing, react will detach/attach the ref by checking flags.
- `useRef()` is a simple hook which just holds the ref object.

## Dispatcher

```ts
function mountRef<T>(initialValue: T) {
  const hook = mountWorkInProgressHook()
  const ref = {
    current: initialValue,
  }
  Object.seal(ref)
  hook.memoizedState = ref
  return ref
}

function updateRef<T>(initialValue: T) {
  const hook = updateWorkInProgressHook()
  return hook.memoizedState
}
```

## Features

- Mutable Value:
  `useRef()` is useful for for keeping any mutable value around.
  Updating reference values inside handlers/useEffect callbacks is good,
  updating reference values during rendering (outside callbacks) is bad.
- Lifecycle Persisted Value:
  `useRef()` creates a plain JavaScript object,
  is persisted (**stays the same**) between component re-renderings.
- Silent Value:
  update reference values don't trigger re-renderings.
- Latest Value:
  `useRef()` read rendered props/state from **the future**.
  It's good to get **latest** value of a particular prop or state
  (the updated reference value is available right away).

```tsx
export default function Example() {
  const [count, setCount] = useState(0)
  const latestCountRef = useRef(count)

  useEffect(() => {
    // Set the mutable latest value
    latestCountRef.current = count
    const timeout = setTimeout(() => {
      // Read the mutable latest value
      console.log(`You clicked ${latestCountRef.current} times`)
    }, 3000)

    return () => clearTimeout(timeout)
  })

  return <div>Example</div>
}
```

## Update Mechanism

- Update a `ref`, no re-renderings happens.
- Update a `state`, the deep rendering mechanism works to re-render components.
- Store values in refs and have them updated,
  which is more **efficient** than `useState` (which can be expensive)
  when the values are to be updated multiple times within a second.

```tsx
export default function UserAvatar({ src }: { src: string }) {
  return <img src={src} alt="User Avatar" />
}
```

```tsx
export default function Username({ name }: { name: string }) {
  return <span>{name}</span>
}
```

```tsx
export default function User() {
  const userRef = useRef({
    name: 'UserName',
    avatarURL: 'https://avatar.com/avatar',
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      userRef.current = {
        name: 'NewUserName',
        avatarURL: 'https://avatar.com/newavatar',
      }
    }, 5000)

    return () => clearTimeout(timeout)
  })

  // Only output once
  console.log('Rendered.')

  // Both children won't be re-rendered
  // due to shallow rendering mechanism
  return (
    <div>
      <Username name={user.name} />
      <UserAvatar src={user.avatarURL} />
    </div>
  )
}
```

## useRef

If your component needs to store some value,
but it doesn’t impact the rendering logic,
[choose refs](https://react.dev/learn/referencing-values-with-refs#when-to-use-refs):

- Storing timeout IDs.
- Storing and manipulating DOM elements (binding to HTMLElement).
- Storing other objects that aren’t necessary to calculate the JSX:
  work with external systems or browser APIs.
- `ref` can either be a state that does not need to change too often.
- `ref` can either be a state that should change as frequently as possible
  but should not trigger full re-rendering of the component.

```tsx
import { useRef, useState } from 'react'

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null)
  const [now, setNow] = useState(null)
  const intervalRef = useRef(null)

  function handleStart() {
    setStartTime(Date.now())
    setNow(Date.now())

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setNow(Date.now())
    }, 10)
  }

  function handleStop() {
    clearInterval(intervalRef.current)
  }

  let secondsPassed = 0
  if (startTime != null && now != null)
    secondsPassed = (now - startTime) / 1000

  return (
    <>
      <h1>
        Time passed:
        {secondsPassed.toFixed(3)}
      </h1>
      <button type="button" onClick={handleStart}>Start</button>
      <button type="button" onClick={handleStop}>Stop</button>
    </>
  )
}
```

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface Props {}

function MyInput({ ref, ...props }: Props) {
  const realInputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus()
    },
  }))
  return <input {...props} ref={realInputRef} />
}

export default function Form() {
  const inputRef = useRef(null)

  function handleClick() {
    inputRef.current.focus()
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button type="button" onClick={handleClick}>Focus the input</button>
    </>
  )
}
```
