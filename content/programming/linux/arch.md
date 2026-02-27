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
2. Disk: `1GB` `fat32` `/boot`, `16GB` linux-swap, `compress=zstd` `btrfs` with `@` sub-volume mount `/` and `@home` sub-volume mount `/home`.
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

:::tip[Manual Partition]

```bash
lsblk -pf
fdisk -l /dev/nvme1n1
cfdisk /dev/nvme1n1 # 1GB for `EFI System`, rest for `Linux filesystem`.

mkfs.fat -F 32 /dev/nvme1n1p1
mkfs.btrfs /dev/nvme1n1p2
mount -t btrfs -o compress=zstd /dev/nvme1n1p2 /mnt
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@swap

umount /mnt
mount -t btrfs -o subvol=/@,compress=zstd /dev/nvme1n1p2 /mnt
mount --mkdir -t btrfs -o subvol=/@home,compress=zstd /dev/nvme1n1p2 /mnt/home
mount --mkdir -t btrfs -o subvol=/@swap,compress=zstd /dev/nvme1n1p2 /mnt/swap
mount --mkdir /dev/nvme1n1p1 /mnt/boot

pacman -Sy archlinux-keyring
pacstrap -K /mnt base base-devel linux linux-firmware btrfs-progs
pacstrap /mnt networkmanager vim neovim amd-ucode os-prober

btrfs filesystem mkswapfile --size 32g --uuid clear /mnt/swap/swapfile
swapon /mnt/swap/swapfile
genfstab -U /mnt > /mnt/etc/fstab
arch-chroot /mnt
passwd
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --boot-directory=/boot --removable
# grub-install --target=x86_64-efi --efi-directory=/efi --boot-directory=/efi --removable
# ln -s /efi/grub /boot/grub
grub-mkconfig -o /boot/grub/grub.cfg
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
  pacman-contrib unzip wget git zsh vim neovim paru \
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
echo "QT_QPA_PLATFORMTHEME=qt6ct" >> ~/.config/environment.d/90-dms.conf
sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  QT_QPA_PLATFORMTHEME "qt6ct"\n  QT_QPA_PLATFORMTHEME_QT6 "qt6ct"' ~/.config/niri/config.kdl
sed -i 's/scope="output"/scope="all"/g' ~/.config/niri/config.kdl
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

:::tip[Polkit]

Polkit (Quickshell feature) need `quickshell-git`:

```bash
paru -S quickshell-git
dms doctor
```

:::

## Niri

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

## Pacman

```bash
sudo pacman -S --needed snapper snap-pac btrfs-assistant grub-btrfs inotify-tools \
  noto-fonts noto-fonts-cjk noto-fonts-emoji noto-fonts-extra \
  ttf-dejavu ttf-liberation ttf-jetbrains-mono-nerd \
  wqy-zenhei fcitx5-im fcitx5-chinese-addons fcitx5-rime rime-ice-pinyin-git \
  cmatrix fastfetch lolcat \
  nvm uv rustup go jre8-openjdk mise \
  zoxide bat eza git-delta dust duf ncdu fd ripgrep fzf jq fx \
  bottom nvtop gping procs curlie \
  net-tools rsync rclone speedtest-cli \
  firefox firefox-i18n-zh-cn github-cli chezmoi starship wl-clipboard \
  yazi satty imagemagick kimageformats resvg poppler 7zip \
  trash-cli ffmpeg yt-dlp flatpak steam \
  cava khal fprintd grim slurp i2c-tools speech-dispatcher \
  bluez bluez-utils pipewire-pulse pipewire-alsa pipewire-jack power-profiles-daemon \
  xdg-desktop-portal xdg-desktop-portal-gnome nautilus-python mission-center \
  sushi tumbler poppler-glib ffmpegthumbnailer gst-libav gst-plugins-base gst-plugins-good \
  gvfs-smb file-roller loupe baobab gnome-disk-utility gnome-keyring libsecret \
  archlinux-wallpaper gnome-backgrounds plasma-workspace-wallpapers \
  lib32-nvidia-utils lib32-mesa lib32-vulkan-radeon vulkan-headers \
  mesa-utils s-tui \
  qemu-full virt-manager dnsmasq swtpm
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
  ttf-ms-win11-auto-zh_cn ttf-ms-win11-fod-auto-hans \
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
- `-git` 包的 `pkgver()` 由 makepkg 自动执行, 格式: `0.2.0.r1.g783b971` (tag.revision.commit)
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

