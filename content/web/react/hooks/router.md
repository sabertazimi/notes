---
sidebar_position: 24
tags: [Web, React, Hook, Router]
---

# Router

```ts
import { use, useEffect } from 'react'
import { __RouterContext } from 'react-router'
import useForceUpdate from 'use-force-update'

function useReactRouter() {
  const forceUpdate = useForceUpdate()
  const routerContext = use(__RouterContext)

  useEffect(
    () => routerContext.history.listen(forceUpdate),
    [forceUpdate, routerContext]
  )

  return routerContext
}
```

## URL Params

Storing state in the URL:

```ts
export default function useStateParams<T>(
  initialState: T,
  paramsName: string,
  serialize: (state: T) => string,
  deserialize: (state: string) => T
): [T, (state: T) => void] {
  const history = useHistory()
  const search = new URLSearchParams(history.location.search)
  const existingValue = search.get(paramsName)

  const [state, setState] = useState<T>(
    () => existingValue ? deserialize(existingValue) : initialState
  )

  useEffect(() => {
    // Updates state when user navigates backwards or forwards in browser history
    if (existingValue && deserialize(existingValue) !== state) {
      setState(() => deserialize(existingValue))
    }
  }, [existingValue])

  const onChange = (s: T) => {
    setState(s)
    const searchParams = new URLSearchParams(history.location.search)
    searchParams.set(paramsName, serialize(s))
    const pathname = history.location.pathname
    history.push({ pathname, search: searchParams.toString() })
  }

  return [state, onChange]
}
```

## History

```ts
import { useCallback, useReducer } from 'react'

// Initial state that we pass into useReducer
const initialState = {
  // Array of previous state values updated each time we push a new state
  past: [],
  // Current state value
  present: null,
  // Will contain "future" state values if we undo (so we can redo)
  future: [],
}

// Our reducer function to handle state changes based on action
function reducer(state, action) {
  const { past, present, future } = state

  switch (action.type) {
    case 'UNDO': {
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      }
    }
    case 'REDO': {
      const next = future[0]
      const newFuture = future.slice(1)

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      }
    }
    case 'SET': {
      const { newPresent } = action

      if (newPresent === present)
        return state

      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      }
    }
    case 'CLEAR': {
      const { initialPresent } = action

      return {
        ...initialState,
        present: initialPresent,
      }
    }
    default:
      throw new Error('Unsupported action type!')
  }
}

// Hook
function useHistory(initialPresent) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  })

  const canUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0

  // Setup our callback functions
  // We memoize with useCallback to prevent unnecessary re-renders

  const undo = useCallback(() => {
    if (canUndo)
      dispatch({ type: 'UNDO' })
  }, [dispatch, canUndo])

  const redo = useCallback(() => {
    if (canRedo)
      dispatch({ type: 'REDO' })
  }, [dispatch, canRedo])

  const set = useCallback(
    newPresent => dispatch({ type: 'SET', newPresent }),
    [dispatch]
  )

  const clear = useCallback(
    () => dispatch({ type: 'CLEAR', initialPresent }),
    [dispatch, initialPresent]
  )

  // If needed we could also return past and future state
  return { state: state.present, set, undo, redo, clear, canUndo, canRedo }
}
```
