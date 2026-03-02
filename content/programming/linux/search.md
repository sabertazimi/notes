---
sidebar_position: 2
tags: [Programming, OS, Linux, Search]
---

# Search

## Locate

结合 `updatedb` 命令 (该命令一般自动 1 天/次).

## Type

Indicate how a command name is interpreted.

## Apropos

Display a list of appropriate commands.

## `whereis`

## `whatis`

## `which`

## Find

`find [搜索路径] [可选参数] [文件名](可加"")`:

- `-name`.
- `-iname`: 不区分大小写.
- `-user`: `user_name` 按照所有者搜索.
- `-nouser`: 搜索没有所有者的文件.
- `-atime`(文件访问时间)/`-ctime`(改变文件属性)/`-mtime`(改变文件内容):
  `-10`(十天内)/`10`(十天当天)/`+10`(十天前).
- `-size`: 文件大小, `-25k`(小于 25k)/`25M`(25M)/`+25G`(大于 25G).
- `-inum`: `inode_number`.
- `-a`/`-o`: 逻辑与/逻辑或 (左右两端搜索条件).
- `-exec system_command_list {} ;`: 对搜索结果执行操作.
- `-ok system_command_list {} ;`: 对搜索结果执行操作.

```bash
find . -name "*.bak" -type f
find . -name "*.bak" -type f -delete
```

## Grep

`grep` `[可选参数] '字符串' 文件名`:

- `-i`: 不区分大小写
- `-v`: 排除指定字符串
- `-r`: recursive on directory
- `-l`: only print matched filename
- `--exclude`

Find `FunctionalComponent` in files and open them all:

```bash
grep -lr FunctionalComponent src --exclude=*.md | xargs code
```

## Man

- `-f` 显示操作等级
- `-k` 包含匹配
- `-1`/`-2`/`...`/`-9` 显示命令不同操作等级的帮助

1. Commands (Programs)
   Those commands that can be executed by the user from within a shell.
2. System calls
   Those functions which must be performed by the kernel.
3. Library calls
   Most of the `libc` functions.
4. Special files (devices)
   Files found in `/dev`.
5. File formats and conventions
   The format for `/etc/passwd` and other human-readable files.
6. Games
7. Conventions and miscellaneous
   Overviews of various topics, conventions, and protocols,
   character set standards, and miscellaneous other things.
8. System management commands
   Commands like mount(8), many of which only root can execute.

## `help`

显示 shell 内部命令帮助:

```bash
help cd
```

## `info`

显示大型帮助文档:

- `enter` 进入
- `u` 返回
- `p` 上一节
- `n` 下一节
- `q` 退出
