---
sidebar_position: 10
tags: [Programming, OS, Linux, Distributions, Ubuntu, Arch Linux, WSL]
---

# Archlinux

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
5. Authentication: Root and user.
6. Kernel: linux-lts.
7. Profile: Niri.
8. Applications: Bluetooth, audio, print, power.
9. Network: Network Manager.
10. Timezone: Asia/Shanghai.

## Setup

```bash
sudo pacman -Sy base-devel linux-lts-headers btrfs-progs os-prober git unzip vim
```

```bash
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

## Locale

```bash
sudo pacman -Sy noto-fonts noto-fonts-cjk noto-fonts-emoji noto-fonts-extra \
  ttf-dejavu ttf-liberation
```

```bash
sudo sed -i '/zh_CN\.UTF-8 UTF-8/s/^#\s*//' /etc/locale.gen
sudo locale-gen
sudo localectl set-locale LANG=zh_CN.UTF-8
```

## Proxy

```bash
paru -S clash-verge-rev-bin mihomo-party-bin google-chrome-dev
```

## Development

```bash
sudo pacman -Sy zsh github-cli nvm neovim fastfetch cmatrix
```

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
echo "alias np=pnpm" >> ~/.zshrc
```

```bash
echo "alias vim=nvim" >> ~/.zshrc
git clone --depth 1 https://github.com/AstroNvim/template ~/.config/nvim
nvim
```