:::caution[Devel]

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
# sudo pacman -S os-prober
# mount --mkdir /dev/nvme0n1p1 /mnt/winboot
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
# Create snapshots
sudo snapper -c root create-config /
sudo snapper -c home create-config /home
sudo snapper -c root create -d "Initial root snapshot"
sudo snapper -c home create -d "Initial home snapshot"

# Config
sudo snapper -c <config-name> list
sudo snapper -c <config-name> delete <number-id>

# Enable cleanup timer
sudo systemctl enable --now snapper-cleanup.timer

# Generate grub menu entry
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## Locale

```bash
sudo sed -i '/zh_CN\.UTF-8 UTF-8/s/^#\s*//' /etc/locale.gen
sudo locale-gen
sudo localectl set-locale LANG=zh_CN.UTF-8

LC_ALL=C.UTF-8 xdg-user-dirs-update --force
cat ~/.config/user-dirs.dirs

mkdir -p ~/.local/share/fcitx5/rime \
  && echo -e "patch:\n  __include: rime_ice_suggestion:/" > ~/.local/share/fcitx5/rime/default.custom.yaml

sed -i '/^[[:space:]]*environment[[:space:]]*{/a \  LC_CTYPE "en_US.UTF-8"\n  XMODIFIERS "@im=fcitx"\n  LANG "zh_CN.UTF-8"' ~/.config/niri/config.kdl
echo 'spawn-at-startup "fcitx5" "-d"' >> ~/.config/niri/config.kdl

git clone --depth=1 https://github.com/sabertazimi/fonts && cd fonts && bash install.sh && cd ..
```

```bash
sed -i 's/^Vertical Candidate List=.*/Vertical Candidate List=True/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^Font=.*/Font="霞鹜文楷 10"/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^MenuFont=.*/MenuFont="霞鹜文楷 10"/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^TrayFont=.*/TrayFont="霞鹜文楷 Medium 10"/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^Theme=.*/Theme=default/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^DarkTheme=.*/DarkTheme=default-dark/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^UseDarkTheme=.*/UseDarkTheme=True/' ~/.config/fcitx5/conf/classicui.conf
sed -i 's/^UseAccentColor=.*/UseAccentColor=True/' ~/.config/fcitx5/conf/classicui.conf
```

## Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
sed -i '1i # Enable the subsequent settings only in interactive sessions\ncase $- in\n  *i*) ;;\n    *) return;;\nesac\n' ~/.zshrc
sed -i 's/^plugins=(/plugins=(vi-mode last-working-dir zsh-autosuggestions zsh-syntax-highlighting /' ~/.zshrc

cat << EOF >> ~/.zshrc
alias pac="paru -Slq | fzf --multi --preview 'paru -Si {1}' | xargs -ro paru -S"
alias pacr="paru -Qq | fzf --multi --preview 'paru -Qi {1}' | xargs -ro paru -Rns"
alias pacl="paru -Qq | fzf --preview 'paru -Qil {1}' | xargs -ro paru -Qi"
EOF
```

[Starship](https://github.com/starship/starship) theme:

```bash
sed -i 's/^ZSH_THEME=.*/ZSH_THEME=""/' ~/.zshrc
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
starship preset gruvbox-rainbow -o ~/.config/starship.toml

mkdir -p ~/.config/matugen
mkdir -p ~/.config/matugen/templates
cat << EOF > ~/.config/matugen/config.toml
[config]

[templates.starship]
input_path = '~/.config/matugen/templates/starship.toml'
output_path = '~/.config/starship.toml'
EOF
cp -fr ~/.config/starship.toml ~/.config/matugen/templates/starship.toml
sed -i \
  -e 's/^color_fg0.*/color_fg0 = '"'"'{{colors.on_primary.default.hex}}'"'"'/' \
  -e '/^color_fg0.*/a\color_fg1 = '"'"'{{colors.on_surface.default.hex}}'"'"'' \
  -e 's/^color_bg1.*/color_bg1 = '"'"'{{colors.secondary_container.default.hex}}'"'"'/' \
  -e 's/^color_bg3.*/color_bg3 = '"'"'{{colors.secondary.default.hex}}'"'"'/' \
  -e 's/^color_blue.*/color_blue = '"'"'{{colors.inverse_primary.default.hex}}'"'"'/' \
  -e 's/^color_aqua.*/color_aqua = '"'"'{{colors.on_secondary_container.default.hex}}'"'"'/' \
  -e 's/^color_orange.*/color_orange = '"'"'{{colors.primary_fixed_dim.default.hex}}'"'"'/' \
  -e 's/^color_yellow.*/color_yellow = '"'"'{{colors.tertiary.default.hex}}'"'"'/' \
  -e 's/fg:color_fg0 bg:color_blue/fg:color_fg1 bg:color_blue/g' \
  -e 's/fg:color_fg0 bg:color_bg1/fg:color_fg1 bg:color_bg1/g' ~/.config/matugen/templates/starship.toml

