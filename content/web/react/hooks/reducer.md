---
sidebar_position: 2
tags: [Web, React, Hook, Reducer]
---

# Reducer

- Use useState whenever manage a JS **primitive** (e.g. string, boolean, integer).
- Use useReducer whenever manage an **object** or **array**.
- It’s best to put states together in one state object
  when they conditionally dependent on each other (useReducer).
- Using useReducer over useState gives us predictable state transitions.
  It comes in very powerful when state changes become more complex.

## Dispatcher

```ts
function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: (I) => S
): [S, Dispatch<A>] {
  // 1. Create Hook.
  const hook = mountWorkInProgressHook()
  let initialState

  if (init !== undefined)
    initialState = init(initialArg)
  else initialState = initialArg

  // 2. Setup Hook.
  // 2.1 Set hook.memoizedState/hook.baseState.
  hook.memoizedState = hook.baseState = initialState
  // 2.2 Set hook.queue.
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState,
  })
  // 2.3 Set hook.dispatch.
  const dispatch: Dispatch<A> = (queue.dispatch = dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ))

  // 3. Return Hook state and dispatch action.
  return [hook.memoizedState, dispatch]
}

function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: (I) => S
): [S, Dispatch<A>] {
  // Get workInProgressHook.
  const hook = updateWorkInProgressHook()
  const queue = hook.queue
  queue.lastRenderedReducer = reducer
  const current: Hook = currentHook

  // The last rebase update that is NOT part of the base state.
  let baseQueue = current.baseQueue
  // The last pending update that hasn't been processed yet.
  const pendingQueue = queue.pending

  // Append hook.queue.pending to current.baseQueue.
  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      const baseFirst = baseQueue.next
      const pendingFirst = pendingQueue.next
      baseQueue.next = pendingFirst
      pendingQueue.next = baseFirst
    }

    current.baseQueue = baseQueue = pendingQueue
    queue.pending = null
  }

  // Calculate Hook state.
  if (baseQueue !== null) {
    // We have a queue to process.
    const first = baseQueue.next
    let newState = current.baseState

    let newBaseState = null
    let newBaseQueueFirst = null
    let newBaseQueueLast = null
    let update = first

    do {
      const updateLane = update.lane

      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // 优先级不够: 加入到 baseQueue, 等待下一次 render.
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: null,
        }

        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone
          newBaseState = newState
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone
        }

        // Update the remaining priority in the queue.
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane
        )
        markSkippedUpdateLanes(updateLane)
      } else {
        // This update does have sufficient priority (优先级足够).
        // Merge state.
        if (newBaseQueueLast !== null) {
          // Update baseQueue
          const clone: Update<S, A> = {
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null,
          }
          newBaseQueueLast = newBaseQueueLast.next = clone
        }

        // Process this update.
        if (update.hasEagerState) {
          // 性能优化:
          // If this update is a state update (not a reducer) and was processed eagerly,
          // we can use the eagerly computed state
          newState = update.eagerState
        } else {
          // 调用 Reducer 获取最新状态.
          const action = update.action
          newState = reducer(newState, action)
        }
      }

      update = update.next
    } while (update !== null && update !== first)

    if (newBaseQueueLast === null)
      newBaseState = newState
    else newBaseQueueLast.next = newBaseQueueFirst

    // Mark that the fiber performed work,
    // but only if the new state is different from the current state.
    if (!is(newState, hook.memoizedState))
      markWorkInProgressReceivedUpdate()

    // 把计算后结果更新到 workInProgressHook.
    hook.memoizedState = newState
    hook.baseState = newBaseState
    hook.baseQueue = newBaseQueueLast
    queue.lastRenderedState = newState
  }

  // Return Hook state and dispatch action.
  const dispatch: Dispatch<A> = queue.dispatch
  return [hook.memoizedState, dispatch]
}
```

## useReducer

Use `useState` if:

- manage JavaScript primitives as state
- have simple state transitions
- want to have business logic within components
- have different properties that don’t change in any correlated manner
  and can be managed by multiple useState hooks
- state is co-located to your component
- for a small application

Use `useReducer` if:

- manage JavaScript objects or arrays as state
- have complex state transitions
- want to move business logic into reducers
- have different properties that are tied together
  and should be managed in one state object
- update state deep down in your component tree
- for a medium size application
- for easier testing
- for more predictable and maintainable state architecture

```ts
function App() {
  const [state, setState] = useState({ count: 0 })

  // 等价于
  const [state, setState] = useReducer(
    (state, action) => {
      return typeof action === 'function' ? action(state) : action
    },
    { count: 0 }
  )

  // 当需要更新 state 时, 有 2 种方式:
  const dispatch = typeof setState === 'function' ? setState : () => {}
  // 1. 直接设置:
  dispatch({ count: 1 })
  // 2.通过回调函数设置:
  dispatch(state => ({ count: state.count + 1 }))
}
```

```tsx
function insertToHistory(state) {
  if (state && Array.isArray(state.history)) {
    // Do not mutate
    const newHistory = [...state.history]
    newHistory.push(state)
    return newHistory
  }
  console.warn(`
    WARNING! The state was attempting capture but something went wrong.
    Please check if the state is controlled correctly.
  `)
  return state.history || []
}

function reducer(state, action) {
  switch (action.type) {
    case 'set-theme':
      return { ...state, theme: action.theme, history: insertToHistory(state) }
    case 'add-friend':
      return {
        ...state,
        friends: [...state.friends, action.friend],
        history: insertToHistory(state),
      }
    case 'undo': {
      const isEmpty = !state.history.length
      if (isEmpty)
        return state
      return { ...state.history[state.history.length - 1] }
    }
    case 'reset':
      return { ...initialState, history: insertToHistory(state) }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <div>App</div>
}
```
