---
sidebar_position: 30
tags: [Programming, OS, Linux, Distribution, Arch Linux, Niri]
---

# Arch Linux

## Install

:::caution[BIOS]

Disable BIOS secure boot.

:::

```bash
timedatectl set-ntp true
reflector -a 12 -c cn -f 10 —sort score —v —save /etc/pacman.d/mirrorlist
pacman-key —init
pacman -Sy archinstall
archinstall
```

1. Mirrors: China + multilib.
2. Disk: `1GB` `fat32` `/boot`, `16GB` `linux-swap`, `compress=zstd` `btrfs` with `@` sub-volume mount `/` and `@home` sub-volume mount `/home`, enable `snapper`.
3. Swap: disable `zram`.
4. Bootloader: GRUB.
5. Hostname: `station`.
6. Authentication: Root and user.
7. Profile: Niri.
8. Applications: Bluetooth, audio, print, power.
9. Network: Network Manager (`iwd`).
10. Timezone: Asia/Shanghai.

:::tip[TTY Guide]

Browse Arch Wiki and official installation guide in TTY:

```bash
pacman -S lynx arch-wiki-docs arch-wiki-lite
less /usr/share/aif/docs/official_installation_guide_en
lynx /usr/share/doc/arch-wiki/html/index.html
```

:::

## Setup

```bash
sudo pacman -S firefox
```

```bash
sudo sed -i '/^#\[multilib\]/{N;s/^#//gm}' /etc/pacman.conf
sudo sed -i 's/^#Color/Color/' /etc/pacman.conf
sudo sed -i 's/^#VerbosePkgLists/VerbosePkgLists/' /etc/pacman.conf

cat << EOF | sudo tee -a /etc/pacman.conf
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/\$arch
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/\$arch
Server = https://mirrors.sjtug.sjtu.edu.cn/archlinux-cn/\$arch
Server = https://mirrors.aliyun.com/archlinuxcn/\$arch
EOF
```

```bash
sudo systemctl enable --now NetworkManager
sudo pacman -Sy archlinuxcn-keyring
```

```bash
sudo pacman -S --needed base-devel btrfs-progs os-prober \
  linux-headers linux-lts linux-lts-headers \
  git neovim paru clash-verge-rev
```

```bash
echo "EDITOR=nvim" | sudo tee -a /etc/environment
sudo sed -i 's/^Devel$/# Devel/' /etc/paru.conf
```

:::tip[Polkit]

Use `polkit-gnome` to enable `clash-verge-rev` tun mode:

```bash
sudo pacman -S polkit-gnome
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 & disown
```

:::

## Desktop

```bash
curl -fsSL https://install.danklinux.com | sh
```

```bash
paru -S greetd-dms-greeter-git qt6ct-kde
```

```bash
dms greeter enable
dms greeter sync
```

:::tip[Qt]

After Qt updates, rebuild AUR packages:

```bash
paru -S --rebuild qt6ct-kde
```

:::

## Pacman

```bash
sudo pacman -S --needed snapper snap-pac btrfs-assistant grub-btrfs inotify-tools \
  pacman-contrib pkgstats \
  man-db man-pages man-pages-zh_cn tldr less \
  noto-fonts noto-fonts-cjk noto-fonts-emoji \
  ttf-dejavu ttf-liberation ttf-jetbrains-mono-nerd ttf-firacode-nerd \
  ttf-maplemono-nf-cn-unhinted ttf-lxgw-wenkai ttf-lxgw-wenkai-mono \
  adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts wqy-zenhei \
  fcitx5-im fcitx5-chinese-addons fcitx5-rime rime-ice-pinyin-git \
  zoxide bat eza fd ripgrep fzf television jq fx \
  dust duf bottom procs fastfetch s-tui nvtop \
  gping curlie wget ddgr doggo net-tools speedtest-cli rsync rclone \
  git-delta lazygit tmux zsh starship chezmoi cmatrix lolcat \
  nodejs npm pnpm bun python uv rustup go jdk8-openjdk luarocks mise \
  tree-sitter-cli github-cli openai-codex gemini-cli opencode \
  bluez bluez-utils pipewire-pulse pipewire-alsa pipewire-jack \
  fprintd fwupd i2c-tools power-profiles-daemon speech-dispatcher \
  xdg-desktop-portal xdg-desktop-portal-gnome gnome-keyring libsecret \
  mission-center gnome-disk-utility baobab gdu \
  nautilus-python sushi tumbler gvfs-smb file-roller trash-cli yazi \
  ffmpegthumbnailer gst-libav gst-plugins-base gst-plugins-good \
  grim slurp satty wl-clipboard \
  poppler poppler-glib python-pylatexenc \
  chafa imv loupe imagemagick kimageformats resvg \
  mpv ffmpeg yt-dlp cava \
  7zip unzip \
  lib32-nvidia-utils lib32-mesa lib32-vulkan-radeon vulkan-headers mesa-utils \
  papirus-icon-theme archlinux-wallpaper gnome-backgrounds plasma-workspace-wallpapers \
  firefox firefox-i18n-zh-cn flatpak steam
```

