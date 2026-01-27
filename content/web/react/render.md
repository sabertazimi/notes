---
sidebar_position: 34
tags: [Web, React, Internals, Reconciler]
---

# Render

Reconciler construct Fiber tree:

- scheduleUpdateOnFiber:
  - 首次 render 直接调用 `performWorkOnRoot`.
  - 再次 render 需要调用 `ensureRootIsScheduled`.
- ensureRootIsScheduled.
- flushSyncCallbacks.
- performSyncWorkOnRoot / performConcurrentWorkOnRoot:
  - `performConcurrentWorkOnRoot` 支持可中断渲染:
    - 此函数首先检查是否处于 render 过程中,
      是否需要恢复上一次渲染.
    - 如果本次渲染被中断,
      此函数最后返回一个新的 `performConcurrentWorkOnRoot` 函数,
      等待下一次 Scheduler 调度.
- renderRootSync / renderRootConcurrent:
  - 此函数会调用 `prepareFreshStack`, 重置 FiberRoot 上的全局属性, 重置 Fiber work loop 全局变量.
  - 此函数会设置 `workInProgressRoot = FiberRoot`, 表示正在进行 render.
  - 此函数退出前, 会重置 `workInProgressRoot = null`, 表示没有正在进行中的 render.
  - 此函数退出前, 会挂载 `FiberRoot.finishedWork = workInProgressHostRootFiber`.
    此时 `HostRootFiber` 上挂载了副作用队列, 层级越深子节点副作用越靠前.
- workLoopSync / workLoopConcurrent:
  循环调用 `performUnitOfWork`,
  直到 `workInProgress === null` 或用完当前时间分片.
- **performUnitOfWork(workInProgress)**:
  - 存在子节点， `beginWork` 与 `completeUnitOfWork` 不在同一次循环里调用:
    执行完 `beginWork` 后,
    优先向下遍历, 执行子节点的 `beginWork` 与 `completeUnitOfWork`,
    在 N 次循环后再向上回溯.
  - 不存在子节点， `beginWork` 与 `completeUnitOfWork` 在同一次循环里调用.
  - 若 `beginWork` 返回 `next` 节点,
    则设置 `workInProgress = next` 进行 DFS 遍历,
    再次调用此函数.
  - 若 `beginWork` 返回 `null` 节点,
    则调用 `completeUnitOfWork` 函数完成节点处理.
  - 若存在兄弟节点,
    `completeUnitOfWork` 会设置 `workInProgress = siblingFiber` 进行 DFS 遍历,
    再次调用此函数.
  - 若到达子叶节点,
    `completeUnitOfWork` 会设置 `workInProgress = returnFiber` 进行 DFS 回溯,
    再次调用此函数.
- **beginWork**:
  - 根据 `ReactElement` 对象创建所有的 Fiber 节点, 最终构造出 Fiber 树形结构
    (设置 `return` 和 `sibling` 指针).
  - 调用 `updateXXX`, 设置 `fiber.flags`/`fiber.stateNode` 等状态.
  - 非子叶节点返回子节点, 进行 DFS 遍历; 子叶节点返回 `null`, 直接进入 `completeUnitOfWork` 阶段.
- **updateHostRoot/updateXXXComponent**:
  - 根据 `fiber.pendingProps`/`fiber.updateQueue` 等输入数据状态,
    计算 `fiber.memoizedState` 作为输出状态.
  - ClassComponent:
    - 构建 `React.Component` 实例.
    - 把新实例挂载到 `fiber.stateNode` 上.
    - 执行 `render` 之前的生命周期函数.
    - 执行 `render` 方法, 获取下级 `ReactElement`.
    - 设置 `fiber.flags`, 标记副作用.
  - FunctionComponent:
    - 执行 `renderWithHooks()` -> `FunctionComponent()`, 获取下级 `ReactElement`.
    - 设置 `fiber.flags`, 标记副作用.
  - HostComponent.
    - `pendingProps.children` 作为下级 `ReactElement`.
    - 如果下级节点是文本节点, 则设置下级节点为 `null` (进入 `completeUnitOfWork` 阶段).
    - 设置 `fiber.flags`, 标记副作用.
  - 根据实际情况, 设置 `fiber.flags`, 标记副作用.
  - 根据获取的下级 `ReactElement` 对象, 调用 `reconcileChildren` 生成 `Fiber` 子节点 (只生成次级子节点).
- `ReactDOMComponent.createElement()` / `ReactClassComponent.render()` / `ReactFunctionComponent()`.
- **reconcileChildren**.
- mountChildFibers/reconcileChildFibers:
  - `mountChildFibers`: similar logic, not tracking side effects.
  - `reconcileChildFibers`: similar logic, tracking side effects.
  - `reconcileSingleElement`.
  - `reconcileSingleTextNode`.
  - `reconcileSinglePortal`.
  - `reconcileChildrenArray`.
  - `reconcileChildrenIterator`.
