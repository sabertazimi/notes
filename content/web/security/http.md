---
sidebar_position: 14
tags: [Web, Security, HTTP, Injection, Vulnerability]
---

# HTTP Injection

## Malicious Redirect

```json
{
  "query": "?redirect=google.com%3BEcho%20%22Hacked%22"
}
```

- 检查第三方网站 `URL`, 显示第三方地址跳转警告页面:
  - Remove sensitive data in URL query and `Referer` header.
  - `<a href="https://3rd.com" target="_blank" rel="noopener noreferrer nofollow">`.
- Check `?url=`/`?redirect` data:
  - Escape control character.
  - Limit redirect range.
- Check `Referrer` header when doing redirect.

```ts
function isRelative(url) {
  return url && url.match(/^\/[^/\\]/)
}
```

## Header Injection

通过截断 HTTP 响应头 (换行符/空字符),
覆盖 `Location`/`Referer` 响应头,
注入攻击者设置的 HTTP 响应头:

- 不将外部输入作为 HTTP 响应头.
- 检验 HTTP 响应头特殊字符: e.g. 换行符.
- 使用成熟的库生成 HTTP 响应头, 禁止简单字符拼接.
