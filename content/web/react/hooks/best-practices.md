---
sidebar_position: 50
tags: [Web, React, Hook, Best Practice]
---

# Best Practices

如果将一个函数任意地将其放在 useEffect Deps List 中
可能会导致重复无意义的 useEffect 执行
(因为每次 render 期间的此函数都会重新定义).
有两个解决办法:

- 对于被多次复用 Utils 函数 (且不依赖组件的任何值),
  应该提到组件外面的公共区域去定义.
- 对于只被特定 Effect Hook 调用的 Utils 函数,
  可以放到 useEffect 内部定义.
- 对于其他需要在组件内(或自定义 Hooks 内)定义的函数,
  可使用 useCallback 包裹函数, 并设置正确的 Deps List,
  尽可能地减少 render 时重新定义此函数.

```ts
// ✅ Not affected by the data flow
function getFetchUrl(query) {
  return `https://hn.algolia.com/api/v1/search?query=${query}`
}

function SearchResults() {
  useEffect(() => {
    const url = getFetchUrl('react')
    // ... Fetch data and do something ...
  }, []) // ✅ Deps are OK

  useEffect(() => {
    const url = getFetchUrl('redux')
    // ... Fetch data and do something ...
  }, []) // ✅ Deps are OK

  // ...
}
```

- Don't forget to cleanup side effects (return function in useEffect)
- Set correct deps list for useEffect:
  - avoid object deps (should use object property).
  - enough deps list to avoid infinite loop rendering pitfall.
  - enough deps list to avoid stale closure.
- setState(state => state + 1) is better (avoid outdated state).
- Change `useState` to `useRef` when values not for rendering.
- Don't put any `if` statement before hooks function.
- Only call Hooks at the top level (don't inside loops, conditions or nested functions).
- Only call Hooks from React function components.
