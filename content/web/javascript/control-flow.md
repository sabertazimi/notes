---
sidebar_position: 12
tags: [Web, JavaScript, ECMAScript]
---

# Control Flow

## Switch Case

用 `Strategy Pattern` 代替 `switch`/`case` 语句:

```ts
function doAction(action) {
  const actions = {
    hack() {
      return 'hack'
    },

    slash() {
      return 'slash'
    },

    run() {
      return 'run'
    },
  }

  if (typeof actions[action] !== 'function')
    throw new TypeError('Invalid action.')

  // 闭包方法集
  return actions[action]()
}
```
