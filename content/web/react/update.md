---
sidebar_position: 35
tags: [Web, React, Internals, Reconciler]
---

# Update

[Update and Update Queue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactUpdateQueue.js):

- `UpdateQueue` 是一个**循环队列**.
- 创建 `Update` 时机 (`createUpdate`/`enqueueUpdate`):
  - `ReactFiberReconciler.updateContainer`.
  - `ReactFiberClassComponent.setState`.
  - `ReactFiberHooks.dispatchAction`.
- `Reconciler.Render` 阶段, 调用 `XXXClassInstance`/`useXXX`,
  遍历处理 Update Queue (`processUpdateQueue`/`HooksDispatcherOnUpdate`), 计算出 memoizedState,
  利用 pendingProps 与 memoizedState 产生新的 ReactElement (`ClassComponent.render()`/`FunctionComponent()`).

```ts
interface Update<State> {
  lane: Lane
  tag: 'UpdateState' | 'ReplaceState' | 'ForceUpdate' | 'CaptureUpdate'
  payload: any
  callback: (() => mixed) | null
  next: Update<State> | null
  _eventTime: number
}

interface SharedQueue<State> {
  pending: Update<State> | null
}

interface UpdateQueue<State> {
  baseState: State
  firstBaseUpdate: Update<State> | null
  lastBaseUpdate: Update<State> | null
  shared: SharedQueue<State>
  effects: Array<Update<State>> | null // Updates with `callback`.
}
```

[ReactFiberClassComponent.setState](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberClassComponent.js):

```ts
const classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {
    // 1. 获取 ClassComponent 实例对应的 Fiber 节点.
    const fiber = getInstance(inst)
    // 2. 创建 Update 对象.
    const eventTime = requestEventTime()
    const lane = requestUpdateLane(fiber)
    const update = createUpdate(eventTime, lane)
    update.payload = payload

    if (callback !== undefined && callback !== null)
      update.callback = callback

    // 3. 将 Update 对象添加到当前 Fiber 节点的 updateQueue.
    enqueueUpdate(fiber, update)
    // 4. 请求调度, 进入 Reconciler.
    scheduleUpdateOnFiber(fiber, lane, eventTime)
  },
}
```

[ReactFiberHooks.dispatchAction](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js):

```ts
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

  // 2. 将 Update 对象添加到当前 Hook 对象的 updateQueue.
  const pending = queue.pending

  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }

  queue.pending = update

  // 3. 请求调度, 进入 Reconciler.
  scheduleUpdateOnFiber(fiber, lane, eventTime)
}
```

- createUpdate.
- enqueueUpdate.
- scheduleUpdateOnFiber.
- **markUpdateLaneFromFiberToRoot**:
  找出 Fiber 树中受到本次 `Update` 影响的所有节点 (存在更新可能),
  设置这些节点的 `fiber.lanes` 或 `fiber.childLanes`.
- ensureRootIsScheduled.
- flushSyncCallbacks.
- performSyncWorkOnRoot / performConcurrentWorkOnRoot.
- renderRootSync / renderRootConcurrent.
- workLoopSync / workLoopConcurrent.
- **performUnitOfWork(workInProgress)**.
- **beginWork**:
  - 若判断当前 Fiber 节点无需更新 (`lanes: 0, childLanes: ?`), 调用 `bailoutOnAlreadyFinishedWork` 循环检测子节点是否需要更新:
    - `instance.shouldComponentUpdate() === false`,
      `workInProgress.pendingProps === current.memoizedProps`,
      `hasLegacyContextChange() === false`,
      `checkIfContextChanged(fiber.dependencies) === false`,
      `includesSomeLane(fiber.lanes, renderLanes) === false`.
    - When it comes to `lanes: 0, childLanes: 0`, skip it and its children (**bailout**).
    - When it comes to `lanes: 0, childLanes: 1`, continue to check its children.
  - 若判断当前 Fiber 节点需要更新 (`lanes: 1`), 调用 `updateXXXComponent` 进行更新.
- **bailoutOnAlreadyFinishedWork**:
  - 若 `includesSomeLane(renderLanes, workInProgress.childLanes) === false`
    表明子节点无需更新, 可直接进入回溯阶段 (`completeUnitOfWork`).
  - 若 `includesSomeLane(renderLanes, workInProgress.childLanes) === true`,
    表明子节点需要更新, clone 并返回子节点.
- **updateHostRoot/updateXXXComponent**.
- `ReactClassComponent.render()` / `ReactFunctionComponent()` / `ReactDOMComponent.createElement()`:
  遍历处理 Update Queue (`processUpdateQueue`/`HooksDispatcherOnUpdate`), 计算出 memoizedState,
  利用 pendingProps 与 memoizedState 产生新的 ReactElement.
