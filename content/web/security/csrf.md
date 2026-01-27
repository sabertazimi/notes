---
sidebar_position: 11
tags: [Web, Security, CSRF, Vulnerability]
---

# CSRF

## Attack

Cross-site request forgery (跨站请求伪造)
挟制用户在当前已登录的 Web 应用程序上执行**非本意**的操作,
利用已认证用户 (长期本地 `Cookie`), 访问攻击者网站, 并被强制执行脚本,
在用户不知情的情况下提交 `GET`/`POST` request (长期本地 `Cookie`):

- `<link href="">`.
- `<a href="">`.
- `<img src="">`.
- `<img lowsrc="">`.
- `<img dynsrc="">`.
- `<iframe src="">`.
- `<frame src="">`.
- `<meta http-equiv="refresh" content="0; url=">`.
- `<script src="">`.
- `<bgsound src="">`.
- `<embed src="">`.
- `<video src="">`.
- `<audio src="">`.
- `<table background="">`.
- `@import ""`.
- `background: url("")`.

:::tip[XSS vs CSRF]

- XSS 利用的是网站对用户 (输入) 的信任.
- CSRF 利用的是网站对用户网页浏览器的信任.

:::

## Protection

- `REST` (representational state transfer) 原则:
  - `GET` request: only read objects, 确保无副作用.
  - `PUT` request: only create new objects.
  - `POST` request: only modify objects.
  - `DELETE` request: only delete objects.
- 确保 `request` 正常发起渠道:
  - Anti-CSRF cookie:
    - 不可预测 salt token: `Set-Cookie: _xsrf=5978e29d4ef434a1`.
    - Hidden token check in `<form>`.
  - 开启同源策略: `Set-Cookie: _xsrf=5978e29d4ef434a1; SameSite=Strict;`.
  - 检查 HTTP `Referer` 请求头.
  - 检查第三方网站 `URL`, 显示第三方地址跳转警告页面:
    - Remove sensitive data in URL query and `Referer` header.
    - `<a href="https://3rd.com" target="_blank" rel="noopener noreferrer nofollow">`.
- Require re-authentication for sensitive action:
  支付账单, 修改邮箱, 删除账号.
- Use mature `CSRF` protection library:
  express.js `csurf` library.

```python
# Reject cross-origin requests to protect from
# CSRF, XSSI & other bugs
def allow_request(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigation from anywhere
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET':
    return True

  return False
```
