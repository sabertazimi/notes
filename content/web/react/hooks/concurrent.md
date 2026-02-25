---
sidebar_position: 8
tags: [Web, React, Hook, Concurrent, Asynchronous]
---

# Concurrent

## useDeferredValue

Debounce:

```tsx
import { useDeferredValue } from 'react'

export default function App() {
  const [text, setText] = useState('hello')

  // Debounced value.
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 })

  return (
    <div>
      <input value={text} onChange={handleChange} />
      <List text={deferredText} />
    </div>
  )
}
```

`useDeferredValue` only works when `SlowComponent` has been wrapped with `React.memo()`.
Without `React.memo()`,
`SlowComponent` would re-render whenever its parent component re-renders,
regardless of whether props has changed or not.

```tsx
import { useDeferredValue, useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const deferredCount = useDeferredValue(count)
  const isBusyRecalculating = count !== deferredCount

  return (
    <>
      <ImportantStuff count={count} />
      <SlowWrapper
        style={{ opacity: isBusyRecalculating ? 0.5 : 1 }}
      >
        <SlowStuff count={deferredCount} />
        {isBusyRecalculating && <Spinner />}
      </SlowWrapper>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  )
}
```

## useTransition

`startTransition` 回调中的更新都会被认为是**非紧急处理**,
如果出现更紧急的更新 (User Input), 则上面的更新都会被中断,
直到没有其他紧急操作之后才会去继续执行更新.

