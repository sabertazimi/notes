---
sidebar_position: 40
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
2. Disk: `1GB` `fat32` `/boot`, `16GB` `linux-swap`, `compress=zstd` `btrfs` with `@` sub-volume mount `/` and `@home` sub-volume mount `/home`.
3. Bootloader: GRUB.
4. Kernel: `linux`.
5. Authentication: Root and user.
6. Profile: Niri.
7. Applications: Bluetooth, audio, print, power.
8. Network: Network Manager.
9. Timezone: Asia/Shanghai.

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
  pacman-contrib unzip wget git zsh less vim neovim paru \
  clash-verge-rev
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
paru -S greetd-dms-greeter-git dsearch-bin qt6ct-kde
```

```bash
dms greeter enable
dms greeter sync
```

Configure niri:

```bash
sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  QT_QPA_PLATFORMTHEME "qt6ct"\n  QT_QPA_PLATFORMTHEME_QT6 "qt6ct"' ~/.config/niri/config.kdl
sed -i 's/scope="output"/scope="all"/g' ~/.config/niri/config.kdl
```

:::tip[Polkit]

Polkit (Quickshell feature) need `quickshell-git`:

```bash
paru -S quickshell-git
dms doctor
```

:::

## Pacman

```bash
sudo pacman -S --needed snapper snap-pac btrfs-assistant grub-btrfs inotify-tools \
  qemu-full virt-manager dnsmasq swtpm \
  noto-fonts noto-fonts-cjk noto-fonts-emoji noto-fonts-extra \
  ttf-dejavu ttf-liberation ttf-jetbrains-mono-nerd ttf-firacode-nerd \
  ttf-maplemono-nf-cn-unhinted ttf-lxgw-wenkai ttf-lxgw-wenkai-mono \
  adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts wqy-zenhei \
  fcitx5-im fcitx5-chinese-addons fcitx5-rime rime-ice-pinyin-git \
  zoxide bat eza git-delta dust duf fd ripgrep fzf television \
  jq fx tldr bottom gping procs curlie lazygit \
  nvm uv rustup go jdk8-openjdk luarocks mise tree-sitter-cli \
  chezmoi starship github-cli \
  fastfetch cmatrix lolcat s-tui nvtop \
  net-tools rsync rclone speedtest-cli \
  bluez bluez-utils pipewire-pulse pipewire-alsa pipewire-jack \
  power-profiles-daemon speech-dispatcher fprintd i2c-tools \
  xdg-desktop-portal xdg-desktop-portal-gnome \
  mission-center gnome-disk-utility baobab gdu \
  gnome-keyring libsecret \
  nautilus-python sushi tumbler gvfs-smb file-roller \
  poppler-glib ffmpegthumbnailer gst-libav gst-plugins-base gst-plugins-good \
  grim slurp satty wl-clipboard \
  imv imagemagick kimageformats resvg poppler loupe \
  mpv ffmpeg yt-dlp cava \
  7zip trash-cli yazi khal \
  lib32-nvidia-utils lib32-mesa lib32-vulkan-radeon vulkan-headers mesa-utils \
  archlinux-wallpaper gnome-backgrounds plasma-workspace-wallpapers \
  firefox firefox-i18n-zh-cn flatpak steam
```

```bash
sudo pacman -Rns polkit-gnome alacritty fuzzel mako waybar swaybg swayidle swaylock
```

### Sync

```bash
# Search packages
pacman -Ss <keyword>
# Show information
pacman -Si <package-name>
# Skip installed packages
sudo pacman -S --needed <package-list>
```

:::danger[Partial Upgrade]

DO NOT use `pacman -Sy <package-name>`.
[Partial upgrade](https://wiki.archlinux.org/title/System_maintenance#Partial_upgrades_are_unsupported) are unsupported.

:::

### Query

```bash
# Show information
pacman -Qi <package-name>
# List package contents
pacman -Ql <package-name> | grep '/usr/bin/'
# List installed packages
pacman -Qq | wc -l
# List orphans packages
pacman -Qdtq
# Check owns package
pacman -Qo /usr/lib/bluetooth/bluetoothd # -> bluez
```

### Remove

```bash
# Remove package
sudo pacman -Rns <package-name>
# Clean orphans packages
sudo pacman -Rns $(pacman -Qdtq)
```

## AUR

```bash
paru -S mihomo-party-bin
```

```bash
paru -Rns clash-verge-rev
```

```bash
paru -S --needed chsrc-bin downgrade \
  visual-studio-code-bin uudeck linuxqq wechat \
  wps-office-cn wps-office-mui-zh-cn wps-office-fonts ttf-wps-fonts \
  animeko-appimage splayer
```

```bash
# paru -S google-chrome zen-browser-bin zen-browser-i18n-zh-cn
# paru -S com.qq.weixin.work.deepin
# paru -S nipaplay-reload-bin go-musicfox
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

Install, remove, and browse packages with `fzf`:

```bash
paru -Slq | fzf --multi --preview 'paru -Si {1}' | xargs -ro paru -S
paru -Qq | fzf --multi --preview 'paru -Qi {1}' | xargs -ro paru -Rns
paru -Qq | fzf --preview 'paru -Qil {1}' | xargs -ro paru -Qi
```

### Repository