- **completeUnitOfWork**:
  - 当 `reconcileChildren` 返回值为 `null` 时, 表示 DFS 进行到子叶节点,
    `performUnitOfWork` 会调用 `completeUnitOfWork` 函数.
  - 调用 `completeWork` 进行 `render`.
  - 把当前 Fiber 对象的副作用队列 (`firstEffect` 与 `lastEffect`)
    加到父节点的副作用队列之后, 更新父节点的 `firstEffect` 和 `lastEffect` 指针.
  - 识别 `beginWork` 阶段设置的 `fiber.flags`,
    若当前 Fiber 存在副作用 (Effects),
    则将当前 Fiber 加入到父节点的 Effects 队列,
    等待 Commit 阶段处理.
  - 将 `workInProgress` 设置为 `siblingFiber` (DFS 遍历) 或 `returnFiber` (DFS 回溯),
    继续构建 Fiber 树.
- **completeWork**:
  - 创建 DOM 实例, 绑定至 `HostComponent`/`HostText` `fiber.stateNode` (局部状态).
  - 设置 DOM 节点属性, 绑定事件.
  - 设置 `fiber.flags`, 收集副作用.

```ts
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number
) {
  const root = markUpdateLaneFromFiberToRoot(fiber, lane)

  if (lane === SyncLane) {
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext
      && (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 初次渲染.
      performSyncWorkOnRoot(root)
    } else {
      // 对比更新.
      ensureRootIsScheduled(root, eventTime)
    }
  }

  mostRecentlyUpdatedRoot = root
}

function performSyncWorkOnRoot(root) {
  // 1. 获取本次render的优先级, 初次构造返回 NoLanes.
  const lanes = getNextLanes(root, NoLanes)
  // 2. 从root节点开始, 至上而下更新.
  const exitStatus = renderRootSync(root, lanes)
  // 3. 将最新的 Fiber 树挂载到 root.finishedWork 节点上.
  const finishedWork: Fiber = root.current.alternate
  root.finishedWork = finishedWork
  root.finishedLanes = lanes
  // 4. 进入 Commit 阶段.
  commitRoot(root)
}

function performConcurrentWorkOnRoot(root) {
  const originalCallbackNode = root.callbackNode

  // 1. 刷新 pending 状态的 effects, 有可能某些 effect 会取消本次任务.
  const didFlushPassiveEffects = flushPassiveEffects()

  if (didFlushPassiveEffects) {
    if (root.callbackNode !== originalCallbackNode) {
      // 任务被取消, 退出调用.
      return null
    } else {
      // Current task was not canceled. Continue.
    }
  }

  // 2. 获取本次渲染的优先级.
  const lanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  )

  // 3. 构造 Fiber 树.
  const exitStatus = renderRootConcurrent(root, lanes)

  if (
    includesSomeLane(
      workInProgressRootIncludedLanes,
      workInProgressRootUpdatedLanes
    )
  ) {
    // 如果在 render 过程中产生了新 update, 且新 update 的优先级与最初 render 的优先级有交集.
    // 那么最初 render 无效, 丢弃最初 render 的结果, 等待下一次调度.
    prepareFreshStack(root, NoLanes)
  } else if (exitStatus !== RootIncomplete) {
    // 4. 异常处理: 有可能fiber构造过程中出现异常.
    if (exitStatus === RootError)
      processError()

    const finishedWork = root.current.alternate // Fiber
    root.finishedWork = finishedWork
    root.finishedLanes = lanes

    // 5. 输出: 渲染 Fiber树.
    finishConcurrentRender(root, exitStatus, lanes)
  }

  // 退出前再次检测, 是否还有其他更新, 是否需要发起新调度.
  ensureRootIsScheduled(root, now())

  if (root.callbackNode === originalCallbackNode) {
    // 渲染被阻断, 返回一个新的 performConcurrentWorkOnRoot 函数, 等待下一次调度.
    return performConcurrentWorkOnRoot.bind(null, root)
  }

  return null
}

function renderRootSync(root: FiberRoot, lanes: Lanes) {
  const prevExecutionContext = executionContext
  executionContext |= RenderContext

  // 如果 FiberRoot 变动, 或者 update.lane 变动, 都会刷新栈帧, 丢弃上一次渲染进度.
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    // 刷新栈帧.
    prepareFreshStack(root, lanes)
  }
  do {
    try {
      workLoopSync()
      break
    } catch (thrownValue) {
      handleError(root, thrownValue)
    }
  } while (true)

  // 重置全局变量, 表明 render 结束.
  executionContext = prevExecutionContext
  workInProgressRoot = null
  workInProgressRootRenderLanes = NoLanes
  return workInProgressRootExitStatus
}

function renderRootConcurrent(root: FiberRoot, lanes: Lanes) {
  const prevExecutionContext = executionContext
  executionContext |= RenderContext
  const prevDispatcher = pushDispatcher()

  // 如果 FiberRoot 变动, 或者 update.lane 变动, 都会刷新栈帧, 丢弃上一次渲染进度.
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    resetRenderTimer()
    // 刷新栈帧.
    prepareFreshStack(root, lanes)
    startWorkOnPendingInteractions(root, lanes)
  }

  const prevInteractions = pushInteractions(root)

  do {
    try {
      workLoopConcurrent()
      break
    } catch (thrownValue) {
      handleError(root, thrownValue)
    }
  } while (true)

  // 重置全局变量.
  resetContextDependencies()
  popDispatcher(prevDispatcher)
  executionContext = prevExecutionContext

  // Check if tree has completed.
  if (workInProgress !== null) {
    // Still work remaining.
    return RootIncomplete
  } else {
    // Completed tree.
    // Set this to null to indicate there's no in-progress render.
    workInProgressRoot = null
    workInProgressRootRenderLanes = NoLanes

    // Return final exit status.
    return workInProgressRootExitStatus
  }
}

function prepareFreshStack(root: FiberRoot, lanes: Lanes) {
  // 重置 FiberRoot 上的属性.
  root.finishedWork = null
  root.finishedLanes = NoLanes
  const timeoutHandle = root.timeoutHandle

  if (timeoutHandle !== noTimeout) {
    root.timeoutHandle = noTimeout
    cancelTimeout(timeoutHandle)
  }

  if (workInProgress !== null) {
    let interruptedWork = workInProgress.return
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork)
      interruptedWork = interruptedWork.return
    }
  }

  // 重置全局变量.
  workInProgressRoot = root
  workInProgress = createWorkInProgress(root.current, null) // currentHostRootFiber.alternate.
  workInProgressRootRenderLanes
    = subtreeRenderLanes
      = workInProgressRootIncludedLanes
        = lanes
  workInProgressRootExitStatus = RootIncomplete
  workInProgressRootFatalError = null
  workInProgressRootSkippedLanes = NoLanes
  workInProgressRootUpdatedLanes = NoLanes
  workInProgressRootPingedLanes = NoLanes
}

function workLoopSync() {
  while (workInProgress !== null)
    performUnitOfWork(workInProgress)
}

function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield.
  while (workInProgress !== null && !shouldYield())
    performUnitOfWork(workInProgress)
}

function performUnitOfWork(unitOfWork: Fiber): void {
  // unitOfWork 就是被传入的 workInProgress.
  const current = unitOfWork.alternate
  const next = beginWork(current, unitOfWork, subtreeRenderLanes)
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // 如果没有派生出新的下级节点, 则进入 completeWork 阶段, 传入的是当前 unitOfWork.
    completeUnitOfWork(unitOfWork)
  } else {
    // 如果派生出新的下级节点, 则递归处理.
    workInProgress = next
  }
}

function _performUnitOfWork_Recursive(unitOfWork: Fiber): void {
  beginWork(unitOfWork.alternate, unitOfWork, subtreeRenderLanes)
  if (unitOfWork.child)
    _performUnitOfWork_Recursive(unitOfWork.child)
  completeUnitOfWork(unitOfWork)
  if (unitOfWork.sibling)
    _performUnitOfWork_Recursive(unitOfWork.sibling)
}

function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // 1. 设置 workInProgress 优先级为 NoLanes (最高优先级).
  const updateLanes = workInProgress.lanes
  didReceiveUpdate = false
  workInProgress.lanes = NoLanes

  // 2. 根据 workInProgress 节点的类型, 用不同的方法派生出子节点.
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

function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork = unitOfWork

  // 外层循环控制并移动指针 (workInProgress/completedWork).
  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return

    if ((completedWork.flags & Incomplete) === NoFlags) {
      // 1. 处理 Fiber 节点, 会调用渲染器 (关联 Fiber 节点和 DOM 对象, 绑定事件等).
      const next = completeWork(current, completedWork, subtreeRenderLanes)

      if (next !== null) {
        // 如果派生出其他的子节点, 则回到 beginWork 阶段进行处理.
        workInProgress = next
        return
      }

      // 重置子节点的优先级.
      resetChildLanes(completedWork)

      if (
        returnFiber !== null
        && (returnFiber.flags & Incomplete) === NoFlags
      ) {
        // 2. 收集当前 Fiber 节点以及其子树的副作用 Effects.
        // 2.1 把子节点的副作用队列添加到父节点上.
        if (returnFiber.firstEffect === null)
          returnFiber.firstEffect = completedWork.firstEffect

        if (completedWork.lastEffect !== null) {
          if (returnFiber.lastEffect !== null)
            returnFiber.lastEffect.nextEffect = completedWork.firstEffect

          returnFiber.lastEffect = completedWork.lastEffect
        }

        // 2.2 如果当前 Fiber 节点有副作用, 将其添加到子节点的副作用队列之后.
        const flags = completedWork.flags

        if (returnFiber.lastEffect !== null)
          returnFiber.lastEffect.nextEffect = completedWork
        else
          returnFiber.firstEffect = completedWork

        returnFiber.lastEffect = completedWork
      }
    }

    const siblingFiber = completedWork.sibling

    if (siblingFiber !== null) {
      // 如果有兄弟节点, 返回之后再次进入 beginWork 阶段.
      workInProgress = siblingFiber
      return
    }

    // 移动指针, 指向下一个节点.
    completedWork = returnFiber
    workInProgress = completedWork
  } while (completedWork !== null)

  // 已回溯到根节点, 设置 workInProgressRootExitStatus = RootCompleted.
  if (workInProgressRootExitStatus === RootIncomplete)
    workInProgressRootExitStatus = RootCompleted
}

function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const newProps = workInProgress.pendingProps

  switch (workInProgress.tag) {
    case HostRoot: {
      const fiberRoot: FiberRoot = workInProgress.stateNode

      if (fiberRoot.pendingContext) {
        fiberRoot.context = fiberRoot.pendingContext
        fiberRoot.pendingContext = null
      }

      if (current === null || current.child === null) {
        // 设置 fiber.flags.
        workInProgress.flags |= Snapshot
      }

      return null
    }
    case HostComponent: {
      popHostContext(workInProgress)
      const rootContainerInstance = getRootHostContainer()
      const type = workInProgress.type
      const currentHostContext = getHostContext()

      // 1. 创建 DOM 对象.
      const instance = createInstance(
        type,
        newProps,
        rootContainerInstance,
        currentHostContext,
        workInProgress
      )

      // 2. 把子树中的 DOM 对象 append 到本节点的 DOM 对象之后.
      appendAllChildren(instance, workInProgress, false, false)

      // 3. 设置 stateNode 属性, 指向 DOM 对象.
      workInProgress.stateNode = instance

      if (
        // 4. 设置DOM对象的属性, 绑定事件等.
        finalizeInitialChildren(
          instance,
          type,
          newProps,
          rootContainerInstance,
          currentHostContext
        )
      ) {
        // 设置 fiber.flags (Update).
        markUpdate(workInProgress)
      }

      if (workInProgress.ref !== null) {
        // 设置 fiber.flags (Ref).
        markRef(workInProgress)
      }

      return null
    }
  }
}
```

