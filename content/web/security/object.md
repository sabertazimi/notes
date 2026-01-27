---
sidebar_position: 15
tags: [Web, Security, Object, Injection, Vulnerability]
---

# Object Injection

## Attack

- `__proto__.XX`
- `constructor`
- `hasOwnProperty`
- Insecure object comparison:

```ts
const token = req.cookie.token

// Vulnerability:
// SESSIONS[constructor] => `true`
if (token && SESSIONS[token])
  next()
```

## Protection

- `crypto.timingSafeEqual`
- `object.hasOwnProperty(token)`
