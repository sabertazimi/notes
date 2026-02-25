---
sidebar_position: 23
tags: [Web, React, Hook, Media]
---

# Media

## Media Query

```ts
export default function useMedia<T>(
  queries: string[],
  values: T[],
  defaultValue: T
) {
  // Array containing a media query list for each query
  const mediaQueryLists = queries.map(q => window.matchMedia(q))

  const getValue = () => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex(mql => mql.matches)
    return values?.[index] || defaultValue
  }

  // State and setter for matched value
  const [value, setValue] = useState<T>(getValue)

  useMount(() => {
    const handler = () => setValue(getValue)
    mediaQueryLists.forEach(mql => mql.addListener(handler))
    return () => mediaQueryLists.forEach(mql => mql.removeListener(handler))
  })

  return value
}
```

## Locked Body

```ts
import { useEffect, useLayoutEffect, useState } from 'react'

type ReturnType = [boolean, (locked: boolean) => void]

function useLockedBody(initialLocked = false): ReturnType {
  const [locked, setLocked] = useState(initialLocked)

  // Do the side effect before render
  useLayoutEffect(() => {
    // Key point 1
    if (!locked)
      return

    // Save initial body style
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    // Get the scrollBar width
    const root = document.getElementById('___gatsby') // or root
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0

    // Avoid width reflow
    if (scrollBarWidth)
      document.body.style.paddingRight = `${scrollBarWidth}px`

    // Key point 2
    return () => {
      document.body.style.overflow = originalOverflow

      if (scrollBarWidth)
        document.body.style.paddingRight = originalPaddingRight
    }
  }, [locked])

  // Update state if initialValue changes
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked)
    }
  }, [initialLocked])

  return [locked, setLocked]
}

export default useLockedBody
```

## Mouse

```ts
import { useRef, useState } from 'react'

export default function useLongPress(time = 500) {
  const [action, setAction] = useState()

  const timerRef = useRef()
  const isLongPressRef = useRef()

  function startPressTimer() {
    isLongPressRef.current = false
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      setAction('LongPress')
    }, time)
  }

  function handleClick() {
    if (isLongPressRef.current)
      return

    setAction('Click')
  }

  function handleMouseDown() {
    startPressTimer()
  }

  function handleMouseUp() {
    clearTimeout(timerRef.current)
  }

  function handleTouchStart() {
    startPressTimer()
  }

  function handleTouchEnd() {
    if (action === 'LongPress')
      return

    clearTimeout(timerRef.current)
  }

  return {
    action,
    handlers: {
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  }
}
```
