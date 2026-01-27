---
sidebar_position: 32
tags: [Web, React, Internals, Fiber]
---

# Fiber

[React Fiber](https://tigerabrodi.blog/reacts-evolution-from-hooks-to-concurrent-react#heading-react-fiber)
的目标是提高其在动画、布局和手势等领域的适用性:

- 它的主要特性是 `Incremental Rendering`:
  将渲染任务拆分为小的任务块并将任务分配到多个帧上的能力.
- Ability to pause and resume rendering.
- Ability to prioritize updates.
- Ability to work on multiple tasks concurrently.

## Type

`Fiber` [definition](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactInternalTypes.js):

- Component type.
- Current props and state.
- Pointers to parent, sibling, and child components,
- Pointer to DOM/class instance.
- Other internal metadata to track rendering process.

```ts
export interface Fiber {
  tag: WorkTag
  key: string | null
  elementType: any
  type: any // Tag/Class/Function.
  stateNode: any // DOM/class instance.
  ref: (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject | null

  // Singly Linked List Tree Structure.
  return: Fiber | null // DFS parent Fiber node.
  child: Fiber | null
  sibling: Fiber | null
  index: number

  // Props and state for output.
  pendingProps: any
  memoizedProps: any
  updateQueue: mixed // Updates from diff(pendingProps, memoizedProps).
  memoizedState: any

  // Context API.
  dependencies: Dependencies | null // (Contexts, Events) dependencies.

  mode: TypeOfMode // NoMode/BlockingMode/ConcurrentMode bit.

  // Effects.
  flags: Flags
  subtreeFlags: Flags
  deletions: Array<Fiber> | null
  nextEffect: Fiber | null // Next effect Fiber node.
  firstEffect: Fiber | null // First effect Fiber node.
  lastEffect: Fiber | null // Last effect Fiber node.

  // Priority.
  lanes: Lanes
  childLanes: Lanes
  alternate: Fiber | null // `current` Fiber and `workInProgress` Fiber.

  // Performance statistics for React DevTool.
  actualDuration?: number
  actualStartTime?: number
  selfBaseDuration?: number
  treeBaseDuration?: number
}
```

## Work Tag

常见的 Fiber [类型](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactWorkTags.js):

- HostComponent: HTML native tag.
- ClassComponent.
- FunctionComponent.

```ts
type WorkTag
  = | 'FunctionComponent'
    | 'ClassComponent'
    | 'IndeterminateComponent'
    | 'HostRoot'
    | 'HostPortal'
    | 'HostComponent'
    | 'HostText'
    | 'Fragment'
    | 'Mode'
    | 'ContextConsumer'
    | 'ContextProvider'
    | 'ForwardRef'
    | 'Profiler'
    | 'SuspenseComponent'
    | 'MemoComponent'
    | 'SimpleMemoComponent'
    | 'LazyComponent'
    | 'IncompleteClassComponent'
    | 'DehydratedFragment'
    | 'SuspenseListComponent'
    | 'FundamentalComponent'
    | 'ScopeComponent'
    | 'Block'
    | 'OffscreenComponent'
    | 'LegacyHiddenComponent'
```

## Mode

React [运行模式](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactTypeOfMode.js):
所有 `Fiber.mode` 保持一致 (包括 `FiberRoot`).

```ts
type TypeOfMode = number

const NoMode = /*                         */ 0b000000
const ConcurrentMode = /*                 */ 0b000001
const ProfileMode = /*                    */ 0b000010
const DebugTracingMode = /*               */ 0b000100
const StrictLegacyMode = /*               */ 0b001000
const StrictEffectsMode = /*              */ 0b010000
const ConcurrentUpdatesByDefaultMode = /* */ 0b100000
```

## Effects

- Insert DOM elements: `Placement` tag.
- Update DOM elements: `Update` tag.
- Delete DOM elements: `Deletion` tag.
- Update Ref property: `Ref` tag.
- `useEffect` callback: `got Passive` tag.
  - `useEffect(fn)`: `Mount` and `Update` lifecycle.
  - `useEffect(fn, [])`: `Mount` lifecycle.
  - `useEffect(fn, [deps])`:
    `Mount` lifecycle and
    `Update` lifecycle with `deps` changed.

React create effects when `Render` stage,
then update effects to real DOM when `Commit` stage.

常见的 Effect [标志位](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberFlags.js):

```ts
type Flags = number

const NoFlags = /*                      */ 0b000000000000000000
const PerformedWork = /*                */ 0b000000000000000001
const Placement = /*                    */ 0b000000000000000010
const Update = /*                       */ 0b000000000000000100
const PlacementAndUpdate = /*           */ 0b000000000000000110
const Deletion = /*                     */ 0b000000000000001000
const ContentReset = /*                 */ 0b000000000000010000
const Callback = /*                     */ 0b000000000000100000
const DidCapture = /*                   */ 0b000000000001000000
const Ref = /*                          */ 0b000000000010000000
const Snapshot = /*                     */ 0b000000000100000000
const Passive = /*                      */ 0b000000001000000000
const PassiveUnmountPendingDev = /*     */ 0b000010000000000000
const Hydrating = /*                    */ 0b000000010000000000
const HydratingAndUpdate = /*           */ 0b000000010000000100
const LifecycleEffectMask = /*          */ 0b000000001110100100
const HostEffectMask = /*               */ 0b000000011111111111
const Incomplete = /*                   */ 0b000000100000000000
const ShouldCapture = /*                */ 0b000001000000000000
const ForceUpdateForLegacySuspense = /* */ 0b000100000000000000
const PassiveStatic = /*                */ 0b001000000000000000
const BeforeMutationMask = /*           */ 0b000000001100001010
const MutationMask = /*                 */ 0b000000010010011110
const LayoutMask = /*                   */ 0b000000000010100100
const PassiveMask = /*                  */ 0b000000001000001000
const StaticMask = /*                   */ 0b001000000000000000
const MountLayoutDev = /*               */ 0b010000000000000000
const MountPassiveDev = /*              */ 0b100000000000000000
```

## Lanes

[Assign `Lane` to `Update`](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):

- Legacy 模式: 返回 SyncLane.
- Blocking 模式: 返回 SyncLane.
- Concurrent 模式:
  - 正常情况: 根据当前的调度优先级来生成一个 lane.
  - 处于 Suspense 过程中: 会优先选择 `TransitionLanes` 通道中的空闲通道 (或最高优先级).

```ts
export function requestUpdateLane(fiber: Fiber): Lane {
  const mode = fiber.mode

  if ((mode & BlockingMode) === NoMode) {
    // Legacy 模式.
    return SyncLane
  } else if ((mode & ConcurrentMode) === NoMode) {
    // Blocking 模式.
    return getCurrentPriorityLevel() === ImmediateSchedulerPriority
      ? SyncLane
      : SyncBatchedLane
  }

  // Concurrent 模式.
  if (currentEventWipLanes === NoLanes)
    currentEventWipLanes = workInProgressRootIncludedLanes

  const isTransition = requestCurrentTransition() !== NoTransition

  if (isTransition) {
    // 特殊情况, 处于 Suspense 过程中.
    if (currentEventPendingLanes !== NoLanes) {
      currentEventPendingLanes
        = mostRecentlyUpdatedRoot !== null
          ? mostRecentlyUpdatedRoot.pendingLanes
          : NoLanes
    }

    return findTransitionLane(currentEventWipLanes, currentEventPendingLanes)
  }

  // 正常情况, 获取调度优先级.
  let lane
  const schedulerPriority = getCurrentPriorityLevel()

  if (
    (executionContext & DiscreteEventContext) !== NoContext
    && schedulerPriority === UserBlockingSchedulerPriority
  ) {
    // `executionContext` 存在输入事件, 且调度优先级是用户阻塞性质.
    lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes)
  } else {
    // 调度优先级转换为车道模型.
    const schedulerLanePriority
      = schedulerPriorityToLanePriority(schedulerPriority)
    lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes)
  }

  return lane
}
```

[Global `renderLanes`](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js):

Fiber 树构造过程中 (`Render Phase`),
若 Fiber 对象或 Update 对象优先级 (`fiber.lanes`/`update.lane`) 比全局渲染优先级低,
则将会被忽略 (节点未更新, 可以直接复用).

```ts
export function getNextLanes(root: FiberRoot, wipLanes: Lanes): Lanes {
  const pendingLanes = root.pendingLanes

  if (pendingLanes === NoLanes)
    return NoLanes

  let nextLanes = NoLanes
  const suspendedLanes = root.suspendedLanes
  const pingedLanes = root.pingedLanes
  const nonIdlePendingLanes = pendingLanes & NonIdleLanes

  if (nonIdlePendingLanes !== NoLanes) {
    const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes

    if (nonIdleUnblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes)
    } else {
      const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes

      if (nonIdlePingedLanes !== NoLanes)
        nextLanes = getHighestPriorityLanes(nonIdlePingedLanes)
    }
  } else {
    const unblockedLanes = pendingLanes & ~suspendedLanes

    if (unblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(unblockedLanes)
    } else {
      if (pingedLanes !== NoLanes)
        nextLanes = getHighestPriorityLanes(pingedLanes)
    }
  }

  if (nextLanes === NoLanes)
    return NoLanes

  if (
    wipLanes !== NoLanes
    && wipLanes !== nextLanes
    && (wipLanes & suspendedLanes) === NoLanes
  ) {
    const nextLane = getHighestPriorityLane(nextLanes)
    const wipLane = getHighestPriorityLane(wipLanes)

    if (
      nextLane >= wipLane
      || (nextLane === DefaultLane && (wipLane & TransitionLanes) !== NoLanes)
    ) {
      return wipLanes
    }
  }

  if (
    allowConcurrentByDefault
    && (root.current.mode & ConcurrentUpdatesByDefaultMode) !== NoMode
  ) {
    // Do nothing, use lanes as they were assigned.
  } else if ((nextLanes & InputContinuousLane) !== NoLanes) {
    nextLanes |= pendingLanes & DefaultLane
  }

  const entangledLanes = root.entangledLanes

  if (entangledLanes !== NoLanes) {
    const entanglements = root.entanglements
    let lanes = nextLanes & entangledLanes

    while (lanes > 0) {
      const index = pickArbitraryLaneIndex(lanes)
      const lane = 1 << index
      nextLanes |= entanglements[index]
      lanes &= ~lane
    }
  }

  return nextLanes
}
```

Lanes model [use case](https://github.com/facebook/react/pull/18796):

```ts
// task 与 batchTask 的优先级是否重叠:
// 1. expirationTime:
const isTaskIncludedInBatch = priorityOfTask >= priorityOfBatch
// 2. Lanes:
const isTaskIncludedInBatch = (task & batchOfTasks) !== 0

// 当同时处理一组任务, 该组内有多个任务, 且每个任务的优先级不一致:
// 1. expirationTime:
const isTaskIncludedInBatch
  = taskPriority <= highestPriorityInRange
    && taskPriority >= lowestPriorityInRange
// 2. Lanes:
const isTaskIncludedInBatch = (task & batchOfTasks) !== 0

// 从 group 中增删 task:
// 1. expirationTime (need list):
task.prev.next = task.next

let current = queue
while (task.expirationTime >= current.expirationTime)
  current = current.next

task.next = current.next
current.next = task

const isTaskIncludedInBatch
  = taskPriority <= highestPriorityInRange
    && taskPriority >= lowestPriorityInRange

// 2. Lanes:
batchOfTasks &= ~task // Delete task.
batchOfTasks |= task // Add task.
const isTaskIncludedInBatch = (task & batchOfTasks) !== 0
```

## Trees

- `current` Fiber tree: rendered to screen.
- `workInProgress` Fiber tree: under reconciliation.
- When `workInProgress` Fiber tree complete `render` + `commit`,
  swap 2 Fiber tree:
  - Reuse Fiber objects.
  - Reduce memory usage and GC time.
- `FiberRoot`:
  - `FiberRoot.current = currentHostRootFiber`.
  - `FiberRoot.finishedWork = workInProgressHostRootFiber`.
  - `currentHostRootFiber.stateNode = FiberRoot`.
  - `workInProgressHostRootFiber.stateNode = FiberRoot`.
  - `currentHostRootFiber.alternate = workInProgressHostRootFiber`
  - `workInProgressHostRootFiber.alternate = currentHostRootFiber`
- `ReactElement` tree -> `Fiber` tree -> `DOM` tree.

[![React Fiber Trees](./figures/react-fiber-trees.png)](https://7kms.github.io/react-illustration-series/main/fibertree-prepare)

## Work Loop

[![React Fiber Work Loop](./figures/react-fiber-work-loop.png)](https://7kms.github.io/react-illustration-series/main/reconciler-workflow)
