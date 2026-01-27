---
sidebar_position: 2
tags: [Web, React, State]
---

# State

## SetState

- `setState` synchronous way:
  when it comes `blocking mode`
  (`ReactDOM.createBlockingRoot(rootNode).render(<App />)`),
  `setState` works in synchronous mode:
  `scheduleUpdateOnFiber` -> `ensureRootIsScheduled` -> **`flushSyncCallbackQueue`**.
- `setState` asynchronous way:
  at most of the other time, `setState` works in asynchronous mode,
  including `legacy mode`(`ReactDOM.render(<App />, rootNode)`)
  and `concurrent mode`(`ReactDOM.createRoot(rootNode).render(<App />)`).
- 在异步模式下, 为了防止子组件在处理事件时多次渲染,
  将多个 `setState` (包括父组件) 移到浏览器事件之后执行
  (`Batched Updates`: 此时 React 内部变量 `isBatchingUpdates` 变成 `true`),
  可以提升 React 性能.
  未来会在更多的可以 `Batched Updates` 的场景下将 `setState` 设为异步执行,
  所以编写代码时最好将 `setState` 总是当做异步执行函数.

```tsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      val: 0,
    }
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 第 1 次 log

    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 第 2 次 log

    const timeout = setTimeout(() => {
      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val) // 第 3 次 log

      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val) // 第 4 次 log
    }, 0)
  }

  componentWillUnmount() {
    clearTimeout(timeout)
  }

  render() {
    return <div>Example</div>
  }
}

// => 0 0 2 3
```

:::tip[State Structure Principles]

[Principles for structuring state](https://react.dev/learn/choosing-the-state-structure):

- Group related state.
- Avoid contradictions in state.
- Avoid duplication in state.
- Avoid redundant state.
- Avoid deeply nested state.

:::

## componentDidMount

- Don't `setState` directly in this method.
- Can use `setInterval`/`setTimeout`/AJAX request/`fetch` in this method,
  and call `setState` as `callback` inside these functions.

```tsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    }
  }

  componentDidMount() {
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items,
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
        },
      )
  }

  render() {
    const { error, isLoaded, items } = this.state
    if (error) {
      return (
        <div>
          Error:
          {error.message}
        </div>
      )
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name}
              {' '}
              {item.price}
            </li>
          ))}
        </ul>
      )
    }
  }
}
```
