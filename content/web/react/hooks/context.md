---
sidebar_position: 6
tags: [Web, React, Hook, Context]
---

# Context

- Create custom `XXXContextProvider`:
  一般都不会裸露地使用 Context.Provider, 而是封装为独立的 Provider 组件,
  将子组件作为 props.children 传入, 这样当 Context 变化时 Provider 不会重新渲染它的子组件,
  由依赖了 context 的子组件自己进行重渲染, 未依赖的子组件不会重新渲染.
  **使用 `useMemo` 使得 value 不会导致不必要的重复渲染 (Re-rendering)**.
- Create custom `useXXXContext` hook:
- Check whether component under `XXXContextProvider`.
- Wrap complex context logic and only expose simple API (Facade design pattern).
- Use `useMemo`/`useCallback` to **memorize values and functions**.
- Context 中只定义被大多数组件所共用的属性,
  use context to avoid **Prop Drilling**.

## Dispatcher

- `HooksDispatcherOnMount.useContext = readContext`.
- `HooksDispatcherOnUpdate.useContext = readContext`.
- `HooksDispatcherOnRerender.useContext = readContext`.

```ts
export function createContext<T>(
  defaultValue: T,
  calculateChangedBits: ?((a: T, b: T) => number)
): ReactContext<T> {
  if (calculateChangedBits === undefined)
    calculateChangedBits = null

  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null,
    Consumer: null,
  }
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  }
  context.Consumer = context
  return context
}

function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const updateLanes = workInProgress.lanes
  workInProgress.lanes = NoLanes

  switch (workInProgress.tag) {
    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes)
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes)
  }
}

function updateContextProvider(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
) {
  const providerType: ReactProviderType<any> = workInProgress.type
  const context: ReactContext<any> = providerType._context

  const newProps = workInProgress.pendingProps
  const oldProps = workInProgress.memoizedProps
  const newValue = newProps.value // <Provider value={}>{children}</Provider>

  // 更新 ContextProvider._currentValue:
  // workInProgress.type._context._currentValue = newValue;
  pushProvider(workInProgress, newValue)

  if (oldProps !== null) {
    // 更新阶段.
    // 对比 newValue 和 oldValue
    const oldValue = oldProps.value
    const changedBits = calculateChangedBits(context, newValue, oldValue)

    if (changedBits === 0) {
      // value 没有变动, 进入 Bailout 逻辑.
      if (
        oldProps.children === newProps.children
        && !hasLegacyContextChanged()
      ) {
        return bailoutOnAlreadyFinishedWork(
          current,
          workInProgress,
          renderLanes
        )
      }
    } else {
      // value变动, 查找对应的 Consumers, 并使其能够被更新.
      // 向下遍历:
      // 从 ContextProvider 节点开始,
      // 向下查找所有 fiber.dependencies 依赖该 context 的节点.
      // 向上遍历:
      // 从 ContextConsumer 节点开始,
      // 向上遍历, 修改父路径上所有节点的 fiber.childLanes 属性, 表明其子节点有改动, 子节点会进入更新逻辑.
      propagateContextChange(workInProgress, context, changedBits, renderLanes)
    }
  }

  // 生成下级 Fiber.
  const newChildren = newProps.children
  reconcileChildren(current, workInProgress, newChildren, renderLanes)
  return workInProgress.child
}

function updateContextConsumer(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
) {
  const context: ReactContext<any> = workInProgress.type
  const newProps = workInProgress.pendingProps
  const render = newProps.children

  // 读取 context.
  prepareToReadContext(workInProgress, renderLanes)
  const newValue = readContext(context, newProps.unstable_observedBits)

  // 生成下级 Fiber.
  const newChildren = render(newValue)
  reconcileChildren(current, workInProgress, newChildren, renderLanes)
  return workInProgress.child
}

function prepareToReadContext(workInProgress: Fiber, renderLanes: Lanes): void {
  // Setup.
  currentlyRenderingFiber = workInProgress
  lastContextDependency = null
  lastContextWithAllBitsObserved = null
  const dependencies = workInProgress.dependencies

  if (dependencies !== null) {
    const firstContext = dependencies.firstContext

    if (firstContext !== null) {
      if (includesSomeLane(dependencies.lanes, renderLanes)) {
        // Context list has a pending update.
        // Mark that this fiber performed work.
        markWorkInProgressReceivedUpdate()
      }

      // Reset the work-in-progress list
      dependencies.firstContext = null
    }
  }
}

function readContext<T>(
  context: ReactContext<T>,
  observedBits: void | number | boolean
): T {
  const contextItem = {
    context: context as ReactContext<mixed>,
    observedBits: resolvedObservedBits,
    next: null,
  }

  // 1. 构造一个 contextItem, 加入到 workInProgress.dependencies 链表.
  if (lastContextDependency === null) {
    lastContextDependency = contextItem
    currentlyRenderingFiber.dependencies = {
      lanes: NoLanes,
      firstContext: contextItem,
      responders: null,
    }
  } else {
    lastContextDependency = lastContextDependency.next = contextItem
  }

  // 2. 返回 currentValue.
  return isPrimaryRenderer ? context._currentValue : context._currentValue2
}
```

## useContext

```tsx
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
} from 'react'

const CountContext = createContext(null)

function useCountProvider() {
  const [count, setCount] = useState(0)

  // Use `useMemo`/`useCallback` to memorize values and functions.
  const value = useMemo(() => {
    return {
      count,
      setCount,
    }
  }, [count, setCount])

  return value
}

export default function CountProvider({ children, ...props }) {
  const value = useCountProvider()
  return <CountContext value={value} {...props}>{children}</CountContext>
}

function useCount() {
  const context = use(CountContext)

  // Check whether component under `XXXContextProvider`.
  if (!context) {
    throw new Error('useCount must be used within a CountProvider')
  }

  // Wrap complex context logic, only expose simple API.
  const { count, setCount } = context
  const increment = useCallback(() => setCount(c => c + 1), [setCount])

  return {
    count,
    increment,
  }
}
```
