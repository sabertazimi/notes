---
sidebar_position: 11
tags: [Web, CSS, Layout, Inline]
---

# Inline Element

## Height

- 内联元素默认的高度完全受 `font-size` 大小控制.
- 内联元素没有可视宽度和可视高度 (`clientHeight`/`clientWidth` always `0`),
  垂直方向的行为表现完全受 `line-height` 和 `vertical-align` 的影响.

## Baseline

### Inline Block

`inline-block` element:

- 内部没有内联元素, 或者 `overflow` not visible:
  其基线为 `margin` 底边缘.
- 内部存在内联元素:
  其基线为最后一行内联元素的基线.

### Vertical Align

Inline element 与父元素下边缘存在空隙,
原因在于文字排版的基线 (`baseline`) 对齐机制:

- 在标准模式中,
  `Inline Formatting Context` 总是会包含类似字母 'g'/'f' 尾巴伸出部分空间 (针对下行字母).
- `<img>`/`<a>` inline element 与父元素底部若干像素间隙,
  实际上是此种情况下的**字母尾巴**预留机制:
  行框盒子存在幽灵空白节点, 默认基于 `baseline` 对齐 (小写字母 `x` 底部).

清除间隙的方法:

- 清除 `Strut` 高度:
  父元素 `font-size: 0` / `line-height: 0`,
  设置 `Inline Formatting Context` 高度为 `0`.
- 改变对齐方式:
  子元素 `vertical-align` 设置为 `top`/`middle`/`bottom`.
- 清除 `Strut` 节点:
  子元素 `display` 设置为 `inline-block`/`block`,
  创建 `Block Formatting Context`,
  直接清除幽灵空白节点.

可以用以上方法解决 `<img>` image 5px problem 或相似问题.

## Margin

非主动触发位移的内联元素是不会位移至计算容器外部,
内联元素 `margin-top` 设置过大时 `margin-top` 会直接失效,
内联元素依然会处于基线对齐位置.

## Padding

可以在不影响当前布局的情况下,
通过增加垂直方向的 `padding`,
增加链接 (`inline`) 或按钮 (`inline-block`) 的点击区域大小:

```css
article a {
  padding: 0.25rem 0;
}
```
