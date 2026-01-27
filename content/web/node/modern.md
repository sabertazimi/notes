---
sidebar_position: 1
tags: [Web, Node.js, Deno]
---

# Modern Node.js

## Structure

- Main ./index.js, ./server.js, or ./yourEntryFile.js in the root
- Supporting files in ./lib/
- Static HTTP files in ./public/
- Views or templates in ./views/
- Command-line executables in ./bin/
- Tests in ./test/ (or ./spec/ if you’re a Jasmine cool-aid drinker)
- npm scripts in ./scripts/
- Config in ./config/
- Documentation in ./doc/
- Examples in ./examples/
- Performance analysis in ./benchmarks/
- Native C/C++ source in ./source/

## Features

Modern [features](https://nodesource.com/blog/nodejs-features-replacing-npm-packages)
replacing npm packages:

- `node-fetch` -> `fetch`.
- `ws` -> `WebSocket`.
- `jest` -> `node:test`.
- `better-sqlite3` -> `node:sqlite`.
- `chalk` -> `util.styleText()`.
- `strip-ansi` -> `util.stripVTControlCharacters()`.
- `glob` -> `fs.glob()`.
- `rimraf` -> `fs.rm({ recursive: true, force: true })`.
- `mkdirp` -> `fs.mkdir({ recursive: true })`.
- `uuid` → `crypto.randomUUID()`.
- `base64-js` -> `Buffer`, `atob`, `btoa`.
- `url-pattern` → `URLPattern`.
- `event-target-shim` → `EventTarget`.

```ts
import assert from 'node:assert'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import { open } from 'node:sqlite'
import test from 'node:test'
import { stripVTControlCharacters, styleText } from 'node:util'

const res = await fetch('https://api.github.com/repos/nodejs/node')
const data = await res.json()
console.log(data.full_name) // "nodejs/node"

const ws = new WebSocket('wss://echo.websocket.org')
ws.onopen = () => ws.send('Hello!')
ws.onmessage = event => console.log('Received:', event.data)

test('addition works', () => {
  assert.strictEqual(2 + 2, 4)
})

const db = await open(':memory:')
await db.exec('CREATE TABLE users (id INTEGER, name TEXT)')

console.log(styleText('red', 'Error!'))
console.log(styleText(['bold', 'green'], 'Success!'))

const text = '\u001B[4mUnderlined\u001B[0m'
console.log(stripVTControlCharacters(text))

const files = await fs.glob('**/*.js')
await fs.rm('dist', { recursive: true, force: true })
await fs.mkdir('logs/app', { recursive: true })

console.log(randomUUID())

const encoded = btoa('hello')
console.log(encoded) // "aGVsbG8="
console.log(atob(encoded)) // "hello"

const pattern = new URLPattern({ pathname: '/users/:id' })
const match = pattern.exec('/users/42')
console.log(match.pathname.groups.id) // "42"

const target = new EventTarget()
target.addEventListener('ping', () => console.log('pong'))
target.dispatchEvent(new Event('ping'))
```

## References

- Node.js [modern patterns](https://kashw1n.com/blog/nodejs-2025).
- Node.js official [tutorial](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs).
- Node.js [tao](https://alexkondov.com/tao-of-node).
- Node.js [best practices](https://github.com/goldbergyoni/nodebestpractices).
- Node.js testing [best practices](https://github.com/goldbergyoni/nodejs-testing-best-practices).
- Node.js library to Deno [guide](https://www.edgedb.com/blog/how-we-converted-our-node-js-library-to-deno-using-deno).
