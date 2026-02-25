---
sidebar_position: 4
tags: [Web, React, TypeScript]
---

# Types

## Props

```ts
export declare interface AppProps {
  children: React.ReactNode // best
  style?: React.CSSProperties // for style
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void // form events!
  props: Props & React.HTMLProps<HTMLButtonElement>
}
```

`ComponentProps`:

- `React.ComponentProps`
- `React.ComponentPropsWithRef`
- `React.ComponentPropsWithoutRef`

```tsx
import { Button } from 'library'

type ButtonProps = React.ComponentProps<typeof Button>
type AlertButtonProps = Omit<ButtonProps, 'onClick'>

const AlertButton: React.FC<AlertButtonProps> = props => (
  <Button onClick={() => alert('hello')} {...props} />
)

export default function App() {
  return <AlertButton />
}
```

Typing existing untyped React components:

```ts
declare module 'react-router-dom' {
  import * as React from 'react'

  interface NavigateProps<T> {
    to: string | number
    replace?: boolean
    state?: T
  }

  export class Navigate<T = any> extends React.Component<NavigateProps<T>> {}
}
```

## Class

- `React.Component<P, S>`
- `readonly state: State`
- `static defaultProps`
- `static getDerivedStateFromProps`

```tsx
class MyComponent extends React.Component<{
  message?: string
}> {
  render() {
    const { message = 'default' } = this.props
    return <div>{message}</div>
  }
}
```

```tsx
import Button from './Button'

type Props = typeof ButtonCounter.defaultProps & {
  name: string
}

const initialState = { clicksCount: 0 }
type State = Readonly<typeof initialState>

class ButtonCounter extends React.Component<Props, State> {
  readonly state: State = initialState

  static defaultProps = {
    name: 'count',
  }

  static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    // ...
  }

  render() {
    return <span>{this.props.foo}</span>
  }
}
```

## Generics

```tsx
// 一个泛型组件
interface SelectProps<T> {
  items: T[]
}

class Select<T> extends React.Component<SelectProps<T>, any> {}

// 使用
const Form = () => <Select<string> items={['a', 'b']} />

export default function App() {
  return <Form />
}
```

In `.tsx` file, `<T>` maybe considered `JSX.Element`,
use `extends {}` to avoid it:

```tsx
const foo = <T extends object>(arg: T) => arg
```

## Function

Don't use `React.FC`/`React.FunctionComponent`:

- React 17:
  Unnecessary addition of `children` (hide some run-time error).