- `PKGBUILD` 在 [AUR 仓库](https://aur.archlinux.org) 单独维护
- `-git` 包的 `pkgver()` 由 `makepkg` 自动执行, 格式: `0.2.0.r1.g783b971` (`tag.revision.commit`)
- `-git` 包的**更新频率**由维护者控制, 确保代码可用后才推送 `pkgver` 更新

```bash
# 只构建
paru -Syu quickshell-git
# 不构建
paru -Syu --ignore quickshell-git
# 拉取最新 commit 构建
paru -Syu --devel
# 强制重新构建
paru -S quickshell-git --rebuild
# 手动构建
git clone https://aur.archlinux.org/quickshell-git.git
cd quickshell-git && makepkg -si
```

:::caution[`Devel`]

paru 在 `/etc/paru.conf` 默认开启 `--devel` 选项:
运行 `sudo sed -i 's/^Devel$/# Devel/' /etc/paru.conf` 进行关闭.

:::

## Flatpak

```bash
flatpak remote-add --if-not-exists flathub https://flathub.org
```

```bash
# flatpak install flathub com.jianguoyun.Nutstore
```

## GRUB

```bash
sudo sed -i 's/^#GRUB_DISABLE_OS_PROBER=false/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub
echo 'GRUB_TOP_LEVEL="/boot/vmlinuz-linux"' | sudo tee -a /etc/default/grub
git clone --depth=1 https://github.com/vinceliuice/grub2-themes \
  && cd grub2-themes && sudo ./install.sh -b -t tela -s 2k && cd ..
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

```bash
# sudo snapper -c <config-name> list
# sudo snapper -c <config-name> delete <number-id>
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

sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  LC_CTYPE "en_US.UTF-8"\n  XMODIFIERS "@im=fcitx"\n  LANG "zh_CN.UTF-8"' ~/.config/niri/config.kdl
echo 'spawn-at-startup "fcitx5" "-d"' >> ~/.config/niri/config.kdl
```

Install Windows fonts with `linux-lts` kernel:

```bash
sudo modprobe udf
paru -S ttf-ms-win11-auto ttf-ms-win11-auto-zh_cn ttf-ms-win11-fod-auto-hans
```

## Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```bash
dot init sabertazimi
dot diff
dot apply -v
```

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/Aloxaf/fzf-tab ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fzf-tab

source ~/.zshrc
```

## Development

```bash
chsrc set node
```

```bash
nvm install --lts
npm install -g pnpm
uv python install --default
rustup default stable
```

## Ghostty

```bash
git clone --depth=1 https://github.com/sahaj-b/ghostty-cursor-shaders ~/.config/ghostty/shaders
```

## Toolchain

Modern Linux [toolchain](./toolchain.md):

```bash
tv update-channels
```

## Git

**Copy complete commands** from git config [guide](../git/config.md#setup).

## GitHub

**Copy complete commands** from GPG config [guide](../git/config.md#gpg).

## Claude Code

**Copy complete commands** from Claude Code [guide](../../ai/gen/claude-code.md#setup).

## OneDrive

```bash
rclone config
```

```bash
mkdir -p ~/onedrive
echo 'spawn-at-startup "rclone" "mount" "onedrive:/" "/home/sabertaz/onedrive" "--vfs-cache-mode" "full" "--daemon"' >> ~/.config/niri/config.kdl
```

```bash
# rclone ls onedrive:/
# rclone rcd --rc-web-gui
```

## Steam

Appearance (设置 -> 界面) `中文`+`24小时制`+`开机自启`:

```bash
sed -i 's|^Exec=/usr/bin/steam %U$|Exec=/usr/bin/steam -silent %U|' ~/.config/autostart/steam.desktop
rm ~/Desktop/steam.desktop
```

## WeChat

Add `DLAGENTS=("https::/usr/bin/curl -A 'apt' -fLC - --retry 3 --retry-delay 3 -o %o %u")`
to [`deepin-wine8-stable.PKGBUILD`](https://aur.archlinux.org/packages/deepin-wine8-stable):

```bash
paru -S com.qq.weixin.work.deepin --fm nvim
```

## WPS

修复[中文输入法](https://wiki.archlinuxcn.org/wiki/WPS_Office#Fcitx5_无法输入中文):

```bash
sudo sed -i '1a export GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx5\nexport XMODIFIERS=@im=fcitx' /usr/bin/wps
```

## Wallpapers

```bash
dot cd
bash wallpapers/third-party.sh
exit
```

## Themes

:::caution[Application Theme]

由于 `Theme.applyGtkColors`/`Theme.applyQtColors` 没有 `dms ipc` 接口,
需要手动点击 `主题与配色` 底部的 `应用 GTK 配色` 与 `应用 Qt 配色`,
**统一应用 `DMS` 图标与配色**.

:::

## Virtualization

```bash
sudo usermod -aG libvirt $USER
sudo systemctl enable --now libvirtd.service
```

## Library

- [Dank](https://github.com/AvengeMedia/DankMaterialShell):
  Desktop shell for Wayland compositors.
- [`Caelestia`](https://github.com/caelestia-dots/shell):
  Desktop shell for Hyprland.
- [Illogical Impulse](https://github.com/end-4/dots-hyprland):
  Usability-first dotfiles for Hyprland.
- [`HyDE`](https://github.com/HyDE-Project/HyDE):
  Hyprland desktop environment.
- [`Shorin`](https://github.com/SHORiN-KiWATA/shorin-arch-setup):
  One-click Arch Linux desktop environment configuration.

## References

- Linux from scratch [guide](https://www.linuxfromscratch.org/lfs/read.html).
- Wayland [protocol](https://wayland.app/protocols).
- XDG: cross-desktop [group](https://www.freedesktop.org/wiki).
- Arch Linux [简明指南](https://github.com/nakanomikuorg/arch-guide).
- `Shorin` Arch Linux [guide](https://github.com/SHORiN-KiWATA/Shorin-ArchLinux-Guide).
