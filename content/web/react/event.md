---
sidebar_position: 3
tags: [Web, React, Event]
---

# Synthetic Events

- Events delegation:
  - React 16: delegate events handlers on `document` DOM node.
  - React 17: delegate events handlers on `app` root DOM node.
  - 先处理原生事件, 后处理 React 事件.
- Events dispatching: dispatch native events to `React.onXXX` handlers by `SyntheticEvent`.
  - 收集监听器: `const listeners = accumulateSinglePhaseListeners(targetFiber, eventName)`.
  - 派发合成事件: `dispatchQueue.push({ new SyntheticEvent(eventName), listeners })`.
  - 执行派发:
    `processDispatchQueue(dispatchQueue, eventSystemFlags)`
    -> `executeDispatch(event, listener, currentTarget)`.
  - Capture event: 从上至下调用 Fiber 树中绑定的回调函数.
  - Bubble event: 从下至上调用 Fiber 树中绑定的回调函数.

[![React Synthetic Events](./figures/react-synthetic-events.png)](https://7kms.github.io/react-illustration-series/main/synthetic-event)

[react-dom/src/events/DOMPluginEventSystem](https://github.com/facebook/react/blob/main/packages/react-dom/src/events/DOMPluginEventSystem.js):

```ts
function listenToAllSupportedEvents(rootContainerElement: EventTarget) {
  if (enableEagerRootListeners) {
    // 1. 节流优化, 保证全局注册只被调用一次.
    if (rootContainerElement[listeningMarker])
      return

    rootContainerElement[listeningMarker] = true

    // 2. 遍历 allNativeEvents 监听冒泡和捕获阶段的事件.
    allNativeEvents.forEach((domEventName) => {
      if (!nonDelegatedEvents.has(domEventName)) {
        listenToNativeEvent(
          domEventName,
          false, // 冒泡阶段监听.
          rootContainerElement,
          null,
        )
      }

      listenToNativeEvent(
        domEventName,
        true, // 捕获阶段监听.
        rootContainerElement,
        null,
      )
    })
  }
}

function listenToNativeEvent(
  domEventName: DOMEventName,
  isCapturePhaseListener: boolean,
  rootContainerElement: EventTarget,
  targetElement: Element | null,
  eventSystemFlags?: EventSystemFlags = 0,
): void {
  const target = rootContainerElement
  const listenerSet = getEventListenerSet(target)
  const listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener)

  // 利用 Set 数据结构, 保证相同的事件类型只会被注册一次.
  if (!listenerSet.has(listenerSetKey)) {
    if (isCapturePhaseListener)
      eventSystemFlags |= IS_CAPTURE_PHASE

    // 注册事件监听.
    addTrappedEventListener(
      target,
      domEventName,
      eventSystemFlags,
      isCapturePhaseListener,
    )
    listenerSet.add(listenerSetKey)
  }
}

function addTrappedEventListener(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  isCapturePhaseListener: boolean,
  isDeferredListenerForLegacyFBSupport?: boolean,
) {
  // 1. 构造 listener.
  const listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
  )

  // 2. 注册事件监听.
  let unsubscribeListener

  if (isCapturePhaseListener) {
    unsubscribeListener = addEventCaptureListener(
      targetContainer,
      domEventName,
      listener,
    )
  } else {
    unsubscribeListener = addEventBubbleListener(
      targetContainer,
      domEventName,
      listener,
    )
  }
}

// 注册原生冒泡事件.
function addEventBubbleListener(
  target: EventTarget,
  eventType: string,
  listener: Function,
): Function {
  target.addEventListener(eventType, listener, false)
  return listener
}

// 注册原生捕获事件.
function addEventCaptureListener(
  target: EventTarget,
  eventType: string,
  listener: Function,
): Function {
  target.addEventListener(eventType, listener, true)
  return listener
}
```

[react-dom/src/events/ReactDOMEventListener](https://github.com/facebook/react/blob/main/packages/react-dom/src/events/ReactDOMEventListener.js):

```ts
// 派发原生事件至 React.onXXX.
function createEventListenerWrapperWithPriority(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
): Function {
  // 1. 根据优先级设置 listenerWrapper.
  const eventPriority = getEventPriorityForPluginSystem(domEventName)
  let listenerWrapper

  switch (eventPriority) {
    case DiscreteEvent:
      listenerWrapper = dispatchDiscreteEvent
      break
    case UserBlockingEvent:
      listenerWrapper = dispatchUserBlockingUpdate
      break
    case ContinuousEvent:
    default:
      listenerWrapper = dispatchEvent
      break
  }

  // 2. 返回 listenerWrapper.
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer,
  )
}

function dispatchDiscreteEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent,
) {
  const previousPriority = getCurrentUpdatePriority()
  const prevTransition = ReactCurrentBatchConfig.transition
  ReactCurrentBatchConfig.transition = null

  try {
    setCurrentUpdatePriority(DiscreteEventPriority)
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent)
  } finally {
    setCurrentUpdatePriority(previousPriority)
    ReactCurrentBatchConfig.transition = prevTransition
  }
}

function dispatchContinuousEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent,
) {
  const previousPriority = getCurrentUpdatePriority()
  const prevTransition = ReactCurrentBatchConfig.transition
  ReactCurrentBatchConfig.transition = null

  try {
    setCurrentUpdatePriority(ContinuousEventPriority)
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent)
  } finally {
    setCurrentUpdatePriority(previousPriority)
    ReactCurrentBatchConfig.transition = prevTransition
  }
}

function dispatchEvent(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent,
) {
  let blockedOn = findInstanceBlockingEvent(
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent,
  )

  if (blockedOn === null) {
    dispatchEventForPluginEventSystem(
      domEventName,
      eventSystemFlags,
      nativeEvent,
      return_targetInst,
      targetContainer,
    )
    clearIfContinuousEvent(domEventName, nativeEvent)
    return
  }

  if (
    queueIfContinuousEvent(
      blockedOn,
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent,
    )
  ) {
    nativeEvent.stopPropagation()
    return
  }

  // We need to clear only if we didn't queue because queueing is accumulative.
  clearIfContinuousEvent(domEventName, nativeEvent)

  if (
    eventSystemFlags & IS_CAPTURE_PHASE
    && isDiscreteEventThatRequiresHydration(domEventName)
  ) {
    while (blockedOn !== null) {
      const fiber = getInstanceFromNode(blockedOn)

      if (fiber !== null)
        attemptSynchronousHydration(fiber)

      const nextBlockedOn = findInstanceBlockingEvent(
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent,
      )

      if (nextBlockedOn === null) {
        dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          return_targetInst,
          targetContainer,
        )
      }

      if (nextBlockedOn === blockedOn)
        break

      blockedOn = nextBlockedOn
    }

    if (blockedOn !== null)
      nativeEvent.stopPropagation()

    return
  }

  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    null,
    targetContainer,
  )
}
```
