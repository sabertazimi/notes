---
sidebar_position: 27
tags: [Web, CSS, Filter, Blend]
---

# Filter

[`filter`](https://developer.mozilla.org/docs/Web/CSS/filter):

```css
.filter {
  filter: blur(5px); /* 模糊 */
  filter: brightness(240%); /* 亮度 */
  filter: contrast(200%); /* 对比度 */
  filter: drop-shadow(16px 16px 20px blue); /* 投影 */
  filter: grayscale(50%); /* 灰度 */
  filter: hue-rotate(90deg); /* 色相旋转 */
  filter: invert(75%); /* 反相 (颜色翻转) */
  filter: opacity(25%); /* 透明度 */
  filter: saturate(30%); /* 饱和度 */
  filter: sepia(60%); /* 褐色 (老照片) */
  filter: url('resources.svg'); /* 引用 SVG filter 元素 */

  /* Apply multiple filters */
  filter: contrast(175%) brightness(3%);
}
```

:::tip[Drop Shadow]

`filter: drop-shadow()`:

- 不支持多重阴影.
- 不支持内阴影.
- 不支持扩展阴影.
- 阴影会**自动贴合形状**:
  - 伪元素.
  - 自定义边框.
  - 背景渐变.
  - SVG 元素.

:::

## Backdrop Filter

[`backdrop-filter`](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter):

让当前元素所在区域后面的内容应用滤镜效果.

```css
.dropdown-list {
  background: hsl(0deg 0% 100% / 75%);
  backdrop-filter: blur(5px);
}
```

若当前浏览器不支持 `backdrop-filter`,
可使用 pseudo element + `filter` 进行模拟:

```css
/* 设置两张重合图片 */
body,
main::before {
  background: url('tiger.jpg') 0 / cover fixed;
}

main {
  position: relative;
  overflow: hidden;
  background: hsl(0deg 0% 100% / 30%);
}

/* 模糊文字背景图片 */
main::before {
  position: absolute;
  inset: 0;
  margin: -30px;
  content: '';
  filter: blur(20px);
}
```

## Blend Mode

[`<blend-mode>`](https://developer.mozilla.org/docs/Web/CSS/blend-mode):

- `multiply`:
  - 正片叠底: $C=\frac{A \cdot B}{255}$.
  - 混合黑色变黑色.
  - 混合白色不变色.
  - 混合后颜色变暗.
- `screen`:
  - 滤色: $C=255-\frac{(255-A)(255-B)}{255}$.
  - 混合黑色不变色.
  - 混合白色变白色.
  - 混合后颜色变亮.
- `darken`/`lighten`:
  - 变暗: $C=\min(A, B)$.
  - 变亮: $C=\max(A, B)$.
  - 可用于实现渐变文字.
- `color-dodge`:
  - 颜色变淡: $C=A+\frac{A \cdot B}{255-B}$.
  - 可用于保护底图的高光, 适合处理高光下的人物照片:
    通过将照片和特定颜色混合, 可以改变整个照片的色调 (暖色调或是冷色调),
    同时不会影响人物高光区域的细节.
- `color-burn`:
  - 颜色加深: $C=A-\frac{(255-A)(255-B)}{B}$.
  - 可用于保护底图的阴影, 适合处理阴影丰富的照片:
    通过将照片和特定颜色混合, 可以营造更加幽深的氛围.
- `overlay`:
  - 叠加 ($A$ 为底图的色值):
    - $A\leqslant128$: $C=\frac{A \cdot B}{128}$.
    - $A\gt128$: $C=255-\frac{(255-A)(255-B)}{128}$.
  - 底图的阴影 (黑色)和高光 (白色) 的颜色会被保留,
    其他颜色的饱和度和对比度提高, 混合后的图像会更加鲜亮.
- `hard-light`:
  - 强光 ($A$ 为底图的色值):
    - $B\leqslant128$: $C=\frac{A \cdot B}{128}$.
    - $B\gt128$: $C=255-\frac{(255-A)(255-B)}{128}$.
  - 图像亮的地方更亮, 暗的地方更暗.
- `soft-light`:
  - 柔光 ($A$ 为底图的色值):
    - $B\leqslant128$: $C=\frac{A \cdot B}{128}+(\frac{A}{255})^2(255-2\cdot B)$.
    - $B\gt128$: $C=255-\frac{(255-A)(255-B)}{128}$.
  - 图像亮的地方轻微变亮, 暗的地方轻微变暗.
- `difference`:
  - 差值: $C=|A-B|$.
  - 若上层元素为 `white`, 则最终混合的颜色是底层元素颜色的反色.
- `exclusion`:
  - 排除: $C=A+B-\frac{A \cdot B}{128}$.
- `hue`:
  - 色相混合.
  - 混合后的颜色保留底图的饱和度和亮度, 使用顶图的色相.
  - 将照片和渐变色进行色相混合, 可让照片呈现出丰富多彩的色调效果.
- `saturation`:
  - 饱和度混合.
  - 混合后的颜色保留底图的色相和亮度, 使用顶图的饱和度.
- `luminosity`:
  - 亮度混合.
  - 混合后的颜色保留底图的色相和饱和度, 使用顶图的亮度.
  - 当底图是渐变图像或纯色图像, 上层元素是复杂图像时, 适合使用亮度混合模式.
- `color`:
  - 颜色混合.
  - 混合后的颜色保留底图的亮度, 使用顶图的色相和饱和度.
  - 通过使用 CSS 渐变让照片的色调变得丰富.

## Mix Blend Mode

[`mix-blend-mode`](https://developer.mozilla.org/docs/Web/CSS/mix-blend-mode):

- Used for multiple elements, e.g. text styles.
- 通常把混合模式设置在顶层元素上:
  当元素应用了混合模式时,
  该元素会混合 `z` 轴上所有层叠顺序比其低的层叠元素.
- `multiply`: `black` is cutout (keep `black`).
- `screen`: `white` is cutout (keep `white`).

```html
<div class="background">
  <h1>Even More CSS Secrets</h1>
</div>

<style>
  .background {
    background-image: url('bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .background h1 {
    color: white; /* keep white */
    background-color: black; /* mix with background */
    mix-blend-mode: screen; /* screen or multiply  */
  }
</style>
```

## Background Blend Mode

[`background-blend-mode`](https://developer.mozilla.org/docs/Web/CSS/background-blend-mode)

- Used for multiple `background-image`.

```css
.box {
  background: url('pic1.png'), url('pic2.png');
  background-size: cover;
  background-blend-mode: lighten; /* lighten, lighten */
}

.gradient-icon {
  background: linear-gradient(deepskyblue, deeppink), url('icon.png'), white;
  background-blend-mode: lighten, normal;
}
```

## References

- Instagram [filters](https://github.com/una/CSSgram).
- Image [effects](https://github.com/bennettfeely/image-effects).
- PhotoShop blending modes [ultimate guide](https://www.slrlounge.com/photoshop-blending-modes).
