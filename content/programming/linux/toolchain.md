---
sidebar_position: 4
tags: [Programming, OS, Linux, Toolchain, Package, Yum, Rpm]
---

# Toolchain

## Modern Unix

- Cross-platform Rust rewrite of the [GNU core utils](https://github.com/uutils/coreutils).
- Modern alternatives to [common unix commands](https://github.com/ibraheemdev/modern-unix).

```bash
scoop install mise zoxide bat eza delta dust duf fd ripgrep fzf jq fx tlrc bottom gping procs curlie
```

```bash
eval "$(mise activate bash)"
eval "$(zoxide init bash)"
eval "$(fzf --bash)"
source <(fx --comp bash)

bind 'set bell-style none'

# Use fd for listing path candidates
_fzf_compgen_path() {
  fd --hidden --follow --exclude ".git" . "$1"
}

# Use fd for list directory candidates
_fzf_compgen_dir() {
  fd --type d --hidden --follow --exclude ".git" . "$1"
}

alias app="scoop"
alias cc="claude"
alias ccc="claude -c"
alias ccm="claude -p 'commit'"
alias code="cursor"
alias np="pnpm"
alias vim="nvim"

alias cd="z"
alias cat="bat"
alias ls="eza"
alias du="dust"
alias df="duf"
alias find="fd --hidden --follow --exclude .git"
alias grep="rg"
alias man="tldr"
alias top="btm"
alias ping="gping"
alias ps="procs"
alias curl="curlie"

export FZF_DEFAULT_COMMAND="fd --type f --strip-cwd-prefix --hidden --follow --exclude .git"
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
export PATH="$HOME/.local/bin:$PATH"
```

### Scoop

[Scoop](https://github.com/ScoopInstaller/Scoop):

```powershell
# Command-line installer for Windows
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

```bash
scoop search bat
scoop install eza
scoop info fzf
scoop bucket add extras
```

### WinGet

[WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget):

```bash
winget search steam
winget install Microsoft.VisualStudioCode
winget show vscode
winget list
```

:::tip[Scoop vs WinGet]

[Scoop vs WinGet](https://daftdev.blog/2024/04/01/chocolatey-vs-scoop-vs-winget---which-windows-package-manager-to-use):

Scoop is command line installer,
while WinGet is app installer.

:::

Recommended software for Windows:

```bash
winget install astral-sh.uv BellSoft.LibericaJDK.11 CoreyButler.NVMforWindows Rustlang.Rustup Tencent.WeixinDevTools zig.zig
```

```bash
winget install Google.Antigravity Microsoft.VisualStudioCode Neovim.Neovim Obsidian.Obsidian ZedIndustries.Zed
```

```bash
winget install Git.Git GitHub.cli kangfenmao.CherryStudio Microsoft.WindowsTerminal ImageMagick.ImageMagick Gyan.FFmpeg
```

```bash
winget install ClashVergeRev.ClashVergeRev Mihomo-Party.Mihomo-Party Google.Chrome Microsoft.OneDrive
```

```bash
winget install ByteDance.Feishu NetEase.CloudMusic Tencent.QQ.NT Tencent.WeChat Tencent.WeType Valve.Steam
```

### Mise

[Mise](https://github.com/jdx/mise):

```bash
brew install mise
scoop install mise
winget install jdx.mise
```

```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
mise u -g node@lts
node -v
```

### Zoxide

[zoxide](https://github.com/ajeetdsouza/zoxide):

```bash
brew install zoxide
scoop install zoxide
winget install ajeetdsouza.zoxide
```

```bash
eval "$(zoxide init bash)"

alias cd="z"
```

### Bat

[bat](https://github.com/sharkdp/bat):

```bash
brew install bat
scoop install bat
winget install sharkdp.bat
```

```bash
alias cat="bat"
```

### Eza

[eza](https://github.com/eza-community/eza):

```bash
brew install eza
scoop install eza
winget install eza-community.eza
```

```bash
alias ls="eza"
```

### Delta

[delta](https://github.com/dandavison/delta):

```bash
brew install git-delta
scoop install delta
winget install dandavison.delta
```

```bash
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global delta.dark true
git config --global delta.line-numbers true
git config --global delta.side-by-side true
git config --global merge.conflictStyle zdiff3
```

```bash
git diff
git show
git add -p
git log -p
git stash show -p
git reflog -p
```

### Dust

[dust](https://github.com/bootandy/dust):

```bash
brew install dust
scoop install dust
winget install bootandy.dust
```

```bash
alias du="dust"
```

### Duf

[duf](https://github.com/muesli/duf):

```bash
brew install duf
scoop install duf
winget install muesli.duf
```

```bash
alias df="duf"
```

### Fd

[fd](https://github.com/sharkdp/fd):

```bash
brew install fd
scoop install fd
winget install sharkdp.fd
```

```bash
alias find="fd --hidden --follow --exclude .git"
```

### RipGrep

[rg](https://github.com/BurntSushi/ripgrep):

```bash
brew install ripgrep
winget install BurntSushi.ripgrep.MSVC
scoop install ripgrep
```

```bash
alias grep="rg"

export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
```

`$HOME/.ripgreprc`:

```bash
# Add 'web' type.
--type-add
web:*.{html,css,js,jsx,ts,tsx,vue,svelte,astro}*

# Search hidden files / directories (e.g. dotfiles) by default
--hidden

# Using glob patterns to include/exclude files or folders
--glob
!**/.git/*

# Ignore case unless all caps
--smart-case
```

```bash
# Show file list with `-l`
rg -l text
```

### Fzf

[fzf](https://github.com/junegunn/fzf):

```bash
brew install fzf
winget install fzf
scoop install fzf
```

```bash
# ~/.bashrc
eval "$(fzf --bash)"
# ~/.zshrc
source <(fzf --zsh)

# Use fd for listing path candidates
_fzf_compgen_path() {
  fd --hidden --follow --exclude ".git" . "$1"
}

# Use fd for list directory candidates
_fzf_compgen_dir() {
  fd --type d --hidden --follow --exclude ".git" . "$1"
}

# Respecting `.gitignore`
export FZF_DEFAULT_COMMAND="fd --type f --strip-cwd-prefix --hidden --follow --exclude .git"
```

Command line fuzzy finder:

- `ctrl-r`: find commands.
- `ctrl-t`: find files and directories.
- `alt-c`: `cd` into directory.
- `code **<TAB>`/`code $(fzf -m)`: fuzzy completion for files and directories.
- `ctrl-k` / `ctrl-j`: move cursor up and down.
- Multi-select(`-m`): `tab` and `shift-tab` to mark multiple items.

### Jq

[jq](https://github.com/jqlang/jq):

```bash
brew install jq
scoop install jq
winget install jqlang.jq
```

```bash
echo "version=$(jq -r '.devDependencies["@playwright/test"]' package.json | sed 's/^[^0-9]*//')"
```

### Fx

[fx](https://github.com/antonmedv/fx):

```bash
brew install fx
scoop install fx
```

```bash
# ~/.bashrc
source <(fx --comp bash)
# ~/.zshrc
source <(fx --comp zsh)
```

Terminal JSON [viewer and processor](https://fx.wtf/getting-started):

```bash
# Hello world
echo '{"name": "world"}' | fx 'x => x.name' 'x => `Hello, ${x}!`'

# Bump version
fx package.json 'x.version = x.version.replace(/\d+$/, n => +n + 1), x'

# Interactive JSON viewer
curl -i https://fx.wtf/example.json | fx
```

### TLDR

[TLDR](https://github.com/tldr-pages/tldr):

```bash
brew install tlrc
scoop install tlrc
winget install tldr-pages.tlrc
```

```bash
alias man="tldr"
```

### Bottom

[bottom](https://github.com/ClementTsang/bottom):

```bash
brew install bottom
scoop install bottom
winget install Clement.bottom
```

```bash
alias top="btm"
```

### Gping

[gping](https://github.com/orf/gping):

```bash
brew install gping
scoop install gping
winget install orf.gping
```

```bash
alias ping="gping"
```

### Procs

[procs](https://github.com/dalance/procs):

```bash
brew install procs
scoop install procs
winget install dalance.procs
```

```bash
alias ps="procs"
```

### Curlie

[Curlie](https://github.com/rs/curlie):

```bash
brew install curlie
scoop install curlie
```

```bash
alias curl="curlie"
```

## Package Manager

### Rpm

安装和卸载时同时存在依赖性(包依赖、库依赖)

rpm 查询:

- -q 包名 查询已安装的包 //必备参数
- -a 查询所有已安装的包
- -i 查询软件信息
- -l list
- -f 查询系统文件属于哪个软件包
- -R 查询软件包的依赖性
- -p 查询未安装包 //普适参数

rpm 校验(查看 Cracker 信息):

- -V 校验已安装包 相应信息不是.号便是被修改项 可用于找回丢失的系统命令

### Yum

源配置文件:/etc/yum.repos.d

```bash
cd /etc/yum.repos.d
mv CentOS-Base.repo CentOS-Base.repo.bk
wget https://mirrors.163.com/.help/CentOS7-Base-163.repo
yum makecache
```

- yum list
- yum search 'keyword'
- yum -y(自动回答 yes) install 包名
- yum -y update 包名
- yum -y remove 包名
- yum grouplist
- yum groupinstall 软件组名
- yum groupremove 软件组名

### Source Code

指定位置:

- /usr/local/软件名/
- /usr/local/src/软件名/

(如上述脚本出错，执行 make clean）

```bash
make install
```

e.g. apache /var/www/html/index.html /usr/local/apache/htdocs/index.html

### Applications

- desktop shortcut: `/usr/share/applications`
- startup apps: `gnome-session-properties` or `gnome-tweaks`

### Default

`update-alternatives`: maintain symbolic links determining default commands.

```bash
sudo update-alternatives --get-selections
```

```bash
sudo update-alternatives --install /usr/bin/x-terminal-emulator
 \ x-terminal-emulator /opt/Hyper/hyper 50
```

```bash
sudo update-alternatives --config x-terminal-emulator
```

### APT Key

```bash
# Add key
sudo apt-add-repository ppa:user/repo
sudo apt update

# Delete key via last 8 bits
sudo apt-key list
sudo apt-key del 73C62A18
sudo apt update
```

## C++ Binary

### Ldd

```bash
ldd ./lib.sio
```

### Nm

```bash
nm -Ca ./lib.so
```

## Plot

chart.gp

```bash
#!/usr/bin/env gnuplot

set term wxt enhanced
set xtics
set view
set multiplot
set size
set origin
fit

plot 'data.dat' using 1:2, 'data.dat' using 1:3
```

```bash
#!/usr/bin/gnuplot -c

set terminal png enhanced
set output ARG1.".png"
set style data linespoints
show timestamp
set title ARG1
set xlabel "time (seconds)"
set ylabel "Segments (cwnd, ssthresh)"
plot ARG1 using 1:7 title "snd_cwnd", \
     ARG1 using 1:($8>=2147483647 ? 0 : $8) title "snd_ssthresh"
```

## Developer Toolkit

- [MAS](https://github.com/massgravel/Microsoft-Activation-Scripts):
  Microsoft KMS activation scripts.
- [行书指南](https://github.com/xszn/xszn.github.io):
  高质量免费与开源软件列表.
- [IT](https://github.com/CorentinTh/it-tools):
  Collection of handy online toolkit for developers.
- [Omni](https://github.com/iib0011/omni-tools):
  Collection of powerful web-based toolkit for everyday tasks.
- [Miku](https://github.com/Ice-Hazymoon/MikuTools):
  Lightweight toolkit collection.

## Dotfiles

- [macOS](https://github.com/mathiasbynens/dotfiles)
- [Linux](https://github.com/thoughtbot/dotfiles)
- [Ubuntu](https://github.com/tracyone/oh-my-ubuntu)

## References

- Terminal [tool of the week](https://terminaltrove.com/tool-of-the-week).
