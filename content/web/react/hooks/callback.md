---
sidebar_position: 4
tags: [Web, React, Hook, Callback]
---

# Callback

- Returns a memoized callback.
- 对事件句柄进行缓存, `useState` 的第二个返回值是 `dispatch`,
  但是每次都是返回新的函数, 使用 `useCallback`, 可以让它使用上次的函数.
  在虚拟 DOM 更新过程中, 如果事件句柄相同, 那么就不用每次都进行
  `removeEventListener` 与 `addEventListener`.
- `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

## Dispatcher

```ts
function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  hook.memoizedState = [callback, nextDeps]
  return callback
}

function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
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

  hook.memoizedState = [callback, nextDeps]
  return callback
}
```

## useCallback

```tsx
export default function Parent() {
  const [query, setQuery] = useState('react')

  // ✅ Preserves identity until query changes
  const fetchData = useCallback(() => {
    const url = `https://hn.algolia.com/api/v1/search?query=${query}`
    // ... Fetch data and return it ...
  }, [query]) // ✅ Callback deps are OK

  return <Child fetchData={fetchData} />
}
```

```tsx
export default function Child({ fetchData }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(setData)
  }, [fetchData]) // ✅ Effect deps are OK

  // ...
}
```