## Host Root

```ts
function updateHostRoot(current, workInProgress, renderLanes) {
  // 1. 状态计算, 更新整合到 workInProgress.memoizedState.
  const updateQueue = workInProgress.updateQueue
  const nextProps = workInProgress.pendingProps
  const prevState = workInProgress.memoizedState
  const prevChildren = prevState !== null ? prevState.element : null
  cloneUpdateQueue(current, workInProgress)
  // 遍历 updateQueue.shared.pending, 提取有足够优先级的 update对象, 计算出最终的状态 workInProgress.memoizedState.
  processUpdateQueue(workInProgress, nextProps, null, renderLanes)
  const nextState = workInProgress.memoizedState

  // 2. 获取下级 ReactElement 对象.
  const nextChildren = nextState.element
  const root: FiberRoot = workInProgress.stateNode

  // 3. 根据 ReactElement 对象, 调用 reconcileChildren 生成 Fiber 子节点 (只生成次级子节点).
  reconcileChildren(current, workInProgress, nextChildren, renderLanes)
  return workInProgress.child
}
```

## Host Component

```ts
function updateHostComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
) {
  // 1. 状态计算, 由于 HostComponent 是无状态组件, 只需要收集 nextProps.
  const type = workInProgress.type
  const nextProps = workInProgress.pendingProps
  const prevProps = current !== null ? current.memoizedProps : null

  // 2. 获取下级 ReactElement 对象.
  let nextChildren = nextProps.children
  const isDirectTextChild = shouldSetTextContent(type, nextProps)

  if (isDirectTextChild) {
    // 如果子节点只有一个文本节点, 不用再创建一个 HostText 类型的 Fiber.
    nextChildren = null
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // 设置 fiber.flags.
    workInProgress.flags |= ContentReset
  }

  // 设置 fiber.flags.
  markRef(current, workInProgress)

  // 3. 根据 ReactElement 对象, 调用 reconcileChildren 生成 Fiber 子节点(只生成次级子节点)
  reconcileChildren(current, workInProgress, nextChildren, renderLanes)
  return workInProgress.child
}
```
