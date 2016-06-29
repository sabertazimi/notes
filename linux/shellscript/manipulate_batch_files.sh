#!/bin/bash

find ./ -name "*.v" | xargs -i -t cp -fr {} ./src/
