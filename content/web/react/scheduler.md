---
sidebar_position: 31
tags: [Web, React, Internals, Scheduler]
---

# Scheduler

Work loop in scheduler focus on **Task Scheduling**,
not only including `Reconciler.performSyncWorkOnRoot`/`Reconciler.performConcurrentWorkOnRoot`,
but also for non-react tasks
(meaning `Scheduler` module can work standalone without `React`).

## Priority

React 16, unstable concurrent mode with
[`Priorities`](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerPriorities.js):

- ImmediatePriority: 立即执行优先级, 级别最高, `expirationTime = -1`.
- UserBlockingPriority: 用户阻塞优先级, `expirationTime = 250`.
- NormalPriority: 正常优先级, `expirationTime = 5000`.
- LowPriority: 低优先级, `expirationTime = 10000`.
- IdlePriority: 可闲置优先级, `expirationTime = maxSigned31BitInt`.

React 17, stable concurrent mode with
[`Lanes`](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js):

```ts
export type Lanes = number
export type Lane = number

export const TotalLanes = 31

export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001

export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000010
export const InputContinuousLane: Lanes = /*            */ 0b0000000000000000000000000000100

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000001000
export const DefaultLane: Lanes = /*                    */ 0b0000000000000000000000000010000

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000000000000100000
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111111111111000000
const TransitionLane1: Lane = /*                        */ 0b0000000000000000000000001000000
const TransitionLane2: Lane = /*                        */ 0b0000000000000000000000010000000
const TransitionLane3: Lane = /*                        */ 0b0000000000000000000000100000000
const TransitionLane4: Lane = /*                        */ 0b0000000000000000000001000000000
const TransitionLane5: Lane = /*                        */ 0b0000000000000000000010000000000
const TransitionLane6: Lane = /*                        */ 0b0000000000000000000100000000000
const TransitionLane7: Lane = /*                        */ 0b0000000000000000001000000000000
const TransitionLane8: Lane = /*                        */ 0b0000000000000000010000000000000
const TransitionLane9: Lane = /*                        */ 0b0000000000000000100000000000000
const TransitionLane10: Lane = /*                       */ 0b0000000000000001000000000000000
const TransitionLane11: Lane = /*                       */ 0b0000000000000010000000000000000
const TransitionLane12: Lane = /*                       */ 0b0000000000000100000000000000000
const TransitionLane13: Lane = /*                       */ 0b0000000000001000000000000000000
const TransitionLane14: Lane = /*                       */ 0b0000000000010000000000000000000
const TransitionLane15: Lane = /*                       */ 0b0000000000100000000000000000000
const TransitionLane16: Lane = /*                       */ 0b0000000001000000000000000000000

const RetryLanes: Lanes = /*                            */ 0b0000111110000000000000000000000
const RetryLane1: Lane = /*                             */ 0b0000000010000000000000000000000
const RetryLane2: Lane = /*                             */ 0b0000000100000000000000000000000
const RetryLane3: Lane = /*                             */ 0b0000001000000000000000000000000
const RetryLane4: Lane = /*                             */ 0b0000010000000000000000000000000
const RetryLane5: Lane = /*                             */ 0b0000100000000000000000000000000

export const SomeRetryLane: Lane = RetryLane1

export const SelectiveHydrationLane: Lane = /*          */ 0b0001000000000000000000000000000

const NonIdleLanes = /*                                 */ 0b0001111111111111111111111111111

export const IdleHydrationLane: Lane = /*               */ 0b0010000000000000000000000000000
export const IdleLane: Lanes = /*                       */ 0b0100000000000000000000000000000

export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000
```

## Workflow

Scheduler main [workflow](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js):

`scheduleCallback(callback)`
-> `push(queue, newTask)` (Wrap `callback` into `task`)
(For delayed task -> `requestHostTimeout(handleTimeout, delayTime)`)
-> `requestHostCallback(flushWork)`
-> `messageChannelPort.postMessage(null)`
-> `performWorkUntilDeadline()`
-> `flushWork(hasTimeRemaining, currentTime)`:
-> `workLoop(hasTimeRemaining, currentTime)`:

将 Reconciler 的工作 (Callback)
包装成 Task 组成 Task Queue,
按照时间分片机制,
不断地消费 Task Queue.

对于延时任务 (Delayed Task),
会将其先放入 Timer Queue,
等待延时完成后再将其放入 Task Queue.

## Time Slicing