source ~/.zshrc
```

[Powerlevel10k](https://github.com/romkatv/powerlevel10k) theme:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
sed -i 's/^ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc
```

## Node.js

```bash
echo "source /usr/share/nvm/init-nvm.sh" >> ~/.zshrc
source ~/.zshrc
```

```bash
nvm install --lts
npm config set registry https://registry.npmmirror.com --global
npm install -g pnpm
```

## Python

```bash
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
echo 'eval "$(uvx --generate-shell-completion zsh)"' >> ~/.zshrc
echo 'export UV_PYTHON_INSTALL_MIRROR="https://gh-proxy.com/github.com/indygreg/python-build-standalone/releases/download"' >> ~/.zshrc
echo 'export UV_DEFAULT_INDEX="https://mirrors.aliyun.com/pypi/simple"' >> ~/.zshrc
uv python install --default
```

## Rust

```bash
mkdir -vp ${CARGO_HOME:-$HOME/.cargo}

cat << EOF | tee -a ${CARGO_HOME:-$HOME/.cargo}/config.toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"

[registries.ustc]
index = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"
EOF

rustup default stable
```

## Go

```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

## Neovim

```bash
git clone --depth=1 https://github.com/AstroNvim/template ~/.config/nvim
```

## Ghostty

- `Ctrl`+`Shift`+`p`: command palette.
- `Ctrl`+`Shift`+`,`: reload config.

```bash
git clone --depth=1 https://github.com/sahaj-b/ghostty-cursor-shaders ~/.config/ghostty/shaders
sed -i 's/background-opacity = .*/background-opacity = 0.85/' ~/.config/ghostty/config
echo "custom-shader = shaders/cursor_warp.glsl" >> ~/.config/ghostty/config
echo "keybind = alt+h=goto_split:left" >> ~/.config/ghostty/config
echo "keybind = alt+j=goto_split:down" >> ~/.config/ghostty/config
echo "keybind = alt+k=goto_split:up" >> ~/.config/ghostty/config
echo "keybind = alt+l=goto_split:right" >> ~/.config/ghostty/config
```

## Toolchain

[Modern toolchain](./toolchain.md):

```bash
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
echo "source <(fzf --zsh)" >> ~/.zshrc
echo "source <(fx --comp zsh)" >> ~/.zshrc

cat << EOF >> ~/.zshrc
# Use fd for listing path candidates
_fzf_compgen_path() {
  fd --hidden --follow --exclude ".git" . "\$1"
}

# Use fd for list directory candidates
_fzf_compgen_dir() {
  fd --type d --hidden --follow --exclude ".git" . "\$1"
}
EOF

echo 'alias cc="claude"' >> ~/.zshrc
echo 'alias ccc="claude -c"' >> ~/.zshrc
echo 'alias ccr="claude -r"' >> ~/.zshrc
echo 'alias ccm="claude -p commit"' >> ~/.zshrc
echo 'alias vim="nvim"' >> ~/.zshrc
echo 'alias dot="chezmoi"' >> ~/.zshrc

echo 'alias ff="fastfetch --config examples/7.jsonc"' >> ~/.zshrc
echo 'alias cd="z"' >> ~/.zshrc
echo 'alias cat="bat"' >> ~/.zshrc
echo 'alias ls="eza"' >> ~/.zshrc
echo 'alias diff="delta"' >> ~/.zshrc
echo 'alias du="dust"' >> ~/.zshrc
echo 'alias df="duf"' >> ~/.zshrc
echo 'alias find="fd --hidden --follow --exclude .git"' >> ~/.zshrc
echo 'alias grep="rg"' >> ~/.zshrc
echo 'alias top="btm"' >> ~/.zshrc
echo 'alias ping="gping"' >> ~/.zshrc
echo 'alias ps="procs"' >> ~/.zshrc
echo 'alias curl="curlie"' >> ~/.zshrc

