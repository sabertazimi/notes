---
tags: [Web, Vue, Animation, Transition, Internals]
sidebar_position: 13
---

# Animation

- `v-enter-from`.
- `v-enter-to`: CSS defaults.
- `v-enter-active`.
- `v-leave-from`: CSS defaults.
- `v-leave-to`.
- `v-leave-active`.
- `name`: transition name (different from `v`).
- `mode`:
  - `out-in`: rectify router components transition.
  - `in-out`.

```css
.v-enter-from {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.3s ease-out;
  }
}

.v-leave-to {
  opacity: 0;
}
```

## Fade

```html
<template>
  <div>
    <h1>This is a modal page</h1>
    <button @click="toggleModal">Open</button>
    <transition name="fade" mode="out-in">
      <div v-if="isOpen" class="modal">
        <p><button @click="toggleModal">Close</button></p>
      </div>
    </transition>
  </div>
</template>

<style>
  .fade-enter-from {
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s ease-out;
    }
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
```

```html
<style>
  @media only screen and (prefers-reduced-motion: no-preference) {
    .enter,
    .leave {
      transition: opacity 0.5s ease-out;
    }
  }

  .before-enter,
  .leave {
    opacity: 0;
  }

  .enter,
  .before-leave {
    opacity: 1;
  }
</style>

<script>
  function enter(el, done) {
    el.classList.add('before-enter')

    setTimeout(() => {
      el.classList.remove('before-enter')
      el.classList.add('enter')
    }, 20)

    setTimeout(() => {
      el.classList.remove('enter')
      done()
    }, 500)
  }

  function leave(el, done) {
    el.classList.add('before-leave')

    setTimeout(() => {
      el.classList.remove('before-leave')
      el.classList.add('leave')
    }, 0)

    setTimeout(() => {
      el.classList.remove('leave')
      done()
    }, 500)
  }
</script>
```

## Slide

```css
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

@media (prefers-reduced-motion: no-preference) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.2s ease;
  }
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
```

## Group

```html
<template>
  <div>
    <input type="text" v-model="newContact" placeholder="Name" />
    <button @click="addContact">Add Contact</button>
    <button @click="sortContacts">Sort</button>
    <transition-group name="slide-up" tag="ul" appear>
      <li v-for="contact in contacts" :key="contact">{{ contact }}</li>
    </transition-group>
  </div>
</template>
```

```css
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@media (prefers-reduced-motion: no-preference) {
  .slide-up-enter-active {
    transition: all 0.2s ease;
  }

  .slide-up-move {
    transition: transform 0.8s ease-in;
  }
}
```

## Hooks

`:css="false"` tells Vue don't handle transition classes,
we're relying on JavaScript hooks instead.

When it comes to JavaScript animation library,
transition JavaScript hooks helps a lot.

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
  :css="false"
>
  <div>Modal</div>
</transition>

<transition-group
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
  :css="false"
>
  <div class="card" v-for="card in cards" :key="card.id">
    <p>{{ card.title }}</p>
  </div>
</transition-group>
```

```ts
export default {
  methods: {
    beforeEnter(el) {},
    enter(el, done) {
      done()
    },
    afterEnter(el) {},
    enterCancelled(el) {},
    beforeLeave(el) {},
    leave(el, done) {
      done()
    },
    afterLeave(el) {},
    leaveCancelled(el) {},
  },
}
```

```html
<template>
  <transition appear @before-enter="beforeEnter" @enter="enter" :css="false">
    <div class="card"></div>
  </transition>
</template>

<script>
  import gsap from 'gsap'

  export default {
    methods: {
      beforeEnter(el) {
        el.style.opacity = 0
        el.style.transform = 'scale(0, 0)'
      },
      enter(el, done) {
        gsap.to(el, {
          duration: 1,
          opacity: 1,
          scale: 1,
          ease: 'bounce.inOut',
          onComplete: done,
        })
      },
    },
  }
</script>
```

## Internals

### Component

```ts
const Transition = {
  name: 'Transition',
  setup(props, { slots }) {
    return () => {
      const innerVNode = slots.default()

      innerVNode.transition = {
        beforeEnter(el) {
          el.classList.add('enter-from')
          el.classList.add('enter-active')
        },
        enter(el) {
          nextFrame(() => {
            el.classList.remove('enter-from')
            el.classList.add('enter-to')

            el.addEventListener('transitionend', () => {
              el.classList.remove('enter-to')
              el.classList.remove('enter-active')
            })
          })
        },
        leave(el, performRemove) {
          el.classList.add('leave-from')
          el.classList.add('leave-active')

          nextFrame(() => {
            el.classList.remove('leave-from')
            el.classList.add('leave-to')

            el.addEventListener('transitionend', () => {
              el.classList.remove('leave-to')
              el.classList.remove('leave-active')

              performRemove()
            })
          })
        },
      }

      return innerVNode
    }
  },
}
```

### Module

`platforms/web/runtime/modules/transition.js`:

- 自动嗅探目标元素是否应用了 CSS 过渡或动画, 在恰当的时机添加/删除 CSS 类名.
- 过渡组件提供 JavaScript 钩子函数接口, 钩子函数将在恰当的时机被调用.
- 核心逻辑位于 `enter()` 与 `leave()` 函数.

```ts
export default {
  create: _enter,
  activate: _enter,
  remove(vnode: VNode, rm: Function) {
    if (vnode.data.show !== true)
      leave(vnode, rm)
    else rm()
  },
}

