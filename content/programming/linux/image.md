---
sidebar_position: 23
tags: [Programming, Linux, Media, Image, ImageMagick]
---

# `ImageMagick`

```bash
sudo pacman -S imagemagick
```

## Metadata

```bash
identify avatar.png
```

## Convert

### Single

```bash
magick input.png -quality 92 -strip output.png
```

### Batch

```bash
magick mogrify -format webp -quality 75 *.png
```

## Resize

```bash
# 查看裁剪后的内容区域大小
magick input.png -trim info:

# 裁剪空白后缩放到指定尺寸
magick input.png \
  -trim \
  -resize 256x256 \
  -gravity center \
  -background none \
  -extent 256x256 \
  output.png
```
