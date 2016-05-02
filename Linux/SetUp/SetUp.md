

# Linux SetUp

> 建立一个软件repo，加快装机速度，是程序员的必备修养 -- 尼采

/home /usr /opt /lib /var /etc

------

## Lang

```shell
export LANG=en_US
xdg-user-dirs-gtk-update
export LANG=zh_CN
```

```shell
sudo locale-gen zh_CN.GB18030
sudo vim /var/lib/locales/supported.d/local
zh_CN GB2312
sudo dpkg-reconfigure locales
```

## Purge

```shell
sudo apt-get remove libreoffice-common
sudo apt-get remove unity-webapps-common
```

## Set Up

### Config

```shell
sudo vim /etc/dhcp/dhclient.conf

prepend domain-name-servers 127.0.0.1;下一行

prepend domain-name-servers 114.114.114.114;
prepend domain-name-servers 223.5.5.5;
```

### PPA

```shell
sudo add-apt-repository ppa:nilarimogard/webupd8
sudo add-apt-repository ppa:webupd8team/sublime-text-3
sudo add-apt-repository ppa:webupd8team/atom
sudo add-apt-repository ppa:numix/ppa
sudo add-apt-repository ppa:zeal-developers/ppa
sudo add-apt-repository ppa:ubuntu-desktop/ubuntu-make
sudo add-apt-repository ppa:ubuntu-wine/ppaudo add-apt-repository ppa:noobslab/deepin-sc
sudo add-apt-repository ppa:ubuntu-wine/ppa
sudo apt-get update
```

### Office

-   http://pinyin.sogou.com/linux/
-   http://community.wps.cn/download/

```shell
sudo apt-get install fcitx-sogoupinyin
sudo apt-get install wps-office
```

### Entertainment

#### music

```shell
$ sudo -H pip install requests
$ sudo -H pip install pycrypto
$ sudo apt-get install deepin-music
$ git clone https://github.com/wu-nerd/dmusic-plugin-NeteaseCloudMusic.git
$ python dmusic-plugin-NeteaseCloudMusic/install.py
```

#### game

##### playonlinux

```shell
sudo apt-get install build-essential libgl1-mesa-dev libglu1-mesa-dev libglut-dev freeglut3-dev
```

```shell
wget -q "http://deb.playonlinux.com/public.gpg" -O- | sudo apt-key add -
sudo wget http://deb.playonlinux.com/playonlinux_trusty.list -O /etc/apt/sources.list.d/playonlinux.list
sudo apt-get update
sudo apt-get install playonlinux
```

###  fonts

/usr/share/fonts/chinese/TrueType/

```shell
mkfontscale
mkfontdir
fc-cache
```

### tools

```shell
sudo apt-get install git unrar screen ssh axel lnav exfat-fuse  vpnc network-manager-vpnc syspeek python-pip manpages-zh
```

### GDB Hacker UI

#### GDB-DashBoard

```shell
wget -P ~ git.io/.gdbinit
(gdb) source ~/.gdbinit
```

```shell
git clone https://github.com/cyrus-and/gdb-dashboard.git
cp -fr ./gdb-dashboard/.gdbinit ./
rm -fr ./gdb-dashboard
(gdb) source ~/.gdbinit
```

#### Voltron

##### pip3

```shell
$ sudo easy_install3 pip
```

##### install

```shell
$ git clone https://github.com/snare/voltron
$ sudo apt-get install libreadline6-dev python3-dev python3-setuptools python3-yaml
$ cd voltron
$ sudo python3 setup.py install
```

##### config

-   .gdbinit

```shell
source /usr/local/lib/python3.4/dist-packages/voltron-0.1.2-py3.4.egg/voltron/entry.py
voltron init
set disassembly-flavor att

(gdb) source .gdbinit
```

-   view (in another terminal)

```shell
$ voltron view register stack disasm backtrace
```

## IDE

###  Android Studio

###  WebStorm

## Text Editor

### Vim(Github)

```shell
sudo apt-get install vim
```

-   basic version

```shell
curl https://raw.githubusercontent.com/wklken/vim-for-server/master/vimrc > ~/.vimrc
```

-   advanced version

```shell
wget -qO- https://raw.github.com/ma6174/vim/master/setup.sh | sh -x
```

### Sublime Text

```shell
sudo apt-get install sublime-text-installer
```

```shell
git clone https://github.com/lyfeyaj/sublime-text-imfix.git
cd sublime-text-imfix
./sublime-imfix
```

```markdown
—– BEGIN LICENSE —–
Nicolas Hennion
Single User License
EA7E-866075
8A01AA83 1D668D24 4484AEBC 3B04512C
827B0DE5 69E9B07A A39ACCC0 F95F5410
729D5639 4C37CECB B2522FB3 8D37FDC1
72899363 BBA441AC A5F47F08 6CD3B3FE
CEFB3783 B2E1BA96 71AAF7B4 AFB61B1D
0CC513E7 52FF2333 9F726D2C CDE53B4A
810C0D4F E1F419A3 CDA0832B 8440565A
35BF00F6 4CA9F869 ED10E245 469C233E
—— END LICENSE ——
```

