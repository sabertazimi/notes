#! /bin/sh
#
# echo_permission_denied.sh
# Copyright (C) 2016 sabertazimi <sabertazimi@gmail.com>
#
# Distributed under terms of the MIT license.
#

$ sudo sh -c "echo "info" >> target.md"
$ echo "info" | sudo tee -a target.md