```bash
sudo pacman -Rns polkit-gnome lightdm lightdm-gtk-greeter alacritty fuzzel mako waybar swaybg swayidle swaylock
```

### Sync

```bash
# Search
pacman -Ss <keyword>
# Information
pacman -Si <package-name>
# Needed only
sudo pacman -S --needed <package-list>
```

:::danger[Partial Upgrade]

DO NOT use `pacman -Sy <package-name>`.
[Partial upgrade](https://wiki.archlinux.org/title/System_maintenance#Partial_upgrades_are_unsupported) are unsupported.

:::

### Query

```bash
# Information
pacman -Qi <package-name>
# Contents
pacman -Ql <package-name> | grep '/usr/bin/'
# Installed
pacman -Qq | wc -l
# Upgradable (`checkupdates`)
pacman -Qu
# Orphans
pacman -Qdtq
# Owns
pacman -Qo /usr/lib/bluetooth/bluetoothd # -> bluez
```

### Remove

```bash
# Package
sudo pacman -Rns <package-name>
# Orphans
sudo pacman -Rns $(pacman -Qdtq)
# Cache
sudo pacman -Sc     # 清理未安装包的缓存
sudo pacman -Scc    # 清理全部缓存
sudo paccache -ruk0 # 清理未安装包的缓存
sudo paccache -rk0  # 清理全部缓存
```

## AUR

```bash
paru -S --needed chsrc-bin downgrade \
  visual-studio-code-bin claude-code cc-switch-bin cli-proxy-api-bin \
  llmfit-bin models-bin \
  linuxqq wechat uudeck \
  wps-office-cn wps-office-mui-zh-cn wps-office-fonts ttf-wps-fonts \
  animeko-appimage splayer go-musicfox-bin \
  libtexprintf
```

### Helpers

Rolling updates:

```bash
# sudo pacman -Syu
paru
```

Clean up packages:

```bash
# sudo pacman -Rns $(pacman -Qtdq)
paru -c
```

Show diagnostics and statistics:

```bash
paru -Qm
paru -Ps
```

Install, remove, and browse packages with [`fzf`](https://github.com/sabertazimi/dotfiles/blob/main/dot_zshrc).

### Repository

- `PKGBUILD` 在 [AUR 仓库](https://aur.archlinux.org) 单独维护
- `-git` 包的 `pkgver()` 由 `makepkg` 自动执行, 格式: `0.2.0.r1.g783b971` (`tag.revision.commit`)
- `-git` 包的**更新频率**由维护者控制, 确保代码可用后才推送 `pkgver` 更新

```bash
# Target
paru -Syu quickshell-git
# Ignore
paru -Syu --ignore quickshell-git
# Latest commit
paru -Syu --devel
# Force rebuild
paru -S --rebuild quickshell-git
# Manual
git clone https://aur.archlinux.org/quickshell-git.git
cd quickshell-git && makepkg -si
```

:::caution[`Devel`]

paru 在 `/etc/paru.conf` 默认开启 `--devel` 选项:
运行 `sudo sed -i 's/^Devel$/# Devel/' /etc/paru.conf` 进行关闭.

:::

## GRUB

```bash
sudo sed -i 's/^#GRUB_DISABLE_OS_PROBER=false/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub
echo 'GRUB_TOP_LEVEL="/boot/vmlinuz-linux"' | sudo tee -a /etc/default/grub
git clone --depth=1 https://github.com/vinceliuice/grub2-themes \
  && cd grub2-themes && sudo ./install.sh -b -t tela -s 2k && cd .. && rm -rf grub2-themes
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## Snapshot

```bash
sudo systemctl status grub-btrfsd
sudo snapper list-configs
```

```bash
sudo systemctl enable --now grub-btrfsd
reboot
```

```bash
sudo snapper -c root create-config /
sudo snapper -c home create-config /home
sudo snapper -c root create -d "Initial root snapshot"
sudo snapper -c home create -d "Initial home snapshot"
```

```bash
sudo systemctl enable --now snapper-cleanup.timer
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## Keyring

```bash
echo -e "auth       optional     pam_gnome_keyring.so\nsession    optional     pam_gnome_keyring.so    auto_start" | sudo tee -a /etc/pam.d/login
echo -e "auth       optional     pam_gnome_keyring.so\nsession    optional     pam_gnome_keyring.so    auto_start" | sudo tee -a /etc/pam.d/greetd
```

## Locale

```bash
sudo sed -i '/zh_CN\.UTF-8 UTF-8/s/^#\s*//' /etc/locale.gen
sudo locale-gen
sudo localectl set-locale LANG=zh_CN.UTF-8
```

```bash
LC_ALL=C.UTF-8 xdg-user-dirs-update --force
cat ~/.config/user-dirs.dirs
```

## Dotfiles

```bash
chezmoi init sabertazimi
chezmoi diff
chezmoi apply -v
source ~/.zshrc
```

## Zsh

```bash
chsh -s $(which zsh)
exec zsh -l
```

## Development

Modern Linux [toolchain](./toolchain.md):

```bash
chsrc set node
rustup default stable
tv update-channels
```

## Git

**Complete setup** in git config [guide](../git/config.md#setup).

## GitHub

**Complete setup** in GPG config [guide](../git/config.md#gpg).

## Claude Code

**Complete setup** in Claude Code [guide](../../ai/gen/claude-code.md#setup).

## OneDrive

```bash
rclone config
```

## Steam

Appearance (设置 -> 界面) `中文`+`24小时制`+`开机自启`:

```bash
sed -i 's|^Exec=/usr/bin/steam %U$|Exec=/usr/bin/steam -silent %U|' ~/.config/autostart/steam.desktop
rm ~/Desktop/steam.desktop
```

## WeChat

Add `DLAGENTS=("https::/usr/bin/curl -A 'apt' -fLC - --retry 3 --retry-delay 3 -o %o %u")`
to [`deepin-wine8-stable.PKGBUILD`](https://aur.archlinux.org/packages/deepin-wine8-stable#comment-1057371):

```bash
paru -S --fm nvim com.qq.weixin.work.deepin
```

## WPS

修复[中文输入法](https://wiki.archlinuxcn.org/wiki/WPS_Office#Fcitx5_无法输入中文):

```bash
sudo sed -i '1a export GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx5\nexport XMODIFIERS=@im=fcitx' /usr/bin/wps
```

## Wallpapers

```bash
chezmoi cd
bash wallpapers/third-party.sh
exit
```

## Settings

- 头像.
- 配色: `应用 Qt 配色` 与 `应用 GTK 配色`.
- 天气.

## Virtualization

```bash
sudo pacman -S qemu-full virt-manager dnsmasq swtpm
sudo usermod -aG libvirt $USER
sudo systemctl enable --now libvirtd.service
```

## Microsoft Fonts

Delete `_loopDev` related lines (`10` + `4` lines),
add `7z e -aoa "${_isoFile}" path-with-prefix`,
and update `7z e -aoa "path-without-prefix" \`
to all [`PKGBUILD`](https://aur.archlinux.org/packages/ttf-ms-win11-auto#comment-1060433):

```bash
paru -S --fm nvim ttf-ms-win11-auto ttf-ms-win11-auto-zh_cn ttf-ms-win11-fod-auto-hans
```

## References

- Linux from scratch [guide](https://www.linuxfromscratch.org/lfs/read.html).
- Arch Linux [简明指南](https://github.com/nakanomikuorg/arch-guide).
- `Shorin` Arch Linux [guide](https://github.com/SHORiN-KiWATA/Shorin-ArchLinux-Guide).
- [`Shorin`](https://github.com/SHORiN-KiWATA/shorin-arch-setup):
  One-click Arch Linux desktop environment configuration.
- AUR package [action](https://manateelazycat.github.io/2026/01/12/publish-aur).
