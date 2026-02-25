---
sidebar_position: 7
tags: [Web, React, Hook, Effect]
---

# Effects

## Dispatcher

```ts
function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return mountEffectImpl(
    UpdateEffect | PassiveEffect,
    HookPassive,
    create,
    deps
  )
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  currentlyRenderingFiber.flags |= fiberFlags // UpdateEffect | PassiveEffect.
  hook.memoizedState = pushEffect(
    HasEffect | hookFlags, // PassiveHook.
    create,
    undefined,
    nextDeps
  )
}

function updateEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps)
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  let destroy

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState
    destroy = prevEffect.destroy

    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 如果依赖不变, 新建 Effect (tag 不含 HookHasEffect).
        // Reconciler.Commit 阶段会跳过此 Effect.
        pushEffect(hookFlags, create, destroy, nextDeps)
        return
      }
    }
  }

  // 如果依赖改变, 更改 fiber.flags, 新建 Effect.
  // Reconciler.Commit 阶段会再次执行此 Effect.
  currentlyRenderingFiber.flags |= fiberFlags
  hook.memoizedState = pushEffect(
    HasEffect | hookFlags,
    create,
    destroy,
    nextDeps
  )
}

function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create, // User code: effect callback.
    destroy, // User code: destroy callback.
    deps, // User code: deps list.
    next: null,
  }

  let componentUpdateQueue = currentlyRenderingFiber.updateQueue

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue()
    currentlyRenderingFiber.updateQueue = componentUpdateQueue
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    const lastEffect = componentUpdateQueue.lastEffect

    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect
    } else {
      // Circular effect list.
      const firstEffect = lastEffect.next
      lastEffect.next = effect
      effect.next = firstEffect
      componentUpdateQueue.lastEffect = effect
    }
  }

  return effect
}
```

