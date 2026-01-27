---
sidebar_position: 30
tags: [Web, React, Internals, Architecture]
---

# Architecture

## Virtual DOM

- Reduce rendering times with reconciliation algorithm,
  improving rendering efficiency:
  Declarative UI performance = Diff performance + DOM performance,
  `Virtual DOM` 主要是为了最小化 Diff 性能消耗.
- Cross platform code.
- Functional programming without details on DOM manipulation.
- Virtual DOM 很多时候都不是最优的操作,
  但它具有普适性, 在效率与可维护性之间达到平衡.
- [SnabbDOM](https://github.com/snabbdom/snabbdom):
  virtual DOM library focus on modularity and performance.

## Packages

- `Scheduler` 调度器: 调度任务的优先级, 高优任务优先进入 `Reconciler`.
- `Reconciler` 协调器:
  - 装载 `Renderer`.
  - 接收 `ReactDOM` 和 `React` 模块 (用户代码) 发起的更新请求:
    - `ReactFiberReconciler.updateContainer`.
    - `ReactFiberClassComponent.setState`.
    - `ReactFiberHooks.dispatchAction`.
  - 找出变化组件, 构建 Fiber Tree.
- `Renderer` 渲染器:
  - 引导 `React` 应用启动 (e.g. `ReactDOM.createRoot(rootNode).render(<App />)`).
  - 实现 `HostConfig` 协议, 将变化的组件渲染到页面上.

其中 `Reconciler` 构建 Fiber Tree 的过程被包装成一个回调函数, 传入 `Scheduler` 模块等待调度.
`Scheduler` 将回调函数进一步包装成任务对象, 放入多优先级调度的任务队列, 循环消费任务队列, 直至队列清空.
Scheduler work loop (任务调度循环) 负责调度 `Task`,
Reconciler work loop (`Fiber` 构造循环) 负责实现 `Task`.

`React` runtime main logic:

- Updates: `Add`/`Delete`/`Mutation` updates from `User Code`.
- Registration:
  - `Reconciler` receive updates request from `User Code`.
  - `Scheduler` register new `Task`.
- Execution:
  - `Scheduler` consume `Task` in `TaskQueue` in work loop.
  - `Reconciler` execute `Task` work.
    - `Fiber` 构造循环: construct `Fiber` tree.
    - `commitRoot`: render `Fiber` tree with `Renderer`.
- 任务调度循环与 `Fiber` 构造循环相互配合可实现**可中断渲染**:
  - 渲染中断 (`Reconciler.renderRootConcurrent().shouldYield()`):
    - 存在更高优先级任务 (Priority Scheduling).
    - 当前帧没有剩余时间 (Time Slicing).
  - 渲染恢复 (`Scheduler.workLoop()`):
    将 `callback()` 返回的任务放入任务队列, 继续进行调度直至清空任务队列.

[![React Core Packages](./figures/react-core-packages.png)](https://7kms.github.io/react-illustration-series/main/macro-structure)

## Workflow

[![React Core Workflow](./figures/react-core-workflow.png)](https://jser.dev/2023-07-14-initial-mount/#how-react-does-initial-mount-first-time-render-)

### Create RootContainer

#### Legacy Root

- [react-dom/src/client/ReactDOMLegacy](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMLegacy.js):
  - **render**.
  - legacyRenderSubtreeIntoContainer.
  - legacyCreateRootFromDOMContainer.
- [react-reconciler/src/ReactFiberReconciler](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js):
  - **createContainer**.
- [react-dom/src/client/ReactDOMComponentTree](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMComponentTree.js):
  - markContainerAsRoot.
- [react-reconciler/src/ReactFiberRoot](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRoot.js):
  - **createFiberRoot**.
- [react-reconciler/src/ReactFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js):
  - createHostRootFiber.
- [react-reconciler/src/ReactUpdateQueue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactUpdateQueue.js):
  - **initializeUpdateQueue**.
- [react-dom/src/events/DOMPluginEventSystem](https://github.com/facebook/react/blob/main/packages/react-dom/src/events/DOMPluginEventSystem.js):
  - listenToAllSupportedEvents:
    事件统一在 rootContainer 上处理 dispatchDiscreteEvent.

#### Concurrent Root

- [react-dom/src/client/ReactDOMRoot](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMRoot.js):
  - **createRoot**.
- [react-reconciler/src/ReactFiberReconciler](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js):
  - **createContainer**.
- [react-dom/src/client/ReactDOMComponentTree](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMComponentTree.js):
  - markContainerAsRoot.
- [react-reconciler/src/ReactFiberRoot](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRoot.js):
  - **createFiberRoot**.
- [react-reconciler/src/ReactFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js):
  - createHostRootFiber.
- [react-reconciler/src/ReactUpdateQueue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactUpdateQueue.js):
  - **initializeUpdateQueue**.
- [react-dom/src/events/DOMPluginEventSystem](https://github.com/facebook/react/blob/main/packages/react-dom/src/events/DOMPluginEventSystem.js):
  - listenToAllSupportedEvents:
    事件统一在 rootContainer 上处理 dispatchDiscreteEvent.
- `ReactDOMRoot.render(<App />)`.

### Update RootContainer

- [react-dom/src/client/ReactDOMLegacy](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMLegacy.js):
  - render.
  - legacyRenderSubtreeIntoContainer.
- [react-dom/src/client/ReactDOMRoot](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMRoot.js):
  - render.
- [react-reconciler/src/ReactFiberReconciler](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js):
  - **updateContainer**.
- [react-reconciler/src/ReactUpdateQueue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactUpdateQueue.js):
  - createUpdate.
  - enqueueUpdate.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **scheduleUpdateOnFiber**.
  - **ensureRootIsScheduled**.
- [react-reconciler/src/ReactFiberSyncTaskQueue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberSyncTaskQueue.js):
  - flushSyncCallbacks.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **performSyncWorkOnRoot**.
  - renderRootSync.
  - workLoopSync.
  - **performUnitOfWork**.
- [react-reconciler/src/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):
  - **beginWork**.
  - **updateHostRoot**/**updateXXXComponent**.
  - `ReactDOMComponent.createElement`.
  - reconcileChildren.
- [react-reconciler/src/ReactChildFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js):
  - reconcileChildFibers.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **completeUnitOfWork**.
- [react-reconciler/src/ReactFiberCompleteWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js)
  - **completeWork**.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **commitRoot**.
- [react-dom/src/client/ReactDOMHostConfig](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMHostConfig.js):
  - appendChildToContainer.
  - finalizeInitialChildren.
- [react-dom/src/client/ReactDOMComponent](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMComponent.js):
  - setInitialProperties:
    设置初始化属性, 处理特殊元素和事件.

```ts
// Legacy Mode
import type { ReactElement } from 'react'
import type { Container } from './types'
import Reconciler from './reconciler'

const Renderer = {
  render: (
    element: ReactElement,
    container: Container | null,
    callback?: Function
  ): void => {
    if (container) {
      const root = Reconciler.createContainer(container, 0, false, null)
      Reconciler.updateContainer(element, root, null)
    }
  },
}

export default Renderer
```

```ts
// Modern Mode
import type { ReactElement } from 'react'
import type { Container, OpaqueRoot } from './types'
import Reconciler from './reconciler'

const Renderer = {
  createRoot: (
    container: Container | null,
    callback?: Function
  ): OpaqueRoot => {
    if (container) {
      const root = Reconciler.createContainer(container, 0, false, null)

      root.render = function (element: ReactElement) {
        Reconciler.updateContainer(element, this, null)
      }

      return root
    }
  },
}

export default Renderer
```

### SetState

- [react-dom/src/events/ReactDOMEventListener](https://github.com/facebook/react/blob/main/packages/react-dom/src/events/ReactDOMEventListener.js):
  - dispatchDiscreteEvent.
- [react/src/ReactBaseClasses](https://github.com/facebook/react/blob/main/packages/react/src/ReactBaseClasses.js):
  - **setState**.
- [react-reconciler/src/ReactFiberClassComponent](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberClassComponent.js):
  - enqueueSetState.
- [react-reconciler/src/ReactUpdateQueue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactUpdateQueue.js):
  - createUpdate.
  - enqueueUpdate.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **scheduleUpdateOnFiber**.
  - discreteUpdates.
- [react-reconciler/src/ReactFiberSyncTaskQueue](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberSyncTaskQueue.js):
  - flushSyncCallbacks.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **performSyncWorkOnRoot**.
  - workLoopSync.
  - **performUnitOfWork**.
- [react-reconciler/src/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):
  - **beginWork**.
  - **updateXXXComponent**.
  - reconcileChildren.
- [react-reconciler/src/ReactChildFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js):
  - reconcileChildFibers.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **completeUnitOfWork**.
- [react-reconciler/src/ReactFiberCompleteWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCompleteWork.js)
  - **completeWork**.
- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - **commitRoot**.
  - commitMutationEffects.
- [react-reconciler/src/ReactFiberCommitWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberCommitWork.js):
  - commitWork.
- [react-dom/src/client/ReactDOMHostConfig](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMHostConfig.js):
  - commitUpdate.
- [react-dom/src/client/ReactDOMComponentTree](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMComponentTree.js):
  - updateFiberProps.
- [react-dom/src/client/ReactDOMComponent](https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMComponent.js):
  - updateProperties:
    Apply diff.

### ClassComponent

- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - performSyncWorkOnRoot.
  - workLoopSync.
  - performUnitOfWork.
- [react-reconciler/src/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):
  - beginWork
  - **updateClassComponent**.
- [react-reconciler/src/ReactFiberClassComponent](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberClassComponent.js):
  - updateClassInstance.
- [react-reconciler/src/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):
  - finishClassComponent.
  - **instance.render** (User defined Component).
  - **reconcileChildren**.
- [react-reconciler/src/ReactChildFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js):
  - reconcileChildFibers.

### FunctionComponent

- [react-reconciler/src/ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js):
  - performSyncWorkOnRoot.
  - workLoopSync.
  - performUnitOfWork.
- [react-reconciler/src/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):
  - beginWork.
  - **updateFunctionComponent**.
- [react-reconciler/src/ReactFiberHooks](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js):
  - renderWithHooks.
  - **FunctionComponent()** (User defined Function).
  - **Hooks**: useXXX -> mountXXX -> updateXXX.
- [react-reconciler/src/ReactFiberBeginWork](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js):
  - **reconcileChildren**.
- [react-reconciler/src/ReactChildFiber](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactChildFiber.js):
  - reconcileChildFibers.
