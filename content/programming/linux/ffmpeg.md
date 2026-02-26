---
sidebar_position: 32
tags: [Programming, Linux, Media, Video, FFmpeg]
---

# FFmpeg

```bash
sudo pacman -S ffmpeg 
```

[Media conversion](https://web.dev/media-conversion):

```bash
# https://www.yanxurui.cc/posts/tool/2017-10-07-use-ffmpeg-to-edit-video
ffmpeg -global_options -input_1_options -i input_1 -input_2_options -i input_2 \
  -output_1_options output_1 ...
```

## Probe

```bash
ffprobe input.mp4
ffmpeg -hide_banner -i input.mkv
```

## Transform

- `MP4`: `H264`Video + `AAC`Audio
- `WebM`: `VP8`Video + `Vorbis`Audio
- `OGG`: `Theora`Video + `Vorbis`Audio

```bash
# code decoder information
ffmpeg -codecs
```

```bash
# mkv to mp4
ffmpeg -i input.mkv -codec copy output.mp4
```

```bash
# compress
ffmpeg -i input.mkv -c copy -c:v libx264 -vf scale=-2:720 output.mkv
```

```bash
# make mkv with video and subtitle
ffmpeg -i input.avi -i input.srt \
  -map 0:0 -map 0:1 -map 1:0 -c:v libx264 -c:a aac -c:s srt output.mkv
```

```bash
# flac to mp3
ffmpeg -i "Michael Jackson - Billie Jean.flac" \
  -ab 320k "Michael Jackson - Billie Jean.mp3"
ffmpeg -i music_flac.flac \
  -acodec libmp3lame      \
  -ar 44100               \
  -ab 320k                \
  -ac 2 music_flac_mp3.mp3
# - acodec: Audio Coder Decoder 音频编码解码器
# - libmp3lame: MP3 解码器
# - ar: audio rate 音频采样率, 默认用原音频的采样率
# - ab: audio bit rate 音频比特率, 默认 128K
# - ac: audio channels 音频声道, 默认采用源音频的声道数
```

```bash
# mp4 to avi
ffmpeg -i video.mp4 \
  -s 1920x1080      \
  -pix_fmt yuv420p  \
  -vcodec libx264   \
  -preset medium    \
  -profile:v high   \
  -level:v 4.1      \
  -crf 23           \
  -r 30             \
  -acodec aac       \
  -ar 44100         \
  -ac 2             \
  -b:a 128k video_avi.avi
# - s: 缩放视频新尺寸 (size)
# - pix_fmt：pixel format, 设置视频颜色空间
# - vcodec: Video Coder Decoder, 视频编码解码器
# - preset: 编码器预设
# - profile:v: 编码器配置, 与压缩比有关. 实时通讯-baseline, 流媒体-main, 超清视频-high
# - level:v: 对编码器设置的具体规范和限制, 权衡压缩比和画质
# - crf: 设置码率控制模式, constant rate factor恒定速率因子模式, 范围 0~51, 数值越小, 画质越高
# - r:设置视频帧率
# - b:a: 音频比特率, 大多数网站限制音频比特率 128k, 129k
```

```bash
# Scale pictures
ffmpeg -i input.jpg -vf scale=320:240 output_320x240.png
```

## Cutting

```bash
# audio only
ffmpeg -i cut.mp4 -vn output.mp3
ffmpeg -i video.mp4 -vn -acodec copy video_noVideo.m4a

# video only
ffmpeg -i video.mp4 -vcodec copy -an video_silent.mp4
```

```bash
# from to cutting
ffmpeg -i music.mp3 -ss 00:00:30 -to 00:02:00 -acodec copy music_cutout.mp3
ffmpeg -i in.mp4 -ss 00:01:00 -to 00:01:10 -c copy out.mp4
ffmpeg -ss 00:01:00 -i in.mp4 -to 00:01:10 -c copy -copyts out.mp4

# 30s duration cutting
ffmpeg -ss 00:02:00.0 -i input.mkv -t 30 -c copy output.mkv
ffmpeg -i input.mkv -ss 00:02:00.0 -t 30 -c copy output.mkv
ffmpeg -ss 00:01:30.0 -i input.mkv -ss 00:00:30.0 -t 30 output.mkv
```

## Mixing

```bash
# replace audio
ffmpeg -i input.mkv -i input.mp3 -map 0:v -map 1:a -c copy -shortest output.mp4

# merge audio and video
ffmpeg -i video_noVideo.m4a -i video_silent.mp4 -c copy video_merge.mp4

ffmpeg -i "concat:01.mp4|02.mp4|03.mp4" -c copy out.mp4

ffmpeg -i input.mkv -i output.aac \
  -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 0:v -map "[a]" \
  -c:v copy -c:a aac -ac 2 -shortest output.mp4
```

```bash
# Merge pictures
ffmpeg -i 1.png -i 2.png -filter_complex "vstack" output.png
```

## Screenshot

```bash
# -vf -> -filter:v
ffmpeg -ss 00:30:14.435 -i input.mkv -vframes 1 out.png
ffmpeg -i input.mkv -vf fps=1/60 -strftime 1 out_%Y%m%d%H%M%S.jpg
```

## Gif

GIF 格式效率较低，通常需要降低帧率和分辨率以控制文件大小:

1. 帧率选择:
   - 10-15 fps: 操作步骤、UI 交互展示
   - 24-30 fps: 流畅动画、游戏画面
2. 分辨率选择:
   - 960px: 网页嵌入、文档配图
   - 1280-1920px: 保持原宽

```bash
# 10fps + 960px 宽度 + 调色板优化画质
ffmpeg -i input.mp4 \
  -vf "fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif

# 15fps + 1280px 宽度
ffmpeg -i input.mp4 \
  -vf "fps=15,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

```bash
# 基础转换
ffmpeg -i video.mp4 -ss 7.5 -to 8.5 -s 640x320 -r 15 video_gif.gif

# 使用自定义调色板
palette="/tmp/palette.png"
filters="fps=10,scale=-1:144:flags=lanczos"
ffmpeg -ss 30 -t 5 -i input.mp4 -vf "$filters,palettegen" -y $palette
ffmpeg -ss 30 -t 5 -i input.mp4 -i $palette \
  -filter_complex "$filters [x]; [x][1:v] paletteuse" -y output.gif
```

参数说明:

- `fps=N`: 设置帧率
- `scale=W:H`: 设置分辨率，`-1` 表示自动计算保持比例
- `flags=lanczos`: 使用 Lanczos 算法进行高质量缩放
- `palettegen`: 生成自定义调色板 (从 88842 色中生成 256 色)
- `paletteuse`: 应用调色板
- `-loop 0`: 无限循环
- `split[s0][s1]`: 分流视频流, 一路用于生成调色板, 一路用于应用

## Subtitle

```bash
ffmpeg -i input.mkv -vf subtitles=input.srt output.mp4
ffmpeg -i input.mkv -vf ass=input.ass output.mp4
```

## Watermark

```bash
ffmpeg -i input.mkv -i input.png \
  -filter_complex "overlay=W-w-5:5" -c copy -c:v libx264 output.mkv
```

## Desktop Recording

```bash
# windows
ffmpeg -f gdigrab -i desktop rec.mp4

# linux
sudo ffmpeg -f fbdev -framerate 10 -i /dev/fb0 rec.mp4
```

## Live Streaming

```bash
ffmpeg -re i rec.mp4 按照网站要求编码 -f flv "你的 RTMP 地址/你的直播码"
```
