---
sidebar_position: 33
tags: [Programming, OS, Linux, Distribution, Desktop Environment, Compositor, X11, Wayland, GNOME, KDE, GTK, QT]
---

# Desktop

## Dotfiles

```bash
sudo pacman -S chezmoi
```

Set up new machine with single command:

```bash
chezmoi init --apply -v sabertazimi
```

Set up new machine from remote dotfiles:

```bash
chezmoi init sabertazimi
chezmoi diff
chezmoi apply -v
chezmoi update -v
```

Sync local dotfiles to remote repository:

```bash
chezmoi add ~/.zshrc
chezmoi cd
git add .
git commit
git push
exit
```

[Edit](https://www.chezmoi.io/user-guide/frequently-asked-questions/usage/#how-do-i-edit-my-dotfiles-with-chezmoi)
dotfiles:

```bash
# Edit dotfile
chezmoi edit ~/.zshrc
# Apply to local machine
chezmoi diff
chezmoi apply -v
# Push to remote repository
chezmoi cd
git add .
git commit
git push
exit
```

## Locale

- Config `fcitx5` key [`~/.config/fcitx5/config`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/private_fcitx5/private_config)
  and UI [`~/.config/fcitx5/conf/classicui.conf`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/private_fcitx5/private_conf/private_classicui.conf).
- Config rime [`~/.local/share/fcitx5/rime/default.custom.yaml`](https://github.com/sabertazimi/dotfiles/blob/main/dot_local/share/private_fcitx5/rime/default.custom.yaml).

## Fonts

[`fontconfig`](https://wiki.archlinuxcn.org/wiki/%E5%AD%97%E4%BD%93%E9%85%8D%E7%BD%AE/%E4%B8%AD%E6%96%87):

```bash
mkdir -p ~/.local/share/fonts/
cp -fr code-fonts ~/.local/share/fonts/
fc-cache -fv
fc-list
fc-list : family | sort | uniq
fc-list :lang=zh | sort | uniq
fc-match sans-serif
fc-match "serif:lang=zh"
fc-match "monospace:lang=zh-cn"
fc-cat ~/.config/fontconfig/fonts.conf
```

## Compositor

```bash
echo $WAYLAND_DISPLAY
glxgears
glxinfo | grep "direct rendering" # Yes: 3D 硬件加速正常
```

## Niri

- Config environment [`~/.config/environment.d/90-dms.conf`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/environment.d/90-dms.conf).
- Config niri [`~/.config/niri/config.kdl`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/niri/modify_config.kdl).
- Config keys [`~/.config/niri/dms/binds.kdl`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/niri/dms/binds.kdl).

### Hotkeys

[`~/.config/niri/dms/binds.kdl`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/niri/dms/binds.kdl):

- `Super`+`Shift`+`/` for important hotkeys
- Launcher: `Super`+`d`
- Terminal: `Super`+`t`
- Window:
  - Switch: `Alt`+`Tab`
  - Navigation: `Super`+`h`/`j`/`k`/`l`
  - Move: `Super`+`Ctrl`+`h`/`j`/`k`/`l`
- Monitor:
  - Navigation: `Super`+`Shift`+`h`/`j`/`k`/`l`
  - Move: `Super`+`Shift`+`Ctrl`+`h`/`j`/`k`/`l`
- Workspace:
  - Navigation: `Super`+`u`/`i`
  - Move: `Super`+`Ctrl`+`u`/`i` (column), `Super`+`Shift`+`u`/`i` (workspace)
- Vertical:
  - Left: `Super`+`[`
  - Right: `Super`+`]`
  - Tab (stack): `Super`+`w`, `Super`+`j`/`k`
  - Consume: `Super`+`,`
  - Expel: `Super`+`.`
- Floating:
  - Toggle: `Super`+`v`
  - Switch: `Super`+`Shift`+`v`
  - Move: `Super`+`Ctrl`+`h`/`j`/`k`/`l`, `Super` + click
- Size:
  - Maximize: `Super`+`f`, `Super`+`Shift`+`f`
  - Preset: `Super`+`r`, `Super`+`Shift`+`r`, `Super`+`Ctrl`+`r`
  - Manual: `Super`+`-`/`+`, `Super`+`Shift`+`-`/`+`
- Close: `Super`+`q`
- Lock: `Super`+`Alt`+`l`

### Outputs

```bash
niri msg outputs
```

```kdl
output "HDMI-A-1" {
    mode "1920x1080@60.000"
    scale 1
    position x=0 y=0
}

output "eDP-1" {
    mode "2880x1800@90.007"
    scale 1.75
    position x=1920 y=0
}
```

### Window Rules

```bash
niri msg windows
```

```kdl
window-rule {
    match app-id="^firefox$"
    open-maximized true
}
```

### `DMS`

Config `DMS`
settings [`~/.config/DankMaterialShell/settings.json`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/DankMaterialShell/modify_settings.json)
and session [`~/.local/state/DankMaterialShell/session.json`](https://github.com/sabertazimi/dotfiles/blob/main/dot_local/state/DankMaterialShell/modify_session.json).

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
sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji # 谷歌字体及表情
sudo pacman -S firefox chromium # 浏览器
sudo pacman -S ark # 压缩软件
sudo pacman -S packagekit-qt6 packagekit appstream-qt appstream # Discover 依赖
sudo pacman -S gwenview # 图片查看器
```

## Applications

Desktop shortcut located in `/usr/share/applications`.

## MIME

Set [default MIME apps](https://specifications.freedesktop.org/mime-apps/latest/default.html)
[`~/.config/mimeapps.list`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/mimeapps.list):

```bash
xdg-mime default nvim.desktop application/javascript
xdg-mime default org.gnome.Loupe.desktop image/png
xdg-mime default mpv.desktop video/mp4
xdg-mime default org.gnome.Nautilus.desktop inode/directory
xdg-mime default wine.desktop application/vnd.microsoft.portable-executable
```

Query MIME types:

```bash
xdg-mime query default text/plain
xdg-mime query filetype ~/workspace/notes/src/components/notes-marquee.tsx
```

## Icons

```bash
pkgstats show breeze-icons $(pacman -Ss icon-theme | awk 'NR%2==1' | awk -F '[/ ]' '$0 !~ /-git$/ {print $2}' | head -19)
```

## Music Player

`SPlayer`:

```bash
echo 'alias ncm="/opt/SPlayer/SPlayer"' >> ~/.zshrc
```

`MusicFox`:

```bash
sed -i '/\[startup\]/,/loadingSeconds = 2/s/loadingSeconds = 2/loadingSeconds = 1/' ~/.config/go-musicfox/config.toml
sed -i '/\[main.notification\]/,/enable = true/s/enable = true/enable = false/' ~/.config/go-musicfox/config.toml
sed -i '/\[player\]/,/songLevel = "higher"/s/songLevel = "higher"/songLevel = "jymaster"/' ~/.config/go-musicfox/config.toml
sed -i '/\[autoplay\]/,/enable = false/s/enable = false/enable = true/' ~/.config/go-musicfox/config.toml
sed -i '/\[unm\]/,/enable = false/s/enable = false/enable = true/' ~/.config/go-musicfox/config.toml
```

## Library

- [Dank](https://github.com/AvengeMedia/DankMaterialShell):
  Desktop shell for Wayland compositors.
- [`Noctalia`](https://github.com/noctalia-dev/noctalia-shell):
  Sleek and minimal desktop shell for Wayland.
- [`Caelestia`](https://github.com/caelestia-dots/shell):
  Desktop shell for Hyprland.
- [Illogical Impulse](https://github.com/end-4/dots-hyprland):
  Usability-first dotfiles for Hyprland.
- [`HyDE`](https://github.com/HyDE-Project/HyDE):
  Hyprland desktop environment.

## References

- Linux distribution [chooser](https://distrochooser.de).
- Linux desktop [ecosystem](https://blog.grtsinry43.com/moments/2025/01/13/2025-linux-usage).
- Wayland [protocol](https://wayland.app/protocols).
- XDG: cross-desktop [group](https://www.freedesktop.org/wiki).
