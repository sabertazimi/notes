---
sidebar_position: 14
tags: [Web, HTML, Iframe]
---

# Iframe

| Attribute                      |                                             |
| ------------------------------ | ------------------------------------------- |
| `src="https://google.com/"`    | Sets address of the document to embed       |
| `srcdoc="<p>Some html</p>"`    | Sets HTML content of the page to show       |
| `height="100px"`               | Sets iframe height in pixels                |
| `width="100px"`                | Sets iframe width in pixels                 |
| `name="my-iframe"`             | Sets name of the iframe (used in JavaScript |
| `allow="fullscreen"`           | Sets feature policy for the iframe          |
| `referrerpolicy="no-referrer"` | Sets referrer when fetching iframe content  |
| `sandbox="allow-same-origin"`  | Sets restrictions of the iframe             |
| `loading="lazy"`               | Lazy loading                                |

```html
<iframe src="https://www.google.com/" height="500px" width="500px"></iframe>
<iframe src="https://platform.twitter.com/widgets/tweet_button.html"></iframe>
<iframe srcdoc="<html><body>App</body></html>"></iframe>
<iframe
  sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"
  src="http://maps.example.com/embedded.html"
></iframe>
```

```ts
const iframeDocument = iframe.contentDocument
const iframeStyles = iframe.contentDocument.querySelectorAll('.css')
iframe.contentWindow.postMessage('message', '*')
```
