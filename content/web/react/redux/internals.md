---
sidebar_position: 8
tags: [Web, React, Redux, State Management, Internals]
---

# Internals

## Constructor

- Use closure to store state and subscribe.
- Use middleware to change normal dispatch function.

```ts
function applyMiddleware(...middlewares) {
  return (store) => {
    // should return (next) => (action) => { ... } function
    if (middlewares.length === 0)
      return dispatch => dispatch

    if (middlewares.length === 1)
      return middlewares[0]

    // [ (next) => (action) => {...}, ... ] array
    // next: (action) => { ... } function
    const boundMiddlewares = middlewares.map(middleware => middleware(store))

    return boundMiddlewares.reduce((a, b) => next => a(b(next)))
  }
}

function createStore(reducer, middleware) {
  // closure for storing global state
  let state
  const subscribers = []
  const coreDispatch = (action) => {
    validateAction(action)
    state = reducer(state, action)
    subscribers.forEach(handler => handler())
  }
  const getState = () => state

  const store = {
    dispatch: coreDispatch,
    getState,
    subscribe: (handler) => {
      subscribers.push(handler)

      // unsubscribe function
      return () => {
        const index = subscribers.indexOf(handler)

        if (index > 0)
          subscribers.splice(index, 1)
      }
    },
  }

  if (middleware) {
    // store default dispatch
    const dispatch = action => store.dispatch(action)

    // middleware = ({ dispatch, getState }) => (next) => (action) => { ... };
    // middleware is a higher-order function (return (action) => { ... });
    // dispatch, getState and coreDispatch are injected into middleware as arguments
    store.dispatch = middleware({
      dispatch,
      getState,
    })(coreDispatch)
  }

  coreDispatch({
    type: INIT_REDUX,
  })
  return store
}
```

## Action Validation

```ts
function isValidKey(key) {
  return ['type', 'payload', 'error', 'meta'].includes(key)
}

function validateAction(action) {
  if (!action || typeof action !== 'object' || Array.isArray(action))
    throw new Error('Action must be an object!')

  if (typeof action.type === 'undefined')
    throw new TypeError('Action must have a type!')

  if (!Object.keys(action).every(isValidKey)) {
    throw new Error(
      'Action only have `type`, `payload`, `error` or `meta` field!'
    )
  }
}
```

## Provider

- use Context to provide store (two methods):
  - inject store into every children recursively
  - use Consumer in Connect higher order component
    `<Consumer>{store => (<WrapperComponent store={store}>)}</Consumer>`

```tsx
interface Store {
  getState: Function
  subscribe: Function
  dispatch: Function
}

const StoreContext = React.createContext(store)

export function Provider({
  store,
  children,
}: {
  store: Store
  children: ReactElement
}) {
  return (
    <StoreContext value={store}>
      <StoreContext.Consumer>
        {(store) => {
          const childrenWithStore = React.Children.map(children, child =>
            React.cloneElement(child, { store }))

          return <div>{childrenWithStore}</div>
        }}
      </StoreContext.Consumer>
    </StoreContext>
  )
}

function connect(
  mapStateToProps = () => ({}),
  mapDispatchToProps = () => ({})
) {
  return (Component) => {
    class Connected extends React.Component<{ store: Store }> {
      onStoreOrPropsChange(props) {
        const { store } = this.props
        const state = store.getState()
        const stateProps = mapStateToProps(state, props)
        const dispatchProps = mapDispatchToProps(store.dispatch, props)
        this.setState({
          ...stateProps,
          ...dispatchProps,
        })
      }

      UNSAFE_componentWillMount() {
        const { store } = this.props
        this.onStoreOrPropsChange(this.props)
        this.unsubscribe = store.subscribe(() =>
          this.onStoreOrPropsChange(this.props)
        )
      }

      UNSAFE_componentWillReceiveProps(nextProps) {
        this.onStoreOrPropsChange(nextProps)
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      render() {
        return <Component {...this.props} {...this.state} />
      }
    }

    return Connected
  }
}
```
