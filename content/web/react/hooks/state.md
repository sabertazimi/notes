---
sidebar_position: 1
tags: [Web, React, Hook, State]
---

# State

- Read rendered props/state.
- Return value of `useState` is `ref` to `hooks[idx]`:
  direct change to return value doesn't change state value.
- Return function of `useState` (`setState`) is to change value of `hooks[idx]`.
- 由于 setState 更新状态 (dispatch action) 时基于 hook.BaseState,
  `setState(value + 1)` 与 `setState(value => value + 1)` 存在差异.
- 当在 useEffect 中调用 setState 时, 最好使用 `setState(callback)` 形式,
  这样可以不用再 Deps List 中显式声明 state, 也可以避免一些 BUG.
- `dispatchAction`:
  - 创建 `Update` 对象.
  - 将 Update 对象添加到 hook.queue.pending 队列.
  - 根据 reducerEagerState 与 currentState, 决定是否发起新的 Reconciler 调度.

## Dispatcher

```ts
function mountState<T>(initialState: T) {
  const hook = mountWorkInProgressHook()

  if (typeof initialState === 'function')
    initialState = initialState()

  // Setup Hook.
  hook.memoizedState = hook.baseState = initialState
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  })
  const dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ))

  // Return Hook state and dispatch action.
  return [hook.memoizedState, dispatch]
}

function updateState<T>(initialState: T) {
  const basicStateReducer = (state, action) => {
    return typeof action === 'function' ? action(state) : action
  }

  return updateReducer(basicStateReducer)
}

function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A
) {
  // 1. 创建 Update 对象.
  const eventTime = requestEventTime()
  const lane = requestUpdateLane(fiber)
  const update: Update<S, A> = {
    lane,
    action,
    eagerReducer: null,
    eagerState: null,
    next: null,
  }

  // 2. 将 Update 对象添加到 hook.queue.pending 队列.
  const pending = queue.pending
  if (pending === null) {
    // 首个 Update, 创建一个环形链表.
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  queue.pending = update

  const alternate = fiber.alternate
  if (
    fiber === currentlyRenderingFiber
    || (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    // 渲染时更新, 做好全局标记.
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate
      = true
  } else {
    if (
      fiber.lanes === NoLanes
      && (alternate === null || alternate.lanes === NoLanes)
    ) {
      const lastRenderedReducer = queue.lastRenderedReducer

      if (lastRenderedReducer !== null) {
        let prevDispatcher
        const currentState: S = queue.lastRenderedState
        const eagerState = lastRenderedReducer(currentState, action)
        update.eagerReducer = lastRenderedReducer
        update.eagerState = eagerState

        // 若在 Render 阶段, reducerEagerState === currentState,
        // 则可以无需再次计算状态, 跳过调度阶段, 后续直接使用 update.eagerState.
        if (is(eagerState, currentState))
          return
      }
    }

    // 3. 发起调度更新, 进入 Reconciler.
    scheduleUpdateOnFiber(fiber, lane, eventTime)
  }
}
```

[Queueing series of state updates](https://react.dev/learn/queueing-a-series-of-state-updates):

```ts
export function getFinalState(baseState, queue) {
  let finalState = baseState

  for (const update of queue)
    finalState = typeof update === 'function' ? update(finalState) : update

  return finalState
}
```

## useState

```ts
setState((prevState) => {
  // Object.assign would also work
  return { ...prevState, ...updatedValues }
})
```

```ts
let newState = baseState
const firstUpdate = hook.baseQueue.next
let update = firstUpdate

// setState(value + 1) 与 setState(value => value + 1) 存在差异
// 遍历 baseQueue 中的每一个 update
do {
  if (typeof update.action === 'function')
    newState = update.action(newState)
  else newState = action

  update = reconciler()
} while (update !== firstUpdate)
```

```tsx
import { useState } from 'react'

export default function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0)

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
```

```ts
import { useEffect, useState } from 'react'

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null)

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    }
  })

  if (isOnline === null)
    return 'Loading...'

  return isOnline ? 'Online' : 'Offline'
}

// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange) // Run first effect

// Update with { friend: { id: 200 } } props
// Clean up previous effect
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange)
ChatAPI.subscribeToFriendStatus(200, handleStatusChange) // Run next effect

// Update with { friend: { id: 300 } } props
// Clean up previous effect
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange)
ChatAPI.subscribeToFriendStatus(300, handleStatusChange) // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange) // Clean up last effect
```
