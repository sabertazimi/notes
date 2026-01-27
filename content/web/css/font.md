---
sidebar_position: 9
tags: [Web, CSS, Typography, Font]
---

# Font

## Family

### Generics

- `serif`: 衬线字体族.
- `sans-serif`: 无衬线字体族.
- `monospace`: 等宽字体族.
- `cursive`: 手写字体族.
- `fantasy`: 奇幻字体族.
- `emoji`: 表情字体族.
- `math`: 数学表达式字体族.
- `fangsong`: 仿宋字体族.
- `system-ui`: 系统 UI 字体族.
- `ui-serif`: 系统衬线字体.
- `ui-sans-serif`: 系统无衬线字体.
- `ui-monospace`: 系统等宽字体.
- `ui-rounded`: 系统圆形字体.

### English

- `Segoe UI`: Windows 从 Vista 版本开始默认的西文字体族.
- `Roboto`: Android 中的一款无衬线字体.
- `Helvetica`: macOS 和 iOS 中很常用的一款无衬线字体.
- `Arial`: 全平台都支持的一款无衬线字体.

```css
body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}
```

### Chinese

```bash
宋体 SimSun
黑体 SimHei
微软雅黑 Microsoft YaHei
微软正黑体 Microsoft JhengHei
新宋体 NSimSun
新细明体 PMingLiU
细明体 MingLiU
标楷体 DFKai-SB
仿宋 FangSong
楷体 KaiTi
仿宋_GB2312 FangSong_GB2312
楷体_GB2312 KaiTi_GB2312

宋体: SimSun
华文细黑: STHeiti Light [STXihei]
华文黑体: STHeiti
华文楷体: STKaiti
华文宋体: STSong
华文仿宋: STFangsong
儷黑 Pro: LiHei Pro Medium
儷宋 Pro: LiSong Pro Light
標楷體: BiauKai
蘋果儷中黑: Apple LiGothic Medium
蘋果儷細宋: Apple LiSung Light

新細明體: PMingLiU
細明體: MingLiU
標楷體: DFKai-SB
黑体: SimHei
新宋体: NSimSun
仿宋: FangSong
楷体: KaiTi
仿宋_GB2312: FangSong_GB2312
楷体_GB2312: KaiTi_GB2312
微軟正黑體: Microsoft JhengHei
微软雅黑体: Microsoft YaHei

隶书: LiSu
幼圆: YouYuan
华文细黑: STXihei
华文楷体: STKaiti
华文宋体: STSong
华文中宋: STZhongsong
华文仿宋: STFangsong
方正舒体: FZShuTi
方正姚体: FZYaoti
华文彩云: STCaiyun
华文琥珀: STHupo
华文隶书: STLiti
华文行楷: STXingkai
华文新魏: STXinwei
```

### Emoji

- `Apple Color Emoji`:
  macOS and iOS.
- `Segoe UI Emoji`:
  Windows.
- `Segoe UI Symbol`:
  Windows 7 新增字体, 是一种 Unicode 编码字体,
  显示的是单色图案, 非彩色图形.
- `Noto Color Emoji`:
  谷歌出品的 emoji 字体,
  用于 Android 和 Linux.

```css
@font-face {
  font-family: emoji;
  src: local('Apple Color Emoji'), local('Segoe UI Emoji'), local('Segoe UI Symbol'), local('Noto Color Emoji');
  font-display: swap;
  unicode-range: U+1F000-1F644, U+203C-3299;
}

body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    emoji,
    Helvetica,
    Arial,
    sans-serif;
}
```

### Icon