[Opt-in concurrent features](https://jser.dev/2023-05-19-how-does-usetransition-work)
(implementing debounce-like function):

- Avoid blocking updates: events (e.g. click) are triggering updates in synchronous mode.
- Avoid unnecessary `Suspense` fallbacks.

```tsx
// Use this function to schedule a task for a root.
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  const existingCallbackNode = root.callbackNode
  markStarvedLanesAsExpired(root, currentTime)

  // `getNextLanes()` returns highest priority lane
  // if there are SyncLane and Transition Lanes, SyncLane will be chosen
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  )

  if (nextLanes === NoLanes) {
    // Special case: There's nothing to work on.
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode)
    }
    root.callbackNode = null
    root.callbackPriority = NoLane
    return
  }

  if (existingCallbackNode != null) {
    // This is important!
    // If a re-render is not done, and we schedule a new one,
    // the old one is going to be canceled.
    // This is how interruption happens.
    cancelCallback(existingCallbackNode)
  }

  // Schedule a new callback.
  let newCallbackNode
  if (newCallbackPriority === SyncLane) {
    // For SyncLane, the reconciliation is sync work, not concurrent mode
    // meaning there is no yielding to main thread, potentially becomes blocking
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
  } else {
    let schedulerPriorityLevel
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority
        break
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority
        break
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority
        break
      default:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
    }

    // If not SyncLane, concurrent mode is used,
    // reconciliation yields to main thread time to time
    // which makes UI interactive and thus possible to cancel previous re-render
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    )
  }

  root.callbackPriority = newCallbackPriority
  root.callbackNode = newCallbackNode
}
```

```tsx
import { useRef, useState, useTransition } from 'react'
import Spinner from './Spinner'

export default function App() {
  const inputRef = useRef('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Urgent: show what was typed.
  setSearchInputValue(inputRef)

  // Debounced callback.
  startTransition(() => {
    setSearchQuery(inputRef)
  })

  return <div>{isPending && <Spinner />}</div>
}
```

Form state:

```tsx
import { useTransition } from 'react'

export default function App() {
  const sendMessage = async (formData: FormData) => {
    const message = formData.get('message')

    console.log(message)

    // Artificial delay to simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: do call (e.g. API call) to send the message
  }

  const [isPending, startTransition] = useTransition()

  const action = (formData: FormData) => {
    startTransition(async () => {
      await sendMessage(formData)
    })
  }

  return (
    <form action={action}>
      <label htmlFor="message">Message:</label>
      <input name="message" id="message" />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending ...' : 'Send'}
      </button>
    </form>
  )
}
```

## useSyncExternalStore

`props`/`context`/`useState`/`useReducer`
are internal states not affected by concurrent features.

External stores affected by concurrent features including:

- Global variables: `document.body`.
- Browser APIs: `matchMedia`, page visibility, scroll position, `Date`.
- External stores: Redux, Zustand.
- Anything performance-sensitive or event-driven.

`useSyncExternalStore` allows external stores to support concurrent reads
by forcing updates to the store to be synchronous:

- Caching data from external APIs:
  As this hook is mostly used to subscribe external third-party data sources,
  caching that data gets simpler as well.
  You can keep your app's data in sync with the external data source
  and later can also use it for offline support.
- WebSocket connection:
  As a WebSocket is a "continuous" connection,
  you can use this hook to manage the WebSocket connection state data in real-time.
- Managing browser storage:
  In such cases where you need to sync data
  between the web browser's storage and the application's state,
  you can use `useSyncExternalStore` to subscribe to updates in the external store.

```ts
type UseSyncExternalStore = <State>(
  subscribe: (callback: Callback) => Unsubscribe,
  getSnapshot: () => State,
  getServerSnapshot?: () => State,
) => State

export function useSyncExternalStore<Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot?: () => Snapshot,
): Snapshot
```

`subscribe` method should subscribe to store changes,
and it should return function to unsubscribe from store changes.
Ensure `onStoreChange` is called whenever store changes,
will trigger re-render of component.

`getSnapshot` method would return a snapshot of data from store.
While store has not changed, repeated calls to getSnapshot must return same value.
If store changes and returned value is different (as compared by Object.is),
React re-renders component.

`getServerSnapshot` method would return **initial** snapshot of data from server.
It will be used only during server rendering
and during hydration of server-rendered content on client.
The server snapshot must be the same between client and server,
and is usually serialized and passed from server to client.

Simple shim for [`useSyncExternalStore`](https://jser.dev/2023-08-02-usesyncexternalstore):

```tsx
function useSyncExternalStore(subscribe, getSnapshot) {
  const [data, setData] = useState(() => getSnapshot())

  const update = useCallback(() => {
    setData(() => getSnapshot())
  }, [])

  useEffect(() => {
    update()
    return subscribe(update)
  }, [update])

  return data
}
```

### APIs

Sync navigator `online` API:

```ts
function subscribe(onStoreChange) {
  window.addEventListener('online', onStoreChange)
  window.addEventListener('offline', onStoreChange)
  return () => {
    window.removeEventListener('online', onStoreChange)
    window.removeEventListener('offline', onStoreChange)
  }
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  )
}

function ChatIndicator() {
  const isOnline = useOnlineStatus()
  // ...
}
```

### Event

Sync browser `scroll` event:

```tsx
// A memoized constant fn prevents unsubscribe/resubscribe
// In practice it is not a big deal
function subscribe(onStoreChange) {
  globalThis.window?.addEventListener('scroll', onStoreChange)
  return () => globalThis.window?.removeEventListener('scroll', onStoreChange)
}

function useScrollY(selector = id => id) {
  return useSyncExternalStore(
    subscribe,
    () => selector(globalThis.window?.scrollY),
    () => undefined
  )
}
```

```tsx
export default function ScrollY() {
  const scrollY = useScrollY()
  return <div>{scrollY}</div>
}
```

```tsx
export default function ScrollYFloored() {
  const to = 100
  const scrollYFloored = useScrollY(y =>
    y ? Math.floor(y / to) * to : undefined
  )
  return <div>{scrollYFloored}</div>
}
```

### Router

```tsx
function useHistorySelector(selector) {
  const history = useHistory()
  return useSyncExternalStore(history.listen, () => selector(history))
}
```

```tsx
export default function CurrentPathname() {
  const pathname = useHistorySelector(history => history.location.pathname)
  return <div>{pathname}</div>
}
```

```tsx
export default function CurrentHash() {
  const hash = useHistorySelector(history => history.location.hash)
  return <div>{hash}</div>
}
```

### External State

Simple demo from [React Conf 2021](https://www.youtube.com/watch?v=oPfSC5bQPR8):

```tsx
import { useSyncExternalStore } from 'react'

// We will also publish a backwards compatible shim
// It will prefer the native API, when available
import { useSyncExternalStore } from 'use-sync-external-store/shim'

const store = {
  state: { count: 0 },
  listeners: new Set(),
  setState: (fn) => {
    store.state = fn(store.state)
    store.listeners.forEach(listener => listener())
  },
  subscribe: (callback) => {
    store.listeners.add(callback)
    return () => store.listeners.delete(callback)
  },
  getSnapshot: () => {
    const snap = Object.freeze(store.state)
    return snap
  },
}

export default function App() {
  // Basic usage. getSnapshot must return a cached/memoized result
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot)

  // Selecting a specific field using an inline getSnapshot
  const selectedField = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().count
  )

  return (
    <div>
      {state.count}
      {selectedField}
    </div>
  )
}
```

Migrate from `useState` + `useEffect` + `useRef` to `useSyncExternalStore`
for 3rd external stores libraries (e.g. `Redux`):

```tsx
import { useCallback, useEffect, useState } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

function createStore(initialState) {
  let state = initialState
  const listeners = new Set()

  const getState = () => state
  const setState = (fn) => {
    state = fn(state)
    listeners.forEach(listener => listener())
  }
  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return {
    getState,
    setState,
    subscribe,
  }
}

// Explicitly process external store for React v17.
// Sync external store state to React internal state
// with `useState` and `store.subscribe`:
// store.setState -> updater -> setState.
function useStoreLegacy(store, selector) {
  const [state, setState] = useState(() => selector(store.getState()))

  useEffect(() => {
    const updater = () => setState(selector(store.getState()))
    const unsubscribe = store.subscribe(updater)
    updater()
    return unsubscribe
  }, [store, selector])

  return state
}

// Use `useSyncExternalStore` for React v18+.
function useStore(store, selector) {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector])
  )
}

const store = createStore({ count: 0, text: 'hello' })

function Counter() {
  const count = useStore(
    store,
    useCallback(state => state.count, [])
  )

  const handleClick = () =>
    store.setState(state => ({ ...state, count: state.count + 1 }))

  return (
    <div>
      {count}
      <button type="button" onClick={handleClick}>+1</button>
    </div>
  )
}

function TextBox() {
  const text = useStore(
    store,
    useCallback(state => state.text, [])
  )

  const handleChange = (event) => {
    store.setState(state => ({ ...state, text: event.target.value }))
  }

  return (
    <div>
      <input type="text" value={text} onChange={handleChange} />
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
      <TextBox />
      <TextBox />
    </div>
  )
}

React.createRoot(document.querySelector('#root')).render(<App />)
```
