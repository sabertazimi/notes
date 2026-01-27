---
sidebar_position: 10
tags: [Web, Security, XSS, Vulnerability]
---

# XSS

## Attack

Cross-site scripting (跨站脚本):

- Reflected XSS:
  url input (search pages)
  `http://localhost:8080/test?name=<script>alert('attack')</script>`.
- Stored XSS:
  store script into database.
- Inject script in HTML/CSS/JavaScript/JSON/HTTP:
  - `<a href=javascript:...>`.
  - `<base href=javascript:...>`.
  - `<bgsound src=javascript:...>`.
  - `<body background=javascript:...>`.
  - `<frameset><frame src="javascript:..."></frameset>`.
  - `<iframe src=javascript:...>`.
  - `<img src=x onerror=...>`.
  - `<input type=image src=javascript:...>`.
  - `<layer src=...>`.
  - `<link href="javascript:..." rel="stylesheet" type="text/css">`.
  - `<meta http-equiv="refresh" content="0;url=javascript:...">`.
  - `<object type=text/x-scriptlet data=...>`.
  - `<script>...</script>`.
  - `<style type=text/javascript>alert('xss')</style>`.
  - `<table background=javascript:...>`.
  - `<td background=javascript:...>`.
  - `<button onmouseover="alert(/1/)" onclick="alert(/2/)"></button>`.
  - `<button form="test" formaction="javascript:alert(1)">`.
  - `<button form=test onformchange=alert(2)>`.
  - `<input onfocus=write(1) autofocus>`.
  - `<form id=test onforminput=alert(1)><input></form>`.
  - `<audio onerror=javascript:alert(1)>`.
  - `<audio><source onerror="javascript:alert(1)"></audio>`.
  - `<video onerror=javascript:alert(1)>`.
  - `<video><source onerror="javascript:alert(1)"></video>`.
  - `@import ""`.
  - `background: url("")`.
  - `window.name`.
  - `window.location`.
  - `document.domain`.
  - `document.referrer`.
  - `document.location.assign()`.
  - `document.location.replace()`.
  - `document.write()`.
  - `element.innerHTML`.
  - `element.outerHTML`.
  - `cookie`.
  - `localStorage`.

## Protection

Don't trust user:

- Escape control characters (输入校验):
  - `"` -> `&quot;`, `&` -> `&amp;`, `'` -> `&apos;`, `<` -> `&lt;`, `>` -> `&gt;`.
  - `input.trim()`.
  - Use a well-vetted HTML sanitization library,
    e.g. `DOMPurify.sanitize(input)`, instead of ad-hoc regex replacements.
  - React DOM escapes any values embedded in JSX before rendering them.
- Secure encode output result (输出编码):
  保证**编码方式一致**, e.g. 混用单字节编码与多字节编码, 导致攻击者绕过 `\` 系统转义符.
- 任何用户提供的 URL 在进一步处理前 (e.g. 保存到数据库),
  应先做无害化处理 (`SanitizeUrl`).
- Check HTTP `Content-Type` header.
- Content security policy: `script-src 'self' https://apis.google.com`.
- Use mature template engine: built-in XSS protection feature.

## mXSS

[Mutation XSS](https://www.sonarsource.com/blog/mxss-the-vulnerability-hiding-in-your-code)
utilize mutation in HTML is any kind of change made to the markup:

- When a parser fixes a broken markup: `<p>test` → `<p>test</p>`.
- Normalizing attribute quotes: `<a alt=test>` → `<a alt=”test”>`.
- Rearranging elements: `<table><a>` → `<a></a><table></table>`.
