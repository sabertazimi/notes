---
sidebar_position: 22
tags: [Web, Security, ClickJacking, Vulnerability]
---

# Click Jacking

## Attack

Hover transparent malicious link upon trusted true button:

- `click`.
- `drag` and `drop`.
- `touch`.

## Protection

`X-Frame-Options`:

- `DENY`.
- `SAMEORIGIN`.
- `ALLOW-FROM origin`.

```ts
// nodejs
response.setHeader('X-Frame-Options', 'DENY')
```

Content security policy:

```bash
Content-Security-Policy: frame-ancestors 'none'
Content-Security-Policy: frame-ancestors 'self'
Content-Security-Policy: frame-ancestors example.com google.com
```

Prevent load self in frame (`Frame Busting`):

```html
<style>
  /* Hide page by default */
  html {
    display: none;
  }
</style>

<script>
  if (
    top != self ||
    top.location != location ||
    top.location != self.location ||
    parent.frames.length > 0 ||
    window != top ||
    window.self != window.top ||
    window.top !== window.self ||
    (parent && parent != window) ||
    (parent && parent.frames && parent.frames.length > 0) ||
    (self.parent && !(self.parent === self) && self.parent.frames.length != 0)
  ) {
    // Break out of the frame.
    top.location = self.location
    top.location.href = document.location.href
    top.location.href = self.location.href
    top.location.replace(self.location)
    top.location.href = window.location.href
    top.location.replace(document.location)
    top.location.href = window.location.href
    top.location.href = 'URL'
    document.write('')
    top.location = location
    top.location.replace(document.location)
    top.location.replace('URL')
    top.location.href = document.location
    top.location.replace(window.location.href)
    top.location.href = location.href
    self.parent.location = document.location
    parent.location.href = self.document.location
    parent.location = self.location
  } else {
    // Everything checks out, show the page.
    document.documentElement.style.display = 'block'
  }
</script>
```

:::caution[Frame Busting Attack]

`<iframe>` `sandbox` 属性与 `security`,
可以限制 `<iframe>` 页面中的 JavaScript 脚本执行,
从而使得 [`Frame Busting` 失效](https://seclab.stanford.edu/websec/framebusting/framebust.pdf).

:::
