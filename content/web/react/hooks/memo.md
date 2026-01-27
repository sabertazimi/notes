---
sidebar_position: 3
tags: [Web, React, Hook, Memo]
---

# Memo

- Returns a memoized value.
- Only recompute the memoized value when one of the dependencies has changed.
- **Shallow compare** diff.
- **Optimization** helps to
  avoid expensive calculations on every render
  (avoid re-render problem):
  - **Good use** for complex objects or expensive calculations.
  - **Donn't use** for primitive values or simple calculations.

## Dispatcher

```ts
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null
): T {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null
): T {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1]

      if (areHookInputsEqual(nextDeps, prevDeps))
        return prevState[0]
    }
  }

  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}
```

## useMemo

```tsx
export default function Button({
  color,
  children,
}: {
  color: string
  children: ReactElement
}) {
  const textColor = useMemo(
    () => slowlyCalculateTextColor(color),
    [color] // ✅ Don’t recalculate until `color` changes
  )

  return (
    <button type="button" className={`Button-${color} Button-text-${textColor}`}>
      {children}
    </button>
  )
}
```
