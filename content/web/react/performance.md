---
sidebar_position: 17
tags: [Web, React, Performance]
---

# Performance

## Mental Model

**3L** - Less render times, less render calculations, less render nodes:

- 数据: 利用缓存 (复用数据与 VNode), 减少 re-render 次数.
- 计算: 精确判断更新时机和范围, 减少计算量, 优化 render 过程.
- 渲染: 精细粒度, 降低组件复杂度, 减少 DOM 数量.

## Re-rendering

React will [recursively render **all child components**](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior)
inside of it (because `props.children` is always a new reference when parent re-rendering).

The major difference is that
`React.Component` doesn’t implement `shouldComponentUpdate()` lifecycle method
while `React.PureComponent` implements it.

If component `render()` function renders
the same result given the same props and state,
use `React.PureComponent`/`React.memo` for a performance boost in some cases.

```tsx
import { PureComponent } from 'react'

function Unstable({ value }: { value: string }) {
  console.log(' Rendered Unstable component ')

  return (
    <div>
      <p>{value}</p>
    </div>
  )
}

class App extends PureComponent {
  state = {
    value: 1,
  }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState(() => {
        return { value: 1 }
      })
    }, 2000)
  }

  componentWillUnmount() {
    clearInterval(interval)
  }

  render() {
    return (
      <div>
        <Unstable value={this.state.value} />
      </div>
    )
  }
}

export default App
```

```tsx
import { Component } from 'react'

function Unstable({ value }: { value: string }) {
  console.log(' Rendered this component ')

  return (
    <div>
      <p>{value}</p>
    </div>
  )
}

const MemoedUnstable = React.memo(Unstable)

class App extends Component {
  state = {
    value: 1,
  }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState(() => {
        return { value: 1 }
      })
    }, 2000)
  }

  componentWillUnmount() {
    clearInterval(interval)
  }

  render() {
    return (
      <div>
        <MemoedUnstable value={this.state.value} />
      </div>
    )
  }
}

export default App
```

