---
tags: [Web, Vue, Internals, Virtual DOM]
sidebar_position: 26
---

# Virtual DOM

VNode Type:

- HTML native tag.
- Plain text.
- Component:
  - Functional component.
  - Stateful component:
    - Normal stateful component.
    - Need keep-alive stateful component.
    - Already keep-alive stateful component.
- Fragment.
- Portal.
- Suspense.

```ts
export default class VNode {
  tag: string | void
  data: VNodeData | void
  children: Array<VNode> | null
  text: string | void
  elm: Node | void
  ns: string | void
  context: Component | void // rendered in this component's scope
  key: string | number | void
  componentOptions: VNodeComponentOptions | void
  componentInstance: Component | void // component instance
  parent: VNode | void // component placeholder node

  // strictly internal
  raw: boolean // contains raw HTML? (server only)
  isStatic: boolean // hoisted static node
  isRootInsert: boolean // necessary for enter transition check
  isComment: boolean // empty comment placeholder?
  isCloned: boolean // is a cloned node?
  isOnce: boolean // is a v-once node?
  asyncFactory: Function | void // async component factory function
  asyncMeta: object | void
  ssrContext: object | void
  fnContext: Component | void // real context vm for functional nodes
  fnOptions: ComponentOptions | null // for SSR caching
  fnScopeId: string | null // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode> | null,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }
}
```

```ts
const VNodeFlags = {
  ELEMENT_HTML: 1,
  ELEMENT_SVG: 1 << 1,
  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  COMPONENT_FUNCTIONAL: 1 << 5,
  TEXT: 1 << 6,
  FRAGMENT: 1 << 7,
  PORTAL: 1 << 8,
}

VNodeFlags.ELEMENT
  = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG

VNodeFlags.COMPONENT_STATEFUL
  = VNodeFlags.COMPONENT_STATEFUL_NORMAL
    | VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE
    | VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE

VNodeFlags.COMPONENT
  = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL

const ChildrenFlags = {
  // 未知的 children 类型。
  UNKNOWN_CHILDREN: 0,
  // 没有 children。
  NO_CHILDREN: 1,
  // children 是单个 VNode。
  SINGLE_VNODE: 1 << 1,
  // children 是多个拥有 key 的 VNode。
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode。
  NONE_KEYED_VNODES: 1 << 3,
}

ChildrenFlags.MULTIPLE_VNODES
  = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES

export interface VNode {
  _isVNode: true
  // Refer to real DOM.
  el: Element | null
  flags: VNodeFlags
  tag: string | FunctionalComponent | ComponentClass | null
  data: VNodeData | null
  children: VNodeChildren
  childFlags: ChildrenFlags
}
```
