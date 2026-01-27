---
sidebar_position: 9
tags: [Programming, OS, Linux, Distributions, Ubuntu, Arch Linux, WSL]
---

# Distributions

## Ubuntu

### Locale Settings

```bash
export LANG=en_US
xdg-user-dirs-gtk-update
export LANG=zh_CN
```

- /var/lib/locales/supported.d/local

```bash
sudo locale-gen zh_CN.GBK
sudo locale-gen zh_CN.GB18030
sudo dpkg-reconfigure locales
```

### Icon

Nightly build for Numix Circle icon:

```bash
sudo add-apt-repository ppa:numix/ppa
sudo apt update
sudo apt install numix-icon-theme-circle
```

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

### GNOME Shell Extension

- Install GNOME shell extension for browser.
- Install local binding app: `sudo apt install chrome-gnome-shell`.
- Visit `extensions.gnome.org` to install extensions.

### Fonts

```bash
mkdir -p ~/.local/share/fonts/
cp -fr code-fonts ~/.local/share/fonts/
fc-cache -f -v
fc-list
fc-list : family | sort | uniq
```

## Arch Linux

### Setup

```bash
less /usr/share/aif/docs/official_installation_guide_en
pacman -S lynx arch-wiki-docs arch-wiki-lite
lynx /usr/share/doc/arch-wiki/html/index.html
```

```bash
systemctl enable dhcpcd
reboot
pacman -S --needed base-devel git wget jshon expac yajl zsh vim
```

- makepkg

```bash
curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/package_name.tar.gz
cd package_name
less PKGBUILD
less package_name.install

makepkg -si
# -s sync deps
# -i install
# -r rm deps
# -c clean up
```

### Pacman

- /etc/pacman.conf
- /etc/pacman.d/mirrorlist

### AUR

- [yaourt](https://archlinux.fr/yaourt-en)

```bash
# packages' list
wget https://aur.archlinux.org/packages.gz
```

## WSL

### Installation

[Upgrade to WSL2](https://docs.microsoft.com/windows/wsl/install-manual):

```bash
# <!-- markdownlint-disable-next-line MD013 -->
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer.

wget https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
wsl --set-default-version 2
wsl --set-version Ubuntu-22.04 2
wsl -l -v
```

### Connection

[Gzip for WSL2](https://github.com/microsoft/WSL/issues/4461#issuecomment-1174011640):

```bash
echo -en '\x10' | sudo dd of=/usr/bin/gzip count=1 bs=1 conv=notrunc seek=$((0x189))
```

[Winsock for WSL2](https://github.com/microsoft/WSL/issues/4194):

```bash
netsh winsock reset
```

### Proxy

[Network](https://learn.microsoft.com/windows/wsl/networking)
and [proxy](https://zinglix.xyz/2020/04/18/wsl2-proxy)
for WSL2:

```bash
# HostIP=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
HostIP=$(ip route show | grep -i default | awk '{ print $3}')
WslIP=$(hostname -I | awk '{print $1}')
Port=1080
PROXY_SOCKS="socks5://${HostIP}:${Port}"

# For Git CLI.
git config --global http.proxy "${PROXY_SOCKS}"
git config --global https.proxy "${PROXY_SOCKS}"

# For GitHub CLI.
export HTTP_PROXY="${PROXY_SOCKS}"
export HTTPS_PROXY="${PROXY_SOCKS}"
```

:::caution[Socks Client]

主机代理客户端需要[允许](https://github.com/microsoft/WSL/issues/4402#issuecomment-570474468)
VLAN (或其他网络) 设备访问本地代理连接.

:::

当本地配置系统代理后，需要更改 WSL2 网络配置:

```ini
# ~/.wslconfig
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

### Wi-Fi

Win 11 MediaTek Wi-Fi 6 delay start:
set `Network Connections` and `WLAN AutoConfig`
to auto-start in services.

## References

- Linux from scratch [guide](https://www.linuxfromscratch.org/lfs/read.html).