```python
import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

```shell
git clone https://github.com/sabertazimi/Awesome-Sublime
cd Awesome-Sublime
cp -fr User ~/.config/sublime-text-3/Packages/
```

### Atom

```shell
sudo apt-get install atom
```

-   firewall config

```
 $ touch ~/.atom/.apmrc && echo 'strict-ssl = false' > ~/.atom/.apmrc
```

-   plugins: sync-SETTINGS

e95d69c522d199322429

```javascript
  "activate-power-mode":
    screenShake:
      enabled: false
```

### Visual Studio Code

```Shell
sudo apt-get install ubuntu-make
umake web visual-studio-code
umake web visual-studio-code --remove
sudo ln -s /home/hustlyl/.local/share/umake/web/visual-studio-code/Code /usr/local/bin/code
```

## Software

### gnome

```shell
sudo apt-get install gnome gnome-shell gnome-panel gnome-menus gnome-session gnome-tweak-tool gdm
```

```shell
sudo apt-get install numix-gtk-theme numix-icon-theme-circle
```

### ZealDocs

```shell
$ sudo apt-get install zeal
$ sudo apt-get remove appmenu-qt5
```

### [N1(E-Mail)](https://invite.nylas.com/download/)

Awesome Open Source E-Mail Desktop App

## Shell Tools

### f-irc/irssi (irc client)

### pppoeconf/speedtest-cli

```shell
sudo pppoeconf
sudo pon dsl-provider
sudo poof
ifconfig ppp0
```

### Terminal

-   Font - DejaVu Sans Mono Book 12
-   Ctrl + Shift + E/O
-   Alt + Arrow

```shell
$ sudo apt-get install terminator
$ sudo update-alternatives --config x-terminal-emulator
```

### zsh

```shell
sudo apt-get install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
sudo vim /etc/passwd
```

-   theme : rkj-repos candy ys
-   plugins : git node ruby meteor bundler osx rake sublime

```shell
vim ~/.zshrc
```

## Platform

### Nodejs

```shell
sudo apt-get install nodejs nodejs-dbg
sudo apt-get install npm
```

#### Npm

```shell
sudo npm install -g n
sudo n stable
```

-   global awesome packages

```shell
sudo npm install -g bower gulp gh-pages tooling antd-init npm-check standard jslint jshint express express-generator speed-test babel lebab
```

#### Bower

```shell
bower init
bower install bootstrap -S
bower install font-awesome -S
```

## Firefox Plugins

```shell
nohup ~/XX-Net-2.9.4/start.sh & >/dev/null 2>&1
```

-   AdblockPlus
-   Alexa
-   BetterSearch
-   ChatZilla
-   CLEO
-   Disconnect Search
-   DownThemeAll
-   ExtendedStatusBar
-   FEBE
-   Firebug
-   Flagfox
-   Greasemonkey
    -   网易云音乐高音质支持
-   Markdown Here
-   Markdown Viewer
-   Octotree
-   Pan
-   SeleniumIDE
-   Stylish
-   TabMixPlus
-   User Agent Switcher
-   VimFx
-   Web Search Pro
-   xThunder

## GFW

### Hosts

https://github.com/racaljk/hosts

### XX-Net

```shell
sudo apt-get install python-vte  python-OpenSSL  python-gtk2 libffi-dev python-appindicator libnss3-tools
```

-   download

https://github.com/XX-net/XX-Net/wiki/%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95

-   firefox config: pan add-on

### Lantern

-   https://github.com/getlantern/lantern

### Shadowsocks

-   https://github.com/shadowsocks/shadowsocks
-   https://github.com/breakwa11/shadowsocks-rss
-   https://github.com/yangyangwithgnu/autoshadower

### sshuttle

-   https://github.com/apenwarr/sshuttle

### Proxychains(Global Proxy)

-   https://github.com/rofl0r/proxychains-ng

### OpenVPN && vpngate/vpnbook

-   https://github.com/OpenVPN/openvpn
-   https://github.com/waylau/vpngate-mirrors

```shell
sudo apt-get install openssl
sudo apt-get install pam-devel
```

```shell
sudo wget http://www.oberhumer.com/opensource/lzo/download/lzo-2.06.tar.gz
tar –zxvf lzo-2.06.tar.gz –C /usr/src/
cd /usr/src/lzo-2.06
sudo  ./configure --prefix=/usr/local
sudo make
sudo make install
```

```shell
sudo unzip openvpn-2.3.10.zip
cd openvpn-2.3.2
sudo ./.configure --prefix=/opt/openvpn-2.3.10
sudo make
sudo make install
```

```shell
sudo apt-get install easy-rsa
sudo apt-get install openvpn
```

## Windows

### Imitate Linux

-   Wox
-   Cygwin

### Software

-   360 safe
-   qq browser
-   sougoupinyin
-   haozip
-   qq
-   baiduyun
-   thunder
-   netease music
-   office 2007
-   nodejs: cash
