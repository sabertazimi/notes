---
sidebar_position: 21
tags: [Programming, OS, Linux, Terminal, Tmux]
---

# Terminal

- 电传打字机 (Teletypewriter, `TTY`) 是物理设备,
  最初是为电报设计, 后来被连接到计算机上, 发送输入和获取输出.
- 电传打字机 (`TTY`) 现在被运行在内核中的模块所模拟,
  被称为终端模拟器 (Terminal Emulator).
- 伪终端 (Pseudo Terminal, `PTY`) 是运行在用户区的终端模拟程序.
- Shell 由 Terminal fork 出来, 是 Terminal 的子进程.
  Terminal 处理键盘事件, 负责字符的显示.
  Shell 负责解释执行用户输入的字符, 返回操作系统底层响应.
- 可以使用 `stty` 命令对 TTY 设备进行配置.
- 远程终端 `ssh` 也是一种伪终端 `PTY`:
  - Local: `PTY` Master is Terminal, `PTY` Slave is `bash` and `ssh client`.
  - Remote: `PT`Y Master is `ssh server`, `PTY` Slave is `bash`.

## TTY

`Ctrl`+`Alt`+`F1` ~ `F6`: 在 `TTY1` ~ `TTY6` 间切换.

## Ghostty

Config [`~/.config/ghostty/config`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/ghostty/config):

```bash
git clone --depth=1 https://github.com/sahaj-b/ghostty-cursor-shaders ~/.config/ghostty/shaders
```

- `Ctrl`+`Shift`+`p`: command palette.
- `Ctrl`+`Shift`+`,`: reload config.

## Tmux

```bash
tmux ls
tmux new -s sessionID
tmux a -t sessionID
tmux show -g >> current.tmux.conf # export configuration
```

### Configuration

Config [`~/.config/tmux/tmux.conf`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/tmux/tmux.conf):

```bash
mkdir -p ~/.config/tmux/plugins/catppuccin
git clone --depth=1 https://github.com/catppuccin/tmux ~/.config/tmux/plugins/catppuccin/tmux
```

Set up `Matugen` config [`~/.config/matugen/config.toml`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/matugen/config.toml)
and template [`~/.config/matugen/templates/tmux.conf`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/matugen/templates/tmux.conf).

### Session

- `?`: list key bindings
- `:new`: 创建新的 Session，其中 : 是进入 Tmux 命令行的快捷键
- `s`: list sessions
- `$`: rename the current session
- `d`: detach from the current session
- Auto attach tmux session for terminal [`~/.local/bin/ghostty-tmux.sh`](https://github.com/sabertazimi/dotfiles/blob/main/dot_local/bin/executable_ghostty-tmux.sh).

### Window

- `c`: create a new window
- `,`: rename the current window
- `w`: list windows
- `%`: split horizontally
- `"`: split vertically
- `n`: change to the next window
- `p`: change to the previous window
- `0` ~ `9`: select windows `0` through `9`

### Pane

- `%`: create a horizontal pane
- `"`: create a vertical pane
- `<space>`: 切换 pane 布局
- `h`: move to left pane
- `j`: move to below pane
- `l`: move to right pane
- `k`: move to above pane
- `q`: show pane numbers
- `o`: toggle between panes
- `}`: swap with next pane
- `{`: swap with previous pane
- `!`: break the pane out of the window
- `x`: kill current pane
- `t`: 显示一个时钟

### Scroll

- `C-a`+`[` to into scroll mode, `q` to quit scroll mode
- Copy mode can scroll too
- `set -g mouse on` for enabling mouse scrolling

## Windows

Fix git bash flicker:

```bash
bind 'set bell-style none'
```
