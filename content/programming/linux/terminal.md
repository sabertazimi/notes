---
sidebar_position: 10
tags: [Programming, OS, Linux, Terminal, Tmux]
---

# Terminal

- 电传打字机 (TeleTypeWriter, TTY) 是物理设备,
  最初是为电报设计, 后来被连接到计算机上, 发送输入和获取输出.
- 电传打字机 (TTY) 现在被运行在内核中的模块所模拟,
  被称为终端模拟器 (Terminal Emulator).
- 伪终端 (Pseudo Terminal, PTY) 是运行在用户区的终端模拟程序.
- Shell 由 Terminal fork 出来, 是 Terminal 的子进程.
  Terminal 处理键盘事件, 负责字符的显示.
  Shell 负责解释执行用户输入的字符, 返回操作系统底层响应.
- 可以使用 `stty` 命令对 TTY 设备进行配置.
- 远程终端 `ssh` 也是一种伪终端 PTY:
  - Local: PTY Master is Terminal, PTY Slave is `bash` and `ssh client`.
  - Remote: PTY Master is `ssh server`, PTY Slave is `bash`.

## TTY

`Ctrl`+`Alt`+`F1 ~ F6` 在 TTY1 ~ TTY6 间切换.

## Tmux

```bash
tmux ls
tmux new -s sessionID
tmux a -t sessionID # attach
tmux show -g >> current.tmux.conf # export configuration
```

### Tmux Hotkeys

```bash
?        # 快捷键帮助列表
```

### Tmux Session

```bash
:new<CR> # 创建新的 Session，其中 : 是进入 Tmux 命令行的快捷键
s list sessions
$ rename the current session
d detach from the current session
```

### Tmux Window

```bash
c create a new window
, rename the current window
w list windows
% split horizontally
" split vertically
n change to the next window
p change to the previous window
0 to 9 select windows 0 through 9
```

### Tmux Pane

```bash
% create a horizontal pane
" create a vertical pane
<space>  # 切换 Pane 布局
h move to the left pane. *
j move to the pane below *
l move to the right pane *
k move to the pane above *
q show pane numbers
o toggle between panes
} swap with next pane
{ swap with previous pane
! break the pane out of the window
x kill the current pane
t        # 显示一个时钟
```

### Tmux Scroll

- `C-a + [` to into scroll mode, `q` to quit scroll mode
- copy mode can scroll too
- `set -g mouse on` for enabling mouse scrolling

### Tmux Configuration

```bash
# C-b is not acceptable -- Vim uses it
set-option -g prefix C-a
bind-key C-a last-window

# Start numbering at 1
set -g base-index 1

# Allows for faster key repetition
set -s escape-time 0

# Set status bar
set -g status-bg black
set -g status-fg white
set -g status-left ""
set -g status-right "#[fg=green]#H"

# Enable scroll mouse
set -g mouse on

# Rather than constraining window size to the maximum size of any client
# connected to the *session*, constrain window size to the maximum size of any
# client connected to *that window*. Much more reasonable.
setw -g aggressive-resize on

# Allows us to use C-a a <command> to send commands to a TMUX session inside
# another TMUX session
bind-key a send-prefix

# Reload configuration
bind r source-file ~/.tmux.conf \; display-message "Config reloaded"

# Escape to enter copy mode, v to selection, y to yank, p to paste
bind Escape copy-mode
bind-key -T copy-mode-vi 'v' send -X begin-selection
bind-key -T copy-mode-vi 'y' send -X copy-selection-and-cancel
# bind-key -t vi-copy v begin-selection
# bind-key -t vi-copy y copy-pipe "reattach-to-user-namespace pbcopy"
unbind p
bind p pasteb

setw -g mode-keys vi      # Vi

# Highlight active window
set-window-option -g window-status-current-bg red
```

## Ghostty

- `Ctrl`+`Shift`+`p`: command palette.
- `Ctrl`+`Shift`+`,`: reload config.

```bash
git clone --depth=1 https://github.com/sahaj-b/ghostty-cursor-shaders ~/.config/ghostty/shaders
sed -i 's/background-opacity = .*/background-opacity = 0.85/' ~/.config/ghostty/config
sed -i 's/^keybind = ctrl+t=/# keybind = ctrl+t=/' ~/.config/ghostty/config
echo "custom-shader = shaders/cursor_warp.glsl" >> ~/.config/ghostty/config
echo "keybind = alt+h=goto_split:left" >> ~/.config/ghostty/config
echo "keybind = alt+j=goto_split:down" >> ~/.config/ghostty/config
echo "keybind = alt+k=goto_split:up" >> ~/.config/ghostty/config
echo "keybind = alt+l=goto_split:right" >> ~/.config/ghostty/config
```

## Windows

```bash
# ~/.bashrc

# Fix git bash flicker
bind 'set bell-style none'
```
