---
sidebar_position: 1
tags: [Programming, OS, Linux, Commands]
---

# Core

## Command Priority

1. 包含路径命令 `./vmtools.pl`.
2. 别名命令.
3. Bash 内部命令.
4. `$PATH` 包含目录内的命令 (`/bin`/`/sbin`).

## Folder Structure

```bash
man hier
```

通过源码包安装的软件，可以通过 `./configure --prefix=/opt/`.

- `/usr/src`: Kernel source code.
- `/usr/share/applications`: Desktop shortcuts.
- `/usr/share/fonts/opentype`: Open Type Fonts (OTF).
- `/usr/share/fonts/truetype`: True Type Fonts (TTF).
- `/etc/nginx`: Nginx.

## Getting Started

### Ls

- `-lh`: long human.
- `-ld`: long directory.
- `-i inode --color==auto`

权限 (user/group/other) 引用计数 user group 文件大小 文件修改时间 文件名.

### Cd

- `-`: 上次目录.
- `..`: 上级目录.

### Pwd

print working directory

### Rm

- –r delete directory
- –f delete forcedly
- -i 显示确认信息

### Cp

- -r copy directory
- -p copy property
- -d copy link
- -a --all(-pdr)
- -i 显示确认信息

### Mv

无需参数(改名+移动)

- -i 显示确认信息

### Ln

link: create `.bak/.hard` (硬链接) and `.soft` (软链接：创建链接时填写绝对路径).

- A hard link always points a filename to data on a storage device.
- A soft link always points a filename to another filename,
  which then points to information on a storage device.

```bash
ln [源文件] [New Hard Link File]
ln -s [源文件] [New Soft Link File]
```

## History

- -c 清除历史命令
- -w (~/.bash_history) 保存历史命令

/etc/profile 中修改 HISTSIZE !n/!!/!字符串 重复执行第 n 条/上一条/指定开头的历史命令

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

## Time

```bash
date
```

Change ntp (Network Time Protocol) time:

```bash
sudo apt-get install ntpdate
sudo iptables -A OUTPUT -p udp --dport 123 -j ACCEPT
sudo iptables -A INPUT -p udp --sport 123 -j ACCEPT
sudo ntpdate time.windows.com
sudo hwclock --localtime --systohc
```

Use local time (not UTC time):

```bash
sudo timedatectl set-local-rtc 1
```

NTP servers:

```bash
ntpd
ntpq -p
```

## Search

### Locate

结合 `updatedb` 命令 (该命令一般自动 1 天/次).

### Type

Indicate how a command name is interpreted.

### Apropos

Display a list of appropriate commands.

### Whereis

### Whatis

### Find

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

### Grep

`grep` `[可选参数] '字符串' 文件名`:

- `-I`: 不区分大小写
- `-v`: 排除指定字符串
- `-r`: recursive on directory
- `-l`: only print matched filename
- `--exclude`

Find `FunctionalComponent` in files and open them all:

```bash
grep -lr FunctionalComponent src --exclude=*.md | xargs code
```

## Process

### Uptime

Average load information:

```bash
uptime
```

### Ps

Report a snapshot of current processes

```bash
ps aux
ps aux --sort=-%mem

ps -u <username> | grep -v PID | sort -k4 -n -r | head -n 10
ps -u <username> | grep -v PID | awk '{print $1}' | xargs kill -9
```

### Vmstat

Outputs a snapshot of system resource usage:

- CPU usage
- Context switch times
- Interrupt times (/proc/interrupts)
- Running and exclusive process status
- Memory usage
- Swap space
- Disk I/O usage

```bash
vmstat 1
```

### Mpstat

- CPU usage
- Software interrupt times (/proc/interrupts)

```bash
mpstat -P ALL 1
```

### Pidstat

Process and Thread:

- CPU usage
- Context switch times
- Interrupt times (/proc/interrupts)

```bash
pidstat 1
```

### Top

`top`/`htop`:

- Display tasks
- Average load
- Process status
- CPU usage

`atop`:

- Memory usage
- Disk I/O usage
- Network usage

### Lscpu

Show `/proc/cpuinfo`.