`useEffect` [quiz](https://jser.dev/2023-07-08-how-does-useeffect-work):

```tsx
import * as React from 'react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [count, setCount] = useState(1)
  console.log(1)
  useEffect(() => {
    console.log(2)
    return () => {
      console.log(3)
    }
  }, [count])

  useEffect(() => {
    console.log(4)
    setCount(count => count + 1)
  }, [])
  return <Child count={count} />
}

function Child({ count }) {
  useEffect(() => {
    console.log(5)
    return () => {
      console.log(6)
    }
  }, [count])

  return null
};

const root = createRoot(document.getElementById('root'))
root.render(<App />)
// 1 -> Parent initial render
// 5 -> Child useEffect normal runs
// 2 -> Parent first useEffect normal runs
// 4 -> Parent second useEffect normal runs  <-- Causes a state change
// 1 -> Parent re-render
// 6 -> Cleanup code in Child's useEffect (return ...)
// 3 -> Cleanup code in parent's useEffect (return... )
// 5 -> Child useEffect normal runs (due to dependency on count)
// 2 -> Parent useEffect normal runs (due to dependency on count)
```

## Lifecycle

1. React renders UI for current props/state to screen.
2. React cleans up the effect for prev props/state.
3. React runs the effect for current props/state
   (`useEffect` got invoked after `componentDidMount`).

## Nasty Loop

The effect hook runs when the component `mounts`
but also when the component `updates`.
Because we are setting the state after every data fetch,
the component updates and the effect runs again.
It fetches the data again and again.
That’s a bug and needs to be avoided.

## Dependencies List

无论是将组件编写为类还是函数,
都必须为 effect 响应所有 props 和 state 的更新
(`Reactive Value`).
在传统的 Class Component, 需要编写代码去检测这些 props 和 state 是否变更
(`shouldComponentUpdate`, `componentDidUpdate`).
在 Function Component, 借助 `useEffect` 可以实现自动检测.

If one of deps list changes, the hook runs again.
Provide **empty array** as second argument to the effect hook
to avoid activating it on component updates
but **only for the mounting** of the component.
For listeners binding, use `[]` deps list should be better.

### Omits

Omit stable values from the deps list:

- `set` function returned from `useState`.
- `ref` object returned from `useRef`.

```tsx
export default function App() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count
  }, [count]) // ✅ Only count is declared.
}
```

### Primitives

Primitive values are [better](https://react.dev/learn/removing-effect-dependencies):

```ts
function ChatRoom({ options }) {
  const [message, setMessage] = useState('')
  const { roomId, serverUrl } = options

  useEffect(() => {
    const connection = createConnection({
      roomId,
      serverUrl,
    })
    connection.connect()
    return () => connection.disconnect()
  }, [roomId, serverUrl]) // ✅ All dependencies declared
}
```

### Functions

Functions in `useEffect`:

- If only use some functions inside an effect, move them directly into that effect.
- Hoisting functions that don’t need props or state outside of component,
  and pull the ones that are used only by an effect inside of that effect.
- For useCallback function, it should be in deps list `useEffect(() => {}, [callback])`

```ts
import axios from 'axios'
// https://www.robinwieruch.de/react-hooks-fetch-data
import { useEffect, useState } from 'react'

function useDataApi(initialUrl, initialData) {
  const [data, setData] = useState(initialData)
  const [url, setUrl] = useState(initialUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      try {
        const result = await axios(url)

        setData(result.data)
      } catch (error) {
        setIsError(true)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [url])

  const doFetch = (url) => {
    setUrl(url)
  }

  return { data, isLoading, isError, doFetch }
}
```

### Comparison

```ts
import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

const isPrimitive = (val: any) => val !== Object(val)

type DepsEqualFnType<TDeps extends DependencyList>
  = (prevDeps: TDeps, nextDeps: TDeps) => boolean

export default function useCustomCompareEffect<TDeps extends DependencyList>(
  effect: EffectCallback,
  deps: TDeps,
  depsEqual: DepsEqualFnType<TDeps>,
) {
  const ref = useRef<TDeps | undefined>(undefined)

  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps
  }

  useEffect(effect, ref.current)
}
```

```ts
import { DependencyList, EffectCallback } from 'react'
import fastDeepEqual from './misc/fastDeepEqual'
import useCustomCompareEffect from './useCustomCompareEffect'

const isPrimitive = (val: any) => val !== Object(val)

export default function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
) {
  useCustomCompareEffect(effect, deps, fastDeepEqual)
}
```

## Closure

- useEffect Hook 会丢弃上一次渲染结果,
  它会清除上一次 effect,
  再建立下一个 effect
  (也会创建新的 Closure),
  下一个 effect 锁住新的 props 和 state
  (整个 Counter 函数在 re-render 时会被重复调用一次).
- setInterval 不会丢弃上一次结果,
  会引用旧状态 Closure 中的变量,
  导致其与 useEffect 所预期行为不一致.
- 可以通过 useRef 解决这一现象: get latest value.

```tsx
// BUG
export default function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1) // always 1 regardless `count` value change
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <h1>{count}</h1>
}
```

```tsx
export default function Counter() {
  const [count, setCount] = useState(0)

  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  return <h1>{count}</h1>
}

function useInterval(callback, delay) {
  const savedCallbackRef = useRef(callback)

  // Remember the latest callback if it changes
  useEffect(() => {
    savedCallbackRef.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallbackRef.current()
    }

    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}
```

## State

- 如 `UseEffect Closure` 所述, 每次调用 useEffect 时,
  会捕获那一次 render 时的 props 和 state.
- Class Component 中的 this.state.xxx 却总是指向最新的 state.

```tsx
export default function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log(`You clicked ${count} times`)
    }, 3000)

    return () => clearTimeout(timeout)
  })

  return (
    <div>
      <p>
        You clicked
        {' '}
        {count}
        {' '}
        times
      </p>
      <button type="button" onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
// Output:
// Mounted: You clicked 0 times
// Clicked 5 times in 3s
// You clicked 1 times
// You clicked 2 times
// You clicked 3 times
// You clicked 4 times
// You clicked 5 times
```

```tsx
class Counter {
  componentDidUpdate() {
    setTimeout(() => {
      console.log(`You clicked ${this.state.count} times`)
    }, 3000)
  }

  render() {
    const { count } = this.props

    return (
      <div>
        <p>
          You clicked
          {' '}
          {count}
          {' '}
          times
        </p>
        <button type="button" onClick={() => this.setState(count + 1)}>Click me</button>
      </div>
    )
  }
}
// Output:
// Mounted: You clicked 0 times
// Clicked 5 times in 3s
// You clicked 5 times
// You clicked 5 times
// You clicked 5 times
// You clicked 5 times
// You clicked 5 times
```

## Cleanup

- Avoid memory leaks.
- Prevent unexpected errors.
- Good user experience.

Cleanup API requests ([race condition](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect):

- `Boolean` flag.
- `AbortController`.

```ts
function App({ url }) {
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)

  // Cleanup with Boolean flag:
  useEffect(() => {
    let ignore = false
    fetchResults(url, page).then((json) => {
      if (!ignore)
        setResults(json)
    })
    return () => {
      ignore = true
    }
  }, [url, page])

  // Cleanup with AbortController:
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchData = async () => {
      const response = await fetch(url, { signal })
      const json = await response.json()
      setResults(json)
    }

    fetchData()

    return () => controller.abort()
  }, [url])
}
```

Cleanup connections:

```ts
function App() {
  useEffect(() => {
    const socket = new WebSocket('url', protocols)
    // do what you want with the socket

    return () => socket.close()
  }, [])
}
```

Cleanup timeouts:

```ts
function App() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // do something in the timeout
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [])
}
```

:::caution[React 18 Development Strict Mode]

With `Strict Mode` in React 18,
React will simulate unmounting and remounting component in development mode:

- React mounts component:
  - Layout effects are created.
  - Effect effects are created.
- React simulates unmounting component:
  - Layout effects are destroyed.
  - Effects are destroyed.
- React simulates mounting component with previous state:
  - Layout effect setup code runs.
  - Effect setup code runs.

When `Strict Mode` is on,
remounts twice helps find out `Effects` need cleanup
and exposes bugs like race conditions early.

:::

## useEffect

Effects are typically used to
[synchronize with external system](https://react.dev/learn/synchronizing-with-effects):
browser APIs,
third-party library,
network, and so on.

Effects let you specify side effects that are caused by rendering itself,
rather than by a particular event:

- Sending a message in the chat is an event
  because it is directly caused by user clicking a specific button:
  put it in `handleClick()`.
- However, setting up a server connection is an `Effect`
  because it needs to happen regardless of
  which interaction caused the component to appear:
  put int in `useEffect()`.

If your effect only adjusts some state based on other state,
[you might not need effects](https://react.dev/learn/you-might-not-need-an-effect):

- You don’t need Effects to transform data for rendering.
- You don’t need Effects to handle user events.

```ts
function handleClick() {
  // ✅ Buying is an event because it is caused by a particular interaction.
  fetch('/api/buy', { method: 'POST' })
  showNotification(`Added ${product.name} to the shopping cart!`)
  navigateTo('/checkout')
}

function Form() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // ✅ Good: calculated during rendering
  const fullName = `${firstName} ${lastName}`

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName })
  }
  // ...
}
```

## useLayoutEffect

- `useLayoutEffect` callback called **synchronously**
  (fires synchronously after all DOM mutations),
  substitute for `componentDidMount` lifecycle function:
  `Update` effect flags, `HasEffect | Layout` hook flags.
- `useEffect` got invoked after `componentDidMount` **asynchronously**:
  `Update | Passive` effect flags, `HasEffect | Passive` hook flags.
- Lifecycle of React component:
  - User interacts, props or state change.
  - React updates DOM.
  - `useLayoutEffect` hook fires.
  - Browser paints: visual changes are displayed to user.
  - `useEffect` hook fires.
- If need to mutate DOM directly (visual changes to UI)
  or need to perform DOM measurements,
  `useLayoutEffect` is better than `useEffect`.

```ts
function mountLayoutEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return mountEffectImpl(
    UpdateEffect, // Fiber Flags
    HookLayout, // Hook Flags
    create,
    deps
  )
}

function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return mountEffectImpl(
    UpdateEffect | PassiveEffect, // Fiber Flags
    HookPassive, // Hook Flags
    create,
    deps
  )
}

function updateLayoutEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return updateEffectImpl(UpdateEffect, HookLayout, create, deps)
}

function updateEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps)
}
```

## useInsertionEffect

[`useInsertionEffect`](https://github.com/reactwg/react-18/discussions/110)
allows `CSS-in-JS` libraries to address performance
issues of injecting styles in render:

`useInsertionEffect` will run after the DOM is mutated,
but before layout effects read the new layout.

```tsx
function useCSS(rule) {
  if (!canUseDOM)
    collectedRulesSet.add(rule)

  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule)
      document.head.appendChild(getStyleForRule(rule))
    }
  })

  return rule
}

export default function Component() {
  const className = useCSS(rule)
  return <div className={className} />
}
```

In commit phase, the ordering of effects are:

- Insertion Effects - `useInsertionEffect()`.
- Mutation Effects - host DOM updates diffed from reconciliation.
- Layout Effects - `useLayoutEffect()`.
- Passive Effects - `useEffect()`.

It is synchronous from 1 to 3, the last step of Passive Effects are run
[in next tick](https://jser.dev/react/2022/01/19/lifecycle-of-effect-hook/#flushpassiveeffects).

## References

- `useEffect` complete [guide](https://overreacted.io/a-complete-guide-to-useeffect).
- `useEffect` usage [guide](https://react.dev/learn/you-might-not-need-an-effect).
