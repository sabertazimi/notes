#!/bin/bash

find . -name "*.js" | xargs wc -l | grep "total" | awk '{print $1}'

find . -name "*.js" | xargs cat | grep -v ^$ | wc -l

find . -name "*.js" | xargs cat | grep -v -e ^$ -e ^\s*\/\/.*$ | wc -l
