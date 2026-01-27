---
sidebar_position: 33
tags: [Web, React, Internals, Reconciler]
---

# Reconciler

```ts
function performWork(deadline) {
  if (!nextUnitOfWork)
    resetNextUnitOfWork()

  // whether current status is idle status or not
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME)
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

  if (pendingCommit)
    commitAllWork(pendingCommit)

  // checks if there's pending work
  // if exist, performWork in **next frame** when idle
  if (nextUnitOfWork || updateQueue.length > 0)
    requestIdleCallback(performWork)
}

function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance,
    partialState,
  })

  requestIdleCallback(performWork)
}

// React.render function
function render(elements, container) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: container,
    newProps: {
      children: elements,
    },
  })

  requestIdleCallback(performWork)
}
```

## Performance

- Render: 通过一些启发式算法跳过没有发生变更的子树.
- Commit:
  - 维护了一个列表用于记录变化的 Fiber, 不再访问其他 Fiber.
  - 首次渲染 (Mount) 时只有 `HostRootFiber.flags` 会设置 `Placement`,
    在 Commit 阶段只会执行一次插入操作.
- GC:
  - Reuse `OldFiber` objects when `Bailout`.
  - `current` Fiber tree and `workInProgress` Fiber tree for `Double Buffering`.