- Complete [guide](https://blog.streamlinehq.com/choosing-the-perfect-icons-for-your-typeface)
  on how to pair icons and typefaces to create consistent visual language
  (including awesome fonts list).

### Math

- `Cambria Math`: Windows 中的数学字体.
- `Latin Modern Math`: macOS 中的数学字体.

```css
math {
  font-family: 'Cambria Math', 'Latin Modern Math', serif;
}
```

### Presets

[Font stack](https://github.com/tmcw/systemfontstack):

```css
.mi {
  font-family: Arial, 'Microsoft YaHei', '黑体', '宋体', sans-serif;
}

.tao-ux {
  font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
}

.tao {
  font:
    12px/1.5 Tahoma,
    Helvetica,
    Arial,
    '宋体',
    sans-serif;
}

.tao-ued {
  font:
    12px/1 Tahoma,
    Helvetica,
    Arial,
    '\5b8b\4f53',
    sans-serif;
}

.one-plus {
  font:
    14px/1.5 'Microsoft YaHei',
    Arial,
    Tahoma,
    '\5b8b\4f53',
    sans-serif;
}

.github {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
}

.font-sans-serif {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Avenir Next', Avenir, 'Segoe UI', 'Helvetica Neue', Helvetica, Cantarell,
    Ubuntu, Roboto, Noto, Arial, sans-serif;
}

.font-serif {
  font-family:
    Georgia, Cambria, 'Iowan Old Style', 'Apple Garamond', Baskerville, 'Times New Roman', 'Droid Serif', Times,
    'Source Serif Pro', serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

.font-mono {
  font-family: Menlo, Consolas, Monaco, 'Liberation Mono', 'Lucida Console', 'Courier New', monospace;
}
```

## Size

- `ch`: calculate by `0` width.
- `ex`: calculate by `x` width.
- `em`:
  - Calculate by original `font-size` (`inherit` size or current size).
  - 当用 `em` 指定多重嵌套的元素的字号时, 会产生不断放大/缩小的结果,
    故一般避免在 `font-size` 上使用 `em`.
  - 在 `margin`/`padding`/`border` 上使用 `em` 时,
    可使得布局随 `font-size` 大小改变而改变.
- `rem`: calculate by root `font-size`.
- `<percentage>`: calculate by parent `font-size`.

```css
html {
  /* 浏览器默认size为16px, 此时将html-size自动计算为10px */
  font-size: 62.5%;
}

small {
  /* 11px */
  font-size: 1.1rem;
}

strong {
  /* 18px */
  font-size: 1.8rem;
}
```

## Size Adjust

[`font-size-adjust`](https://developer.mozilla.org/docs/Web/CSS/font-size-adjust):

- 使字体保持大小, 不随字体类型改变而改变.
- 不同字体有不同的值 (`x-height`/字体尺寸).

## Stretch

[`font-stretch`](https://developer.mozilla.org/docs/Web/CSS/font-stretch#examples),
selects a normal, condensed, or expanded face from a font:

- `normal`.
- `ultra-condensed | extra-condensed | condensed | semi-condensed`.
- `semi-expanded | expanded | extra-expanded | ultra-expanded`.
- `<percentage>`.

| Keyword         | Percentage |
| --------------- | ---------- |
| ultra-condensed | 50%        |
| extra-condensed | 62.5%      |
| condensed       | 75%        |
| semi-condensed  | 87.5%      |
| normal          | 100%       |
| semi-expanded   | 112.5%     |
| expanded        | 125%       |
| extra-expanded  | 150%       |
| ultra-expanded  | 200%       |

## Kerning

[`font-kerning`](https://developer.mozilla.org/docs/Web/CSS/font-kerning),
字距调整:

- `auto`.
- `normal`: enable kerning.
- `none`: disable kerning.

## Style

[`font-style`](https://developer.mozilla.org/docs/Web/CSS/font-style):

- `normal`.
- `italic`.
- `oblique`.
- `oblique <angle>`.

## Synthesis

[`font-synthesis`](https://developer.mozilla.org/docs/Web/CSS/font-synthesis):

- Controls which **missing** typefaces, bold, italic, or small-caps
  may be synthesized by the browser.
- Initial value: `weight style`.
- Formal syntax: `none | [ weight || style || small-caps ]`.

```html
<em class="syn">Synthesize me! 站直。</em>
<br />
<em class="no-syn">Don't synthesize me! 站直。</em>

<style>
  em {
    font-weight: bold;
  }

  .syn {
    font-synthesis: style weight small-caps;
  }

  .no-syn {
    font-synthesis: none;
  }
</style>
```

![Font Synthesis](./figures/font-synthesis.png 'Font Synthesis')

## Variant

[`font-variant`](https://developer.mozilla.org/docs/Web/CSS/font-variant):

- `normal`.
- `none`.
- [`font-variant-caps`](https://developer.mozilla.org/docs/Web/CSS/font-variant-caps):
  - `small-caps`: 小体型大写字母.
  - `all-small-caps`.
  - `petite-caps`: 特小型大写字母.
  - `all-petite-caps`.
  - `unicase`: 混合模式, 可以有小体型大写字母, 大写字母, 大体型小写字母.
  - `titling-caps`: 标题大写字母.
- [`font-variant-east-asian`](https://developer.mozilla.org/docs/Web/CSS/font-variant-east-asian):
  - `ruby`: 日文上标假名.
  - `jis78`/`jis83`/`jis90`/`jis04`: 使用对应年份的日语字符集.
  - `simplified`: 简体字形.
  - `traditional`: 繁体字形.
  - `proportional-width`: 不等宽字形.
  - `full-width`: 等宽字形.
- [`font-variant-ligatures`](https://developer.mozilla.org/docs/Web/CSS/font-variant-ligatures):
  - `common-ligatures`: 使用连字效果.
  - `discretionary-ligatures`: 使用特殊连字效果, 设计师设计具体效果表现.
  - `historical-ligatures`: 使用古代连字效果.
  - `contextual-ligatures`: 使用上下文连字效果, 前后字母影响具体效果表现.
- [`font-variant-numeric`](https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric):
  - `ordinal`: 强制使用序数标记特殊的标志符号, e.g. `1st`, `2nd`, `3rd`, `4th`.
  - `slashed-zero`: 强制使用带斜线的 `0`.
  - `lining-nums`: 沿基线对齐.
  - `oldstyle-nums`: 传统对齐方式.
  - `proportional-nums`: 不等宽数字.
  - `tabular-nums`: 等宽数字.
  - `diagonal-fractions`: 斜线分隔分子母
  - `stacked-fractions`: 水平线分隔分子母.

## Display

The font display timeline:

- block period: font face is not loaded,
  render an **invisible** fallback font face
  (use normally when loaded in this period)
- swap period: font face is not loaded,
  render a fallback font face
  (use normally when loaded in this period)
- failure period: the user agent treats it as a failed load
  causing normal font fallback

[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)
decides how a font face is displayed based on
whether and when it is [downloaded and ready to use](https://github.com/bramstein/fontfaceobserver):

- `auto`: font display strategy defined by the user agent.
- `block`: a short block period and an infinite swap period.
- `swap`: an extremely small block period and an infinite swap period.
- `fallback`: an extremely small block period and a short swap period.
- `optional`: an extremely small block period and no swap period.

```css
@font-face {
  font-family: ExampleFont;
  font-style: normal;
  font-weight: 400;
  src:
    url('/path/to/fonts/exampleFont.woff') format('woff'),
    url('/path/to/fonts/exampleFont.eot') format('eot');
  font-display: fallback;
}
```

## Typeface

`@font-face` 使用户使用自定义字体:

```css
@font-face {
  font-family: mySpecialFont;
  font-style: normal;
  font-weight: 400;
  src: url('./Colleen.ttf');
  font-display: swap;
}

.selector {
  font-family: mySpecialFont, sans-serif;
}
```

### Format

```css
@font-face {
  font-family: 'Open Sans Regular';
  font-style: normal;
  font-weight: 400;
  src:
    local('Open Sans Regular'),
    local('OpenSans-Regular'),
    url('open-sans/OpenSans-Regular-Cyrillic.woff2') format('woff2'),
    url('open-sans/OpenSans-Regular-Cyrillic.woff') format('woff'),
    url('open-sans/OpenSans-Regular-Cyrillic.eot') format('embedded-opentype'),
    url('open-sans/OpenSans-Regular-Cyrillic.ttf') format('truetype');
  font-display: swap;
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1;
}
```

### Styles

```css
@font-face {
  font-family: myFont;
  font-weight: 400;
  src: local('Font 40S');
}

@font-face {
  font-family: myFont;
  font-weight: 500;
  src: local('Font 50S');
}

@font-face {
  font-family: myFont;
  font-weight: 600;
  src: local('Font 60S');
}

@font-face {
  font-family: myFont;
  font-style: italic;
  src: local('Font Italic');
}

.text-normal,
.text-medium,
.text-semibold,
.text-italic {
  font-family: myFont, sans-serif;
}

.text-normal {
  font-weight: 400;
}

.text-medium {
  font-weight: 500;
}

.text-semibold {
  font-weight: 600;
}

.text-italic {
  font-style: italic;
}
```

## Performance

[Reduce web font size](https://web.dev/reduce-webfont-size):

- Compress fonts: better formats (e.g. `woff2`/`woff`).
- Subset fonts: `unicode-range`.
- Local fonts: `local()`.

```css
@font-face {
  /* Single value */
  unicode-range: U+0026;
}

@font-face {
  /* Range */
  unicode-range: U+0000-007F;
}

@font-face {
  /* Wildcard Range */
  unicode-range: U+002?;
}

@font-face {
  /* Multiple Values */
  unicode-range: U+0000-007F, U+0100, U+02??;
}
```
