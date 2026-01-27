---
sidebar_position: 5
tags: [Web, Performance, Image]
---

# Images

- Responsive images with `srcset` (LCP):
  - Modern format: WebP/SVG.
  - Correspond size.
- Hero images pre-fetch loading (LCP).
- Offscreen images lazy loading (INP).
- Critical render path blocking images (INP):
  - Images compression and minification.
  - Images CDN.
- Images placeholder with `aspect-ratio` (CLS).

## Responsive

[Responsive images](https://danburzo.ro/responsive-images-html)
provide 3 ~ 5 different sizes reduce image transfer sizes by average of **~20%**:

```html
<picture>
  <source
    srcset="/media/filename.avif 300w, /media/filename.avif 500w, /media/filename.avif 2000w"
    type="image/avif"
    sizes="(max-width: 360px) 300px, (max-width: 720px) 500px, 2000px"
  />
  <source
    srcset="/media/filename.webp 300w, /media/filename.webp 500w, /media/filename.webp 2000w"
    type="image/webp"
    sizes="(max-width: 360px) 300px, (max-width: 720px) 500px, 2000px"
  />
  <source
    srcset="/media/filename.jpg 300w, /media/filename.jpg 500w, /media/filename.jpg 2000w"
    type="image/jpeg"
    sizes="(max-width: 360px) 300px, (max-width: 720px) 500px, 2000px"
  />
  <img
    src="/media/filename.jpg"
    srcset="/media/filename.jpg 300w, /media/filename.jpg 500w, /media/filename.jpg 2000w"
    sizes="(max-width: 360px) 300px, (max-width: 720px) 500px, 2000px"
    alt="Description of the image."
    width="2000"
    height="1333"
    loading="lazy"
    decoding="async"
  />
</picture>
```

```html
<img
  src="keyboard-800w.jpg"
  alt="A beautiful pink keyboard."
  width="400"
  height="400"
  srcset="keyboard-400w.jpg 400w, keyboard-800w.jpg 800w"
  sizes="(max-width: 640px) 400px, 800px"
/>
```

## Preloading

```html
<link
  rel="preload"
  as="image"
  href="keyboard.jpg"
  imagesrcset="poster_400px.jpg 400w, poster_800px.jpg 800w, poster_1600px.jpg 1600w"
  imagesizes="50vw"
/>
```

## Lazy Loading

```html
<img
  src="donut-800w.jpg"
  alt="A delicious pink donut"
  width="400"
  height="400"
  srcset="donut-400w.jpg 400w, donut-800w.jpg 800w"
  sizes="(max-width: 640px) 400px, 800px"
  loading="lazy"
/>
```

## Placeholder

```html
<img
  src="donut-800w.jpg"
  alt="A delicious donut"
  width="400"
  height="400"
  srcset="donut-400w.jpg 400w, donut-800w.jpg 800w"
  sizes="(max-width: 640px) 400px, 800px"
  loading="lazy"
  decoding="async"
  style="background-image: url('data:image/svg+xml;base64,[svg text]'); background-size: cover"
/>
```

## Formats

`mp4` smaller than `gif` (`ffmpeg`):

```html
<!-- ffmpeg -i dog.gif dog.mp4 -->
<video autoplay loop muted playsinline>
  <source src="dog.mp4" type="video/mp4" />
</video>
```

`WebP` 25~35% smaller than `jpg`/`png`:

```html
<picture>
  <source type="image/webp" srcset="flower.webp" />
  <source type="image/jpeg" srcset="flower.jpg" />
  <img src="flower.jpg" />
</picture>
```

## Compression

- [Sharp](https://github.com/lovell/sharp)
- [Jimp](https://github.com/oliver-moran/jimp)
- [Imagemin](https://github.com/Klathmon/imagemin-webpack-plugin)

## References

- Images format [guide](https://evilmartians.com/chronicles/images-done-right-web-graphics-good-to-the-last-byte-optimization-techniques).
- Low effort images optimization [tips](https://blog.sentry.io/low-effort-image-optimization-tips).
- Images optimization [guide](https://www.keycdn.com/blog/optimize-images-for-web).
- Images optimization [blog](https://stackoverflow.blog/2022/03/28/picture-perfect-images-with-the-modern-element).
- Images optimization [book](https://www.smashingmagazine.com/printed-books/image-optimization).

:::danger[CSS/Image Sprites]

- Use image sprites **only on HTTP/1** to improve page-load times.
- Avoid using image sprites on HTTP/2.

Legacy sprites optimization:

- 按颜色合并.
- 水平排列合并.
- 避免不必要空白.
- 限制颜色种类.
- 先优化单独图像, 再优化合并图像

:::
