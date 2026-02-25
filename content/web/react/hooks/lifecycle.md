---
sidebar_position: 20
tags: [Web, React, Hook, Lifecycle]
---

# Lifecycle

## ComponentDidMount

```ts
function useMount(fn) {
  useEffect(() => fn(), [])
}
```

## ComponentWillUnmount

```ts
function useUnmount(fn) {
  useEffect(() => fn, [])
}
```

## ComponentDidUpdate

```ts
function useUpdate(effectCallback) {
  const mountingRef = useRef(true)

  useEffect(() => {
    // First get called for componentDidMount lifecycle,
    // so skip it.
    if (mountingRef.current)
      mountingRef.current = false
    else
      return effectCallback()
  })
}

function useUpdateDeps(effectCallback, deps) {
  const mountingRef = useRef(true)

  React.useEffect(() => {
    return () => {
      mountingRef.current = true
    }
  }, [])

  React.useEffect(() => {
    // Do not execute effectCallback for the first time.
    if (mountingRef.current)
      mountingRef.current = false
    else
      return effectCallback()
  }, deps)
}
```

## Force Update

```ts
const useUpdate = () => useState(0)[1]
```

```ts
import { useState } from 'react'

interface VoidFunction {
  (): void
}

interface VoidFunctionCreator {
  (): VoidFunction
}

const max = 9007199254740990 // Number.MAX_SAFE_INTEGER - 1;

const useForceUpdate: VoidFunctionCreator = (): VoidFunction => {
  const [, setState] = useState(0)
  const forceUpdate: VoidFunction = (): void => {
    setState((state: number) => (state + 1) % max)
  }
  return forceUpdate
}

export default useForceUpdate
```

## Mounted

```ts
function useIsMounted() {
  const [isMount, setIsMount] = useState(false)

  useEffect(() => {
    if (!isMount) {
      setIsMount(true)
    }

    return () => setIsMount(false)
  }, [])

  return isMount
}
```

## Previous

```tsx
export default function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  return (
    <h1>
      Now:
      {' '}
      {count}
      , before:
      {' '}
      {prevCount}
    </h1>
  )
}

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
```
