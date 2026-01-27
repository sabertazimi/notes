---
sidebar_position: 3
tags: [Web, HTML, Head]
---

# Head

## Favicon

Three files fit [most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs):

```html
<head>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <!-- 180x180 (Apple devices) -->
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>
```

Generating favicons in [all necessary sizes](https://github.com/pixel-point/favpie):

```html
<head>
  <link rel="icon" type="image/png" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="48x48" href="/favicon-48x48.png" />
  <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png" />
  <link rel="apple-touch-icon" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="apple-touch-icon" sizes="256x256" href="/favicon-256x256.png" />
  <link rel="apple-touch-icon" sizes="384x384" href="/favicon-384x384.png" />
  <link rel="apple-touch-icon" sizes="512x512" href="/favicon-512x512.png" />
  <link rel="manifest" href="/manifest.webmanifest" crossorigin="anonymous" />
</head>
```

## Theme Color

- [MDN Introduction](https://developer.mozilla.org/docs/Web/HTML/Element/meta/name/theme-color)
- [HTML Specification](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color)

```html
<meta name="theme-color" content="#319197" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#872e4e" media="(prefers-color-scheme: dark)" />
```

## References

- `<head>` element definitive [guide](https://github.com/joshbuchea/HEAD).
