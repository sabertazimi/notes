---
sidebar_position: 15
tags: [Programming, OS, Linux, Distribution, Desktop Environment, Compositor, X11, Wayland, GNOME, KDE, GTK, QT]
---

# Desktop

## Applications

- desktop shortcut: `/usr/share/applications`
- startup apps: `gnome-session-properties` or `gnome-tweaks`

## Defaults

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

## Icons

Nightly build for Numix Circle icon:

```bash
sudo add-apt-repository ppa:numix/ppa
sudo apt update
sudo apt install numix-icon-theme-circle
```

## GTK

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

## Shell

GNOME shell extension:

- Install GNOME shell extension for browser.
- Install local binding app: `sudo apt install chrome-gnome-shell`.
- Visit `extensions.gnome.org` to install extensions.

## References

- Linux desktop [ecosystem](https://blog.grtsinry43.com/moments/2025/01/13/2025-linux-usage).
