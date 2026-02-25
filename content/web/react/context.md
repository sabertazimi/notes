---
sidebar_position: 7
tags: [Web, React, Context]
---

# Context

Context provide a Dependency Injection style method,
to provide values to children components.

Context 中只定义被大多数组件所共用的属性
(avoid **Prop Drilling**):

- Global state.
- UI Theme.
- Preferred locale language.
- Application configuration.
- User setting.
- Authenticated user.
- Service collection.

频繁的 Context value 更改会导致依赖 value 的组件
穿透 `shouldComponentUpdate`/`React.memo` 进行 `forceUpdate`,
增加 `render` 次数, 从而导致性能问题.

```tsx
import { createContext, use, useMemo, useState } from 'react'
import { fakeAuth } from './app/services/auth'

const AuthContext = createContext()

function useAuth() {
  return use(AuthContext)
}

export default function AuthProvider({ children }: { children: ReactElement }) {
  const [user, setUser] = useState(null)

  const signIn = useCallback((cb) => {
    return fakeAuth.signIn(() => {
      setUser('user')
      cb()
    })
  }, [])

  const signOut = useCallback((cb) => {
    return fakeAuth.signOut(() => {
      setUser(null)
      cb()
    })
  }, [])

  const auth = useMemo(() => {
    return {
      user,
      signIn,
      signOut,
    }
  }, [user, signIn, signOut])

  return <AuthContext value={auth}>{children}</AuthContext>
}
```

## Refs

```tsx
// Context.js
import { Component, createContext } from 'react'

const CustomContext = createContext()
const { Provider: ContextProvider, Consumer } = CustomContext

class Provider extends Component<{ children: ReactElement }> {
  // refs
  // usage: this.textareaRef.current
  textareaRef = React.createRef()

  // input handler
  onInput = (e) => {
    const { name, value } = e.target

    this.setState({
      [name]: value,
    })
  }

  render() {
    return (
      <ContextProvider
        value={{
          textareaRef: this.textareaRef,
          onInput: this.onInput,
        }}
      >
        {this.props.children}
      </ContextProvider>
    )
  }
}
```

```tsx
// TextArea.jsx
import { Consumer } from './Context'

export default function TextArea() {
  return (
    <Consumer>
      {context => (
        <textarea
          ref={context.textareaRef}
          className="app__textarea"
          name="snippet"
          placeholder="Your snippet…"
          onChange={context.onInput}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          wrap="off"
        />
      )}
    </Consumer>
  )
}
```

## Internals

`createContext` 创建了一个 `{ _currentValue, Provider, Consumer }` 对象:

- `_currentValue` 保存值.
- `Provider` 为一种 JSX 类型, 会转为对应的 fiber 类型, 负责修改 `_currentValue`.
- `Consumer` 和 `useContext` 负责读取 `_currentValue`.
- `Provider` 处理每个节点之前会入栈当前 `Context`, 处理完会出栈,
  保证 `Context` 只影响子组件, 实现嵌套 `Context`.
