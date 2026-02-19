---
sidebar_position: 10
tags: [Programming, OS, Linux, Distributions, Ubuntu, Arch Linux, WSL]
---

# Arch Linux

## Install

:::caution

Disable BIOS secure boot.

:::

```bash
less /usr/share/aif/docs/official_installation_guide_en
pacman -S lynx arch-wiki-docs arch-wiki-lite
lynx /usr/share/doc/arch-wiki/html/index.html
```

```bash
timedatectl set-ntp true
reflector -a 12 -c cn -f 10 —sort score —v —save /etc/pacman.d/mirrorlist
sed -i '/^#\[multilib\]/{N;s/^#//gm}' /etc/pacman.conf
pacman-key —init
pacman -Sy archinstall
archinstall
```

1. Mirrors: China.
2. Disk: 1GB fat32 /boot, 16GB linux-swap, compress=zstd btrfs with `@` subvolume mount `/` and `@home` subvolume mount `/home`.
3. Swap on zram: Disabled.
4. Bootloader: Grub.
5. Kernel: linux-lts.
6. Authentication: Root and user.
7. Profile: Niri.
8. Applications: Bluetooth, audio, print, power.
9. Network: Network Manager.
10. Timezone: Asia/Shanghai.

## Setup

```bash
sudo pacman -Sy base-devel linux-lts-headers btrfs-progs os-prober git unzip vim
```

```bash
echo "EDITOR=vim" | sudo tee -a /etc/environment
mkdir -vp /home/sabertaz/.cargo

cat << EOF | tee -a /home/sabertaz/.cargo/config.toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = sparse+https://mirrors.ustc.edu.cn/crates.io-index/

[registries.ustc]
index = sparse+https://mirrors.ustc.edu.cn/creates.io-index/
EOF
```

```bash
git clone https://aur.archlinux.org/paru.git \
  && cd paru \
  && makepkg -si
```

## Desktop

```bash
curl -fsSL https://install.danklinux.com | sh
paru -S greetd-dms-greeter-git dsearch-bin
dms greeter enable
dms greeter sync
```

DMS shortkeys (`~/.config/niri/dms/binds.kdl`):

- `Super+Shift+/` for important hotkeys.
- Launcher: `Super+Space`.
- Terminal: `Super+t`
- Window:
  - Switch: `Alt+Tab`.
  - Navigation: `Super+h/j/k/l`.
  - Move column: `Super+shift+h/j/k/l`.
- Monitor:
  - Navigation: `Super+Ctrl+h/j/k/l`.
  - Move column: `Super+Shift+Ctrl+h/j/k/l`.
- Workspace:
  - Navigation: `Super+u/i`.
  - Move column: `Super+Ctrl+u/i`.
  - Move workspace: `Super+Shift+u/i`.
- Size: `Super+-/+`, `Super+Shift+-/+`, `Super+f`, `Super+Shift+f`.
- Close: `Super+q`.

```kdl
    Mod+Ctrl+V { consume-window-into-column; }
    Mod+Shift+Ctrl+V { expel-window-from-column; }
```

:::tip [Polkit]

If polkit in DMS broken:

```bash
sudo pacman -Sy polkit-gnome
echo 'spawn-at-startup "/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"' >> ~/.config/niri/config.kdl
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 & disown
```

:::

## Proxy

```bash
paru -S clash-verge-rev-bin mihomo-party-bin google-chrome-dev
```

## Pacman

```bash
sudo pacman -Sy snapper snap-pac btrfs-assistant grub-btrfs inotify-tools \
  noto-fonts noto-fonts-cjk noto-fonts-emoji noto-fonts-extra \
  ttf-dejavu ttf-liberation fcitx5-im fcitx5-chinese-addons \
  mandb fastfetch cmatrix \
  zsh github-cli neovim nvm \
  xdg-desktop-portal-gnome rclone \
  mise zoxide bat eza git-delta dust duf fd ripgrep fzf jq fx tlrc bottom gping procs curlie
```

## Grub

```bash
# sudo pacman -Sy os-prober
sudo sed -i 's/^#GRUB_DISABLE_OS_PROBER=false/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## Snapshot

```bash
sudo systemctl enable --now grub-btrfsd
reboot

# Create snapshots
sudo snapper -c root create-config /
sudo snapper -c home create-config /home
sudo snapper list-configs
sudo snapper -c root create -d "Initial root snapshot"
sudo snapper -c home create -d "Initial home snapshot"
sudo snapper list -a
sudo snapper -c <config-name> delete <number-id>

# Generate grub menu entry
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## Locale

