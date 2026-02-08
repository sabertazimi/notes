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

## References

- Linux from scratch [guide](https://www.linuxfromscratch.org/lfs/read.html).
