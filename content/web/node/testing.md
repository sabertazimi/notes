---
sidebar_position: 12
tags: [Web, Node.js, Testing]
---

# Testing

## Assertions

- `assert.equal(expect, real, assertPrompt)`.
- `assert.notEqual(expect, real, assertPrompt)`.
- `assert.strictEqual(expect, real, assertPrompt)`.
- `assert.notStrictEqual(expect, real, assertPrompt)`.
- `assert.deepEqual(expect, real, assertPrompt)`.
- `assert.notDeepEqual(expect, real, assertPrompt)`.
- `assert.ok(var, assertPrompt): 测试对象真值(truthy/falsy)`.
- `assert.throws(fn)`: 测试方法是否抛出异常.
- `assert.doesNotThrow(fn)`: 测试方法是否抛出异常.

```ts
const assert = require('node:assert')

assert.equal(1, true, 'Truthy')
assert.notEqual(1, true, 'Truthy')

assert.ok(0, 'Zero is not truthy')
```
