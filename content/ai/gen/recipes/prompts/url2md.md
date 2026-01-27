---
description: Transform URL to markdown file
---

# URL to Markdown

## 输入

文章 URL: $ARGUMENTS

## 输出

1. 格式化后的原文 `article.md`
2. 中英文双语版 `article-en-cn.md`
3. 中文版 `article-cn.md`
4. 文章中所有的图片资源

每完成一步，都必须更新 `progress.md`

## 步骤

### 0. 生成笔记

- 仿照例子和当前任务生成笔记 `progress.md`

### 1. 访问网站

- 访问上文输入中网址
- 必须使用 "lynx -dump -image_links URL"命令访问网站
- 网站内容保存在 `raw.txt` 中

### 2. 下载图片

- 从 `raw.txt` 中提取文章相关图片链接
- 把图片链接写入 `progress.md`
- 逐一下载到 `resources/` 文件夹
- 每下载完成一个图片，必须更新图片下载进度
- 你必须使用 `curl` 命令进行下载

### 3. 改写成 Markdown

- 把 `raw.txt` 改写成 Markdown 格式
- 保存在 `article.md` 中
- 将 `article.md` 中的图片链接指向 `resources/` 文件夹

### 4. 翻译成中英文

- 把 `article.md` 翻译成中英文对照
- 保存在 `article-en-cn.md` 中

### 5. 翻译成中文

- 提取 `article-en-cn.md` 中的中文
- 保存在 `article-cn.md` 中

## `progress.md` 笔记格式

```md
## 任务

[x] xxxxx
[ ] yyyyy
[ ] zzzzz
...

## 图片下载进度

[x] https://xxxx/yyy.png
[ ] https://foo/bar.png
...

## 当前任务

正在下载 https://foo/bar.png
```
