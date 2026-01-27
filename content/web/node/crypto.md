---
sidebar_position: 10
tags: [Web, Node.js, Security, Crypto]
---

# Crypto

- Hash algorithm.
- HMAC algorithm.
- Cipher/decipher algorithms.
- Signature/validate.

## Hash

```ts
const crypto = require('node:crypto')

const md5 = crypto.createHash('md5')

md5.update('foo')
md5.digest('hex') // 'acbd18db4cc2f85cedef654fccc4a4d8'
```

## HMAC

```bash
openssl genrsa -out key.pem 1024
```

```ts
const crypto = require('node:crypto')
const fs = require('node:fs')

const pem = fs.readFileSync('key.pem')
const key = pem.toString('ascii')
const hmac = crypto.createHmac('sha1', key)

hmac.update('bar')
hmac.digest('hex') // '7x123'
```

## UUID Generation

Enhance usability of unique identifiers by
[prefixing and encoding in base58](https://unkey.dev/blog/uuid-ux):

```ts
// src/utils/id.ts
import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

const prefixes = {
  key: 'key',
  api: 'api',
  policy: 'pol',
  request: 'req',
  workspace: 'ws',
  vercelBinding: 'vb',
  keyAuth: 'key_auth', // <-- this is internal and does not need to be short or pretty
  test: 'test', // <-- for tests only
} as const

export function newId(
  prefix: keyof typeof prefixes,
  length: number = 16
): string {
  return [prefixes[prefix], nanoid(length)].join('_')
}
```

```ts
// app.ts
import { newId } from '@utils/id'

const id = newId('workspace')
// ws_dYuyGV3qMKvEbjML

const id = newId('keyY')
// invalid because `keyY` is not a valid prefix name
```
