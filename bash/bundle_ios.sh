#!/bin/bash

#执行之前，打印出来命令
set -x

coderoot=$PWD

[ ! -d ${coderoot}/ios/build ] && mkdir ${coderoot}/ios/build

node ${coderoot}/node_modules/react-native/cli.js bundle --entry-file index.js --platform ios --dev false --reset-cache \
--bundle-output "${coderoot}/ios/build/main.jsbundle" \
--assets-dest "${coderoot}/ios/build"