[Prevent useless re-rendering](https://www.developerway.com/posts/react-re-renders-guide):

- `shouldComponentUpdate`.
- `React.PureComponent`: **shallow compare** diff.
- `React.memo`: **shallow compare** diff,
  to memorize stateless components that **props not changed often**,
  `export default React.memo(MyComponent, areEqual)`.
- Memorized values.
- Memorized event handlers.
- 在用 `memo` 或者 `useMemo` 做优化前
  ([Before You Memo](https://overreacted.io/before-you-memo)),
  可以从不变的部分里分割出变化的部分.
  通过将变化部分的 `state` 向下移动从而抽象出变化的子组件,
  或者将**变化内容提升** (**Lift Up**) 到父组件从而将不变部分独立出来:
  - Composition pattern, composite immutable/expensive component:
    - Sibling component.
    - Props component: `props.children`/`props.renderProps`.
  - Make reference values become immutable:
    - Styles (`object`).
    - Event callbacks (`function`).
    - [Babel plugin](https://www.npmjs.com/package/@babel/plugin-transform-react-constant-elements)
      to hoist reference values.

```tsx
// BAD
// When <App> re-rendering, <ExpensiveTree> will re-rendering:
// <ExpensiveTree /> is actually <ExpensiveTree props={}>.
// Every time <App> re-rendering will pass a new `{}` reference to <ExpensiveTree>.
import { useState } from 'react'

export default function App() {
  const [color, setColor] = useState('red')

  return (
    <div>
      <input value={color} onChange={e => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </div>
  )
}

function ExpensiveTree() {
  const now = performance.now()

  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }

  return <p>I am a very slow component tree.</p>
}
```

Composite sibling component:

```tsx
// GOOD
// <ExpensiveTree> will not re-rendering.
export default function App() {
  return (
    <>
      <Form />
      <ExpensiveTree />
    </>
  )
}

function Form() {
  const [color, setColor] = useState('red')
  return (
    <>
      <input value={color} onChange={e => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
    </>
  )
}
```

Composite props component:

```tsx
// GOOD
// <ExpensiveTree> will not re-rendering.
export default function App() {
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />
    </ColorPicker>
  )
}

function ColorPicker({ children }: { children: ReactElement }) {
  const [color, setColor] = useState('red')
  return (
    <div style={{ color }}>
      <input value={color} onChange={e => setColor(e.target.value)} />
      {children}
    </div>
  )
}
```

```tsx
export default function Parent({
  children,
  lastChild,
}: {
  children: ReactElement
  lastChild: ReactElement
}) {
  return (
    <div className="parent">
      <ChildA />
      {' '}
      {/* Only ChildA gets re-rendered */}
      {children}
      {' '}
      {/* Bailed out */}
      {lastChild}
      {' '}
      {/* Bailed out */}
    </div>
  )
}
```

Immutable objects:

```tsx
// BAD
export default function App1(items) {
  return <BigListComponent style={{ width: '100%' }} items={items} />
}
```

```tsx
// GOOD
const bigListStyle = { width: '100%' }

export default function App2(items) {
  return <BigListComponent style={bigListStyle} items={items} />
}
```

Immutable functions:

```tsx
// BAD: Inline function
export default function App1(items) {
  return <BigListComponent onClick={() => dispatchEvent()} />
}
```

```tsx
// GOOD: Reference to a function
const clickHandler = () => dispatchEvent()

export default function App2(items) {
  return <BigListComponent onClick={clickHandler} />
}
```

## Code Splitting

```tsx
import { Formik } from 'formik'
import { Component } from 'react'
import * as Yup from 'yup'

const formValidator = Yup.object().shape({
  /* ... */
})

export default class Form extends Component {
  render() {
    return <Formik validationSchema={formValidator}>{/* ... */}</Formik>
  }
}
```

```tsx
import { Component } from 'react'

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      Form: undefined,
    }
  }

  render() {
    const { Form } = this.state

    return (
      <div className="app">
        {Form
          ? (
              <Form />
            )
          : (
              <button type="button" onClick={this.showForm}>
                Show form
              </button>
            )}
      </div>
    )
  }

  showForm = async () => {
    const { default: Form } = await import('./Form')
    this.setState({ Form })
  }
}
```

## Best Practices

- Use `key` correctly.
- `React.useMemo` and `React.useCallback` (no anonymous functions).
- `shouldComponentUpdate`/`React.memo`/`React.PureComponent`:
  **shallow compare** on components
  to prevent unnecessary re-rendering **caused by parent components**.
- Lazy loading components (`React.lazy` and `React.Suspense`).
- Virtualized Lists.
- Stateless component: less props, less state, less nest (HOC or render props).
- `Immutable.js`.
- Isomorphic rendering.
- Webpack bundle analyzer.
- `useDeferredValue`/`useTransition` hook for debounce concurrent features.

Production [case studies](https://largeapps.dev/case-studies/advanced):

1. Performance optimization is paramount:
   - Optimizing Core Web Vitals: LCP and INP are key focus.
   - Reducing JavaScript payload.
   - Main thread workload.
2. SSR vs CSR: Striking the right balance:
   - SSR for initial load and SEO.
   - CSR for Interactivity and Rich UI.
   - Progressive Hydration and islands architecture.
   - Watch out for SSR Pitfalls.
3. Smart caching strategies for speed and freshness:
   - Edge and CDN caching.
   - Next.js App Router cache.
   - Client-Side state caching.
4. Evolving State Management: simplify and leverage specialized Hooks:
   - Don’t over-engineer global state.
   - Rethinking Redux.
   - Rise of specialized state libraries.
5. Improved developer experience (DX) and maintainability:
   - Next.js App structure and convention.
   - Tooling for fast iteration.
   - CI/CD and deployment improvements.
   - Embracing React primitives (Suspense, Error Boundaries).
6. Accessibility by design:
   - Semantic HTML and proper ARIA usage.
   - Keyboard navigation and focus management.
   - Testing with assistive tech.
7. User Experience enhancements and impact:
   - Faster loads and interactions.
   - Seamless navigation and transitions.
   - Consistent UX across devices.
   - Feedback and user-centric metrics.

## References

- [Progressive React](https://houssein.me/progressive-react).
- Sentry performance [guide](https://blog.sentry.io/react-js-performance-guide) for React.
