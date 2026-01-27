#!/bin/bash

stty -echo
read -p "[sudo] sabertazimi 的密码: " password
echo $password | sudo -S <command> &
stty echo
