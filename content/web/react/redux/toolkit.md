---
sidebar_position: 2
tags: [Web, React, Redux, State Management]
---

# Toolkit

## Action

Because of `ActionCreator.toString()` override,
action creators returned by `createAction()`
can be used directly as **keys** for `case reducers` passed to `createReducer()`.

```ts
import { createAction } from '@reduxjs/toolkit'

const increment = createAction<number | undefined>('counter/increment')

let action = increment() // { type: 'counter/increment' }
action = increment(3) // returns { type: 'counter/increment', payload: 3 }
console.log(increment.toString())
console.log(`The action type is: ${increment}`)
// 'counter/increment'
// 'The action type is: counter/increment'
```

```ts
import { createAction, nanoid } from '@reduxjs/toolkit'

const addTodo = createAction('todos/add', (text: string) => {
  return {
    payload: {
      text,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    },
  }
})

console.log(addTodo('Write more docs'))
/**
 * {
 *   type: 'todos/add',
 *   payload: {
 *     text: 'Write more docs',
 *     id: '4AJvwMsWeHCChcWYga3dj',
 *     createdAt: '2019-10-03T07:53:36.581Z'
 *   }
 * }
 */
```

:::tip[RTK Pitfall]

Strongly recommend to only use string action types.

:::

Redux Toolkit rests on the assumption that you use string action types.
Specifically, some of its features rely on the fact that with strings,
`toString()` method of `createAction()` action creator returns matching action type.

This is not the case for non-string action types because `toString()`
will return the string-converted type value rather than the type **itself**.

```ts
const INCREMENT = Symbol('increment')
const increment = createAction(INCREMENT)

increment.toString()

// returns the string 'Symbol(increment)',
// not the INCREMENT symbol itself.
assert(increment.toString() === INCREMENT, false)

const counterReducer = createReducer(0, {
  // The following case reducer will NOT trigger for
  // increment() actions because `increment` will be
  // interpreted as a string, rather than being evaluated
  // to the INCREMENT symbol.
  [increment]: (state, action) => state + action.payload,

  // You would need to use the action type explicitly instead.
  [INCREMENT]: (state, action) => state + action.payload,
})
```

## Reducer

