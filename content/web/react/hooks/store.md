---
sidebar_position: 27
tags: [Web, React, Hook, Store]
---

# Store

```ts
import { useState } from 'react'

export const store = {
  state: {},
  setState(value) {
    this.state = value
    this.setters.forEach(setter => setter(this.state))
  },
  setters: [],
}

// Bind the setState function to the store object so
// we don't lose context when calling it elsewhere
store.setState = store.setState.bind(store)

// this is the custom hook we'll call on components.
export default function useStore() {
  const [state, setState] = useState(store.state)

  if (!store.setters.includes(setState))
    store.setters.push(setState)

  return [state, store.setState]
}
```

## Pub-Sub

Complex [implementation](https://github.com/timc1/kbar):

```ts
import type {
  Action,
  ActionId,
  ActionTree,
  KBarOptions,
  KBarProviderProps,
  KBarState,
} from './types'
import { deepEqual } from 'fast-equals'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VisualState } from './types'

type useStoreProps = KBarProviderProps

export default function useStore(props: useStoreProps) {
  if (!props.actions) {
    throw new Error(
      'You must define a list of `actions` when calling KBarProvider'
    )
  }

  const [state, setState] = useState<KBarState>({
    searchQuery: '',
    currentRootActionId: null,
    visualState: VisualState.hidden,
    actions: props.actions.reduce((acc, current) => {
      acc[current.id] = current
      return acc
    }, {}),
  })

  const currentStateRef = useRef(state)
  currentStateRef.current = state

  const getState = useCallback(() => currentStateRef.current, [])
  const publisher = useMemo(() => new Publisher(getState), [getState])

  useEffect(() => {
    currentStateRef.current = state
    publisher.notify()
  }, [publisher, state])

  const optionsRef = useRef((props.options || {}) as KBarOptions)

  const registerActions = useCallback((actions: Action[]) => {
    const actionsByKey: ActionTree = actions.reduce((acc, current) => {
      acc[current.id] = current
      return acc
    }, {})

    setState(state => ({
      ...state,
      actions: {
        ...actionsByKey,
        ...state.actions,
      },
    }))

    return function unregister() {
      setState((state) => {
        const actions = state.actions
        const removeActionIds = Object.keys(actionsByKey)
        removeActionIds.forEach(actionId => delete actions[actionId])
        return {
          ...state,
          actions: {
            ...state.actions,
            ...actions,
          },
        }
      })
    }
  }, [])

  return useMemo(() => {
    return {
      getState,
      query: {
        setCurrentRootAction: (actionId: ActionId | null | undefined) => {
          setState(state => ({
            ...state,
            currentRootActionId: actionId,
          }))
        },
        setVisualState: (
          cb: ((vs: VisualState) => VisualState) | VisualState
        ) => {
          setState(state => ({
            ...state,
            visualState: typeof cb === 'function' ? cb(state.visualState) : cb,
          }))
        },
        setSearch: (searchQuery: string) =>
          setState(state => ({
            ...state,
            searchQuery,
          })),
        registerActions,
      },
      options: optionsRef.current,
      subscribe: (
        collector: <C>(state: KBarState) => C,
        cb: <C>(collected: C) => void
      ) => publisher.subscribe(collector, cb),
    }
  }, [getState, publisher, registerActions])
}

class Publisher {
  getState
  subscribers: Subscriber[] = []

  constructor(getState: () => KBarState) {
    this.getState = getState
  }

  subscribe<C>(
    collector: (state: KBarState) => C,
    onChange: (collected: C) => void
  ) {
    const subscriber = new Subscriber(
      () => collector(this.getState()),
      onChange
    )
    this.subscribers.push(subscriber)
    return this.unsubscribe.bind(this, subscriber)
  }

  unsubscribe(subscriber: Subscriber) {
    if (this.subscribers.length) {
      const index = this.subscribers.indexOf(subscriber)
      if (index > -1)
        return this.subscribers.splice(index, 1)
    }
  }

  notify() {
    this.subscribers.forEach(subscriber => subscriber.collect())
  }
}

class Subscriber {
  collected: any // Previous state cache.
  collector
  onChange

  constructor(collector: () => any, onChange: (collected: any) => any) {
    this.collector = collector
    this.onChange = onChange
  }

  collect() {
    try {
      // Grab latest state.
      const recollect = this.collector()
      if (!deepEqual(recollect, this.collected)) {
        this.collected = recollect
        if (this.onChange)
          this.onChange(this.collected)
      }
    } catch (error) {
      console.warn(error)
    }
  }
}
```

## Recoil

Recoil [minimal implementation](https://github.com/bennetthardwick/recoil-clone):

- `Atom`: collect children callbacks as `listeners`, notify children when value changed.
- `Selector`: collect parent `Atoms` as `deps`, update value when parent Atoms notified.

```ts
interface Disconnector {
  disconnect: () => void
}

class Stateful<T> {
  private listeners = new Set<(value: T) => void>()

  constructor(private value: T) {}

  protected _update(value: T) {
    this.value = value
    this.notify()
  }

  snapshot(): T {
    return this.value
  }

  notify() {
    for (const listener of this.listeners) listener(this.snapshot())
  }

  subscribe(callback: (value: T) => void): Disconnector {
    this.listeners.add(callback)
    return {
      disconnect: () => {
        this.listeners.delete(callback)
      },
    }
  }
}

class Atom<T> extends Stateful<T> {
  update(value: T) {
    super._update(value)
  }
}

interface GeneratorContext {
  get: <V>(dependency: Stateful<V>) => V
}

type SelectorGenerator<T> = (context: GeneratorContext) => T

export class Selector<T> extends Stateful<T> {
  private registeredDeps = new Set<Stateful>()

  constructor(private readonly generate: SelectorGenerator<T>) {
    super(undefined as any)
    const context = { get: dep => this.getDep(dep) }
    this.value = generate(context)
  }

  private getDep<V>(dep: Stateful<V>): V {
    if (!this.registeredDeps.has(dep)) {
      // Update when parent Atom changed.
      dep.subscribe(() => this.updateSelector())
      this.registeredDeps.add(dep)
    }

    return dep.snapshot()
  }

  private updateSelector() {
    const context = { get: dep => this.getDep(dep) }
    this.update(this.generate(context))
  }
}

export function atom<V>(value: { key: string, default: V }): Atom<V> {
  return new Atom(value.default)
}

export function selector<V>(value: {
  key: string
  get: SelectorGenerator<V>
}): Selector<V> {
  return new Selector(value.get)
}

// This hook will re-render whenever supplied `Stateful` value changes.
// It can be used with `Selector` or `Atom`.
export function useCoiledValue<T>(value: Stateful<T>): T {
  const [, updateState] = useState({})

  // Force update when value changed.
  useEffect(() => {
    const { disconnect } = value.subscribe(() => updateState({}))
    return () => disconnect()
  }, [value])

  return value.snapshot()
}

// Similar to above method, but it also lets set state.
// It only can be used with `Atom`.
export function useCoiledState<T>(atom: Atom<T>): [T, (value: T) => void] {
  const value = useCoiledValue(atom)
  return [value, useCallback(value => atom.update(value), [atom])]
}
```

```ts
function generate(context) {
  // Register NameAtom as a dependency and get its snapshot value:
  // get(nameAtom) => selector.getDep(nameAtom)
  // => nameAtom.subscribe(() => selector.updateSelector) + selector.deps.add(nameAtom)
  const name = context.get(nameAtom)
  // Do the same for AgeAtom
  const age = context.get(ageAtom)

  // Return new value using parent atoms.
  // E.g. 'Bob is 20 years old'.
  return `${name} is ${age} years old.`
}
```

## Atom

Simple global store based on:

- Subscribe pattern.
- UseState hook.
- Atomic state library: e.g. [Jotai](https://blog.axlight.com/posts/jotai-tips).

```ts
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'

const store = new Map<string, any>()

class Atom<T> {
  key = nanoid()
  subscribers = new Map<
    MutableRefObject<boolean>,
    Dispatch<SetStateAction<T>>
  >()

  private _current: T

  constructor(initialState: T) {
    store.set(this.key, initialState)
    this._current = initialState
  }

  subscribe(
    ref: MutableRefObject<boolean>,
    action: Dispatch<SetStateAction<T>>
  ) {
    this.subscribers.set(ref, action)
  }

  unsubscribe(ref: MutableRefObject<boolean>) {
    this.subscribers.delete(ref)
  }

  setState(nextState: T) {
    this._current = nextState
    store.set(this.key, nextState)
    this.subscribers.forEach(action => action(nextState))
  }

  get current() {
    return this._current
  }
}

export const atom = <T>(initialState: T) => new Atom(initialState)

export function useAtomValue<T>(atom: Atom<T>) {
  const ref = useRef(false)
  const [state, setState] = useState(atom.current)

  if (ref.current === false) {
    ref.current = true
    atom.subscribe(ref, setState)
  }

  useMount(() => () => atom.unsubscribe(ref))

  return state
}

export function setAtomValue<T>(atom: Atom<T>) {
  return (nextState: T) => atom.setState(nextState)
}
```

## Zustand

Zustand [internals](https://gist.github.com/arkatsy/7ff5b6cd95fe94b5e480972a0d116aeb):

```ts
/**
 * For more on the useSyncExternalStore hook.
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
import { useSyncExternalStore } from 'react'

// https://github.com/pmndrs/zustand/blob/fe47d3e6c6671dbfb9856fda52cb5a3a855d97a6/src/vanilla.ts#L57-L94
function createStore(createState) {
  let state
  let initialState
  const listeners = new Set()

  const setState = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial

    if (!Object.is(nextState, state)) {
      const previousState = state
      state = Object.assign({}, state, nextState)
      listeners.forEach(listener => listener(state, previousState))
    }
  }

  const getState = () => state
  const getInitialState = () => initialState

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const api = { setState, getState, getInitialState, subscribe }
  initialState = state = createState(setState, getState, api)

  return api
}

// https://github.com/pmndrs/zustand/blob/fe47d3e6c6671dbfb9856fda52cb5a3a855d97a6/src/react.ts#L21
const identity = state => state

// https://github.com/pmndrs/zustand/blob/fe47d3e6c6671dbfb9856fda52cb5a3a855d97a6/src/react.ts#L29-L40
function useStore(api, selector = identity) {
  const slice = useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  )

  return slice
}

// https://github.com/pmndrs/zustand/blob/fe47d3e6c6671dbfb9856fda52cb5a3a855d97a6/src/react.ts#L56-L64
function create(createState) {
  const api = createStore(createState)
  const useBoundStore = selector => useStore(api, selector)
  Object.assign(useBoundStore, api)

  return useBoundStore
}

// Usage
const useCountStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}))
```

```tsx
function App() {
  return (
    <div>
      <Counter1 />
      <Counter2 />
    </div>
  )
}

function Counter1() {
  const { count, increment, decrement } = useCountStore()

  return (
    <div>
      <h2>Counter1</h2>
      <div>{count}</div>
      <button type="button" onClick={decrement}>-</button>
      <button type="button" onClick={increment}>+</button>
    </div>
  )
}

function Counter2() {
  const { count, increment, decrement } = useCountStore()

  return (
    <div>
      <h2>Counter2</h2>
      <div>{count}</div>
      <button type="button" onClick={decrement}>-</button>
      <button type="button" onClick={increment}>+</button>
    </div>
  )
}
```
