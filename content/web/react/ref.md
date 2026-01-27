---
sidebar_position: 10
tags: [Web, React, Ref]
---

# Ref

Refs 用于返回对元素的引用.
但在大多数情况下, 应该避免使用它们.
当需要直接访问 DOM 元素或组件的实例时, 它们可能非常有用:

- Managing focus, text selection, or media playback.
- Triggering imperative animations.
- Integrating with third-party DOM libraries.k

`Ref` 通过将 Fiber 树中的 `instance` 赋给 `ref.current` 实现

```ts
function commitAttachRef(finishedWork: Fiber) {
  // finishedWork 为含有 Ref effectTag 的 Fiber
  const ref = finishedWork.ref

  // 含有 ref prop, 这里是作为数据结构
  if (ref !== null) {
    // 获取 ref 属性对应的 Component 实例
    const instance = finishedWork.stateNode
    let instanceToUse
    switch (finishedWork.tag) {
      case HostComponent:
        // 对于 HostComponent, 实例为对应 DOM 节点
        instanceToUse = getPublicInstance(instance)
        break
      default:
        // 其他类型实例为 fiber.stateNode
        instanceToUse = instance
    }

    // 赋值 ref
    if (typeof ref === 'function')
      ref(instanceToUse)
    else ref.current = instanceToUse
  }
}
```

```tsx
class CssThemeProvider extends React.PureComponent<Props> {
  private rootRef = React.createRef<HTMLDivElement>()

  render() {
    return <div ref={this.rootRef}>{this.props.children}</div>
  }
}
```

## String

**不建议使用** [`String Refs`](https://github.com/facebook/react/pull/8333#issuecomment-271648615):

- React 无法获取 `this` 引用, 需要持续追踪当前`render`出的组件, 性能变慢.
- `String Refs` 不可组合化:
  if library puts ref on passed child, user can't put another ref on it.
  `Callback Refs` are perfectly composable.
- `String Refs` don't work with static analysis:
  `Flow` can't guess the magic that framework does to make string ref appear on `this.refs`,
  as well as its type (which could be different).
  `Callback Refs` are friendly to static analysis.
- Starting in React 19, `String Refs` was [removed](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-string-refs).

```tsx
class Foo extends Component {
  render() {
    return <input onClick={() => this.action()} ref="input" />
  }

  action() {
    console.log(this.refs.input.value)
  }
}
```

```tsx
class App extends React.Component<{ data: object }> {
  renderRow = (index) => {
    // ref 会绑定到 DataTable 组件实例, 而不是 App 组件实例上
    return <input ref={`input-${index}`} />

    // 如果使用 function 类型 ref, 则不会有这个问题
    // return <input ref={input => this['input-' + index] = input} />;
  }

  render() {
    return <DataTable data={this.props.data} renderRow={this.renderRow} />
  }
}
```

## Forward

Before React 19, 不能在函数式组件上使用`ref`属性,
因为它们没有实例, 但可以在函数式组件内部使用`ref`.
Ref forwarding 是一个特性,
它允许一些组件获取接收到 ref 对象并将它进一步传递给子组件.

```tsx
// functional component
function Button({ children }: { children: ReactElement }, ref) {
  return (
    <button type="button" ref={ref} className="CustomButton">
      {children}
    </button>
  )
}

// eslint-disable-next-line react/no-forward-ref -- In React 19, 'forwardRef' is no longer necessary.
const ButtonElement = React.forwardRef(Button)

// Create ref to the DOM button:
// get ref to `<button>`
export default function App() {
  const ref = useRef()
  return <ButtonElement ref={ref}>Forward Ref</ButtonElement>
}
```

```tsx
type Ref = HTMLButtonElement
interface Props {
  children: React.ReactNode
}

function Button({ children }: Props, ref: Ref) {
  return (
    <button type="button" ref={ref} className="MyClassName">
      {children}
    </button>
  )
}

// eslint-disable-next-line react/no-forward-ref -- In React 19, 'forwardRef' is no longer necessary.
const FancyButton = React.forwardRef<Ref, Props>(Button)

export default FancyButton
```

## Prop

Starting in React 19, you can now access ref as a prop for function components:

```tsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />
}

<MyInput ref={ref} />
```

## Callback

```tsx
class UserInput extends Component {
  setSearchInput = (input) => {
    this.input = input
  }

  componentDidMount() {
    this.input.focus()
  }

  render() {
    return (
      <>
        <input type="text" ref={this.setSearchInput} />
        <button type="submit">Submit</button>
      </>
    )
  }
}
```
