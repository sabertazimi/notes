---
sidebar_position: 11
tags: [Web, HTML, Media]
---

# Media

## Figure

流内容: 如代码、文件、图片、音频、视频.

## Figcaption

`<figure>` 可拥有唯一的 `0`/`1` 个 `<figcaption>`:

```html
<figure aria-labelledby="image-alt">
  <img src="/media/cc0-images/elephant-660-480.jpg" alt="Elephant at sunset" />
  <figcaption id="image-alt">An elephant at sunset</figcaption>
</figure>
```

## Image

### Src

### Alt

(图片崩溃时文本)、title(提示信息)、class(CSS 类选择器)

### Loading

```html
<img src="picture.jpg" loading="lazy" />
```

### Responsive

```html
<!-- `img` element -->
<img src="foo" alt="bar" />

<!-- `img` element, `srcset` attribute -->
<img
  srcset="foo-320w.jpg 320w, foo-480w.jpg 480w, foo-800w.jpg 800w"
  sizes="(max-width: 480px) 440px, 320px"
  src="foo-320w.jpg"
  alt="bar"
/>
```

## Picture

- Multiple `<source>` and only one `<img>`

```html
<!-- `picture` and `source` elements, `srcset` attributes -->
<picture>
  <source media="(max-width: 799px)" srcset="foo-480w.jpg" />
  <source media="(min-width: 800px)" srcset="foo-800w.jpg" />
  <img src="foo-800w.jpg" alt="bar" />
</picture>
```

- Multiple width images

```html
<picture>
  <source srcset="128px.jpg, 256px.jpg 2x, 512px.jpg 3x" />
  <img src="foo.jpg" alt="bar" />
</picture>
```

- Multiple type images

```html
<picture>
  <source srcset="foo.avif" type="image/avif" />
  <source srcset="foo.webp" type="image/webp" />
  <img src="foo.jpg" />
</picture>
```

## SVG

```ts
const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
const svgRectElement = document.createElementNS(
  'http://www.w3.org/2000/svg',
  'rect'
)
```

## Embed

Embed [best practice](https://web.dev/embed-best-practices):

```html
<script src="lazySizes.min.js" async></script>

<iframe
  data-src="https://www.youtube.com/embed/aKydtOXW8mI"
  width="560"
  height="315"
  class="lazyload"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
>
</iframe>
```

## Video

```html
<video src="myVideo.mp4" width="640" height="480" controls autoplay preload="auto" loop poster="myVideoPoster.png">
  If you're reading this either video didn't load or your browser is legacy!
</video>
```

```html
<video width="640" height="480" controls preload="auto" loop poster="myVideoPoster.png">
  <source src="myVideo.sp8" type="video/super8" />
  <source src="myVideo.mp4" type="video/mp4" />
  <p><b>Download Video:</b> MP4 Format:<a href="myVideo.mp4">"MP4"</a></p>
</video>
```

## Anchor

### Href

`[href]` 超链接指向`超链接`/`#id`/`#name`:

```html
<a href="https://github.com">Link</a> <a href="#title">Link</a>
```

### ID

当前锚点标识.

### Name

当前锚点名字.

### Target

定义被链接文档出现方式:

- `self`: **默认**方式, 在相同的框架中打开被链接文档.
- `blank`: 在新窗口中打开被链接文档.
- `parent`: 在父框架集中打开被链接文档.
- `top`: 在整个窗口中打开被链接文档.
- `framename`: 在指定的框架中打开被链接文档.

## Geo

```html
<geolocation autolocate>
  <button onclick="updateMap(event)">Use my location</button>
</geolocation>
<div role="status"></div>

<script>
  const getLocation = (e) => {
    let coords

    if (e.coords) {
      coords = e.coords
    } else {
      coords = e.target.position.coords
    }

    return `<dl>
    <dt>Accuracy</dt>
    <dd>${coords.accuracy}</dd>
    <dt>Latitude</dt>
    <dd>${coords.latitude}</dd>
    <dt>Longitude</dt>
    <dd>${coords.longitude}</dd>
  </dl>`
  }

  const updateMap = (e) => {
    let result,
      geolocation = 'HTMLGeolocationElement' in window

    if (geolocation) {
      result = getLocation(e)
      e.target.nextElementSibling.innerHTML = result
    } else {
      navigator.geolocation.getCurrentPosition((e) => {
        result = getLocation(e)
        e.target.parentNode.nextElementSibling.innerHTML = result
      })
    }
  }
  const geo = document.querySelector('geolocation')
  geo.addEventListener('location', updateMap)
</script>
```
