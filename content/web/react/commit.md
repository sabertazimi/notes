---
sidebar_position: 37
tags: [Web, React, Internals, Reconciler]
---

# Commit

## Renderer

`Renderer`:

- Implementing `HostConfig` [protocol](https://github.com/facebook/react/blob/main/packages/react-reconciler/README.md).
- Rendering fiber tree to real contents:
  - Web: DOM node.
  - Native: native UI.
  - Server: SSR strings.
- Real renderer [demo](https://github.com/sabertazimi/lab/tree/main/packages/react-renderer/src/renderer).

`HostConfig` protocol:

- `isPrimaryRender: true`.
- `supportsHydration: true`: SSR renderer.
- `supportsMutation: true`: React DOM renderer.
- `supportsPersistence: true`: React Native renderer.
- Platform timer functions:
  - now.
  - scheduleTimeout.
  - cancelTimeout.
- Creation operations:
  - createInstance.
  - createTextInstance.
- UI tree operations:
  - appendInitialChild.
  - appendChild.
  - appendChildToContainer.
  - removeChildFromContainer.
  - removeChild.
  - clearContainer.
- Update props operations:
  - finalizeInitialChildren.
  - prepareUpdate.
  - commitUpdate.
  - commitTextUpdate.
  - shouldSetTextContent.
  - resetTextContent.
- Context and schedule operations:
  - getRootHostContext.
  - getChildHostContext.
  - getPublicInstance.
  - prepareForCommit.
  - resetAfterCommit.
  - preparePortalMount.

## Root

- `FiberRoot.finishedWork`:
  - 副作用队列挂载在根节点上 (`finishedWork.firstEffect`).
  - 最新 DOM 对象挂载在 HostComponent Fiber 上 (`fiber.stateNode`).
- `BeforeMutation` phase:
  - Read state of host tree right before DOM mutation.
  - Process
    `Passive`/`Snapshot`/`Deletion`
    effects fiber.
  - `instance.getSnapshotBeforeUpdate`.
- `Mutation` phase.
  - Mutate host tree, render UI.
  - Process
    `ContentReset`/`Ref`/`Visibility`/`Placement`/`Update`/`Deletion`/`Hydrating`
    effects fiber.
- `Layout` phase.
  - After DOM mutation.
  - Process `Update | Callback` effects fiber.
  - `instance.componentDidMount/componentDidUpdate` (**synchronous**).
  - `instance` callback for `setState`.
  - `useLayoutEffect` (**synchronous**).
- `CommitEffects` functions located in
  [ReactFiberCommitWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js).

```ts
function commitRoot(root: FiberRoot, recoverableErrors: null | Array<mixed>) {
  const previousUpdateLanePriority = getCurrentUpdatePriority()
  const prevTransition = ReactCurrentBatchConfig.transition

  try {
    ReactCurrentBatchConfig.transition = null
    setCurrentUpdatePriority(DiscreteEventPriority)
    commitRootImpl(root, recoverableErrors, previousUpdateLanePriority)
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition
    setCurrentUpdatePriority(previousUpdateLanePriority)
  }

  return null
}

function commitRootImpl(
  root: FiberRoot,
  recoverableErrors: null | Array<mixed>,
  renderPriorityLevel: EventPriority
) {
  do
    flushPassiveEffects()
  while (rootWithPendingPassiveEffects !== null)

  flushRenderPhaseStrictModeWarningsInDEV()

  if ((executionContext & (RenderContext | CommitContext)) !== NoContext)
    throw new Error('Should not already be working.')

  const finishedWork = root.finishedWork
  const lanes = root.finishedLanes

  if (finishedWork === null)
    return null

  // 清空 FiberRoot 对象上的属性.
  root.finishedWork = null
  root.finishedLanes = NoLanes
  root.callbackNode = null
  root.callbackPriority = NoLane

  // Update first and last pending times on this root.
  // New first pending time is whatever is left on root fiber.
  const remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes)

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null
    workInProgress = null
    workInProgressRootRenderLanes = NoLanes
  }

  // If there are pending passive effects, schedule a callback to process them.
  // Do this as early as possible before anything else in commit phase.
  if (
    (finishedWork.subtreeFlags & PassiveMask) !== NoFlags
    || (finishedWork.flags & PassiveMask) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true
      pendingPassiveEffectsRemainingLanes = remainingLanes
      scheduleCallback(NormalSchedulerPriority, () => {
        flushPassiveEffects()
        return null
      })
    }
  }

  // Check if there are any effects in whole tree.
  const subtreeHasEffects
    = (finishedWork.subtreeFlags
      & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask))
    !== NoFlags
  const rootHasEffect
    = (finishedWork.flags
      & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask))
    !== NoFlags

  if (subtreeHasEffects || rootHasEffect) {
    // Store context.
    const prevTransition = ReactCurrentBatchConfig.transition
    const previousPriority = getCurrentUpdatePriority()
    const prevExecutionContext = executionContext
    ReactCurrentBatchConfig.transition = null
    setCurrentUpdatePriority(DiscreteEventPriority)
    executionContext |= CommitContext

    // Reset this to null before calling life cycles.
    ReactCurrentOwner.current = null

    // `BeforeMutation` phase:
    // read state of host tree right before we mutate it.
    // `getSnapshotBeforeUpdate` is called.
    commitBeforeMutationEffects(root, finishedWork)

    // `Mutation` phase:
    // mutate host tree.
    commitMutationEffects(root, finishedWork, lanes)

    resetAfterCommit(root.containerInfo)

    // `workInProgress` tree is now current tree (during `componentDidMount`/`Update`).
    root.current = finishedWork

    // `Layout` phase:
    // `useLayoutEffect` is called.
    commitLayoutEffects(finishedWork, root, lanes)

    // Tell Scheduler to yield at end of frame,
    // so browser has an opportunity to paint.
    requestPaint()

    // Restore context.
    executionContext = prevExecutionContext
    setCurrentUpdatePriority(previousPriority)
    ReactCurrentBatchConfig.transition = prevTransition
  } else {
    // No effects.
    root.current = finishedWork
  }

  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects:
    // Stash a reference to them.
    rootDoesHavePassiveEffects = false
    rootWithPendingPassiveEffects = root
    pendingPassiveEffectsLanes = lanes
  } else {
    // There were no passive effects:
    // immediately release cache pool for this render.
    releaseRootPooledCache(root, remainingLanes)
  }

  // Always call this before exiting `commitRoot`,
  // to ensure that any additional work on this root is scheduled.
  ensureRootIsScheduled(root, now())

  // If passive effects are result of a discrete render,
  // flush them synchronously at end of current task
  // so that result is immediately observable.
  if (
    includesSomeLane(pendingPassiveEffectsLanes, SyncLane)
    && root.tag !== LegacyRoot
  ) {
    flushPassiveEffects()
  }

  // If layout work was scheduled, flush it now.
  flushSyncCallbacks()

  return null
}
```

```ts
const BeforeMutationMask = Update | Snapshot | ChildDeletion | Visibility

const MutationMask
  = Placement
    | Update
    | ChildDeletion
    | ContentReset
    | Ref
    | Hydrating
    | Visibility

const LayoutMask = Update | Callback | Ref | Visibility
```

## Before Mutation

- `Passive` effects:
  - `FunctionComponent` fiber (hooks):
    If there are pending passive effects,
    schedule a callback (**asynchronous**) to process them,
    **as early as possible** before anything else in commit phase.
  - `useXXX` hooks normally run in **asynchronous** mode.
  - `useEffect` (**asynchronous**) run after `useLayoutEffect`.
- `Snapshot` effects:
  - `HostRoot` fiber: `HostConfig.clearContainer`.
  - `ClassComponent` fiber: `instance.getSnapshotBeforeUpdate`.
- `Deletion` effects: `commitBeforeMutationEffectsDeletion` -> `HostConfig.beforeActiveInstanceBlur`.

```ts
// `Passive` effects.
scheduleCallback(NormalSchedulerPriority, () => {
  flushPassiveEffects()
  return null
})

function flushPassiveEffects(): boolean {
  // Returns whether passive effects were flushed.
  if (pendingPassiveEffectsRenderPriority !== NoSchedulerPriority) {
    const priorityLevel
      = pendingPassiveEffectsRenderPriority > NormalSchedulerPriority
        ? NormalSchedulerPriority
        : pendingPassiveEffectsRenderPriority
    pendingPassiveEffectsRenderPriority = NoSchedulerPriority
    return runWithPriority(priorityLevel, flushPassiveEffectsImpl)
  }

  return false
}

function flushPassiveEffectsImpl() {
  if (rootWithPendingPassiveEffects === null)
    return false

  rootWithPendingPassiveEffects = null
  pendingPassiveEffectsLanes = NoLanes

  // 1. 执行 effect.destroy().
  const unmountEffects = pendingPassiveHookEffectsUnmount
  pendingPassiveHookEffectsUnmount = []

  for (let i = 0; i < unmountEffects.length; i += 2) {
    const effect = unmountEffects[i]
    const fiber = unmountEffects[i + 1]
    const destroy = effect.destroy
    effect.destroy = undefined

    if (typeof destroy === 'function')
      destroy()
  }

  // 2. 执行新 effect.create(), 重新赋值到 effect.destroy.
  const mountEffects = pendingPassiveHookEffectsMount
  pendingPassiveHookEffectsMount = []

  for (let i = 0; i < mountEffects.length; i += 2) {
    const effect = mountEffects[i]
    const fiber = mountEffects[i + 1]
    effect.destroy = create()
  }
}
```

```ts
// `Snapshot` effects.
function commitBeforeMutationEffects(root: FiberRoot, firstChild: Fiber) {
  HostConfig.prepareForCommit(root.containerInfo)
  nextEffect = firstChild

  // DFS traverse.
  while (nextEffect !== null) {
    const fiber = nextEffect
    const deletions = fiber.deletions

    if (deletions !== null) {
      for (let i = 0; i < deletions.length; i++) {
        const deletion = deletions[i]
        commitBeforeMutationEffectsDeletion(deletion)
      }
    }

    const child = fiber.child

    if (
      (fiber.subtreeFlags & BeforeMutationMask) !== NoFlags
      && child !== null
    ) {
      // 1. Visit children.
      nextEffect = child
    } else {
      while (nextEffect !== null) {
        const fiber = nextEffect
        commitBeforeMutationEffectsOnFiber(fiber)
        const sibling = fiber.sibling

        // 2. Visit sibling.
        if (sibling !== null) {
          nextEffect = sibling
          break
        }

        nextEffect = fiber.return
      }
    }
  }
}

function commitBeforeMutationEffectsOnFiber(finishedWork: Fiber) {
  const current = finishedWork.alternate
  const flags = finishedWork.flags

  if ((flags & Snapshot) !== NoFlags) {
    switch (finishedWork.tag) {
      case ClassComponent: {
        if (current !== null) {
          const prevProps = current.memoizedProps
          const prevState = current.memoizedState
          const instance = finishedWork.stateNode

          // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          const snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState
          )
          instance.__reactInternalSnapshotBeforeUpdate = snapshot
        }

        break
      }
      case HostRoot: {
        if (supportsMutation) {
          const root = finishedWork.stateNode
          HostConfig.clearContainer(root.containerInfo)
        }

        break
      }
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent:
      case HostComponent:
      case HostText:
      case HostPortal:
      case IncompleteClassComponent:
        // Nothing to do for these component types.
        break
      default: {
        throw new Error(
          'This unit of work tag should not have side-effects. This error is '
          + 'likely caused by a bug in React. Please file an issue.'
        )
      }
    }
  }
}

function commitBeforeMutationEffectsDeletion(deletion: Fiber) {
  if (doesFiberContain(deletion, focusedInstanceHandle)) {
    shouldFireAfterActiveInstanceBlur = true
    beforeActiveInstanceBlur(deletion)
  }
}
```

## Mutation

- `ContentReset` effects: `commitResetTextContent` -> `HostConfig.resetTextContext`.
- `Ref` effects: `commitAttachRef`/`commitDetachRef` -> `HostConfig.getPublicInstance`.
- `Visibility` effects:
  - `SuspenseComponent` fiber:
    `markCommitTimeOfFallback`.
  - `OffscreenComponent` fiber:
    `hideOrUnhideAllChildren` -> `HostConfig.hideInstance/hideTextInstance/unhideInstance/unhideTextInstance`.
- `Deletion` effects:
  `commitDeletion` -> `HostConfig.removeChild/removeChildFromContainer/clearSuspenseBoundaryFromContainer`.
- `Placement` effects:
  `commitPlacement` -> `insertOrAppendPlacementNode`/`insertOrAppendPlacementNodeIntoContainer`
  -> `HostConfig.appendChild/insertBefore/appendChildToContainer/insertInContainerBefore`.
- `Update` effects:
  `commitWork` -> `HostConfig.commitUpdate/commitTextUpdate/commitHydratedContainer/replaceContainerChildren`.
- `Hydrating` effects.

:::tip[Effect Order]

Deletion -> Insertion -> Update.

:::

```ts
export function commitMutationEffects(
  root: FiberRoot,
  firstChild: Fiber,
  committedLanes: Lanes
) {
  inProgressLanes = committedLanes
  inProgressRoot = root
  nextEffect = firstChild

  while (nextEffect !== null) {
    const fiber = nextEffect
    const deletions = fiber.deletions

    if (deletions !== null) {
      for (let i = 0; i < deletions.length; i++) {
        const childToDelete = deletions[i]
        commitDeletion(root, childToDelete, fiber)
      }
    }

    const child = fiber.child

    if ((fiber.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
      // 1. Visit children.
      nextEffect = child
    } else {
      while (nextEffect !== null) {
        const fiber = nextEffect
        commitMutationEffectsOnFiber(fiber, root, lanes)
        const sibling = fiber.sibling

        // 2. Visit sibling.
        if (sibling !== null) {
          nextEffect = sibling
          break
        }

        nextEffect = fiber.return
      }
    }
  }

  inProgressLanes = null
  inProgressRoot = null
}

function commitMutationEffectsOnFiber(
  finishedWork: Fiber,
  root: FiberRoot,
  lanes: Lanes
) {
  const flags = finishedWork.flags

  if (flags & ContentReset)
    commitResetTextContent(finishedWork)

  if (flags & Ref) {
    const current = finishedWork.alternate

    if (current !== null) {
      // 先清空 ref, 在第三阶段 (Layout), 再重新赋值.
      commitDetachRef(current)
    }

    if (finishedWork.tag === ScopeComponent)
      commitAttachRef(finishedWork)
  }

  if (flags & Visibility) {
    switch (finishedWork.tag) {
      case SuspenseComponent: {
        const newState: OffscreenState | null = finishedWork.memoizedState
        const isHidden = newState !== null

        if (isHidden) {
          const current = finishedWork.alternate
          const wasHidden = current !== null && current.memoizedState !== null

          if (!wasHidden)
            markCommitTimeOfFallback()
        }

        break
      }
      case OffscreenComponent: {
        const newState: OffscreenState | null = finishedWork.memoizedState
        const isHidden = newState !== null
        const current = finishedWork.alternate
        const wasHidden = current !== null && current.memoizedState !== null
        const offscreenBoundary: Fiber = finishedWork

        if (supportsMutation)
          hideOrUnhideAllChildren(offscreenBoundary, isHidden)

        break
      }
    }
  }

  const primaryFlags = flags & (Placement | Update | Hydrating)

  switch (primaryFlags) {
    case Placement: {
      // Placement
      commitPlacement(finishedWork)
      finishedWork.flags &= ~Placement // Clear bit.
      break
    }
    case PlacementAndUpdate: {
      // Placement
      commitPlacement(finishedWork)
      finishedWork.flags &= ~Placement // Clear bit.

      // Update
      const current = finishedWork.alternate
      commitWork(current, finishedWork)
      break
    }
    case Hydrating: {
      finishedWork.flags &= ~Hydrating // Clear bit.
      break
    }
    case HydratingAndUpdate: {
      finishedWork.flags &= ~Hydrating // Clear bit.

      // Update
      const current = finishedWork.alternate
      commitWork(current, finishedWork)
      break
    }
    case Update: {
      const current = finishedWork.alternate
      commitWork(current, finishedWork)
      break
    }
  }
}
```

## Layout

- `Update | Callback` effects:
  - `instance.componentDidMount/componentDidUpdate` (**synchronous**).
  - `instance` callback for `setState`.
  - `useLayoutEffect` (**synchronous**).
  - `HostConfig.getPublicInstance/commitMount`.

```ts
function commitLayoutEffects(
  finishedWork: Fiber,
  root: FiberRoot,
  committedLanes: Lanes
): void {
  inProgressLanes = committedLanes
  inProgressRoot = root
  nextEffect = finishedWork

  while (nextEffect !== null) {
    const fiber = nextEffect
    const firstChild = fiber.child

    if ((fiber.subtreeFlags & LayoutMask) !== NoFlags && firstChild !== null) {
      // 1. Visit children.
      nextEffect = firstChild
    } else {
      while (nextEffect !== null) {
        const fiber = nextEffect

        if ((fiber.flags & LayoutMask) !== NoFlags) {
          const current = fiber.alternate
          commitLayoutEffectOnFiber(root, current, fiber, committedLanes)
        }

        // Complete `commitLayoutEffects`.
        if (fiber === subtreeRoot) {
          nextEffect = null
          break
        }

        const sibling = fiber.sibling

        // 2. Visit sibling.
        if (sibling !== null) {
          nextEffect = sibling
          break
        }

        nextEffect = fiber.return
      }
    }
  }

  inProgressLanes = null
  inProgressRoot = null
}

function commitLayoutEffectOnFiber(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedLanes: Lanes
): void {
  if ((finishedWork.flags & LayoutMask) !== NoFlags) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        if (
          !enableSuspenseLayoutEffectSemantics
          || !offscreenSubtreeWasHidden
        ) {
          commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork)
        }

        break
      }
      case ClassComponent: {
        const instance = finishedWork.stateNode

        if (finishedWork.flags & Update) {
          if (!offscreenSubtreeWasHidden) {
            if (current === null) {
              instance.componentDidMount()
            } else {
              const prevProps
                = finishedWork.elementType === finishedWork.type
                  ? current.memoizedProps
                  : resolveDefaultProps(
                      finishedWork.type,
                      current.memoizedProps
                    )
              const prevState = current.memoizedState

              instance.componentDidUpdate(
                prevProps,
                prevState,
                instance.__reactInternalSnapshotBeforeUpdate
              )
            }
          }
        }

        const updateQueue = finishedWork.updateQueue

        if (updateQueue !== null) {
          // 处理 update 回调函数, e.g: `this.setState({}, callback)`.
          commitUpdateQueue(finishedWork, updateQueue, instance)
        }

        break
      }
      case HostRoot: {
        const updateQueue = finishedWork.updateQueue

        if (updateQueue !== null) {
          let instance = null

          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                instance = getPublicInstance(finishedWork.child.stateNode)
                break
              case ClassComponent:
                instance = finishedWork.child.stateNode
                break
            }
          }

          // 处理 update 回调函数, e.g: `this.setState({}, callback)`.
          commitUpdateQueue(finishedWork, updateQueue, instance)
        }

        break
      }
      case HostComponent: {
        const instance: Instance = finishedWork.stateNode

        if (current === null && finishedWork.flags & Update) {
          const type = finishedWork.type
          const props = finishedWork.memoizedProps
          commitMount(instance, type, props, finishedWork)
        }

        break
      }
      case SuspenseComponent: {
        commitSuspenseHydrationCallbacks(finishedRoot, finishedWork)
        break
      }
      case HostText:
      case HostPortal:
      case Profiler:
      case SuspenseListComponent:
      case IncompleteClassComponent:
      case ScopeComponent:
      case OffscreenComponent:
      case LegacyHiddenComponent: {
        break
      }

      default:
        throw new Error(
          'This unit of work tag should not have side-effects. This error is '
          + 'likely caused by a bug in React. Please file an issue.'
        )
    }
  }

  // 重新设置ref.
  if (finishedWork.flags & Ref)
    commitAttachRef(finishedWork)
}
```
