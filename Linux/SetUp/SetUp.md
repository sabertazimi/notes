<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Linux SetUp](#linux-setup)
	- [IDE](#ide)
	- [Editor-OpenSource](#editor-opensource)
		- [Vim(Github)](#vimgithub) - [Visual Studio Code](#visual-studio-code)
		- [Atom](#atom)
			- [package](#package)
	- [Software Tools](#software-tools)
		- [ZealDocs](#zealdocs)
	- [Shell Tools](#shell-tools)
	- [Firefox Plugins](#firefox-plugins)
	- [GFW](#gfw)
		- [OpenVPN && vpngate/vpnbook](#openvpn-vpngatevpnbook)
<!-- /TOC -->

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
sudo apt-get update    
```

### Office

-   http://pinyin.sogou.com/linux/
-   http://community.wps.cn/download/

```shell
sudo apt-get install fcitx-sogoupinyin
sudo apt-get install wps-office 
```

-   fonts

```shell
# mkfontscale
# mkfontdir
# fc-cache
```

-   tools

```shell
sudo apt-get install git unrar screen SSH axel lnav exfat-fuse  vpnc network-manager-vpnc syspeek
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

## Tools

## Software

### gnome

```shell
sudo apt-get install gnome gnome-shell gnome-panel gnome-menus gnome-session gnome-tweak-tool gdm
```

```shell
sudo apt-get install numix-icon-theme-circle
```

### ZealDocs

```shell
$ sudo apt-get install zeal
$ sudo apt-get remove appmenu-qt5
```

## Shell Tools

### f-irc/irssi (irc client)

###  pppoeconf/speedtest-cli

```shell
sudo pppoeconf
sudo pon dsl-provider
sudo poof
ifconfig ppp0
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

## Firefox Plugins

```shell
sudo chmod g-wx,o-wx .python-eggs/
sudo chmod +x ./packages.egg
nohup python ~/hustlyl/software/GoagentFreeFirefoxfan/Goagent/proxy.py & >/dev/null 2>&1
nohup firefox & >/dev/null 2>&1
```

-   AdblockPlus
-   Alexa
-   AutoProxy
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
-   SeleniumIDE
-   Stylish
-   TabMixPlus
-   User Agent Switcher
-   VimFx
-   Web Search Pro
-   xThunder

## GFW

### XX-Net

```shell
sudo apt-get install python-vte  python-OpenSSL  python-gtk2 libffi-dev python-appindicator libnss3-tools  
```

-   download

https://github.com/XX-net/XX-Net/wiki/%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95

-   firefox config: pan add-on

### OpenVPN && vpngate/vpnbook

```shell
sudo apt-get install openssl
sudo apt-get install pam-devel
```

```shell
#wget http://www.oberhumer.com/opensource/lzo/download/lzo-2.06.tar.gz
#tar –zxvf lzo-2.06.tar.gz –C /usr/src/
#cd /usr/src/lzo-2.06
# ./configure --prefix=/usr/local
#make
#make install
```

```shell
#unzip openvpn-2.3.10.zip
#cd openvpn-2.3.2
#./.configure --prefix=/opt/openvpn-2.3.10
#make
#make install

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
-   sougoupinyin
-   qq
-   qq browser
-   baiduyun
-   office 2007
