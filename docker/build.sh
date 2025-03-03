#!/bin/bash

# 设置默认版本号
VERSION=${VERSION:-"latest"}

# 确保工作目录正确
cd "$(dirname "$0")"

# 检查 docker-compose.yml 文件
if [ ! -f "docker-compose.yml" ]; then
    echo "错误：找不到 docker-compose.yml 文件"
    exit 1
fi

echo "开始构建镜像..."

# 使用 docker-compose 构建镜像
docker compose build || exit 1

# 创建输出目录
mkdir -p ../images

# 获取服务名称列表
services=$(docker compose config --services)

# 保存镜像
# echo "保存 MongoDB 镜像..."
# docker save mongodb:${VERSION} > ../images/mongodb-${VERSION}.tar || exit 1
# gzip -f ../images/mongodb-${VERSION}.tar

# echo "保存 MongoDB 镜像..."
# docker save mongodb:${VERSION} > ../images/mongodb-${VERSION}.tar || exit 1
# gzip -f ../images/mongodb-${VERSION}.tar

# echo "保存后端镜像..."
# docker save backend:${VERSION} > ../images/backend-${VERSION}.tar || exit 1
# gzip -f ../images/backend-${VERSION}.tar

# echo "保存前端镜像..."
# docker save website:${VERSION} > ../images/website-${VERSION}.tar || exit 1
# gzip -f ../images/website-${VERSION}.tar

echo "镜像构建和保存完成！"
