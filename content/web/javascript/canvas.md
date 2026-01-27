---
sidebar_position: 54
tags: [Web, JavaScript, ECMAScript, Canvas]
---

# Canvas

- Path2D 对象.
- 绘制路径: `beginPath()` -> `draw()` -> `closePath()`.
- 绘制样式: 颜色/渐变/变换/阴影.
- 绘制图形: `fill`/`stroke`/`clip`.
- 绘制文字: `font`/`fillText()`/`measureText()`.

```ts
const context = canvas.getContext('2d')
```

```ts
// 根据参数画线
function drawLine(fromX, fromY, toX, toY) {
  context.moveTo(fromX, fromY)
  context.lineTo(toX, toY)
  context.stroke()
}

// 根据参数画圆
function drawCircle(x, y, radius, color) {
  context.fillStyle = color
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2, true)
  context.closePath()
  context.fill()
  context.stroke()
}

// 改变 canvas 中图形颜色
function changeColor(color) {
  context.fillStyle = color
  context.fill()
}
```

[Recursive tree](https://eloquentjavascript.net/17_canvas.html):

```html
<canvas width="600" height="300"></canvas>
<script>
  const cx = document.querySelector('canvas').getContext('2d')

  function branch(length, angle, scale) {
    cx.fillRect(0, 0, 1, length)
    if (length < 8) return
    cx.save()
    cx.translate(0, length)
    cx.rotate(-angle)
    branch(length * scale, angle, scale)
    cx.rotate(2 * angle)
    branch(length * scale, angle, scale)
    cx.restore()
  }

  cx.translate(300, 0)
  branch(60, 0.5, 0.8)
</script>
```

## Game Loop

For all objects:

- constructor: `position{x, y}`, `speed{x, y}`, `size{x, y}`
- update(deltaTime): change position or speed
- draw(ctx): use canvas api and object properties (position/size) to render objects

```ts
const canvas = document.getElementById('gameScreen')
const ctx = canvas.getContext('2d')

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

const game = new Game(GAME_WIDTH, GAME_HEIGHT)

let lastTime = 0

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime
  lastTime = timestamp

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  game.update(deltaTime)
  game.draw(ctx)

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
```

## Performance

Canvas buffer:

```ts
frontCanvasContext.drawImage(bufferCanvas, 0, 0)
```

- multiple canvas: top layer, background layer, interactive layer
- disable alpha path

```ts
const ctx = canvas.getContext('2d', { alpha: false })
```

[Offscreen canvas and web workers](https://dbushell.com/2024/04/02/offscreen-canvas-and-web-workers):

`transferControlToOffscreen` method:

```ts
// index.js
const offscreenCanvas = document.querySelector('#frame2')
const offscreen = offscreenCanvas.transferControlToOffscreen()
const worker = new Worker('./worker.js')
worker.postMessage({ canvas: offscreen }, [offscreen])

// worker.js
onmessage = function (event) {
  canvas = event.data.canvas
  context = canvas.getContext('2d')
}
```

`OffscreenCanvas` in service workers:

```js
// Create reusable canvas
const offscreen = new OffscreenCanvas(512, 512)
const context = offscreen.getContext('2d')

// eslint-disable-next-line no-restricted-globals -- Service worker.
self.addEventListener('fetch', (ev) => {
  // Only handle image requests
  const url = new URL(ev.request.url)

  if (url.pathname.startsWith('/artwork/'))
    ev.respondWith(artwork(ev))
})

async function artwork(ev) {
  const cache = await caches.open('artwork')

  // 1. Return from cache
  let response = await cache.match(ev.request)
  if (response)
    return response

  // 2. Or fetch from network
  response = await fetch(ev.request)
  if (!response.ok || response.status !== 200)
    return response

  // 3. Use canvas to resize
  let blob = await response.blob()
  context.drawImage(await createImageBitmap(blob), 0, 0, 512, 512)
  blob = await offscreen.convertToBlob({ type: 'image/png' })

  // 4. Create new headers
  const headers = new Headers(response.headers)
  headers.set('content-type', blob.type)
  headers.set('content-length', blob.size)

  // 5. Create new response
  const { status, statusText } = response
  response = new Response(await blob.arrayBuffer(), {
    status,
    statusText,
    headers
  })
  await cache.put(ev.request, response.clone())
  return response
}
```

## Houdini

[`PaintWorklet`](https://developer.mozilla.org/docs/Web/API/PaintWorklet):

```ts
// checkerboard.js:
// Create a `PaintWorklet`.
class CheckerboardPainter {
  static get contextOptions() {
    return { alpha: true }
  }

  /**
   * @returns {string[]} any custom properties or regular properties
   */
  static get inputProperties() {
    return ['--red', '--green', '--blue', '--width', 'height']
  }

  paint(context, geometry, props) {
    const colors = [
      props.get('--red').toString(),
      props.get('--green').toString(),
      props.get('--blue').toString(),
    ]
    const size = Number.parseInt(props.get('--width'))

    for (let y = 0; y < geometry.height / size; y++) {
      for (let x = 0; x < geometry.width / size; x++) {
        const color = colors[(x + y) % colors.length]
        context.beginPath()
        context.fillStyle = color
        context.rect(x * size, y * size, size, size)
        context.fill()
      }
    }
  }
}

// Register our class under a specific name
registerPaint('checkerboard', CheckerboardPainter)
```

```html
<!-- Load a `PaintWorklet`. -->
<script>
  if ('paintWorklet' in CSS) {
    CSS.paintWorklet.addModule('checkerboard.js')
  }
</script>

<!-- Use a `PaintWorklet`. -->
<style>
  textarea {
    background-image: paint(checkerboard);
  }
</style>
<textarea></textarea>
```

## References

- [Canvas API](https://developer.mozilla.org/docs/Web/API/Canvas_API)
- [Canvas Tutorial](https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial)
- [Canvas Deep Dive](https://joshondesign.com/p/books/canvasdeepdive/toc.html)
- [Canvas Cheat Sheet](https://devhints.io/canvas)
- [Canvas Performance](https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Canvas Real World Case](https://zhuanlan.zhihu.com/p/438142235)
