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
