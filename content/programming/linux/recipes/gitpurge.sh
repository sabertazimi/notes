#! /bin/sh
#
# gitpurge.sh
# Copyright (C) 2016 sabertazimi <sabertazimi@gmail.com>
#
# Distributed under terms of the MIT license.
#

git filter-branch -f --prune-empty --index-filter "git rm -rf --cached --ignore-unmatch `cat large.files`" --tag-name-filter cat -- --all
