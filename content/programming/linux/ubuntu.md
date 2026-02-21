---
sidebar_position: 11
tags: [Programming, OS, Linux, Distribution, Ubuntu]
---

# Ubuntu

## APT Key

```bash
# Add key
sudo apt-add-repository ppa:user/repo
sudo apt update

# Delete key via last 8 bits
sudo apt-key list
sudo apt-key del 73C62A18
sudo apt update
```

## Locale

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

## Fonts

```bash
mkdir -p ~/.local/share/fonts/
cp -fr code-fonts ~/.local/share/fonts/
fc-cache -f -v
fc-list
fc-list : family | sort | uniq
```
