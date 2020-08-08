#!/bin/bash

echo "npm修复ios 0.63打包archive的问题..."
/bin/cp -rf ./bash/npm_fix/* ./node_modules/
echo "-- node_modules如果删除过，重新执行 yarn build:ios"