- **reconcileChildren**:
  - 通过 ReactElement 与 OldFiber, 产生或复用 ChildFiber.
  - 设置 `fiber.flags`, 标记副作用: `Placement`/`Deletion`/etc.
  - 对于 `Deletion` Fiber, 在 `beginWork` 阶段提前将其添加到父节点的 Effects 队列中
    (该节点会脱离 Fiber 树, 不会再进入 `completeWork` 阶段, 无法在此阶段收集此节点副作用).
- reconcileChildFibers.
- **completeUnitOfWork**: 收集副作用.
- **completeWork**: 收集副作用.

```ts
// 标记所有可能存在更新的节点, 并设置 fiber.lanes 与 fiber.childLanes.
function markUpdateLaneFromFiberToRoot(
  sourceFiber: Fiber, // 被更新的节点.
  lane: Lane
): FiberRoot | null {
  // 设置 sourceFiber.lanes.
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane)
  let alternate = sourceFiber.alternate

  if (alternate !== null) {
    // 同时设置 sourceFiber.alternate.lanes.
    alternate.lanes = mergeLanes(alternate.lanes, lane)
  }

  // 从 sourceFiber 开始, 向上遍历所有 Fiber, 直到 HostRootFiber.
  // 设置沿途所有 fiber.childLanes 与 fiber.alternate.childLanes.
  let node = sourceFiber
  let parent = sourceFiber.return

  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane)
    alternate = parent.alternate

    if (alternate !== null)
      alternate.childLanes = mergeLanes(alternate.childLanes, lane)

    node = parent
    parent = parent.return
  }

  if (node.tag === HostRoot) {
    const root: FiberRoot = node.stateNode
    return root
  } else {
    return null
  }
}

function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const updateLanes = workInProgress.lanes

  if (current !== null) {
    // 进入对比.
    const oldProps = current.memoizedProps
    const newProps = workInProgress.pendingProps
    if (
      oldProps !== newProps
      || hasLegacyContextChanged()
      || (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      // 当前渲染优先级 renderLanes 不包括 fiber.lanes, 表明当前 Fiber 节点无需更新.
      didReceiveUpdate = false
      // 调用 bailoutOnAlreadyFinishedWork 循环检测子节点是否需要更新.
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
    }
  }

  // 当前节点需要更新.
  workInProgress.lanes = NoLanes // 最高优先级

  switch (workInProgress.tag) {
    case ClassComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps
        = workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps)
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      )
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes)
    case HostText:
      return updateHostText(current, workInProgress)
    case Fragment:
      return updateFragment(current, workInProgress, renderLanes)
  }
}

function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // 渲染优先级不包括 workInProgress.childLanes, 表明子节点也无需更新.
    // 返回 null, 直接进入回溯阶段.
    return null
  } else {
    // Fiber 自身无需更新, 但子节点需要更新, clone 并返回子节点.
    cloneChildFibers(current, workInProgress)
    return workInProgress.child
  }
}

function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const newProps = workInProgress.pendingProps

  switch (workInProgress.tag) {
    case HostComponent: {
      // 非文本节点.
      popHostContext(workInProgress)
      const rootContainerInstance = getRootHostContainer()
      const type = workInProgress.type

      if (current !== null && workInProgress.stateNode !== null) {
        // 处理改动.
        updateHostComponent(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance
        )

        if (current.ref !== workInProgress.ref)
          markRef(workInProgress)
      }

      return null
    }
    case HostText: {
      // 文本节点.
      const newText = newProps

      if (current !== null && workInProgress.stateNode !== null) {
        const oldText = current.memoizedProps
        // 处理改动.
        updateHostText(current, workInProgress, oldText, newText)
      }

      return null
    }
  }
}

function updateHostComponent(
  current: Fiber,
  workInProgress: Fiber,
  type: Type,
  newProps: Props,
  rootContainerInstance: Container
) {
  const oldProps = current.memoizedProps

  if (oldProps === newProps)
    return

  const instance: Instance = workInProgress.stateNode
  const currentHostContext = getHostContext()
  const updatePayload = prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
  )
  workInProgress.updateQueue = updatePayload

  // 如果有属性变动, 设置 fiber.flags |= Update, 等待 Commit 阶段处理.
  if (updatePayload)
    markUpdate(workInProgress)
}

function updateHostText(
  current: Fiber,
  workInProgress: Fiber,
  oldText: string,
  newText: string
) {
  // 如果有属性变动, 设置 fiber.flags |= Update, 等待 Commit 阶段处理.
  if (oldText !== newText)
    markUpdate(workInProgress)
}
```