### Jobs

List active jobs.

### Bg

Place a job in the background.

### Fg

Place a job in the foreground.

### Kill

Send a signal to a process.

### Killall

Kill processes by name.

### Shutdown

Shutdown or reboot the system.

### Pstree

Outputs a process list arranged in a tree-like pattern.

### Xload and Tload

Draws a graph showing system load over time.

### Screen

```bash
screen -S screenName
screen -ls
screen -r
```

- `Ctrl+d`: detach window
- `Ctrl+k`: kill window

## Memory

### Iostat

```bash
iostat -xz 1
iostat -xmhy 1 4
```

### Iotop

```bash
iotop -o
```

### Free

```bash
free -m
```

## Documentation

### Man

- -f 显示操作等级
- -k 包含匹配
- -1/2/.../9 显示命令不同操作等级的帮助

1. Commands (Programs)
   Those commands that can be executed by the user from within a shell.
2. System calls
   Those functions which must be performed by the kernel.
3. Library calls
   Most of the libc functions.
4. Special files (devices)
   Files found in /dev.
5. File formats and conventions
   The format for /etc/passwd and other human-readable files.
6. Games
7. Conventions and miscellaneous
   Overviews of various topics, conventions and protocols,
   character set standards, and miscellaneous other things.
8. System management commands
   Commands like mount(8), many of which only root can execute.

### Help Shell

显示 shell 内部命令帮助，如 `cd` 命令 (shell 内部命令)

### Info

显示大型帮助文档 - enter 进入 u 返回 p 上一节 n 下一节 q 退出

### Neofetch

Get system information:

```bash
sudo add-apt-repository ppa:dawidd0811/neofetch
sudo apt-get update
sudo apt-get install neofetch
```

```bash
sudo apt-get install screenfetch
```

## Log

### Dmesg

```bash
dmesg -T | tail
```

### Journal

Options:

```bash
# Reverse
journalctl -r
# Unit
journalctl -u <service-name>
# Level
journalctl -p 3
# entries
journalctl -n 50
# User
journalctl -xe --user -u <service-name>
# Boot
journalctl -b
journalctl -b -1
journalctl --list-boots

```

Recipes:

```bash
# Error
journalctl -p 3 -xb
journalctl -p 3 -x -b -1
# Last 50 logs from last boot
journalctl -n 50 -b -1
```

### Coredump

```bash
coredumpctl list
coredumpctl info <PID>
```

### Boot

```bash
last -x shutdown reboot
```

## Performance

![Linux Performance Toolchain](./figures/linux-performance-toolchain.png 'Linux Performance Toolchain')

- [Uptime](#uptime).
- [Dmesg](#dmesg).
- [Vmstat](#vmstat).
- [Mpstat](#mpstat).
- [Pidstat](#pidstat).
- [Iostat](#iostat).
- [Free](#free).
- [Sar](./network.md#sar).
- [Top](#top).
- [Iotop](#iotop).

[Linux performance analysis in 60,000 milliseconds](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)
(Netflix):

```bash
# Load average
uptime

# Kernel errors
dmesg -T | tail

# Overall stats by time
vmstat 1

# CPU balance
mpstat -P ALL 1

# Process usage
pidstat 1

# Disk I/O
iostat -xz 1

# Memory usage
free -m

# Network I/O
sar -n DEV 1

# TCP stats
sar -n TCP,ETCP 1

# Check overview
top
```

### Perf

Perf [cookbook](http://www.brendangregg.com/perf.html)

```bash
perf list # events
perf stat <command>
perf stat -e <events> <command>
perf record -e <events> -a <command>
perf report
```

```bash
perf record -F 99 -a -g -- sleep 10

perf report -n --stdio
perf report -n -g 'flamegraph'
```

### Stress

```bash
sudo pacman -S s-tui
```

## References

- Linux [cheatsheets](https://github.com/trimstray/the-book-of-secret-knowledge).
- [DashDash: Beautiful Linux Manual Pages](https://dashdash.io)
- [TLDR](https://github.com/tldr-pages/tldr)
- [ArchWiki](https://wiki.archlinux.org)
