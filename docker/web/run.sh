#!/bin/sh

mkdir /www/standalone
#前台启动nginx
nginx -g "daemon off;"

# bug 在线修复
#if [[ $1 == "-d" ]]; then
#  while true; do sleep 1000; done
#fi