- React 18:
  `@types/react` v18 [remove implicit `children` in `React.FunctionComponent`](https://github.com/ant-design/ant-design/pull/34937).
- `React.FC` doesn't support generic components.
- Barrier for `<Comp>` with `<Comp.Sub>` types (**component as namespace pattern**).
- `React.FC` doesn't work correctly with `defaultProps`.

```tsx
// Declaring type of props
interface Props {
  message: string
}

// Inferred return type
const Message = ({ message }: Props) => <div>{message}</div>

// Explicit return type annotation
const Message = ({ message }: Props): JSX.Element => <div>{message}</div>

// Inline types annotation
const Message = ({ message }: { message: string }) => <div>{message}</div>

export default function App() {
  return <Message message="message" />
}
```

- `JSX.Element`: return value of `React.createElement`.
- `React.ReactNode`: return value of a component.

```ts
function foo(bar: string) {
  return { baz: 1 }
}

type FooReturn = ReturnType<typeof foo> // { baz: number }
```

## DOM

HTML and CSS:

- `React.DOMAttributes<HTMLElement>`
- `React.AriaAttributes<HTMLElement>`
- `React.SVGAttributes<HTMLElement>`
- `React.HTMLAttributes<HTMLElement>`
- `React.ButtonHTMLAttributes<HTMLButtonElement>`
- `React.HTMLProps<HTMLElement>`
- `React.CSSProperties`

## Event

- `React.SyntheticEvent`.
- `React.AnimationEvent`:
  CSS animations.
- `React.ChangeEvent`:
  `<input>`/`<select>`/`<textarea>` change events.
- `React.ClipboardEvent`:
  copy/paste/cut events.
- `React.CompositionEvent`:
  user indirectly entering text events.
- `React.DragEvent`:
  drag/drop interaction events.
- `React.FocusEvent`:
  elements gets/loses focus events.
- `React.FormEvent<HTMLElement>`:
  form focus/change/submit events.
- `React.InvalidEvent`:
  validity restrictions of inputs fails.
- `React.KeyboardEvent`:
  keyboard interaction events.
- `React.MouseEvent`:
  pointing device interaction events (e.g. mouse).
- `React.TouchEvent`:
  touch device interaction events.
  Extends UIEvent.
- `React.PointerEvent`:
  advanced pointing device interaction events
  (includes mouse, pen/stylus, touchscreen),
  recommended for modern browser.
  Extends `UIEvent`.
- `React.TransitionEvent`:
  CSS transition.
  Extends UIEvent.
- `React.UIEvent`:
  base event for Mouse/Touch/Pointer events.
- `React.WheelEvent`:
  mouse wheel scrolling events.
- Missing `InputEvent` (extends `UIEvent`):
  `InputEvent` is still an experimental interface
  and not fully supported by all browsers.
  Use `SyntheticEvent` instead.
- `React.ChangeEventHandler<HTMLElement>`.

```ts
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: keyof WindowEventMap,
  handler: (event: Event) => void,
  element?: RefObject<T>,
) {
  // Create a ref that stores handler
  const saveHandlerRef = useRef<(event: Event) => void>()

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window
    if (!(targetElement && targetElement.addEventListener))
      return

    // Update saved handler if necessary
    if (saveHandlerRef.current !== handler)
      saveHandlerRef.current = handler

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      saveHandlerRef?.current(event)
    }

    targetElement.addEventListener(eventName, eventListener)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element, handler])
}

export default useEventListener
```

## Form

```tsx
interface State {
  text: string
}

class App extends React.Component<Props, State> {
  state = {
    text: '',
  }

  // typing on RIGHT hand side of =
  onChangeEvent = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ text: e.currentTarget.value })
  }

  // typing on LEFT hand side of =
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({ text: e.currentTarget.value })
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.text} onChange={this.onChange} />
      </div>
    )
  }
}
```

```tsx
export default function Form() {
  return (
    <form
      ref={formRef}
      onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault()

        const target = e.target as typeof e.target & {
          email: { value: string }
          password: { value: string }
        }

        const email = target.email.value // Type Checks
        const password = target.password.value // Type Checks
      }}
    >
      <div>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
      </div>
      <div>
        <input type="submit" value="Log in" />
      </div>
    </form>
  )
}
```

## Input

```ts
type StringChangeHandler = (newValue: string) => void
type NumberChangeHandler = (newValue: number) => void
type BooleanChangeHandler = (newValue: boolean) => void

interface BaseInputDefinition {
  id: string
  label: string
}

interface TextInputDefinition extends BaseInputDefinition {
  type: 'text'
  value: string
  onChange: StringChangeHandler
}

interface NumberInputDefinition extends BaseInputDefinition {
  type: 'number'
  value: number
  onChange: NumberChangeHandler
}

interface CheckboxInputDefinition extends BaseInputDefinition {
  type: 'checkbox'
  value: boolean
  onChange: BooleanChangeHandler
}

type Input
  = | TextInputDefinition
    | NumberInputDefinition
    | CheckboxInputDefinition
```

## Portal

```tsx
const modalRoot = document.getElementById('modal-root') as HTMLElement

export class Modal extends React.Component<{ children: ReactElement }> {
  el: HTMLElement = document.createElement('div')

  componentDidMount() {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}
```

```tsx
import type * as React from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const modalRoot = document.querySelector('#modal-root') as HTMLElement

const Modal: React.FC<object> = ({ children }) => {
  const elRef = useRef(document.createElement('div'))

  useEffect(() => {
    const current = elRef.current
    modalRoot!.appendChild(current)
    return () => modalRoot!.removeChild(current)
  }, [])

  return createPortal(children, elRef.current)
}

export default Modal
```

```tsx
import { Modal } from '@components'

export default function App() {
  const [showModal, setShowModal] = React.useState(false)

  return (
    <div>
      <div id="modal-root"></div>
      {showModal && (
        <Modal>
          <div>
            I&apos;m a modal!
            {' '}
            <button type="button" onClick={() => setShowModal(false)}>
              close
            </button>
          </div>
        </Modal>
      )}
      <button type="button" onClick={() => setShowModal(true)}>
        show Modal
      </button>
    </div>
  )
}
```

## Redux

```ts
const initialState = {
  name: '',
  points: 0,
  likesGames: true,
}

type State = typeof initialState
```

```ts
export function updateName(name: string) {
  return {
    type: 'UPDATE_NAME',
    name,
  } as const
}

export function addPoints(points: number) {
  return {
    type: 'ADD_POINTS',
    points,
  } as const
}

export function setLikesGames(value: boolean) {
  return {
    type: 'SET_LIKES_GAMES',
    value,
  } as const
}

type Action = ReturnType<
  typeof updateName | typeof addPoints | typeof setLikesGames
>

// =>
// type Action = {
//   readonly type: 'UPDATE_NAME';
//   readonly name: string;
// } | {
//   readonly type: 'ADD_POINTS';
//   readonly points: number;
// } | {
//   readonly type: 'SET_LIKES_GAMES';
//   readonly value: boolean;
// }
```

```ts
import type { Reducer } from 'redux'

function reducer(state: State, action: Action): Reducer<State, Action> {
  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...state, name: action.name }
    case 'ADD_POINTS':
      return { ...state, points: action.points }
    case 'SET_LIKES_GAMES':
      return { ...state, likesGames: action.value }
    default:
      return state
  }
}
```

## Hooks

- `useState<T>`
- `Dispatch<T>`
- `SetStateAction<T>`
- `RefObject<T>`
- `MutableRefObject<T>`
- More [TypeScript Hooks](https://github.com/juliencrn/useHooks.ts).

Use `as const` type assertion to avoid type inference
(especially for `[first, second]` type).

```ts
export function useLoading() {
  const [isLoading, setIsLoading] = React.useState(false)
  const load = () => {
    setSIsLoading(true)
  }

  // return `[boolean, () => void]` as want
  // instead of `(boolean | () => void)[]`
  return [isLoading, load] as const
}
```

```ts
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

interface ReturnType {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

function useBoolean(defaultValue?: boolean): ReturnType {
  const [value, setValue] = useState(!!defaultValue)

  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)
  const toggle = () => setValue(x => !x)

  return { value, setValue, setTrue, setFalse, toggle }
}

export default useBoolean
```

## State

```tsx
export default function App() {
  const [user, setUser] = React.useState<IUser>({} as IUser)
  const handleClick = () => setUser(newUser)

  return <div>App</div>
}
```

## Reducer

- Use [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions)
  for reducer actions.

```tsx
const initialState = { count: 0 }
type State = typeof initialState

type Action
  = | { type: 'increment', payload: number }
    | { type: 'decrement', payload: string }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.payload }
    case 'decrement':
      return { count: state.count - Number(action.payload) }
    default:
      throw new Error('Error')
  }
}

export default function Counter() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <>
      Count:
      {' '}
      {state.count}
      <button
        type="button"
        onClick={() => dispatch({ type: 'decrement', payload: '5' })}
      >
        -
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'increment', payload: 5 })}
      >
        +
      </button>
    </>
  )
}
```

## Ref

### DOM Element

- If possible, prefer as specific as possible.
- Return type is `RefObject<T>`.

```tsx
export default function Foo() {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current)
      throw new Error('divRef is not assigned')

    doSomethingWith(divRef.current)
  })

  return <div ref={divRef}>etc</div>
}
```

### Mutable Value

- Return type is `MutableRefObject<T>`.

```tsx
export default function Foo() {
  const intervalRef = useRef<number | null>(null)

  // You manage the ref yourself (that's why it's called MutableRefObject!)
  useEffect(() => {
    intervalRef.current = setInterval()
    return () => clearInterval(intervalRef.current)
  }, [])

  // The ref is not passed to any element's "ref" prop
  return (
    <button type="button" onClick={() => clearInterval(intervalRef.current)}>
      Cancel timer
    </button>
  )
}
```

## Fetch

```ts
import type { AxiosRequestConfig } from 'axios'

import axios from 'axios'
import { useEffect, useReducer, useRef } from 'react'

// State & hook output
interface State<T> {
  status: 'init' | 'fetching' | 'error' | 'fetched'
  data?: T
  error?: string
}

type Cache<T> = Record<string, T>

// discriminated union type
type Action<T>
  = | { type: 'request' }
    | { type: 'success', payload: T }
    | { type: 'failure', payload: string }

function useFetch<T = unknown>(
  url?: string,
  options?: AxiosRequestConfig,
): State<T> {
  const cacheRef = useRef<Cache<T>>({})
  const cancelRequestRef = useRef<boolean>(false)

  const initialState: State<T> = {
    status: 'init',
    error: undefined,
    data: undefined,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'request':
        return { ...initialState, status: 'fetching' }
      case 'success':
        return { ...initialState, status: 'fetched', data: action.payload }
      case 'failure':
        return { ...initialState, status: 'error', error: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    if (!url)
      return

    const fetchData = async () => {
      dispatch({ type: 'request' })

      if (cacheRef.current[url]) {
        dispatch({ type: 'success', payload: cacheRef.current[url] })
      } else {
        try {
          const response = await axios(url, options)
          cacheRef.current[url] = response.data

          if (cancelRequestRef.current)
            return

          dispatch({ type: 'success', payload: response.data })
        } catch (error) {
          if (cancelRequestRef.current)
            return

          dispatch({ type: 'failure', payload: error.message })
        }
      }
    }

    fetchData()

    return () => {
      cancelRequestRef.current = true
    }
  }, [url])

  return state
}

export default useFetch
```

## References

- React TypeScript [cheat sheets](https://github.com/typescript-cheatsheets/react).
