#!/bin/bash

stty -echo
read -p "[sudo] sabertazimi 的密码: " passward
echo $password | sudo -S cmd &
stty echo
