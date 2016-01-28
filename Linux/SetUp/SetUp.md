# Linux SetUp

> 建立一个软件repo，加快装机速度，是程序员的必备修养 -- 尼采

------

## IDE

1. Android Studio
2. WebStorm

## Editor-OpenSource
1. Vim(Github)
2. Visual Studio Code  
```Shell
sudo add-apt-repository ppa:ubuntu-desktop/ubuntu-make
sudo apt-get update
sudo apt-get install ubuntu-make
umake web visual-studio-code
umake web visual-studio-code --remove
sudo ln -s /home/hustlyl/.local/share/umake/web/visual-studio-code/Code /usr/local/bin/code
```
3. Atom
  - firewall : $ touch ~/.atom/.apmrc && echo 'strict-ssl = false' > ~/.atom/.apmrc

## Platform
1. VMPlayer
2. Nodejs
3. Java

## Framework
1. Meteor
2. React
3. React Native

## Software Tools
1. Crossover(TM2013)
2. Gnome Tweak Tool
    - numix
    - macbuntu

## Shell Tools
1. ssh
2. screen
3. git
4. pppoeconf/speedtest-cli  
```shell
sudo pppoeconf
sudo pon dsl-provider
sudo poof
ifconfig ppp0
```
5. zsh
    - theme : rkj-repos candy ys
    - plugins : git node ruby meteor bundler osx rake sublime

## Firefox Plugins
- AdblockPlus
- Alexa
- AutoProxy
- BetterSearch
- CLEO
- DownThemeAll
- ExtendedStatusBar
- FEBE
- Firebug
- Flagfox
- Greasemonkey
- Markdown Here
- Markdown Viewer
- Octotree
- SeleniumIDE
- Stylish
- TabMixPlus
- VimFx
- xThunder
