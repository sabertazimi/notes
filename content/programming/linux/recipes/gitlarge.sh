#! /bin/sh
#
# gitpurge.sh
# Copyright (C) 2016 sabertazimi <sabertazimi@gmail.com>
#
# Distributed under terms of the MIT license.
#

git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10 | awk '{print$1}')" | awk '{print $2}' | tr '\n' ' ' > large.files