function _enter(_: any, vnode: VNodeWithData) {
  if (vnode.data.show !== true)
    enter(vnode)
}
```

### Group Component

```ts
const TransitionGroup = defineComponent({
  props: extend(
    {
      tag: String,
      moveClass: String,
    },
    transitionProps
  ),

  beforeMount() {
    const update = this._update
    this._update = (vnode, hydrating) => {
      // force removing pass
      this.__patch__(
        this._vnode,
        this.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      )
      this._vnode = this.kept
      update.call(this, vnode, hydrating)
    }
  },

  updated() {
    const children: Array<VNode> = this.prevChildren
    const moveClass: string = this.moveClass || `${this.name || 'v'}-move`

    if (!children.length || !this.hasMove(children[0].elm, moveClass))
      return

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs)
    children.forEach(recordPosition)
    children.forEach(applyTranslation)

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight

    children.forEach((c: VNode) => {
      if (c.data.moved) {
        const el: any = c.elm
        const s: any = el.style
        addTransitionClass(el, moveClass)
        s.transform = s.WebkitTransform = s.transitionDuration = ''
        el.addEventListener(
          transitionEndEvent,
          (el._moveCb = function cb(e) {
            if (e?.propertyName.endsWith('transform')) {
              el.removeEventListener(transitionEndEvent, cb)
              el._moveCb = null
              removeTransitionClass(el, moveClass)
            }
          })
        )
      }
    })
  },

  methods: {
    hasMove(el: any, moveClass: string): boolean {
      if (!hasTransition)
        return false

      if (this._hasMove)
        return this._hasMove

      // Detect whether an element with a move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only move class
      // is applied.
      const clone: HTMLElement = el.cloneNode()

      if (el._transitionClasses) {
        el._transitionClasses.forEach((cls: string) => {
          removeClass(clone, cls)
        })
      }

      addClass(clone, moveClass)
      clone.style.display = 'none'
      this.$el.appendChild(clone)
      const info: object = getTransitionInfo(clone)
      this.$el.removeChild(clone)
      return (this._hasMove = info.hasTransform)
    },
  },

  render(h: Function) {
    const tag: string = this.tag || this.$vnode.data.tag || 'span'
    const map: object = Object.create(null)
    const prevChildren: Array<VNode> = (this.prevChildren = this.children)
    const rawChildren: Array<VNode> = this.$slots.default || []
    const children: Array<VNode> = (this.children = [])
    const transitionData: object = extractTransitionData(this)

    for (let i = 0; i < rawChildren.length; i++) {
      const c: VNode = rawChildren[i]

      if (c.tag && c.key != null && String(c.key).indexOf('__vList') !== 0) {
        children.push(c)
        map[c.key] = c
        ;(c.data || (c.data = {})).transition = transitionData
      }
    }

    if (prevChildren) {
      const kept: Array<VNode> = []
      const removed: Array<VNode> = []

      for (let i = 0; i < prevChildren.length; i++) {
        const c: VNode = prevChildren[i]
        c.data.transition = transitionData
        c.data.pos = c.elm.getBoundingClientRect()

        if (map[c.key])
          kept.push(c)
        else removed.push(c)
      }

      this.kept = h(tag, null, kept)
      this.removed = removed
    }

    return h(tag, null, children)
  },
})
```

`Children` 从旧位置按照的缓动时间过渡偏移到当前目标位置,
实现 `Move` 的过渡动画:

```ts
function callPendingCbs(c: VNode) {
  if (c.elm._moveCb)
    c.elm._moveCb()

  if (c.elm._enterCb)
    c.elm._enterCb()
}

function recordPosition(c: VNode) {
  c.data.newPos = c.elm.getBoundingClientRect()
}

function applyTranslation(c: VNode) {
  const oldPos = c.data.pos
  const newPos = c.data.newPos
  const dx = oldPos.left - newPos.left
  const dy = oldPos.top - newPos.top

  if (dx || dy) {
    c.data.moved = true
    const s = c.elm.style
    s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`
    s.transitionDuration = '0s'
  }
}
```
