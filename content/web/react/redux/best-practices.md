---
sidebar_position: 7
tags: [Web, React, Redux, State Management, Best Practice]
---

# Best Practices

- 区分 Smart Component (know the state) 和 Dump Component (stateless)
- Component 里不要出现任何 async calls，交给 action creator 来做
- Reducer 尽量简单，复杂的交给 action creator
- Reducer 里 return 新 state 的时候：
- [Redux Devtools](https://github.com/gaearon/redux-devtools)
- [Redux React Style Guide](https://github.com/iraycd/React-Redux-Styleguide)
- [Simple Redux API](https://github.com/rematch/rematch)

```ts
// add new item to state array
// bad and does not work case "ADD":
state.push(newItem)
// Good case "ADD":
return [...state, newItem]

// delete new item to state array
// bad and does not work case "DELETE":
state.splice(index, 1)
// Good case "DELETE":
state.slice(0, index).concat(state.slice(index + 1))

// update new item to state array
// First way case "EDIT":
state
  .slice(0, index)
  .concat([{ id: 'id', value: 'newValue' }])
  .slice(index + 1)
// Second way case "EDIT":
state.map((item) => {
  if (item.id === 'id') {
    return {
      ...item,
      value: 'newValue',
    }
  } else {
    return item
  }
})
```

- Action creator: 用 promise/async/await 以及 redux-thunk 实现异步操作.

```ts
// bad
function loadTodo(id) {
  return async (dispatch, getState) => {
    // only fetch the todo if it isn't already loaded
    if (!getState().todos.includes(id)) {
      const todo = await fetch(`/todos/${id}`)
      dispatch(addTodo(todo))
    }
  }
}

// good
function loadTodo(id, todos) {
  return async (dispatch) => {
    // only fetch the todo if it isn't already loaded
    if (!todos.includes(id)) {
      const todo = await fetch(`/todos/${id}`)
      dispatch(addTodo(todo))
    }
  }
}
```

```ts
const fluxStandardAction = {
  type: 'ADD_TODO',
  payload: {
    text: 'Do something',
  },
  meta,
}

const fluxStandardAction = {
  type: 'ADD_TODO',
  payload: new Error('Error'),
  error: true,
}
```

## Necessity

Necessity for importing Redux
(状态多, 变化快, 更新复杂):

- Lots of state.
- Frequent update state.
- Complex update state.

## Style Guide

Redux style [guide](https://redux.js.org/style-guide/style-guide):

- Only one store per app.
- Avoid mutate state without ImmerJS.
- Avoid side effects in reducers.
- Avoid non-serializable values in state store.
- Normalize complex nested/relational state.
- Keep state minimal and derive additional values.
- Split large data selection into multiple small `useSelector`.

## States

- Remote state:
  Anything coming from backend, API, database, etc.,
  could be handled by data-fetching library
  like [TanStack Query](https://github.com/tanstack/query) or [SWR](https://github.com/vercel/swr).
- Query params in URL state:
  If your router doesn't support syncing those with local state,
  use [nuqs](https://github.com/47ng/nuqs) and save yourself massive pain implementing that sync manually.
- Local state:
  作为组件局部状态管理器来用.
  对于只影响单个组件实例的状态,
  应作为 Local State 交由 `useState`/`useReducer` 管理,
  而不是将其并入 Global Store.
- Complex shared state:
  Split state into different atoms
  with [Zustand](https://github.com/pmndrs/zustand) or [JoTai](https://github.com/pmndrs/jotai),
  atoms can be imported for any specific component **without single-entry point**,
  each atom handling different app domain/context (reducer).
- Complex UI change: 用 component 归一化处理.
- Complex data input: 用 RxJS/observable 归一化处理.
- Complex state change: 用 action/state 归一化处理.
