---
sidebar_position: 100
tags: [Web, React, Hook, Internals]
---

# Internals

- Reuse stateful logic between components
  (avoid wrapper hell in render props or HOC)
- Split one complex component into smaller functions
- Use more of React features **without classes**
- Class components will read `this.props` **too early** or **too late**,
  because of mutable `this` in React
  (however `props` argument of function components is immutable),
  that says function components capture the **rendered values**.
  more details on
  [Overreacted](https://overreacted.io/how-are-function-components-different-from-classes/).

## Types

Hooks
[definition](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js):

- 从 React 内部 (Reconciler) 看, Hooks 可分为三类:
  - State Hooks (`useState/useReducer/useContext/useRef/useCallback/useMemo`):
    主要作用于 `Reconciler.Render` 阶段, `fiber.pendingProps/memoizedProps/memoizedState/updateQueue`.
  - Effect Hooks (`useLayoutEffect`/`useEffect`):
    在 `Reconciler.Render` 阶段设置 `fiber.flags` (effects flags),
    主要作用于 `Reconciler.Commit` 阶段, 功能接近 `ClassComponent.LifeCycle`.
  - Hybrid Hooks (`useDeferredValue/useTransition/useId/useSyncExternalStore`):
    State + Effect Hooks, 既保存状态, 又产生副作用.

```ts
interface Hook {
  // hook 保存的数据.
  memoizedState: any
  // 本次更新以 baseState 为基础计算新的 state.
  baseState: any
  // 本次更新开始时已有的 update 队列.
  baseQueue: Update<any, any> | null
  // 本次更新需要增加的 update 队列.
  queue: UpdateQueue<any, any> | null
  // 指向下一个 hook.
  next: Hook | null
}

interface Update<S, A> {
  lane: Lane
  action: A
  hasEagerState: boolean
  eagerState: S | null
  next: Update<S, A>
}

interface UpdateQueue<S, A> {
  pending: Update<S, A> | null
  interleaved: Update<S, A> | null
  dispatch: ((A) => mixed) | null
  lanes: Lanes
  lastRenderedReducer: ((S, A) => S) | null
  lastRenderedState: S | null
}

interface Effect {
  tag: HookFlags
  create: () => (() => void) | void
  destroy: (() => void) | void
  deps: Array<mixed> | null
  next: Effect
}

type HookType
  = | 'useState'
    | 'useReducer'
    | 'useContext'
    | 'useRef'
    | 'useEffect'
    | 'useInsertionEffect'
    | 'useLayoutEffect'
    | 'useCallback'
    | 'useMemo'
    | 'useImperativeHandle'
    | 'useDebugValue'
    | 'useDeferredValue'
    | 'useTransition'
    | 'useMutableSource'
    | 'useSyncExternalStore'
    | 'useId'
    | 'useCacheRefresh'
```

## Memoized State

- `FunctionComponent` 内部所有 Hooks memoized state
  组成 `FunctionComponent` `Fiber` memoized state.
- `FunctionComponent` `Fiber`: `fiber.memoizedState` 指向第一个 `Hook`.

| Hooks       | Memoized State                                 |
| ----------- | ---------------------------------------------- |
| useRef      | `ref: { current }`                             |
| useMemo     | `[nextValue, deps]`                            |
| useCallback | `[callback, deps]`                             |
| useState    | `state`                                        |
| useEffect   | `effect: { tag, create, destroy, deps, next }` |

## Workflow

- `Reconciler.Render`/`Reconciler.Update`:
  `performUnitOfWork` -> `beginWork` -> `updateFunctionComponent`
  -> `renderWithHooks` -> `mountXXX`/`updateXXX`/`rerenderXXX`
  -> `reconcileChildren`.
- `Reconciler.Commit`:
  - `Update` layout effect (`useLayoutEffect`):
    - `Mutation` phase: `commitWork` -> `commitHooKEffectListUnmount` -> `effect.destroy`.
    - `Layout` phase: `commitLifeCycles` -> `commitHookEffectListMount` -> `effect.create`.
  - `Update | Passive` passive effect (`useEffect`):
    - `Layout` phase: `commitLifeCycles` -> `schedulePassiveEffects`, 收集 Effects.
    - `scheduleCallback` -> `flushPassiveEffects` -> `effect.destroy` -> `effect.create`.
  - 只有 `effect.tag` 包含 `HasEffect` 时才会调用 `effect.destroy` 和 `effect.create`.
- `renderWithHooks`:
  - `HooksDispatcherOnMount`: `mountXXX`.
  - `HooksDispatcherOnUpdate`: `updateXXX`.
  - `HooksDispatcherOnRerender`: `updateXXX`/`rerenderXXX`.
- **`mountXXX`**: `mountWorkInProgressHook` -> respective mount logic.
- **`updateXXX`**: `updateWorkInProgressHook` -> respective update logic.

[ReactReconciler/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):

```ts
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const updateLanes = workInProgress.lanes

  switch (workInProgress.tag) {
    case FunctionComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps
        = workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps)
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      )
    }
  }
}

function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderLanes
) {
  const context = prepareToReadContext(workInProgress, renderLanes)

  // 进入 Hooks 相关逻辑, 最后返回下级 ReactElement 对象.
  const nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps,
    context,
    renderLanes
  )

  const hasId = checkDidRenderIdHook()

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes)
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
  }

  if (getIsHydrating() && hasId)
    pushMaterializedTreeId(workInProgress)

  // React DevTools reads this flag.
  workInProgress.flags |= PerformedWork

  // 进入 Reconcile 函数, 生成下级 Fiber 节点.
  reconcileChildren(current, workInProgress, nextChildren, renderLanes)
  // 返回下级 Fiber 节点.
  return workInProgress.child
}
```

[ReactReconciler/ReactFiberHooks](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js):

```ts
// 渲染优先级.
let renderLanes: Lanes = NoLanes

// 当前正在构造的 Fiber, 等同于 workInProgress.
let currentlyRenderingFiber: Fiber = null

// Hooks 链表被存储在 fiber.memoizedState:
// currentHook = fiber(current).memoizedState.
let currentHook: Hook | null = null
// workInProgressHook = fiber(workInProgress).memoizedState.
let workInProgressHook: Hook | null = null

// 在 FunctionComponent 的执行过程中, 是否再次发起了更新.
// 只有 FunctionComponent 被完全执行之后才会重置.
// 当 render 异常时, 通过该变量可以决定是否清除 render 过程中的更新.
let didScheduleRenderPhaseUpdate = false

// 在本次 FunctionComponent 的执行过程中, 是否再次发起了更新.
// 每一次调用 FunctionComponent 都会被重置.
let didScheduleRenderPhaseUpdateDuringThisPass = false

// 在本次 FunctionComponent 的执行过程中, 重新发起更新的最大次数.
const RE_RENDER_LIMIT = 25

export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes
): any {
  // Store context.
  renderLanes = nextRenderLanes
  currentlyRenderingFiber = workInProgress

  workInProgress.memoizedState = null
  workInProgress.updateQueue = null
  workInProgress.lanes = NoLanes

  // Mount or Update hooks dispatcher.
  ReactCurrentDispatcher.current
    = current === null || current.memoizedState === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate

  // 执行 FunctionComponent 函数, 执行 `useXXX`.
  let children = Component(props, secondArg)

  // Check if there was a render phase update
  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    // Keep rendering in a loop for as long as render phase updates continue.
    // Use a counter to prevent infinite loops.
    let numberOfReRenders = 0

    do {
      didScheduleRenderPhaseUpdateDuringThisPass = false
      localIdCounter = 0

      if (numberOfReRenders >= RE_RENDER_LIMIT) {
        throw new Error(
          'Too many re-renders. React limits the number of renders to prevent '
          + 'an infinite loop.'
        )
      }

      numberOfReRenders += 1

      // Start over from the beginning of the list
      currentHook = null
      workInProgressHook = null
      workInProgress.updateQueue = null
      // Rerender hooks dispatcher.
      ReactCurrentDispatcher.current = HooksDispatcherOnRerender

      children = Component(props, secondArg)
    } while (didScheduleRenderPhaseUpdateDuringThisPass)
  }

  // Restore context.
  ReactCurrentDispatcher.current = ContextOnlyDispatcher
  renderLanes = NoLanes
  currentlyRenderingFiber = null
  currentHook = null
  workInProgressHook = null
  didScheduleRenderPhaseUpdate = false

  return children
}

const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useInsertionEffect: mountInsertionEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useMutableSource: mountMutableSource,
  useSyncExternalStore: mountSyncExternalStore,
  useId: mountId,
  unstable_isNewReconciler: enableNewReconciler,
  readContext,
}

const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  unstable_isNewReconciler: enableNewReconciler,
  readContext,
}

const HooksDispatcherOnRerender: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: rerenderState,
  useDebugValue: updateDebugValue,
  useDeferredValue: rerenderDeferredValue,
  useTransition: rerenderTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  unstable_isNewReconciler: enableNewReconciler,
  readContext,
}

// 创建 Hook, 挂载到 Hooks 链表.
function mountWorkInProgressHook(): Hook {
  // hook 实例
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: hookForB,
  }

  if (workInProgressHook === null) {
    // Fist hook in the list.
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    // Append to the end of list.
    workInProgressHook = workInProgressHook.next = hook
  }

  return workInProgressHook
}

// 移动 Hooks 链表指针, 获取 workInProgressHook.
function updateWorkInProgressHook(): Hook {
  let nextCurrentHook: Hook | null
  let nextWorkInProgressHook: Hook | null

  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate
    nextCurrentHook = current ? current.memoizedState : null
  } else {
    nextCurrentHook = currentHook.next
  }

  if (workInProgressHook === null)
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState
  else nextWorkInProgressHook = workInProgressHook.next

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook
    nextWorkInProgressHook = workInProgressHook.next
    currentHook = nextCurrentHook
  } else {
    // Clone from the current hook.
    if (nextCurrentHook === null)
      throw new Error('Rendered more hooks than during the previous render.')

    currentHook = nextCurrentHook

    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,

      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,

      next: null,
    }

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook
    }
  }

  return workInProgressHook
}

function commitHookEffectListMount(tag: number, finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null
    = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null

  if (lastEffect !== null) {
    const firstEffect = lastEffect.next
    let effect = firstEffect

    do {
      if ((effect.tag & tag) === tag) {
        const create = effect.create
        effect.destroy = create()
      }

      effect = effect.next
    } while (effect !== firstEffect)
  }
}

function commitHookEffectListUnmount(tag: number, finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null
    = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null

  if (lastEffect !== null) {
    const firstEffect = lastEffect.next
    let effect = firstEffect

    do {
      if ((effect.tag & tag) === tag) {
        // 根据传入的 tag 过滤 Effects 链表.
        const destroy = effect.destroy
        effect.destroy = undefined

        if (destroy !== undefined)
          destroy()
      }

      effect = effect.next
    } while (effect !== firstEffect)
  }
}
```

## Hook

```ts
const MyReact = (function () {
  const hooks = []
  let currentHook = 0 // array of hooks, and an iterator!
  return {
    render(Component) {
      const Comp = Component() // run effects
      Comp.render()
      currentHook = 0 // reset for next render
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // type: array | undefined
      const hasChangedDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }
      currentHook++ // done with this hook
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any
      const setStateHookIndex = currentHook // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    },
  }
})()
```

```ts
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  const [text, setText] = MyReact.useState('foo') // 2nd state hook!
  MyReact.useEffect(() => {
    console.log('effect', count, text)
  }, [count, text])
  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    noop: () => setCount(count),
    render: () => console.log('render', { count, text }),
  }
}

let App

App = MyReact.render(Counter)
// effect 0 foo
// render {count: 0, text: 'foo'}

App.click()
App = MyReact.render(Counter)
// effect 1 foo
// render {count: 1, text: 'foo'}

App.type('bar')
App = MyReact.render(Counter)
// effect 1 bar
// render {count: 1, text: 'bar'}

App.noop()
App = MyReact.render(Counter)
// // no effect run
// render {count: 1, text: 'bar'}

App.click()
App = MyReact.render(Counter)
// effect 2 bar
// render {count: 2, text: 'bar'}
```

```ts
function Component() {
  const [text, setText] = useSplitURL('www.netlify.com')
  return {
    type: txt => setText(txt),
    render: () => console.log({ text }),
  }
}

function useSplitURL(str) {
  const [text, setText] = MyReact.useState(str)
  const masked = text.split('.')
  return [masked, setText]
}

let App

App = MyReact.render(Component)
// { text: [ 'www', 'netlify', 'com' ] }

App.type('www.reactjs.org')
App = MyReact.render(Component)
// { text: [ 'www', 'reactjs', 'org' ] }}
```