```ts
// 时间切片周期, 默认是 5ms.
// 如果一个 task 运行超过该周期, 下一个 task 执行前, 会把控制权归还浏览器.
const yieldInterval = 5
const maxYieldInterval = 300

let deadline = 0 // currentTime + yieldInterval.
let needsPaint = false
let isMessageLoopRunning = false
let scheduledHostCallback = null

const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = performWorkUntilDeadline

const scheduling = navigator.scheduling
const getCurrentTime = performance.now

// 请求回调:
function requestHostCallback(callback) {
  // 1. 保存 callback.
  scheduledHostCallback = callback

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true
    // 2. 通过 MessageChannel 发送消息.
    port.postMessage(null)
  }
}

// 取消回调:
function cancelHostCallback() {
  scheduledHostCallback = null
}

function requestHostTimeout(callback, ms) {
  taskTimeoutID = setTimeout(() => {
    callback(getCurrentTime())
  }, ms)
}

function cancelHostTimeout() {
  clearTimeout(taskTimeoutID)
  taskTimeoutID = -1
}

// 是否让出主线程 (time slice):
function shouldYieldToHost() {
  const currentTime = getCurrentTime()

  if (currentTime >= deadline) {
    if (needsPaint || scheduling.isInputPending()) {
      // There is either a pending paint or a pending input.
      return true
    }

    // There's no pending input.
    // Only yield if we've reached max yield interval.
    return currentTime >= maxYieldInterval
  } else {
    // There's still time left in frame.
    return false
  }
}

// 请求绘制:
function requestPaint() {
  needsPaint = true
}

// 实际回调函数处理:
function performWorkUntilDeadline() {
  if (scheduledHostCallback !== null) {
    // 1. 设置 currentTime 与 deadline.
    const currentTime = getCurrentTime()
    deadline = currentTime + yieldInterval
    const hasTimeRemaining = true

    try {
      // 2. 执行回调, 返回是否有还有剩余任务.
      const hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime)

      if (!hasMoreWork) {
        // 没有剩余任务, 退出.
        isMessageLoopRunning = false
        scheduledHostCallback = null
      } else {
        port.postMessage(null) // 有剩余任务, 发起新的调度.
      }
    } catch (error) {
      port.postMessage(null) // 如有异常, 重新发起调度.
      throw error
    }
  } else {
    isMessageLoopRunning = false
  }

  needsPaint = false // Reset.
}
```

## Task Queue

Task queue is [MinHeap](https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js),
storing Tasks.

```ts
const newTask = {
  id: taskIdCounter++,
  callback, // Work from reconciler.
  priorityLevel,
  startTime,
  expirationTime,
  sortIndex: -1, // MinHeap queue indexing.
}
```

```ts
function scheduleCallback(priorityLevel, callback, options) {
  const currentTime = getCurrentTime()
  const startTime = currentTime
  const expirationTime = startTime + timeout[priorityLevel] // -1/250/5000/10000/MAX_INT.
  const newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  }

  if (startTime > currentTime) {
    // Delayed task.
    newTask.sortIndex = startTime
    push(timerQueue, newTask)

    // All tasks are delayed, and this is task with earliest delay.
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout()
      } else {
        isHostTimeoutScheduled = true
      }

      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime)
    }
  } else {
    // Normal task.
    newTask.sortIndex = expirationTime
    push(taskQueue, newTask)

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true
      requestHostCallback(flushWork)
    }
  }

  return newTask
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false
  advanceTimers(currentTime)

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true
      requestHostCallback(flushWork)
    } else {
      const firstTimer = peek(timerQueue)

      if (firstTimer !== null)
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime)
    }
  }
}
```

## Work Loop

当 `callback()` 返回函数时, 表明产生连续回调 (e.g. 出现更高优先任务/时间分片用完, 渲染中断),
需将返回的函数再次放入任务队列, 继续进行调度直至清空任务队列 (渲染恢复).

```ts
function flushWork(hasTimeRemaining, initialTime) {
  // We'll need a host callback next time work is scheduled.
  isHostCallbackScheduled = false

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false
    cancelHostTimeout()
  }

  isPerformingWork = true // Lock.
  const previousPriorityLevel = currentPriorityLevel

  try {
    return workLoop(hasTimeRemaining, initialTime)
  } finally {
    // Restore context.
    currentTask = null
    currentPriorityLevel = previousPriorityLevel
    isPerformingWork = false
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime
  advanceTimers(currentTime)
  currentTask = peek(taskQueue)

  while (currentTask !== null) {
    if (
      currentTask.expirationTime > currentTime
      && (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // This currentTask hasn't expired, and we've reached deadline.
      break
    }

    const callback = currentTask.callback

    if (typeof callback === 'function') {
      currentTask.callback = null
      currentPriorityLevel = currentTask.priorityLevel
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime
      const continuationCallback = callback(didUserCallbackTimeout)
      currentTime = getCurrentTime()

      if (typeof continuationCallback === 'function') {
        // 产生了连续回调 (如 Fiber树太大, 出现了中断渲染), 保留 currentTask.
        currentTask.callback = continuationCallback
      } else {
        if (currentTask === peek(taskQueue))
          pop(taskQueue)
      }

      advanceTimers(currentTime)
    } else {
      // 如果任务被取消 (currentTask.callback = null), 将其移出队列.
      pop(taskQueue)
    }

    currentTask = peek(taskQueue)
  }

  // Return whether there's additional work.
  if (currentTask !== null) {
    return true
  } else {
    const firstTimer = peek(timerQueue)

    // 存在延时任务, 继续进行调度.
    if (firstTimer !== null)
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime)

    return false
  }
}
```