[Reducer](https://redux.js.org/recipes/reducing-boilerplate),
必须保持无任何副作用: 不修改传入参数, 不调用副作用函数
`(api/date.now()/math.random())`:

```ts
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type))
      return handlers[action.type](state, action)
    else return state
  }
}

const reducer = createReducer(initialState, {
  reset: () => initialState,
  increment: state => ({ count: state.count + 1 }),
  decrement: state => ({ count: state.count + 1 }),
  [ActionTypes.ADD_TODO]: (state, action) => {},
})
```

### Enhancer

Implement reducer enhancer with `higher order reducer`,
like [Redux Undo](https://github.com/omnidan/redux-undo):

```ts
function undoable(reducer) {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  }

  // Return a reducer that handles undo and redo
  return function (state = initialState, action) {
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
      default: {
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action)
        if (present === newPresent)
          return state

        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        }
      }
    }
  }
}
```

```ts
// This is a reducer
import { createStore } from 'redux'

function todos(state = [], action) {
  /* ... */
}

// This is also a reducer!
const undoableTodos = undoable(todos)
const store = createStore(undoableTodos)

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux',
})

store.dispatch({
  type: 'ADD_TODO',
  text: 'Implement Undo',
})

store.dispatch({
  type: 'UNDO',
})
```

### APIs

`createReducer`: `builder.addCase` and `builder.addMatcher`:

- If there is an exact match for the action type,
  the corresponding `case reducer` (`CaseReducer<State, Action>`) will execute first.
- Any matchers that return true
  will execute in the order they were defined.
- If a default case reducer is provided,
  and no case or matcher reducers ran,
  the default case reducer will execute.
- If no case or matcher reducers ran,
  the original existing state value will be returned unchanged.
- `ActionCreator` from RTK has method `ActionCreator.match(action: Action)`,
  can used to TypeScript type narrowing.

```ts
// Simple matcher
function isNumberValueAction(
  action: AnyAction
): action is PayloadAction<{ value: number }> {
  return typeof action.payload.value === 'number'
}
```

```ts
import { createReducer } from '@reduxjs/toolkit'

const reducer = createReducer(0, (builder) => {
  builder
    .addCase('increment', state => state + 1)
    .addMatcher(
      action => action.startsWith('i'),
      state => state * 5
    )
    .addMatcher(
      action => action.endsWith('t'),
      state => state + 2
    )
})

console.log(reducer(0, { type: 'increment' }))
// Returns 7, as the 'increment' case and both matchers all ran in sequence:
// - case 'increment": 0 => 1
// - matcher starts with 'i': 1 => 5
// - matcher ends with 't': 5 => 7
```

`createReducer` and `createSlice`
uses [immer](https://github.com/immerjs/immer)
to let you write reducers as if they were mutating the state directly.
In reality, the reducer receives a proxy state
that translates all mutations into equivalent copy operations.

:::danger[Mutating State Case]

Only write **mutating** logic in RTK `createSlice` and `createReducer` API.

:::

```ts
import { createAction, createReducer } from '@reduxjs/toolkit'

interface Todo {
  text: string
  completed: boolean
}

const addTodo = createAction<Todo>('todos/add')
const toggleTodo = createAction<number>('todos/toggle')

const todosReducer = createReducer([] as Todo[], (builder) => {
  builder
    .addCase(addTodo, (state, action) => {
      // This push() operation gets translated into
      // the same extended-array creation as in the previous example.
      const todo = action.payload
      state.push(todo)
    })
    .addCase(toggleTodo, (state, action) => {
      // The "mutating" version of this case reducer is
      // much more direct than the explicitly pure one.
      const index = action.payload
      const todo = state[index]
      todo.completed = !todo.completed
    })
})
```

:::tip[Reducer Pitfall]

Ensure that either mutate state argument or return a new state, but **not both**.

:::

Following reducer would throw an exception if a toggleTodo action is passed:

```ts
import { createAction, createReducer } from '@reduxjs/toolkit'

interface Todo {
  text: string
  completed: boolean
}

const toggleTodo = createAction<number>('todos/toggle')

const todosReducer = createReducer([] as Todo[], (builder) => {
  builder.addCase(toggleTodo, (state, action) => {
    const index = action.payload
    const todo = state[index]

    // This case reducer both mutates the passed-in state...
    todo.completed = !todo.completed

    // And returns a new value.
    // This will throw an exception.
    // In this example, the easiest fix is to remove the `return` statement.
    return [...state.slice(0, index), todo, ...state.slice(index + 1)]
  })
})
```

Other pitfalls for `State Proxy` in [ImmerJS](https://immerjs.github.io/immer/pitfalls):

- `Draft` objects in `Immer` are wrapped in `Proxy`,
  so you cannot use `==` or `===` to test equality:
  - Use `original` instead: `const index = original(list).indexOf(element)`.
  - Use unique `id` field instead.

## Slice

Slice API is standard approach for writing Redux logic.
Internally, it uses `createAction` and `createReducer`,
also use `Immer` to write immutable updates.

```ts
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState = { value: 0 } as CounterState

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

`extraReducers` allows `createSlice` to respond to
**other** action types besides the types it has generated.

If two fields from reducers and extraReducers
happen to end up with the **same** action type string,
the function from **reducers** will be used to handle that action type.

```ts
import type { Action, AnyAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

interface RejectedAction extends Action {
  error: Error
}

interface Item {
  id: string
  text: string
}

// Counter actions
const incrementBy = createAction<number>('incrementBy')
const decrement = createAction('decrement')

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith('rejected')
}

const todosSlice = createSlice({
  name: 'todo',
  initialState: [] as Item[],
  // Todo reducers
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Item>) => {
        state.push(action.payload)
      },
      // Action creator prepare callback
      prepare: (text: string) => {
        const id = nanoid()
        return { payload: { id, text } }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementBy, (state, action) => {
        // action is inferred correctly here if using TS
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      .addCase(decrement, (state, action) => {})
      // You can match a range of action types
      .addMatcher(
        isRejectedAction,
        // `action` will be inferred as a RejectedAction
        (state, action) => {}
      )
      // and provide a default case if no other handlers matched
      .addDefaultCase((state, action) => {})
  },
})
```

## Selector

- Keep the Redux state minimal,
  derive additional values from root state whenever possible.

The actual state is easier to read.
Less logic is needed to calculate those additional values
and keep them in sync with rest of data.
The original state is still there as a reference and isn't being replaced.

- Extract data getting and normalization logic from components.

Making change to data format in reducers,
then change reusable selector in `slice.ts`.
No need to change `Component.tsx` logic.

- Memorize state changes.

Keep `useSelector` away from returns a new array reference:

```ts
// ❌ Bad: cause always re-render problem
function App() {
  const postsForUser = useSelector((state) => {
    const allPosts = selectAllPosts(state)
    // Returns a new array reference every time.
    return allPosts.filter(post => post.user === userId)
  })
}
```

### `useSelector`

`useSelector` automatically subscribes to Redux store,
any time an action is dispatched,
it will call its selector function again right away.

If value returned by selector changes from last time it ran
(**strict `===` reference comparisons**),
`useSelector` will force component to re-render with the new data.

### `createSelector`

`createSelector` API
([Reselect](https://github.com/reduxjs/reselect) under the hood):

- Takes one or more **Input Selector** functions,
  plus an **Output Selector** function as arguments.
- `Output Selector` will only re-run when outputs of `Input Selector` have changed.
  With `createSelector` to write memorized selector functions:
- `Input Selector` should usually just extract and return values,
  `Output Selector` should do expensive transformation work.

```ts
// Good
const selectAllPosts = state => state.posts.posts
function selectPostById(state, postId) {
  return state.posts.posts.find(post => post.id === postId)
}

// Memorized selector function
const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  // Output selector will only re-run when `posts` or `userId` has changed.
  (posts, userId) => posts.filter(post => post.user === userId)
)
```

`Reselect` will run input selectors with all of given arguments,
If any of input selectors results are `===` different than before,
it will re-run output selector.
Otherwise it will skip re-running and just return cached final result from before.

```ts
const state1 = getState()
// Output selector runs, because it's the first call.
selectPostsByUser(state1, 'user1')
// Output selector does _not_ run, because the arguments haven't changed.
selectPostsByUser(state1, 'user1')
// Output selector runs, because `userId` changed.
selectPostsByUser(state1, 'user2')

dispatch(reactionAdded())
const state2 = getState()
// Output selector does not run, because `posts` and `userId` are the same.
selectPostsByUser(state2, 'user2')

// Add some more posts.
dispatch(addNewPost())
const state3 = getState()
// Output selector runs, because `posts` has changed.
selectPostsByUser(state3, 'user2')
```

### Best Practices and Pitfalls

```ts
// ❌ DO NOT memoize: will always return a consistent reference
const selectTodos = state => state.todos
const selectNestedValue = state => state.some.deeply.nested.field
const selectTodoById = (state, todoId) => state.todos[todoId]

// ❌ DO NOT memoize: deriving data, but will return a consistent result
function selectItemsTotal(state) {
  return state.items.reduce((result, item) => {
    return result + item.total
  }, 0)
}
const selectAllCompleted = state => state.todos.every(todo => todo.completed)

// ✅ SHOULD memoize: returns new references when called
const selectTodoDescriptions = state => state.todos.map(todo => todo.text)
```

## Thunk

Redux Toolkit `configureStore` function automatically
sets up the thunk middleware by default,
recommend using thunks as the standard approach for writing async logic with Redux:

```ts
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) =>
    next =>
      (action) => {
        if (typeof action === 'function')
          return action(dispatch, getState, extraArgument)

        return next(action)
      }
}

const thunk = createThunkMiddleware()
thunk.withExtraArgument = createThunkMiddleware

export default thunk
```

### Async

`createAsyncThunk` API provides:

- Less boilerplate code for `state.status` (`idle | loading | error`) manipulation.
- **Typed** async thunk function.

`AppThunk` type definition:

```ts
import type { Action, ThunkAction } from '@reduxjs/toolkit'

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
```

**Typed** async thunk function:

```ts
interface SerializedError {
  name?: string
  message?: string
  code?: string
  stack?: string
}

interface PendingAction<ThunkArg> {
  type: string
  payload: undefined
  meta: {
    requestId: string
    arg: ThunkArg
  }
}

interface FulfilledAction<ThunkArg, PromiseResult> {
  type: string
  payload: PromiseResult
  meta: {
    requestId: string
    arg: ThunkArg
  }
}

interface RejectedAction<ThunkArg> {
  type: string
  payload: undefined
  error: SerializedError | any
  meta: {
    requestId: string
    arg: ThunkArg
    aborted: boolean
    condition: boolean
  }
}

interface RejectedWithValueAction<ThunkArg, RejectedValue> {
  type: string
  payload: RejectedValue
  error: { message: 'Rejected' }
  meta: {
    requestId: string
    arg: ThunkArg
    aborted: boolean
  }
}

type Pending = <ThunkArg>(
  requestId: string,
  arg: ThunkArg
) => PendingAction<ThunkArg>

type Fulfilled = <ThunkArg, PromiseResult>(
  payload: PromiseResult,
  requestId: string,
  arg: ThunkArg
) => FulfilledAction<ThunkArg, PromiseResult>

type Rejected = <ThunkArg>(
  requestId: string,
  arg: ThunkArg
) => RejectedAction<ThunkArg>

type RejectedWithValue = <ThunkArg, RejectedValue>(
  requestId: string,
  arg: ThunkArg
) => RejectedWithValueAction<ThunkArg, RejectedValue>
```

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'

const fetchUserById = createAsyncThunk<
  // Return type of the payload creator
  ReturnType,
  // First argument to the payload creator
  number,
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch
    state: State
    extra: {
      jwt: string
    }
  }
>('users/fetchById', async (userId, thunkApi) => {
  const response = await fetch(`https://reqres.in/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${thunkApi.extra.jwt}`,
    },
  })

  return (await response.json()) as ReturnType
})
```

State status manipulation:

```ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'

// First, create the thunk.
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle' },
  reducers: {
    // Standard reducer logic, with auto-generated action types per reducer.
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types and handle loading state as needed.
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      // Add user to the state array.
      state.entities.push(action.payload)
    })
  },
})

// Later, dispatch the thunk as needed in the app.
dispatch(fetchUserById(123))
```