# Respecting `.gitignore`
echo 'export FZF_DEFAULT_COMMAND="fd --type f --strip-cwd-prefix --hidden --follow --exclude .git"' >> ~/.zshrc
echo 'export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"' >> ~/.zshrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc

cat << EOF >> ~/.ripgreprc
# Add 'web' type
--type-add
web:*.{html,css,js,jsx,ts,tsx,vue,svelte,astro}*

# Search hidden files / directories (e.g. dotfiles) by default
--hidden

# Using glob patterns to include/exclude files or folders
--glob
!**/.git/*

# Ignore case unless all caps
--smart-case
EOF
```

## Git

```bash
gh auth login
```

[Git configuration](../git/config.md):

```bash
git config --global user.name "sabertazimi"
git config --global user.email sabertazimi@gmail.com
git config --global core.autocrlf false
git config --global core.editor nvim
git config --global credential.helper store
git config --global color.ui true
git config --global commit.template ~/.gitmsg.md
echo "fix():" >> ~/.gitmsg.md

git config --global init.defaultBranch main
git config --global merge.conflictstyle diff3
git config --global push.default simple
git config --global push.autoSetupRemote true
git config --global pull.rebase true
git config --global fetch.prune true
git config --global fetch.pruneTags true
git config --global fetch.all true
git config --global rebase.autoSquash true
git config --global rebase.autoStash true
git config --global rebase.updateRefs true

git config --global diff.algorithm histogram
git config --global diff.colorMoved plain
git config --global diff.mnemonicPrefix true
git config --global diff.renames true

git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global delta.dark true
git config --global delta.line-numbers true
git config --global delta.side-by-side true
git config --global merge.conflictStyle zdiff3

git config --global alias.s "status"
git config --global alias.c "commit --verbose"
git config --global alias.a "add"
git config --global alias.rs "restore --staged"
git config --global alias.st "stash"
git config --global alias.pr "pull --rebase"
git config --global alias.d '!sh -c "git diff --cached | cat"'

git config --global help.autocorrect 10
```

## GitHub

```bash
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long

gh auth refresh -s write:gpg_key
gpg --armor --export <pub-keyID> | gh gpg-key add --title "Arch Linux" -

git config --global commit.gpgsign true
git config --global gpg.program gpg
git config --global user.signingkey <pub-keyID>

curl https://github.com/web-flow.gpg | gpg --import
gpg --sign-key B5690EEEBB952194
```

```bash
# Export GPG private key as an ASCII armored version
# gpg --armor --export-secret-key sabertazimi@gmail.com -w0

# Log git signature
# git log --show-signature

# WSL2 fix: Add to ~/.zshrc
# export GPG_TTY=$(tty)

# Single signature commit
# git commit -S -m "..."
```

## VSCode

`Preferences: Configure Runtime Arguments`:

```json
{
  "password-store": "gnome-libsecret"
}
```

```bash
echo -e "auth       optional     pam_gnome_keyring.so\nsession    optional     pam_gnome_keyring.so    auto_start" | sudo tee -a /etc/pam.d/login
echo -e "auth       optional     pam_gnome_keyring.so\nsession    optional     pam_gnome_keyring.so    auto_start" | sudo tee -a /etc/pam.d/greetd
```

`~/.config/mimeapps.list`:

```bash
xdg-mime query default text/plain
xdg-mime query filetype ~/workspace/notes/src/components/notes-marquee.tsx
```

```bash
xdg-mime default code.desktop text/plain
xdg-mime default code.desktop application/javascript
```

## Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

```bash
sed -i '0,/{/s/{/{\n  "hasCompletedOnboarding": true,/' ~/.claude.json
```

`~/.claude/settings.json`:

```bash
cat << EOF > ~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<YOUR_API_KEY>",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_MODEL": "glm-4.7",
    "ANTHROPIC_SMALL_FAST_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.7",
    "API_TIMEOUT_MS": "3000000",
    "DISABLE_TELEMETRY": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "DISABLE_BUG_COMMAND": "1"
  },
  "autoUpdatesChannel": "stable"
}
EOF
```

```bash
/plugin marketplace add anthropics/skills
/plugin marketplace add obra/superpowers-marketplace
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin marketplace add sabertazimi/claude-code
```

```bash
/plugin install ralph-loop
/plugin install superpowers@superpowers-marketplace
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
/plugin install sabertaz
```

```bash
pnpm dlx skills add vercel-labs/agent-skills -g --agent claude-code
```

## OneDrive

```bash
rclone config
```

```bash
mkdir -p ~/onedrive
echo 'alias onedrive="rclone mount onedrive:/ ~/onedrive --vfs-cache-mode full --daemon"' >> ~/.zshrc
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

## Music

```bash
echo 'alias ncm="/opt/SPlayer/SPlayer"' >> ~/.zshrc
```

```bash
# sed -i '/\[startup\]/,/loadingSeconds = 2/s/loadingSeconds = 2/loadingSeconds = 1/' ~/.config/go-musicfox/config.toml
# sed -i '/\[main.notification\]/,/enable = true/s/enable = true/enable = false/' ~/.config/go-musicfox/config.toml
# sed -i '/\[player\]/,/songLevel = "higher"/s/songLevel = "higher"/songLevel = "jymaster"/' ~/.config/go-musicfox/config.toml
# sed -i '/\[autoplay\]/,/enable = false/s/enable = false/enable = true/' ~/.config/go-musicfox/config.toml
# sed -i '/\[unm\]/,/enable = false/s/enable = false/enable = true/' ~/.config/go-musicfox/config.toml
```

## WeChat

Add `DLAGENTS=("https::/usr/bin/curl -A 'apt' -fLC - --retry 3 --retry-delay 3 -o %o %u")`
to [`deepin-wine8-stable.PKGBUILD`](https://aur.archlinux.org/packages/deepin-wine8-stable):

```bash
paru -S com.qq.weixin.work.deepin --fm nvim
```

## Office

修复[中文输入法](https://wiki.archlinuxcn.org/wiki/WPS_Office#Fcitx5_无法输入中文):

```bash
sudo sed -i '1a export GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx5\nexport XMODIFIERS=@im=fcitx' /usr/bin/wps
```

## Wallpapers

```bash
dot init sabertazimi
dot cd
bash wallpapers/third-party.sh
exit
```

## Settings

```bash
mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/DankMaterialShell" "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell"
touch "${XDG_CONFIG_HOME:-$HOME/.config}/DankMaterialShell/settings.json" "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell/session.json"

jq '
    .wallpaperFillMode = "Fill" |
    .currentThemeName = "dynamic" |
    .currentThemeCategory = "dynamic" |
    .matugenScheme = "scheme-tonal-spot" |
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
    .wallpaperPath = "\($home)/.local/share/wallpapers/archbtw.png" |
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
        "mihomo-party",
        "wps-office-wps",
        "wps-office-et",
        "wps-office-wpp",
        "wps-office-pdf"
    ]
' "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell/session.json" > /tmp/dms-session.json && mv /tmp/dms-session.json "${XDG_STATE_HOME:-$HOME/.local/state}/DankMaterialShell/session.json"
```

:::caution[Application Theme]

由于 `Theme.applyGtkColors`/`Theme.applyQtColors` 没有 `dms ipc` 接口,
需要手动点击 `主题与配色` 底部的 `应用 GTK 配色` 与 `应用 Qt 配色`.

:::

## Virtualization

```bash
sudo usermod -aG libvirt $USER
sudo systemctl enable --now libvirtd.service
```

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

Edit and sync dotfiles:

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

## Library

- [Dank](https://github.com/AvengeMedia/DankMaterialShell):
  Desktop shell for Wayland compositors.
- [Caelestia](https://github.com/caelestia-dots/shell):
  Desktop shell for Hyprland.
- [Illogical Impulse](https://github.com/end-4/dots-hyprland):
  Usability-first dotfiles for Hyprland.
- [HyDE](https://github.com/HyDE-Project/HyDE):
  Hyprland desktop environment.
- [Shorin](https://github.com/SHORiN-KiWATA/shorin-arch-setup):
  One-click Arch Linux desktop environment configuration.

## References

- Linux from scratch [guide](https://www.linuxfromscratch.org/lfs/read.html).
- Wayland [protocol](https://wayland.app/protocols).
- XDG: cross-desktop [group](https://www.freedesktop.org/wiki).
- Arch Linux [简明指南](https://github.com/nakanomikuorg/arch-guide).
- Shorin Arch Linux [guide](https://github.com/SHORiN-KiWATA/Shorin-ArchLinux-Guide).