```bash
sudo sed -i '/zh_CN\.UTF-8 UTF-8/s/^#\s*//' /etc/locale.gen
sudo locale-gen
sudo localectl set-locale LANG=zh_CN.UTF-8
echo 'spawn-at-startup "fcitx5" "-d"' >> ~/.config/niri/config.kdl
sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  LC_CTYPE "en_US.UTF-8"\n  XMODIFIERS "@im=fcitx"\n  LANG "zh_CN.UTF-8"' ~/.config/niri/config.kdl
```

## Development

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```bash
gh auth login
```

```bash
echo "source /usr/share/nvm/init-nvm.sh" >> ~/.zshrc
nvm install --lts
npm config set registry https://registry.npmmirror.com --global
npm install -g pnpm
```

```bash
git clone --depth 1 https://github.com/AstroNvim/template ~/.config/nvim
nvim
```

## Toolchain

[Modern toolchain](./toolchain.md):

```bash
# ~/.zshrc
eval "$(mise activate zsh)"
eval "$(uv generate-shell-completion zsh)"
eval "$(uvx --generate-shell-completion zsh)"
eval "$(zoxide init zsh)"
eval "$(fzf --zsh)"
source <(fx --comp zsh)

# bind 'set bell-style none'

# Use fd for listing path candidates
_fzf_compgen_path() {
  fd --hidden --follow --exclude ".git" . "$1"
}

# Use fd for list directory candidates
_fzf_compgen_dir() {
  fd --type d --hidden --follow --exclude ".git" . "$1"
}

alias cc="claude"
alias ccc="claude -c"
alias ccr="claude -r"
alias ccm="claude -p 'commit'"
alias np="pnpm"
alias vim="nvim"

alias cd="z"
alias cat="bat"
alias ls="eza"
alias du="dust"
alias df="duf"
alias find="fd --hidden --follow --exclude .git"
alias grep="rg"
alias top="btm"
alias ping="gping"
alias ps="procs"
alias curl="curlie"

export FZF_DEFAULT_COMMAND="fd --type f --strip-cwd-prefix --hidden --follow --exclude .git"
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
export PATH="$HOME/.local/bin:$PATH"
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

## Git

[Git configuration](../git/config.md):

```bash
git config --global user.name "sabertazimi"
git config --global user.email sabertazimi@gmail.com
git config --global core.autocrlf false
git config --global core.editor nvim
git config --global credential.helper store
git config --global color.ui true
git config --global commit.template ~/.gitmsg.md

git config --global init.defaultBranch main
git config --global merge.conflictstyle diff3
git config --global push.default simple
git config --global push.autoSetupRemote true
git config --global pull.rebase true
git config --global fetch.prune true
git config --global fetch.pruneTags true
git config --global fetch.all true
git config --global rebase.autoSquash true
git config --global rebase.autoStash true
git config --global rebase.updateRefs true

git config --global diff.algorithm histogram
git config --global diff.colorMoved plain
git config --global diff.mnemonicPrefix true
git config --global diff.renames true

# brew install git-delta
# sudo pacman -Sy git-delta
# winget install dandavison.delta
# scoop install delta
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global delta.dark true
git config --global delta.line-numbers true
git config --global delta.side-by-side true
git config --global merge.conflictStyle zdiff3

git config --global alias.s "status"
git config --global alias.c "commit --verbose"
git config --global alias.a "add"
git config --global alias.rs "restore --staged"
git config --global alias.st "stash"
git config --global alias.pr "pull --rebase"
git config --global alias.d '!sh -c "git diff --cached | cat"'

# after 1s, git auto correct wrong command
git config --global help.autocorrect 10
```

## GitHub

```bash
# Generate GPG key
gpg --full-generate-key
# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Export GPG public key as an ASCII armored version
gh auth refresh -s write:gpg_key
gpg --armor --export <pub-keyID> | gh gpg-key add --title "Arch Linux" -

# Export GPG private key as an ASCII armored version
# gpg --armor --export-secret-key sabertazimi@gmail.com -w0

# Git global configuration for GPG signature commits
git config --global commit.gpgsign true
git config --global gpg.program gpg
git config --global user.signingkey <pub-keyID>

# Import GitHugit log --show-signatureb signature
curl https://github.com/web-flow.gpg | gpg --import
# gpg --sign-key <GitHub-keyID>
gpg --sign-key B5690EEEBB952194

# Log git signature
git log --show-signature

# WSL2 fix: Add to ~/.zshrc
# export GPG_TTY=$(tty)

# Single signature commit
# git commit -S -m "..."
```

## OneDrive

```bash
rclone config
mkdir -p ~/onedrive
rclone mount <remote-name>: ~/onedrive --vfs-cache-mode writes
rclone ls <remote-name>:
echo 'alias onedrive="rclone mount onedrive: ~/onedrive --vfs-cache-mode writes"' >> ~/.zshrc
```
