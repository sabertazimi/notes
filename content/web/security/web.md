---
sidebar_position: 1
tags: [Web, DevOps, Security, HTTP, Headers, Policy, CSP, Crypto, Privacy, Fingerprint]
---

# Web

## Security Headers

Security headers [list](https://web.dev/security-headers):

- [X-Content-Type-Options](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options).
- [X-Frame-Options](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options):
  - `DENY`: 禁止被加载进任何 frame.
  - `SAMEORIGIN`: 仅允许被加载进同域内的 frame.
- [X-XSS-Protection](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-XSS-Protection):
  - `0` :表示禁用这个策略.
  - `1`: 默认, 对危险脚本做一些标志或修改, 以阻止在浏览器上渲染执行.
  - `1; mode=block`: 强制不渲染.
- Setting `Content-Security-Policy` header.
- Ensure all connections to be HTTPS.
- Avoid Clicking-jacking using `X-Frame-Options`.
- Disable `X-Powered-By` header.
- Not put sensitive data in URL query and `Referer` header.

## Same Origin Policy

`origin` = `protocol` + `domain` + `port`:

| `http://www.foo.com`      | Same Origin |            |
| ------------------------- | ----------- | ---------- |
| `https://www.foo.com`     | No          | `protocol` |
| `http://app.foo.com`      | No          | `domain`   |
| `http://foo.com`          | No          | `domain`   |
| `http://www.foo.com:8080` | No          | `port`     |
| `http://www.foo.com/a/`   | Yes         |            |

```json
{
  "Access-Control-Allow-Origin": "https://api.foo.com"
}
```

- 由客户端 HTML 标签等发出的跨域 `GET` 请求默认合法, 构成开放的 Web 世界:
  通过 `src` 属性加载的资源, 浏览器限制了 JavaScript 的权限, 使其不能读写返回的内容.
- `XMLHttpRequest` 受同源策略限制: 默认只能访问同源对象的内容.
- Cookie 受同源策略限制.
- Web storage 受同源策略限制:
  - Local storage.
  - Session storage.

## Content Security Policy

[`CSP`](https://github.com/foundeo/content-security-policy.com)
help prevent from `XSS`:

```bash
{
  "header": {
    "Content-Security-Policy":
      allow 'self';
      script-src 'nonce-random123' 'strict-dynamic' 'unsafe-eval' script.example.com;
      media-src media.example.com;
      img-src img.example.com;
      object-src 'none';
      base-uri 'none'
  }
}
```

Basic CSP [usage](https://www.writesoftwarewell.com/content-security-policy):

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' https://safe-external-site.com; style-src 'self'"
/>
```

`upgrade-insecure-requests`
指示浏览器在发出网络请求之前升级不安全的 `URL`:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
```

`block-all-mixed-content`
指示浏览器永不加载混合内容,
所有混合内容资源请求都会被阻止,
包括主动和被动混合内容:

```html
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content" />
```

`nonce`-only `CSP` block 3rd scripts and dynamic scripts generate by trusted users:

```html
<script nonce="random123">
  alert('this is fine!')
</script>
<script nonce="random123" src="https://cdnjs.com/lib.js"></script>
<!-- XSS injected by attacker - blocked by CSP -->
<script>
  alert('xss')
</script>
```

`strict-dynamic` `CSP` allow dynamic scripts generate by trusted users:

```html
<!-- Content-Security-Policy: script-src 'nonce-random123' 'strict-dynamic' -->
<script nonce="random123">
  const s = document.createElement('script')
  s.src = '/path/to/script.js'
  s.async = true
  document.head.appendChild(s) // can execute correctly
</script>
```

`domain`-specific `CSP` block untrusted domain scripts:

```html
<!-- Given this CSP header -->
<!-- Content-Security-Policy: script-src https://example.com/ -->
<!-- The following third-party script will not be loaded or executed -->
<script src="https://not-example.com/js/library.js"></script>
```

## Trusted Types

- TrustedURL.
- TrustedHTML.
- TrustedScript.
- TrustedScriptURL.

```ts
// fallback policy
TrustedTypes.createPolicy(
  'default',
  {
    createHTML(s) {
      console.error('Please fix! Insecure string assignment detected:', s)
      return s
    },
  },
  true
)
```

```ts
// Content-Security-Policy-Report-Only: trusted-types myPolicy; report-uri /cspReport
const SanitizingPolicy = TrustedTypes.createPolicy(
  'myPolicy',
  {
    createHTML: (s: string) => myCustomSanitizer(s),
  },
  false
)

const trustedHTML = SanitizingPolicy.createHTML(foo)
element.innerHTML = trustedHTML
```

## Crypto

Web crypto [API](https://developer.mozilla.org/docs/Web/API/SubtleCrypto):

- 公钥加密私钥解密: 只有私钥拥有者可以获取信息, e.g. HTTPS 会话密钥传输.
- 公钥解密私钥加密: 只有私钥拥有者可以发布签名, e.g. 数字签名.

## User Privacy

### Browser Privacy

- Browser [leaks](https://browserleaks.com).
- [Exposed](https://github.com/neberej/exposedbydefault) by default.

### User Fingerprint

[User fingerprint](https://github.com/neberej/exposedbydefault) can generate by:

- Use Canvas or WebGL to generate user
  [fingerprint](https://yinzhicao.org/TrackingFree/crossbrowsertracking_NDSS17.pdf).
- Location information:
  - Country.
  - Region.
  - City.
  - Zip code.
  - Latitude.
  - Longitude.
  - Timezone.
- Connection information:
  - IP address.
  - Internet service provider.
  - Organization.
  - ASN.
  - Tor browser detection.
- Software information:
  - Browser.
  - Browser plugins detection.
  - Operation system.
  - User agent.
  - Preferred language.
  - Cookie enabled detection.
  - Java enabled detection.
  - DNT header enabled detection.
  - Automated browser detection.
  - Content filters detection: Adblock detection.
- Hardware information:
  - Screen resolution.
  - Color resolution.
  - Device type.
  - Device memory.
  - CPU cores.
  - Max touch points.
  - WebGL vendor.
  - WebGL renderer.
  - Battery level.
  - Battery status.

```ts
function getCanvasFingerprint() {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = '18pt Arial'
  context.textBaseline = 'top'
  context.fillText('Hello, user.', 2, 2)
  return canvas.toDataURL('image/jpeg')
}

getCanvasFingerprint()
```
