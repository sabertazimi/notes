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
- [wget http://www.oberhumer.com/opensource/lzo/download/lzo-2.06.tar.gz](#wget-httpwwwoberhumercomopensourcelzodownloadlzo-206targz)
- [tar –zxvf lzo-2.06.tar.gz –C /usr/src/](#tar-zxvf-lzo-206targz-c-usrsrc)
- [cd /usr/src/lzo-2.06](#cd-usrsrclzo-206)
- [./configure --prefix=/usr/local](#configure-prefixusrlocal)
- [make](#make)
- [make install](#make-install)
- [unzip openvpn-2.3.10.zip](#unzip-openvpn-2310zip)
- [cd openvpn-2.3.2](#cd-openvpn-232)
- [./.configure --prefix=/opt/openvpn-2.3.10](#configure-prefixoptopenvpn-2310)
- [make](#make)
- [make install](#make-install)

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

```shell
sudo vim /etc/default/rcS
sudo apt-get install vim  
```

```shell
vim /etc/apt/sources.list.d/ubuntukylin.list
deb http://archive.ubuntukylin.com:10006/ubuntukylin trusty main 
```

```shell
sudo apt-get update  
sudo apt-get install sogoupinyin  
```


## IDE

1.  Android Studio
2.  WebStorm

## Editor-OpenSource

### Vim(Github)

### Visual Studio Code

```Shell
sudo add-apt-repository ppa:ubuntu-desktop/ubuntu-make
sudo apt-get update
sudo apt-get install ubuntu-make
umake web visual-studio-code
umake web visual-studio-code --remove
sudo ln -s /home/hustlyl/.local/share/umake/web/visual-studio-code/Code /usr/local/bin/code
```

### Atom

firewall : $ touch ~/.atom/.apmrc && echo 'strict-ssl = false' > ~/.atom/.apmrc

```javascript
  "activate-power-mode":
    screenShake:
      enabled: false
```

#### package

```c
[36mBuilt-in Atom packages[39m (89)
├── about@1.3.0
├── archive-view@0.61.0
├── atom-dark-syntax@0.27.0
├── atom-dark-ui@0.51.0
├── atom-light-syntax@0.28.0
├── atom-light-ui@0.43.0
├── autocomplete-atom-api@0.9.2
├── autocomplete-css@0.11.0
├── autocomplete-html@0.7.2
├── autocomplete-plus@2.25.0
├── autocomplete-snippets@1.9.0
├── autoflow@0.26.0
├── autosave@0.23.0
├── background-tips@0.26.0
├── base16-tomorrow-dark-theme@1.0.0
├── base16-tomorrow-light-theme@1.0.0
├── bookmarks@0.38.0
├── bracket-matcher@0.79.0
├── command-palette@0.38.0
├── deprecation-cop@0.54.0
├── dev-live-reload@0.47.0
├── encoding-selector@0.21.0
├── exception-reporting@0.37.0
├── find-and-replace@0.194.0
├── fuzzy-finder@0.94.0
├── git-diff@0.57.0
├── go-to-line@0.30.0
├── grammar-selector@0.48.0
├── image-view@0.56.0
├── incompatible-packages@0.25.0
├── keybinding-resolver@0.33.0
├── language-c@0.51.1
├── language-clojure@0.19.0
├── language-coffee-script@0.46.0
├── language-csharp@0.11.0
├── language-css@0.36.0
├── language-gfm@0.82.0
├── language-git@0.11.0
├── language-go@0.42.0
├── language-html@0.43.1
├── language-hyperlink@0.16.0
├── language-java@0.17.0
├── language-javascript@0.104.0
├── language-json@0.17.2
├── language-less@0.29.0
├── language-make@0.21.0
├── language-mustache@0.13.0
├── language-objective-c@0.15.1
├── language-perl@0.32.0
├── language-php@0.34.0
├── language-property-list@0.8.0
├── language-python@0.42.1
├── language-ruby@0.65.0
├── language-ruby-on-rails@0.24.0
├── language-sass@0.45.0
├── language-shellscript@0.21.0
├── language-source@0.9.0
├── language-sql@0.20.0
├── language-text@0.7.0
├── language-todo@0.27.0
├── language-toml@0.18.0
├── language-xml@0.34.2
├── language-yaml@0.25.0
├── line-ending-selector@0.3.0
├── link@0.31.0
├── markdown-preview@0.157.0
├── metrics@0.53.1
├── notifications@0.62.1
├── one-dark-syntax@1.1.1
├── one-dark-ui@1.1.8
├── one-light-syntax@1.1.1
├── one-light-ui@1.1.8
├── open-on-github@0.40.0
├── package-generator@0.41.0
├── settings-view@0.232.1
├── snippets@1.0.1
├── solarized-dark-syntax@0.39.0
├── solarized-light-syntax@0.23.0
├── spell-check@0.63.0
├── status-bar@0.80.0
├── styleguide@0.45.0
├── symbols-view@0.110.1
├── tabs@0.88.0
├── timecop@0.33.0
├── tree-view@0.198.0
├── update-package-dependencies@0.10.0
├── welcome@0.33.0
├── whitespace@0.32.1
└── wrap-guide@0.38.1

[36m/home/hustlyl/.atom/packages[39m (53)
├── achievements@0.9.0
├── activate-power-mode@0.4.1
├── atom-beautify@0.28.21
├── atom-css-comb@3.0.0
├── atom-ctags@4.4.2
├── atom-typescript@8.2.0
├── autocomplete-haskell@0.6.2
├── autocomplete-paths@1.0.2
├── autocomplete-python@1.5.1
├── autoprefixer@3.1.0
├── color-picker@2.1.1
├── css-snippets@0.9.0
├── docblockr@0.7.3
├── emmet@2.4.1
├── emmet-snippets-compatibility@1.0.4
├── ex-mode@0.8.0
├── flexbox-snippets@0.3.0
├── git-log@0.4.1
├── git-plus@5.12.1
├── git-status@0.3.4
├── javascript-snippets@1.2.0
├── linter@1.11.3
├── linter-bootlint@1.0.0
├── linter-csslint@1.2.0
├── linter-gcc@0.5.12
├── linter-hlint@0.4.2
├── linter-htmlhint@1.0.2
├── linter-javac@1.5.0
├── linter-js-yaml@1.2.5
├── linter-jshint@1.2.2
├── linter-jsxhint@0.1.2
├── linter-markdown@1.3.0
├── linter-pylint@1.2.0
├── linter-shellcheck@1.1.0
├── linter-tslint@0.6.0
├── markdown-folder@0.5.0
├── markdown-scroll-sync@2.0.3
├── markdown-themeable-pdf@0.10.2
├── markdown-toc@0.4.1
├── merge-conflicts@1.3.7
├── meteor-api@2.20.0
├── meteor-helper@0.27.0
├── minimap-linter@1.1.1
├── octocat-syntax@0.1.5
├── pigments@0.22.1
├── react@0.14.1
├── react-snippets@0.3.0
├── seti-icons@0.4.5
├── seti-ui@0.8.1
├── sync-settings@0.6.0
├── turbo-javascript@1.3.1
├── vim-mode@0.64.0
└── vim-surround@0.8.1
```

## Software Tools

### linuxbrew(On GitHub)

### ZealDocs

### bleachbit

### VMware player

## Shell Tools

-   f-irc/irssi (irc client)
-   ssh
-   screen
-   git
-   pppoeconf/speedtest-cli
-   gh

```shell
sudo pppoeconf
sudo pon dsl-provider
sudo poof
ifconfig ppp0
```

```shell
[sudo] npm install -g gh
```

-   zsh
    -   theme : rkj-repos candy ys
    -   plugins : git node ruby meteor bundler osx rake sublime

## Firefox Plugins

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
