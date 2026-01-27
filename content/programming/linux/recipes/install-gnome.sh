#!/usr/bin/env bash

stty -echo
read -p "[sudo] $(whoami)'s password: " password
stty echo

# https://extensions.gnome.org
# echo $password | sudo -S apt update && apt upgrade
echo $password | sudo -S apt install -y ubuntu-gnome-desktop
echo $password | sudo -S add-apt-repository -y ppa:numix/ppa
echo $password | sudo -S add-apt-repository -y ppa:papirus/papirus
echo $password | sudo -S add-apt-repository -y ppa:snwh/pulp
echo $password | sudo -S add-apt-repository -y ppa:daniruiz/flat-remix
echo $password | sudo -S apt update
echo $password | sudo -S apt install -y numix-icon-theme-circle papirus-icon-theme paper-icon-theme flat-remix
echo $password | sudo -S apt install -y git gnome-tweak-tool chrome-gnome-shell
git clone https://github.com/tliron/install-gnome-themes
cd install-gnome-themes
echo $password | sudo -S ./install-requirements-debian
./install-gnome-themes
