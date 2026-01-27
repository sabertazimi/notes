---
sidebar_position: 5
tags: [Web, React, Pattern]
---

# Patterns

## Higher Order Components

Higher Order Components (HoC) to solve:

- Reuse code with using ES6 classes.
- Compose multiple HOCs.

:::tip[Pros]

- Reusable (abstract same logic).
- HOC is flexible with input data
  (pass input data as parameters or derive it from props).

:::

:::caution[Cons]

- Wrapper hell: `withA(withB(withC(withD(Comp))))`.
- Implicit dependencies: which HOC providing a certain prop.
- Name collision/overlap props: overwrite the same name prop silently.
- HOC is not flexible with output data (to WrappedComponent).

:::

```tsx
// ToggleableMenu.jsx
function withToggleable(Clickable) {
  return class Toggleable extends React.Component<{ children: ReactElement }> {
    constructor() {
      super()
      this.toggle = this.toggle.bind(this)
      this.state = { show: false }
    }

    toggle() {
      this.setState(prevState => ({ show: !prevState.show }))
    }

    render() {
      return (
        <div>
          <Clickable {...this.props} onClick={this.toggle} />
          {this.state.show && this.props.children}
        </div>
      )
    }
  }
}

class NormalMenu extends React.Component<{ onClick: Function, title: string }> {
  render() {
    return (
      <div onClick={this.props.onClick}>
        <h1>{this.props.title}</h1>
      </div>
    )
  }
}

const ToggleableMenu = withToggleable(NormalMenu)
export default ToggleableMenu
```

```tsx
class Menu extends React.Component {
  render() {
    return (
      <div>
        <ToggleableMenu title="First Menu">
          <p>Some content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Second Menu">
          <p>Another content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Third Menu">
          <p>More content</p>
        </ToggleableMenu>
      </div>
    )
  }
}
```

## Render Props

`children`/`props` as render function to solve:

- Reuse code with using ES6 classes.
- Lowest level of indirection.
- No naming collision.

e.g. `Context` or `ThemesProvider` is designed base on Render Props.

:::tip[Pros]

- Separate presentation from logic.
- Extendable.
- Reusable (abstract same logic).
- Render Props is flexible with output data
  (children parameters definition free).

:::

:::caution[Cons]

- Wrapper hell (when many cross-cutting concerns are applied to a component).
- Minor memory issues when defining a closure for every render.
- Unable to optimize code with `React.memo`/`React.PureComponent`
  due to `render()` function always changes.
- Render Props is not flexible with input data
  (restricts children components from using the data at outside field).

:::

```tsx
interface Props {
  title: string
  children: ReactElement
}

class Toggleable extends React.Component<Props> {
  constructor() {
    super()
    this.toggle = this.toggle.bind(this)
    this.state = { show: false }
  }

  toggle() {
    this.setState(prevState => ({ show: !prevState.show }))
  }

  render() {
    return this.props.children(this.state.show, this.toggle)
  }
}

export default function ToggleableMenu({ title, children }: Props) {
  return (
    <Toggleable>
      {(show, onClick) => (
        <div>
          <div onClick={onClick}>
            <h1>{title}</h1>
          </div>
          {show && children}
        </div>
      )}
    </Toggleable>
  )
}
```

```tsx
class Menu extends React.Component {
  render() {
    return (
      <div>
        <ToggleableMenu title="First Menu">
          <p>Some content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Second Menu">
          <p>Another content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Third Menu">
          <p>More content</p>
        </ToggleableMenu>
      </div>
    )
  }
}
```

## Hooks

- No wrapper hell: every hook is just one line of code.
- No implicit dependencies: explicit one certain call for one certain hook.
- No name collision and overlap props due to flexible data usage.
- No need for `JSX`.
- Flexible data usage.
- Flexible optimization methods:
  - Avoid re-render with hook deps list.
  - `useMemo` hook for memorized values.
  - `useCallback` hook for memorized functions.
  - `useRef` hook for lifecycle persistent values.
- Recap related-logic into separate well-structured hooks.
- Reuse same stateful logic with custom hooks.

## References

- React component library [patterns](https://www.gabe.pizza/notes-on-component-libraries).
- React interview [questions](https://github.com/semlinker/reactjs-interview-questions).
