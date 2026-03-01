---
sidebar_position: 43
tags: [Programming, OS, Linux, Distribution, Desktop Environment, Compositor, X11, Wayland, GNOME, KDE, GTK, QT]
---

# Desktop

## Dotfiles

Set up new machine with single command:

```bash
# sudo pacman -S chezmoi
dot init --apply -v sabertazimi
```

Set up new machine from remote dotfiles:

```bash
dot init sabertazimi
dot diff
dot apply -v
dot update -v
```

Sync local dotfiles to remote repository:

```bash
dot add ~/.zshrc
dot cd
git add .
git commit
git push
exit
```

[Edit](https://www.chezmoi.io/user-guide/frequently-asked-questions/usage/#how-do-i-edit-my-dotfiles-with-chezmoi)
dotfiles:

```bash
# Edit dotfile
dot edit ~/.zshrc
# Apply to local machine
dot diff
dot apply -v
# Push to remote repository
dot cd
git add .
git commit
git push
exit
```

## Locale

```bash
mkdir -p ~/.local/share/fcitx5/rime \
  && echo -e "patch:\n  __include: rime_ice_suggestion:/" > ~/.local/share/fcitx5/rime/default.custom.yaml

sed -i 's/^Vertical Candidate List=.*/Vertical Candidate List=True/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^Font=.*/Font="Source Han Sans CN 10"/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^MenuFont=.*/MenuFont="Source Han Sans CN 10"/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^TrayFont=.*/TrayFont="Source Han Sans CN 10"/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^Theme=.*/Theme=default/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^DarkTheme=.*/DarkTheme=default-dark/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^UseDarkTheme=.*/UseDarkTheme=True/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^UseAccentColor=.*/UseAccentColor=True/' ~/.config/fcitx5/conf/classicui.conf
```

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

```bash
echo "QT_QPA_PLATFORMTHEME=qt6ct" >> ~/.config/environment.d/90-dms.conf
sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  QT_QPA_PLATFORMTHEME "qt6ct"\n  QT_QPA_PLATFORMTHEME_QT6 "qt6ct"' ~/.config/niri/config.kdl
sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  LC_CTYPE "en_US.UTF-8"\n  XMODIFIERS "@im=fcitx"\n  LANG "zh_CN.UTF-8"' ~/.config/niri/config.kdl
sed -i 's/scope="output"/scope="all"/g' ~/.config/niri/config.kdl
echo 'spawn-at-startup "fcitx5" "-d"' >> ~/.config/niri/config.kdl
echo 'spawn-at-startup "rclone" "mount" "onedrive:/" "/home/sabertaz/onedrive" "--vfs-cache-mode" "full" "--daemon"' >> ~/.config/niri/config.kdl

sed -i '/Ctrl+Shift+R/,/^[[:space:]]*}[[:space:]]*$/d' ~/.config/niri/dms/binds.kdl
sed -i 's/Mod+Comma /Mod+Shift+Comma /g' ~/.config/niri/dms/binds.kdl
sed -i 's/Mod+M /Mod+Shift+M /g' ~/.config/niri/dms/binds.kdl
sed -i \
  '/binds {/a \
    Mod+Comma { "consume-window-into-column"; }\
    Mod+Alt+A { screenshot; }\
    Mod+A { spawn "firefox"; }\
    Mod+E { spawn "nautilus"; }\
    Mod+M { spawn "/opt/SPlayer/SPlayer" ; }\
    Mod+Z { spawn "code"; }\n' ~/.config/niri/dms/binds.kdl
```

### Hotkeys

`~/.config/niri/dms/binds.kdl`:

- `Super`+`Shift`+`/` for important hotkeys.
- Launcher: `Super`+`Space`.
- Terminal: `Super`+`t`.
- Window:
  - Switch: `Alt`+`Tab`.
  - Navigation: `Super`+`h`/`j`/`k`/`l`.
  - Move: `Super`+`Shift`+`h`/`j`/`k`/`l`.
- Monitor:
  - Navigation: `Super`+`Ctrl`+`h`/`j`/`k`/`l`.
  - Move: `Super`+`Shift`+`Ctrl`+`h`/`j`/`k`/`l`.
- Workspace:
  - Navigation: `Super`+`u`/`i`.
  - Move: `Super`+`Ctrl`+`u`/`i` (column), `Super`+`Shift`+`u`/`i` (workspace).
- Vertical:
  - Left: `Super`+`[`.
  - Right: `Super`+`]`.
  - Tab (stack): `Super`+`w`, `Super`+`j`/`k`.
  - Expel: `Super`+`.`.
- Floating:
  - Toggle: `Super`+`Shift`+`t`.
  - Switch: `Super`+`Shift`+`v`.
  - Move: `Super`+`Shift`+`h`/`j`/`k`/`l`, `Super` + click.
- Size:
  - Maximize: `Super`+`f`, `Super`+`Shift`+`f`.
  - Preset: `Super`+`r`, `Super`+`Shift`+`r`, `Super`+`Ctrl`+`r`.
  - Manual: `Super`+`-`/`+`, `Super`+`Shift`+`-`/`+`
- Close: `Super`+`q`.
- Lock: `Super`+`Alt`+`l`.

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

```bash
mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/DankMaterialShell" "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell"
touch "${XDG_CONFIG_HOME:-$HOME/.config}/DankMaterialShell/settings.json" "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell/session.json"

jq '
  .wallpaperFillMode = "Fill" |
  .currentThemeName = "dynamic" |
  .currentThemeCategory = "dynamic" |
  .matugenScheme = "scheme-tonal-spot" |
  .fontFamily = "思源黑体 CN" |
  .monoFontFamily = "Maple Mono NF CN" |
  .use24HourClock = true |
  .weatherEnabled = true |
  .barConfigs |= map(if .id == "default" or .id == null then .transparency = 0 | .widgetTransparency = 0.65 else . end) |
  .notificationPopupPosition = 3 |
  .showDock = true |
  .dockSmartAutoHide = true |
  .dockGroupByApp = true |
  .dockTransparency = 0.65 |
  .launcherLogoMode = "os" |
  .launcherLogoColorOverride = "primary"
' "${XDG_CONFIG_HOME:-$HOME/.config}/DankMaterialShell/settings.json" > /tmp/dms-settings.json && mv /tmp/dms-settings.json "${XDG_CONFIG_HOME:-$HOME/.config}/DankMaterialShell/settings.json"

jq --arg home "$HOME" '
  .wallpaperPath = "\($home)/.local/share/wallpapers/arceus_pokemon.jpg" |
  .wallpaperCyclingEnabled = true |
  .wallpaperCyclingMode = "interval" |
  .wallpaperCyclingInterval = 1800 |
  .wallpaperCyclingTime = "18:00" |
  .wallpaperTransition = "disc" |
  .pinnedApps = [
    "firefox",
    "com.mitchellh.ghostty",
    "code",
    "SPlayer",
    "com.qq.weixin",
    "qq",
    "wps-office-prometheus",
    "steam",
    "animeko",
    "virt-manager",
    "io.missioncenter.MissionCenter",
    "btrfs-assistant"
  ] |
  .hiddenApps = [
    "Clash Verge",
    "wps-office-wps",
    "wps-office-et",
    "wps-office-wpp",
    "wps-office-pdf"
  ]
' "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell/session.json" > /tmp/dms-session.json && mv /tmp/dms-session.json "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell/session.json"
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
sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji # 谷歌字体及表情
sudo pacman -S firefox chromium # 浏览器
sudo pacman -S ark # 压缩软件
sudo pacman -S packagekit-qt6 packagekit appstream-qt appstream # Discover 依赖
sudo pacman -S gwenview # 图片查看器
```

## Applications

Desktop shortcut located in `/usr/share/applications`.

## Mime

`~/.config/mimeapps.list`:

```bash
xdg-mime default nvim.desktop text/plain
xdg-mime default nvim.desktop text/x-csrc
xdg-mime default nvim.desktop application/javascript
xdg-mime default nvim.desktop application/json
xdg-mime default nvim.desktop application/octet-stream
xdg-mime default nvim.desktop application/x-shellscript
xdg-mime default nvim.desktop application/x-zerosize

xdg-mime default org.gnome.Loupe.desktop image/jpeg
xdg-mime default org.gnome.Loupe.desktop image/png
xdg-mime default org.gnome.Loupe.desktop image/gif
xdg-mime default org.gnome.Loupe.desktop image/webp
xdg-mime default org.gnome.Loupe.desktop image/bmp
xdg-mime default org.gnome.Loupe.desktop image/svg+xml
xdg-mime default org.gnome.Loupe.desktop image/tiff

xdg-mime default mpv.desktop video/mp4
xdg-mime default mpv.desktop video/avi
xdg-mime default mpv.desktop video/webm
xdg-mime default mpv.desktop video/quicktime
xdg-mime default mpv.desktop video/x-matroska

xdg-mime default org.gnome.Nautilus.desktop inode/directory

xdg-mime default wine.desktop application/vnd.microsoft.portable-executable
xdg-mime default wine.desktop application/x-msdownload
```

```bash
xdg-mime query default text/plain
xdg-mime query filetype ~/workspace/notes/src/components/notes-marquee.tsx
```

## Icons

Nightly build for Numix Circle icon:

```bash
sudo add-apt-repository ppa:numix/ppa
sudo apt update
sudo apt install numix-icon-theme-circle
```

## Music Player

SPlayer:

```bash
echo 'alias ncm="/opt/SPlayer/SPlayer"' >> ~/.zshrc
```

MusicFox:

```bash
sed -i '/\[startup\]/,/loadingSeconds = 2/s/loadingSeconds = 2/loadingSeconds = 1/' ~/.config/go-musicfox/config.toml
sed -i '/\[main.notification\]/,/enable = true/s/enable = true/enable = false/' ~/.config/go-musicfox/config.toml
sed -i '/\[player\]/,/songLevel = "higher"/s/songLevel = "higher"/songLevel = "jymaster"/' ~/.config/go-musicfox/config.toml
sed -i '/\[autoplay\]/,/enable = false/s/enable = false/enable = true/' ~/.config/go-musicfox/config.toml
sed -i '/\[unm\]/,/enable = false/s/enable = false/enable = true/' ~/.config/go-musicfox/config.toml
```

## References

- Linux desktop [ecosystem](https://blog.grtsinry43.com/moments/2025/01/13/2025-linux-usage).
