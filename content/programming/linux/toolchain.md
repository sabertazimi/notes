---
sidebar_position: 22
tags: [Programming, OS, Linux, Toolchain, Package, Yum, Rpm]
---

# Toolchain

## Mirrors

```bash
sudo paru -S chsrc-bin
brew install chsrc
scoop install chsrc
winget install RubyMetric.chsrc
```

Auto:

```bash
chsrc set node
chsrc set python
chsrc set rust
chsrc set docker
chsrc set brew
chsrc set flatpak
chsrc set winget
sudo chsrc set arch
sudo chsrc set archlinuxcn
```

Manual:

```bash
chsrc ls ruby
chsrc set ruby rubychina
```

## `scoop`

[`scoop`](https://github.com/ScoopInstaller/Scoop):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

```bash
scoop search bat
scoop install eza
scoop info fzf
scoop bucket add extras
```

## `winget`

[`winget`](https://learn.microsoft.com/en-us/windows/package-manager/winget):

```bash
winget search steam
winget install Microsoft.VisualStudioCode
winget show vscode
winget list
```

:::tip[scoop vs `winget`]

[scoop vs `winget`](https://daftdev.blog/2024/04/01/chocolatey-vs-scoop-vs-winget---which-windows-package-manager-to-use):

Scoop is command line installer,
while WinGet is app installer.

:::

Recommended software for Windows:

```bash
winget install Rustlang.Rustup zig.zig BellSoft.LibericaJDK.11 Tencent.WeixinDevTools
```

```bash
winget install Git.Git GitHub.cli Oven-sh.Bun CoreyButler.NVMforWindows astral-sh.uv
```

```bash
winget install Anthropic.ClaudeCode Neovim.Neovim Microsoft.VisualStudioCode ZedIndustries.Zed
```

```bash
winget install kangfenmao.CherryStudio Microsoft.WindowsTerminal ImageMagick.ImageMagick Gyan.FFmpeg
```

```bash
winget install ClashVergeRev.ClashVergeRev Google.Chrome Microsoft.OneDrive
```

```bash
winget install NetEase.CloudMusic ByteDance.Feishu Tencent.QQ.NT Tencent.WeChat Tencent.WeType Valve.Steam
```

## `mise`

[`mise`](https://github.com/jdx/mise):

```bash
sudo pacman -S mise
brew install mise
scoop install mise
winget install jdx.mise
```

```bash
mise u -g node@lts
node -v
```

## `zoxide`

[`zoxide`](https://github.com/ajeetdsouza/zoxide):

```bash
sudo pacman -S zoxide
brew install zoxide
scoop install zoxide
winget install ajeetdsouza.zoxide
```

Interactive `fzf` menu:

```bash
cdi
cd ambiguous-path <Tab>
```

## `eza`

[`eza`](https://github.com/eza-community/eza):

```bash
sudo pacman -S eza
brew install eza
scoop install eza
winget install eza-community.eza
```

```bash
eza --icons --grid --group-directories-first
```

## `fd`

[`fd`](https://github.com/sharkdp/fd):

```bash
sudo pacman -S fd
brew install fd
scoop install fd
winget install sharkdp.fd
```

```bash
fd --hidden --follow --exclude .git
```

## `ripgrep`

[`rg`](https://github.com/BurntSushi/ripgrep):

```bash
sudo pacman -S ripgrep
brew install ripgrep
winget install BurntSushi.ripgrep.MSVC
scoop install ripgrep
```

Config with [`export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"`](https://github.com/sabertazimi/dotfiles/blob/main/dot_ripgreprc):

```bash
vim $(rg text -l)
```

## `fzf`

[`fzf`](https://github.com/junegunn/fzf):

```bash
sudo pacman -S fzf
brew install fzf
winget install fzf
scoop install fzf
```

Config with [`FZF_DEFAULT_COMMAND`](https://github.com/sabertazimi/dotfiles/blob/main/dot_zshrc):

- `ctrl-r`: find commands.
- `ctrl-t`: find files and directories.
- `alt-c`: `cd` into directory.
- `code **<TAB>`/`code $(fzf -m)`: fuzzy completion for files and directories.
- `ctrl-k` / `ctrl-j`: move cursor up and down.
- Multi-select(`-m`): `tab` and `shift-tab` to mark multiple items.

See [practical guide](https://thevaluable.dev/practical-guide-fzf-example)
for more `fzf` examples.

## Television

[Television](https://github.com/alexpasmantier/television):

```bash
sudo pacman -S television
brew install television
scoop bucket add extras
scoop install television
winget install alexpasmantier.television
```

```bash
tv
tv files
tv text
tv git-repos
tv env
tv list-channels
```

Fetch community [channels](https://alexpasmantier.github.io/television/community/channels-unix)
like `cargo-crates`, `gh-issues`, `pacman-packages`:

```bash
tv update-channels
```

Custom `AUR` channel [`~/.config/television/cable/aur.toml`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/television/cable/aur.toml).

## `jq`

[`jq`](https://github.com/jqlang/jq):

```bash
sudo pacman -S jq
brew install jq
scoop install jq
winget install jqlang.jq
```

```bash
curl -s https://fx.wtf/example.json | jq '.users[] | {name, email}'

# Set up package version for GitHub action workflow
echo "version=$(jq -r '.devDependencies["@playwright/test"]' package.json | sed 's/^[^0-9]*//')"
```

## `fx`

[`fx`](https://github.com/antonmedv/fx):

```bash
sudo pacman -S fx
brew install fx
scoop install fx
```

Terminal JSON [viewer and processor](https://fx.wtf/getting-started):

```bash
# Hello world
echo '{"name": "world"}' | fx 'x => x.name' 'x => `Hello, ${x}!`'

# Bump version
fx package.json 'x.version = x.version.replace(/\d+$/, n => +n + 1), x'

# Interactive JSON viewer
curl -s https://fx.wtf/example.json | fx
```

## `doggo`

[`doggo`](https://github.com/mr-karan/doggo):

```bash
sudo pacman -S doggo
brew install doggo
scoop install doggo
winget install doggo
```

```bash
doggo example.com
doggo MX github.com @9.9.9.9
doggo example.com --json | jq '.responses[0].answers[].address'
```

## Developer

- [行书指南](https://github.com/xszn/xszn.github.io):
  高质量免费与开源软件列表.
- [IT](https://github.com/CorentinTh/it-tools):
  Collection of handy online toolkit for developers.
- [Omni](https://github.com/iib0011/omni-tools):
  Collection of powerful web-based toolkit for everyday tasks.
- [`Miku`](https://github.com/Ice-Hazymoon/MikuTools):
  Lightweight toolkit collection.

## Dotfiles

- [macOS](https://github.com/mathiasbynens/dotfiles)
- [Linux](https://github.com/thoughtbot/dotfiles)
- [Arch](https://github.com/sabertazimi/dotfiles)
- [Ubuntu](https://github.com/tracyone/oh-my-ubuntu)

## References

- Cross-platform Rust rewrite of the [GNU core utils](https://github.com/uutils/coreutils).
- Modern alternatives to [common Linux commands](https://github.com/ibraheemdev/modern-unix).
- Terminal [tool of the week](https://terminaltrove.com/tool-of-the-week).
- `fzf` [practical guide](https://thevaluable.dev/practical-guide-fzf-example).
- Animating ASCII art [app](https://github.com/CameronFoxly/Ascii-Motion).
