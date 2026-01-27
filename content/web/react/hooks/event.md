---
sidebar_position: 21
tags: [Web, React, Hook, Event, Debounce, Observer]
---

# Event

## Interval

`useRef` to get latest value:

```ts
import { useEffect, useRef } from 'react'

function useInterval(onTick: () => void, delay: number | null) {
  const onTickRef = useRef(onTick)

  // Remember the latest callback if it changes.
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null)
      return

    const id = setInterval(() => onTickRef.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

export default useInterval
```

[`useEffectEvent`](https://peterkellner.net/2026/01/09/understanding-react-useeffectevent-vs-useeffect)
to read latest props and state:

```ts
function useInterval(onTick: (tick: number) => void) {
  const onTickEvent = useEffectEvent(onTick)

  useEffect(() => {
    let ticks = 0
    const interval = setInterval(() => onTickEvent(++ticks), 1000)
    return () => clearInterval(interval)
  }, [])
}
```

:::caution[Dependency Arrays]

Bad dependency arrays that depend on wrong state
can cause stale closure issues, invalid resets, or even infinite loops.

:::

When to [`useEffectEvent`](https://peterkellner.net/2026/01/09/understanding-react-useeffectevent-vs-useeffect):

- Passed to subscription, timer, or external library.
- Needs to read latest props/state.
- Values shouldn't trigger `Effect` to re-run.

[![`useEffectEvent` internals](./figures/useeffectevent-internals.svg)](https://peterkellner.net/2026/01/09/understanding-react-useeffectevent-vs-useeffect)

## Debounce

```ts
// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value
      // from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )

  return debouncedValue
}
```

```tsx
export default function App() {
  // Usage
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {}, [debouncedSearchTerm])

  return <div>App</div>
}
```

## EventListener

```ts
import { useCallback, useEffect } from 'react'

export default function useKeydown() {
  const handleKeydown = useCallback(() => {
    alert('key is pressed.')
  }, [])

  useMount(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
}
```

```ts
import { useEffect } from 'react'

export default function useEventListener({ event, handler }) {
  useMount(() => {
    document.addEventListener(event, handler)
    return () => {
      document.removeEventListener(event, handler)
    }
  })
}
```

## Observer

```ts
import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  // Update first entry
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node)
      return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen])

  return entry
}

export default useIntersectionObserver
```

```ts
function useComponentSize() {
  const [size, setSize] = React.useState({
    height: 0,
    width: 0,
  })
  const ref = React.useRef<any>()

  const onResize = React.useCallback(() => {
    if (!ref.current)
      return

    const newHeight = ref.current.offsetHeight
    const newWidth = ref.current.offsetWidth

    if (newHeight !== size.height || newWidth !== size.width) {
      setSize({
        height: newHeight,
        width: newWidth,
      })
    }
  }, [size.height, size.width])

  React.useLayoutEffect(() => {
    if (!ref || !ref.current)
      return

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(ref.current)

    return () => resizeObserver.disconnect()
  }, [ref, onResize])

  return {
    ref,
    ...size,
  }
}
```
