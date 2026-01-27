---
sidebar_position: 7
tags: [Programming, Design, Design Pattern, Structural Pattern]
---

# Bridge

Split large class or set of closely related classes into two separate hierarchies:

- 分离抽象和实现 (Separate abstracts and implements).
- 分离对象的两种不同属性. `e.g` 从 2 个不同维度上扩展对象.

:::tip[Bridge Use Case]

- Platform independence: e.g. separate GUI frameworks from operating systems.
- Database drivers.
- Device drivers.

:::

```ts
class VectorRenderer {
  renderCircle(radius) {
    console.log(`Drawing a circle of radius ${radius}`)
  }
}

class RasterRenderer {
  renderCircle(radius) {
    console.log(`Drawing pixels for circle of radius ${radius}`)
  }
}

class Shape {
  constructor(renderer) {
    this.renderer = renderer
  }
}

class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer)
    this.radius = radius
  }

  draw() {
    this.renderer.renderCircle(this.radius)
  }

  resize(factor) {
    this.radius *= factor
  }
}

const raster = new RasterRenderer()
const vector = new VectorRenderer()
const circle = new Circle(vector, 5)
circle.draw()
circle.resize(2)
circle.draw()
```
