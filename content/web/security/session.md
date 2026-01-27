---
sidebar_position: 21
tags: [Web, Security, Session, Vulnerability]
---

# Session

## Hijacking

Same site cookie [recipe](https://web.dev/first-party-cookie-recipes),
`Set-Cookie: session_id=278283910977381992837; HttpOnly; Secure; SameSite=Lax`:

- Prevent XSS cookie theft,
  disable JavaScript access to cookie:
  `Set-Cookie: session_id=278283910977381992837; HttpOnly`.
- Prevent CSRF cookie theft,
  enable same-origin policy, only allow cookie on `GET` request (social media sharing):
  `Set-Cookie: session_id=278283910977381992837; SameSite=Lax`.
- Prevent man-in-the-middle attack,
  use HTTPS connection:
  `Set-Cookie: session_id=278283910977381992837; Secure`.

## Fixation

在 **HTTP Cookie** 中传输**复杂**的 session ID, 并在**成功连接**/**恶意篡改**后重置 session ID:

- Not passing session ID in `queryString`/`requestBody`:
  跳转至第三方链接时, 会在 `Referer` header 处泄露 session ID,
  passing them in **HTTP Cookie**.
  同样地, 不允许在 URL query 处放置任何其他敏感数据 (如 token).
- Generate complex session ID.
- 认证成功前不在会话变量中存储敏感信息.
- Reset session ID after set up session successfully.
- Reset session ID after it's been changed manually on client (`Set-Cookie`):
  - IP.
  - Device.
  - User agent.

```ts
req.session.regenerate((err) => {
  process(err)
})

const generateSessionId = session => uid(24)
```
