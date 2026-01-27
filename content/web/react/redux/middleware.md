---
sidebar_position: 3
tags: [Web, React, Redux, State Management]
---

# Middleware

Redux middleware were designed to enable writing side effects logic:

- I/O: logging, saving files.
- AJAX HTTP request.
- Async timer.
- Modifying state outside of `reducer` function.
- Mutating arguments to `dispatch` function.
- Generating random numbers or unique random IDs
  (e.g. `uuid()`/`Math.random()`/`Date.now()`).

## Concepts

每一个 Middleware 可以通过上下文获取:

- original `store`:
  - original `store.dispatch`.
  - get state by `store.getState`.
  - 通过 `dispatch` 对象直接发布 `action` 对象.
- `next` 方法: 前一个 Middleware 返回的 `dispatch` 方法.
  当前 Middleware 可以根据自己对 action 的判断和处理结果,
  决定是否调用 `next` 方法 (是否跳过其他 Middleware 的 `dispatch`),
  以及传入什么样的参数.

从而实现如下功能:

- Execute extra logic when any action is dispatched.
- Pause, modify, delay, replace, or halt dispatched actions.
- Write extra code that has access to `dispatch` and `getState`.
- Teach `dispatch` how to accept other values besides plain action objects,
  such as **functions** (`action(dispatch, getState, extraArgument)`) and promises,
  by intercepting them and dispatching real action objects instead.

## Types

```ts
export interface Middleware<
  DispatchExt = object,
  S = any,
  D extends Dispatch = Dispatch, // type of the dispatch method
> {
  ext: DispatchExt
}
```

```ts
import type { Middleware } from 'redux'
import type { RootState } from '../store'

export const exampleMiddleware: Middleware<
  object, // Most middleware do not modify the dispatch return value
  RootState
> = store => next => (action) => {
  const state = store.getState() // correctly typed as RootState
}
```

## Scheduler

```ts
/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the interval in this case.
 */
function timeoutScheduler(store) {
  return next => (action) => {
    if (!action.meta || !action.meta.delay)
      return next(action)

    const intervalId = setTimeout(() => next(action), action.meta.delay)

    return function cancel() {
      clearInterval(intervalId)
    }
  }
}
```

## Thunk

```ts
// thunk middleware
function thunk(store) {
  return next => action =>
    typeof action === 'function'
      ? action(store.dispatch, store.getState)
      : next(action)
}

const createStoreWithMiddleware = applyMiddleware(
  logger,
  thunk,
  timeoutScheduler
)(createStore)
const store = createStoreWithMiddleware(combineReducers(reducers))

function addFave(tweetId) {
  return (dispatch, getState) => {
    if (getState.tweets[tweetId] && getState.tweets[tweetId].liked)
      return

    dispatch({ type: IS_LOADING })
    // Yay, that could be sync or async dispatching
    remote.addFave(tweetId).then(
      (res) => {
        dispatch({ type: ADD_FAVE_SUCCEED })
      },
      (err) => {
        dispatch({ type: ADD_FAVE_FAILED, err })
      }
    )
  }
}

store.dispatch(addFave())
```

## Internals

- Raw Middleware: `store => next => action => T`.
- `middleware(store)`: `next => action => T`.
- `middleware(store)(next)`: `action => T`.
- `next`: `action => T`.
- `dispatch`: `action => T`.
- `middleware(store)(next)`, `next` and `dispatch` have same function signature:
  `type Dispatch = (action: Action | AsyncAction) => any`.
- After `middlewares.forEach`, set `next` to `store.dispatch`,
  make new `dispatch` get all functions from `middlewares`.

```ts
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  let next = store.dispatch
  // Reduce middlewares with reverse order in Redux.
  middlewares.forEach(middleware => (next = middleware(store)(next)))

  // When user app execute `dispatch` function,
  // middlewares execute with forward order.
  return Object.assign({}, store, { dispatch: next })
}
```

```ts
import { applyMiddleware, combineReducers, createStore } from 'redux'

// applyMiddleware takes createStore() and returns
// a function with a compatible API.
const createStoreWithMiddleware = applyMiddleware(
  logger,
  crashReporter
)(createStore)

// Use it like you would use createStore()let todoApp = combineReducers(reducers);
const store = createStoreWithMiddleware(todoApp)
```
