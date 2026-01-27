---
sidebar_position: 6
tags: [Web, React, Error, Fragment, Portal]
---

# Features

## Error Boundary

以下是错误边界不起作用的情况:

- 事件处理器内代码.
- `setTimeout` 或 `requestAnimationFrame` 回调中的异步代码.
- 服务端渲染代码.
- 错误边界代码本身.

[React Error Boundary](https://github.com/bvaughn/react-error-boundary) library:

```tsx
class ErrorBoundary extends React.Component<{ children: ReactElement }> {
  state = {
    hasError: false,
    error: null,
    info: null,
  }

  // key point
  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      info,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops, something went wrong :(</h1>
          <p>
            The error:
            {this.state.error.toString()}
          </p>
          <p>
            Where it occurred:
            {this.state.info.componentStack}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Fragment

- Less node, less memory, faster performance.
- Avoid extra parent-child relationship for CSS flex and grid layout.
- DOM debug inspector is less cluttered.

```tsx
class Items extends React.Component {
  render() {
    return (
      <>
        <Fruit />
        <Beverages />
        <Drinks />
      </>
    )
  }
}

class Fruit extends React.Component {
  render() {
    return (
      <>
        <li>Apple</li>
        <li>Orange</li>
        <li>Blueberry</li>
        <li>Cherry</li>
      </>
    )
  }
}

class Frameworks extends React.Component {
  render() {
    return (
      <>
        <p>JavaScript:</p>
        <li>React</li>
        ,
        <li>Vuejs</li>
        ,
        <li>Angular</li>
      </>
    )
  }
}
```

## Portal

Portal provide a first-class way to render children into a DOM node
that exists **outside** the DOM hierarchy of the parent component
`ReactDOM.createPortal(child, container)`.

```html
<div id="root"></div>
<div id="portal"></div>
```

```tsx
const portalRoot = document.getElementById('portal')

class Portal extends React.Component<{ children: ReactElement }> {
  constructor() {
    super()
    this.el = document.createElement('div')
  }

  componentDidMount = () => {
    portalRoot.appendChild(this.el)
  }

  componentWillUnmount = () => {
    portalRoot.removeChild(this.el)
  }

  render() {
    const { children } = this.props
    return ReactDOM.createPortal(children, this.el)
  }
}

interface Props {
  on: boolean
  toggle: Function
  children: ReactElement
}

class Modal extends React.Component<Props> {
  render() {
    const { children, toggle, on } = this.props

    return (
      <Portal>
        {on
          ? (
              <div className="modal is-active">
                <div className="modal-background" />
                <div className="modal-content">
                  <div className="box">
                    <h2 className="subtitle">{children}</h2>
                    <button
                      type="button"
                      onClick={toggle}
                      className="closeButton button is-info"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )
          : null}
      </Portal>
    )
  }
}

class App extends React.Component {
  state = {
    showModal: false,
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  render() {
    const { showModal } = this.state
    return (
      <div className="box">
        <h1 className="subtitle">Hello, I am the parent!</h1>
        <button
          type="button"
          onClick={this.toggleModal}
          className="button is-black"
        >
          Toggle Modal
        </button>
        <Modal on={showModal} toggle={this.toggleModal}>
          {showModal ? <h1>Hello, I am the portal!</h1> : null}
        </Modal>
      </div>
    )
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```
