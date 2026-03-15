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

- `Ctrl`+`Shift`+`p`: command palette.
- `Ctrl`+`Shift`+`,`: reload config.

```bash
git clone --depth=1 https://github.com/sahaj-b/ghostty-cursor-shaders ~/.config/ghostty/shaders
sed -i 's/background-opacity = .*/background-opacity = 0.85/' ~/.config/ghostty/config
sed -i 's/^keybind = ctrl+t=/# keybind = ctrl+t=/' ~/.config/ghostty/config
echo 'font-family = "Maple Mono NF CN"' >> ~/.config/ghostty/config
echo "custom-shader = shaders/cursor_warp.glsl" >> ~/.config/ghostty/config
echo "keybind = alt+h=goto_split:left" >> ~/.config/ghostty/config
echo "keybind = alt+j=goto_split:down" >> ~/.config/ghostty/config
echo "keybind = alt+k=goto_split:up" >> ~/.config/ghostty/config
echo "keybind = alt+l=goto_split:right" >> ~/.config/ghostty/config
echo "command = tmux attach || tmux" >> ~/.config/ghostty/config
```

## Tmux

```bash
tmux ls
tmux new -s sessionID
tmux a -t sessionID
tmux show -g >> current.tmux.conf # export configuration
```

### Configuration

```bash
mkdir -p ~/.config/tmux/plugins/catppuccin
git clone --depth=1 https://github.com/catppuccin/tmux.git ~/.config/tmux/plugins/catppuccin/tmux
```

```bash
# Set true color
set -sa terminal-overrides ",xterm*:Tc"
set -g default-terminal "tmux-256color"

# Set prefix
unbind C-b
set -g prefix C-Space
bind C-Space send-prefix

# Start numbering at 1
set -g base-index 1
set -g pane-base-index 1
setw -g pane-base-index 1
set -g renumber-windows on

# Allows for faster key repetition
set -s escape-time 0

# Enable scroll mouse
set -g mouse on

# Constrain window size to maximum size.
setw -g aggressive-resize on

# Set vi-mode
setw -g mode-keys vi

# Escape to enter copy mode, v to selection, y to yank, p to paste
bind Escape copy-mode
bind -T copy-mode-vi v send -X begin-selection
bind -T copy-mode-vi C-v send -X rectangle-toggle
bind -T copy-mode-vi y send -X copy-selection-and-cancel
unbind p
bind p pasteb

# Reload configuration
bind r source-file ~/.config/tmux/tmux.conf \; display-message "Config reloaded"

# Open pane in current directory
bind % split-window -h -c "#{pane_current_path}"
bind '"' split-window -v -c "#{pane_current_path}"

# Configure catppuccin plugin
set -g @catppuccin_flavor "mocha"
set -g @catppuccin_window_status_style "custom"
set -g @catppuccin_window_left_separator "#[fg=#{@_ctp_status_bg},reverse]█#[none]"
set -g @catppuccin_window_middle_separator " "
set -g @catppuccin_window_right_separator "#[fg=#{@_ctp_status_bg},reverse]#[none]"

run ~/.config/tmux/plugins/catppuccin/tmux/catppuccin.tmux

set -g status-right-length 100
set -g status-left-length 100
set -g status-left ""
set -g status-right "#{E:@catppuccin_status_application}"
set -ag status-right "#{E:@catppuccin_status_session}"
set -ag status-right "#{E:@catppuccin_status_uptime}"
```

### Session

- `?`: list key bindings
- `:new`: 创建新的 Session，其中 : 是进入 Tmux 命令行的快捷键
- `s`: list sessions
- `$`: rename the current session
- `d`: detach from the current session

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

```bash
# ~/.bashrc
# Fix git bash flicker
bind 'set bell-style none'
```
