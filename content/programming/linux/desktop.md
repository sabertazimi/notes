---
sidebar_position: 43
tags: [Programming, OS, Linux, Distribution, Desktop Environment, Compositor, X11, Wayland, GNOME, KDE, GTK, QT]
---

# Desktop

## Compositor

```bash
echo $WAYLAND_DISPLAY
glxgears
glxinfo | grep "direct rendering" # Yes: 3D 硬件加速正常
```

## GNOME

### GTK

GTK/GNOME themes located in `/usr/share/themes/` or `~/.themes/`:

```bash
# Vimix Cursors Installation
git clone https://github.com/vinceliuice/Vimix-cursors
sudo ./Vimix-cursors/install.sh

# WhiteSur GNOME theme Installation
git clone https://github.com/vinceliuice/WhiteSur-gtk-theme
sudo ./WhiteSur-gtk-theme/install.sh -t all -i ubuntu
# Tweak for Firefox
sudo ./WhiteSur-gtk-theme/tweaks.sh -f
# Tweak for Snap Apps
sudo ./WhiteSur-gtk-theme/tweaks.sh -s
# Tweak for GDM
sudo ./WhiteSur-gtk-theme/tweaks.sh -g -i ubuntu
# Tweak Help Docs
sudo ./WhiteSur-gtk-theme/tweaks.sh -h
```

Repair for not detected HDMI problem:

```bash
sudo dpkg-reconfigure gdm3
sudo apt install --reinstall gdm3 lightdm ubuntu-desktop
```

### Shell

GNOME shell extension:

- Install GNOME shell extension for browser.
- Install local binding app: `sudo apt install chrome-gnome-shell`.
- Visit `extensions.gnome.org` to install extensions.

## KDE

[Set up](https://arch.icekylin.online/guide/rookie/desktop-env-and-app.html):

```bash
sudo pacman -S plasma-meta plasma-workspace xdg-desktop-portal konsole dolphin
sudo pacman -S sof-firmware alsa-firmware alsa-ucm-conf # 声音固件
sudo pacman -S ntfs-3g # NTFS 硬盘
sudo pacman -S adobe-source-han-serif-cn-fonts wqy-zenhei # 中文字体
sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji noto-fonts-extra # 谷歌字体及表情
sudo pacman -S firefox chromium # 浏览器
sudo pacman -S ark # 压缩软件
sudo pacman -S packagekit-qt6 packagekit appstream-qt appstream # Discover 依赖
sudo pacman -S gwenview # 图片查看器
```

## Applications

- Desktop shortcut: `/usr/share/applications`
- Start up apps: `gnome-session-properties` or `gnome-tweaks`

## Icons

Nightly build for Numix Circle icon:

```bash
sudo add-apt-repository ppa:numix/ppa
sudo apt update
sudo apt install numix-icon-theme-circle
```

## References

- Linux desktop [ecosystem](https://blog.grtsinry43.com/moments/2025/01/13/2025-linux-usage).
