---
sidebar_position: 6
tags: [Web, React, Redux, State Management]
---

# Performance

- Normal React performance tips: `React.memo`, `useMemo`, `useCallback` etc.
- Normalize large array state via `createEntityAdapter` API:
  - Use `Ids` array as minimal core data (other than whole `Data[]`).
  - Fast element lookup in normalized state (other than slow `Array.find()`).
- Create memorized selectors via `createSelector` API.

## Code Splitting

- [Redux Code Splitting Guide](https://redux.js.org/usage/code-splitting).
- [Redux Dynamic Modules](https://github.com/microsoft/redux-dynamic-modules):
  Modularize Redux by dynamically loading reducers and middlewares
  (contribute to **code splitting**).

## Pitfalls

- All `reducers` are called to produce the `next` store state.
- All `mapStateToProps`/`useSelectors` of mounted components are called.
- As every `mapStateToProps`/`useSelector`
  that returned a different reference
  from the previous render,
  the associated components are rendered
  (**re-rendering** problem).
