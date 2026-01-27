---
tags: [Web, Vue]
---

# Vue

:::tip[Version Coverage]

These notes cover both Vue 2 (Options API) and Vue 3 (Composition API), including internal implementation details.

:::

## Basic Concepts

- [Directives](./directives.md) - Control flow, binding, events, model directives
- [Components](./components.md) - Computed properties, slots, provide/inject
- [Composition API](./composition.md) - Setup, lifecycle, reactivity
- [Animation](./animation.md) - Transitions and animation system
- [Concurrent](./concurrent.md) - Async component, suspense
- [Keep Alive and Teleport](./keep-alive-teleport.md) - Component caching and DOM teleportation
- [Router](./router.md) - Router guide
- [Vuex](./vuex.md) - Vuex for state management
- [Toolchain](./toolchain.md) - Vite, CLI

## Advanced Internals

- [Architecture](./architecture.md) - Constructor, prototype, global API
- [Options API](./options.md) - Options merging, normalization
- [Lifecycle](./lifecycle.md) - Component initialization, lifecycle, and rendering
- [Virtual DOM](./virtual-dom.md) - VNode structure and types
- [Template Compiler](./template-compiler.md) - Compilation workflow and performance
- [Legacy Reactivity](./legacy-reactivity.md) - Legacy reactivity system
- [Modern Reactivity](./modern-reactivity.md) - Modern reactivity system

## Quick Start

### For Beginners

Start with:

1. [Directives](./directives.md) - Learn v-if, v-for, v-model, event handling
2. [Components](./components.md) - Understand computed, slots, props
3. [Composition API](./composition.md) - Explore setup, ref, reactive, computed

### For Advanced Users

Deep dive into:

1. [Architecture](./architecture.md) - How Vue is built
2. [Options API](./options.md) - Options merge strategies
3. [Lifecycle](./lifecycle.md) - From `new Vue()` to rendering
4. [Virtual DOM](./virtual-dom.md) - VNode types and rendering
5. [Template Compiler](./template-compiler.md) - Template to render function
6. [Legacy Reactivity](./legacy-reactivity.md) - Observer/Watcher/Dep system
7. [Modern Reactivity](./modern-reactivity.md) - Proxy/reactive/effect system
