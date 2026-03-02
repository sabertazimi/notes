---
sidebar_position: 1
tags: [Programming, OS, Linux, Commands]
---

# Commands

## Priority

1. 包含路径命令 `./vmtools.pl`.
2. 别名命令.
3. Bash 内部命令.
4. `$PATH` 包含目录内的命令 (`/bin`/`/sbin`).

## Structure

```bash
man hier
```

通过源码包安装的软件，可以通过 `./configure --prefix=/opt/`.

- `/usr/src`: Kernel source code
- `/usr/share/applications`: Desktop shortcuts
- `/usr/share/fonts/truetype`: True Type Fonts (`TTF`)
- `/usr/share/fonts/opentype`: Open Type Fonts (`OTF`)
- `/etc/nginx`: Nginx

## `ls`

- `-lh`: long human.
- `-ld`: long directory.
- `-i inode --color==auto`

权限 (user/group/other) 引用计数 user group 文件大小 文件修改时间 文件名.

## `cd`

- `-`: 上次目录.
- `..`: 上级目录.

## `pwd`

print working directory

## `rm`

- `–r` delete directory
- `–f` delete by force
- `-i` 显示确认信息

## `cp`

- `-r` copy directory
- `-p` copy property
- `-d` copy link
- `-a` `--all` (`-pdr`)
- `-i` 显示确认信息

## `mv`

无需参数 (改名 + 移动)

- `-i` 显示确认信息

## `ln`

Create `.bak/.hard` (硬链接) and `.soft` (软链接：创建链接时填写绝对路径):

- A hard link always points a filename to data on a storage device.
- A soft link always points a filename to another filename,
  which then points to information on a storage device.

```bash
ln [源文件] [New Hard Link File]
ln -s [源文件] [New Soft Link File]
```

## History

- `-c` 清除历史命令
- -`w` (`~/.bash_history`) 保存历史命令
- `/etc/profile` 中修改 `HISTSIZE`
- `!n`/`!!`/`!字符串` 重复执行第 n 条/上一条/指定开头的历史命令

```bash
# repeat history command
!number
```

### Reverse

Press `ctrl-r` 提示符改变, 显示我们正在执行反向增量搜索.
搜索过程是`反向的`，因为我们按照从`现在`到`过去`某个时间段的顺序来搜寻.
下一步, 我们开始输入要查找的文本搜索返回我们需要的结果.
(`enter` to execute, `ctrl-j` to copy)

### Shortcuts

| command  | function                             |
| :------- | :----------------------------------- |
| `Ctrl-p` | 移动到上一个历史条目                 |
| `Ctrl-n` | 移动到下一个历史条目                 |
| `Alt-<`  | 移动到历史列表开头                   |
| `Alt->`  | 移动到历史列表结尾                   |
| `Ctrl-r` | 反向增量搜索                         |
| `Alt-p`  | 反向搜索，非增量搜索                 |
| `Alt-n`  | 向前搜索，非增量                     |
| `Ctrl-o` | 执行历史列表中的当前项，并移到下一个 |

## References

- Arch Linux [wiki](https://wiki.archlinux.org)
- Linux [cheat sheets](https://github.com/trimstray/the-book-of-secret-knowledge)
- Modern beautiful Linux [manual pages](https://dashdash.io)
- [`TLDR`](https://github.com/tldr-pages/tldr)
