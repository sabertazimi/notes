---
sidebar_position: 20
tags: [Web, React, Style Guide]
---

# Style Guide

## Naming Conventions

- use PascalCase for `.jsx` and component constructor
- use camelCase for component instance reference
- use camelCase for props name

```ts
// bad
import reservationCard from './ReservationCard'
```

```ts
// good
import ReservationCard from './ReservationCard'
```

```tsx
// bad
const ReservationItem = <ReservationCard />

// good
const reservationItem = <ReservationCard />

export default function App() {
  return <div>App</div>
}
```

- Setting displayName for HOC:

```tsx
// bad
function withFoo(WrappedComponent) {
  return function WithFoo(props) {
    return <WrappedComponent {...props} foo />
  }
}

// good
function withFoo(WrappedComponent) {
  function WithFoo(props) {
    return <WrappedComponent {...props} foo />
  }

  const wrappedComponentName
    = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  WithFoo.displayName = `withFoo(${wrappedComponentName})`
  return WithFoo
}
```

## Props

- use `prop` not `prop={true}`
- filter out unnecessary props

```tsx
// bad
class Component {
  render() {
    const { irrelevantProp, ...relevantProps } = this.props
    return <WrappedComponent {...this.props} />
  }
}

// good
class Component {
  render() {
    const { irrelevantProp, ...relevantProps } = this.props
    return <WrappedComponent {...relevantProps} />
  }
}
```

## Refs

- use callback refs

```tsx
// bad
// deprecated
export default function Component() {
  return <Foo ref="myRef" />
}
```

```tsx
// good
export default function Component() {
  return (
    <Foo
      ref={(ref) => {
        this.myRef = ref
      }}
    />
  )
}
```

## Alignment

```tsx
// good
const Component = <Foo superLongParam="bar" anotherSuperLongParam="baz" />

// if props fit in one line then keep it on the same line
const Component = <Foo bar="bar" />

// children get indented normally
const Component = (
  <Foo superLongParam="bar" anotherSuperLongParam="baz">
    <Bar />
  </Foo>
)

// good
const Component = <div>{showButton && <Button />}</div>

export default function App() {
  return <Component />
}
```

## Quotes

- Use `"` for JSX attributes, use `'` for all other JS:

```tsx
// bad
// <Foo bar='bar' />

// good
const Foo = <Foo bar="bar" />

// bad
// <Foo style={{ left: "20px" }} />

// good
const Bar = <Foo style={{ left: '20px' }} />

export default function App() {
  return <Foo />
}
```

## Spacing

- A single space in self-closing tag.
- No pad JSX curly spaces>.

```tsx
// bad
// <Foo/>

// very bad
// <Foo                 />

// good
const Foo = <Foo />

// bad
// <Foo bar={ baz } />

// good
const Foo = <Foo bar={baz} />

export default function App() {
  return <Foo />
}
```

## Class

1. Optional static methods
2. Constructor
3. `getChildContext`
4. `getDerivedStateFromProps`
5. `componentDidMount`
6. `getDerivedStateFromProps`
7. `shouldComponentUpdate`
8. `getSnapshotBeforeUpdate`
9. `componentDidUpdate`
10. `componentWillUnmount`
11. Click handlers or event handlers like `onClickSubmit()` or `onChangeDescription()`
12. Getter methods for render like `getSelectReason()` or `getFooterContent()`
13. Optional render methods like `renderNavigation()` or `renderProfilePicture()`
14. `render()`

## Project Structure

- `components`:
  - 模块化隔离, 最小依赖, 测试友好.
  - 每个组件文件夹包含大写并与文件同名的组件,
    且其中除了注入服务操作外, render return 之前, 无任何代码.
  - `use`开头并与文件夹同名的服务.
  - `use`开头, `Service`结尾, 并与文件夹同名的可注入服务.
- `services`: 服务中只存在基础 Hooks, 自定义 Hooks, 第三方 Hooks,
  静态数据, 工具函数, 工具类.

## Best Practices

- 组件细分化.
- 组件:
  - 只传入必要的 props.
  - 使用 `Immutable.js` 或者 `React.addons.update` 实现不可变数据结构.
  - 结合 `React.addons.PureRenderMixin` 来减少 reRender.
- 在 `shouldComponentUpdate` 中优化组件减少 reRender.
- 使用 Context API.
- 少做 DOM 操作，始终让 UI 能够基于 state 还原.
- 在 store 和 action 中不 DOM 操作或者访问 `window.属性`，只与数据打交道.
- 推荐使用 ES6.
- npm 的 debug 包, log 组件渲染的每个步骤和动作.
- [Single Element Pattern](https://github.com/diegohaz/singel).
