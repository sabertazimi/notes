---
sidebar_position: 9
tags: [Programming, Vim]
---

# Error

## Swap Backup

Can't open swap or backup file:

- Create `:set directory?` directory.
- Chown of directory to `${whoami}`.

## Error Encoding

```vim
set fileencodings=utf-8,gb2312,gb18030,gbk,ucs-bom,cp936,latin1
set fileformats=unix,dos,mac
set enc=utf8
set fencs=utf8,gbk,gb2312,gb18030
set termencoding=utf-8
```
