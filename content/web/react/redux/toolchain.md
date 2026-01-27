---
sidebar_position: 5
tags: [Web, React, Redux, State Management, Toolchain]
---

# Toolchain

## React

- `useSelector`.
- `useDispatch`:
  dispatch function reference will be stable
  as long as same store instance is being passed to the `<Provider>`.

### Types

```ts
import type { TypedUseSelectorHook } from 'react-redux'
import type store from './store'
import { useDispatch, useSelector } from 'react-redux'

type AppDispatch = typeof store.dispatch
type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### Hooks

```ts
import { shallowEqual, useSelector } from 'react-redux'

export default function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual)
}
```

```ts
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

export default function useActions(actions) {
  const dispatch = useDispatch()

  return useMemo(() => {
    if (Array.isArray(actions))
      return actions.map(a => bindActionCreators(a, dispatch))

    return bindActionCreators(actions, dispatch)
  }, [actions, dispatch])
}
```

### APIs

[`batch`](https://react-redux.js.org/api/batch):

```ts
import { batch } from 'react-redux'

function myThunk() {
  return (dispatch, getState) => {
    // Only result in one combined re-render, not two.
    batch(() => {
      dispatch(increment())
      dispatch(increment())
    })
  }
}
```

## SSR

- Client side:
  a new Redux store will be created with state provided from server.
- Server side:
  provide the initial state of app.

`client.jsx`:

```tsx
import { hydrateRoot } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './containers/App'
import counterApp from './reducers'

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__

const store = createStore(counterApp, preloadedState)

hydrateRoot(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

`server.js`:

```tsx
import path from 'node:path'
import Express from 'express'
import qs from 'qs'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './containers/App'
import counterApp from './reducers'

const app = Express()
const port = 3000

app.use('/static', Express.static('static'))

app.use(handleRender)

function handleRender(req, res) {
  // `parseInt` to prevent XSS attack
  const params = qs.parse(req.query)
  const counter = Number.parseInt(params.counter, 10) || 0

  const preloadedState = { counter }
  const store = createStore(counterApp, preloadedState)

  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  const finalState = store.getState()
  res.send(renderFullPage(html, finalState))
}

function renderFullPage(html, preloadedState) {
  // https://redux.js.org/usage/server-rendering#security-considerations
  // `replace(/</g, '\\u003c')` to prevent XSS attack
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: security issues around embedding JSON in HTML:
          // https://redux.js.org/usage/server-rendering#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c'
          )}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

app.listen(port)
```

## Library

### Immutable

- [Immer](https://github.com/immerjs/immer):
  Create next immutable state by mutating current one.
- [Immutable.js](https://github.com/immutable-js/immutable-js):
  Immutable persistent data collections.

### Middleware

- [Thunk](https://github.com/reduxjs/redux-thunk):
  Async actions.
- [Saga](https://github.com/yelouafi/redux-saga):
  Side effects.

### State

- [Reselect](https://github.com/reduxjs/reselect):
  Memorize state transformation.

### Debugging

- [Devtools](https://github.com/reduxjs/redux-devtools):
  Hot reloading and action replay.
