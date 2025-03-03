#!/bin/bash

# 设置默认版本号
VERSION=${VERSION:-"latest"}

# 确保工作目录正确
cd "$(dirname "$0")"

# 检查 docker-compose.yml 文件
if [ ! -f "../docker/docker-compose.yml" ]; then
    echo "错误：找不到 docker-compose.yml 文件"
    exit 1
fi

# 获取服务列表
cd ../docker
services=$(docker compose config --services)
cd ../images

# 检查并加载镜像
for service in $services; do
    if [ ! -f "${service}-${VERSION}.tar.gz" ]; then
        echo "错误：找不到 ${service}-${VERSION}.tar.gz 镜像文件"
        exit 1
    fi
    
    echo "加载 ${service} 镜像..."
    docker load -i "${service}-${VERSION}.tar.gz" || exit 1
done

echo "镜像加载完成"

# 启动容器
echo "启动容器..."
cd ../docker && docker compose up -d

echo "设置完成！"