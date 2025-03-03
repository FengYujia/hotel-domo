# 使用 Ubuntu 18.04 作为基础镜像
FROM ubuntu:18.04

# 设置环境变量，避免交互式安装时的提示
ENV DEBIAN_FRONTEND=noninteractive

# 更新包列表并安装必要的软件包
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    software-properties-common \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js 16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@8.19.4

# 安装 MongoDB 4.4
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - \
    && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list \
    && apt-get update \
    && apt-get install -y mongodb-org=4.4.24 mongodb-org-server=4.4.24 mongodb-org-shell=4.4.24 mongodb-org-mongos=4.4.24 mongodb-org-tools=4.4.24 \
    && mkdir -p /data/db /var/log/mongodb

# 安装 Nginx
RUN apt-get update && apt-get install -y nginx \
    && rm -rf /var/lib/apt/lists/*

# 复制 MongoDB 配置文件
COPY ./docker/ubuntu/mongod.conf /etc/mongod.conf

# 设置 MongoDB 数据目录和日志目录权限
RUN chown -R mongodb:mongodb /data/db /var/log/mongodb /etc/mongod.conf \
    && chmod 755 /data/db /var/log/mongodb \
    && chmod 644 /etc/mongod.conf

# 复制 Nginx 配置文件
COPY docker/ubuntu/nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80 27017 4000

# 后端文件
COPY ./backend /backend
COPY ./backend/config /backend/config_backup

# 设置环境变量
ENV NODE_ENV=production

# 配置 npm 镜像并安装依赖
RUN npm config set registry http://registry.npmmirror.com \
    && cd /backend && npm i --legacy-peer-deps

# 前端文件
COPY web/dist /www

# 执行文件
COPY ./docker/ubuntu/run.sh /run.sh
RUN chmod +x /run.sh

# 设置工作目录
WORKDIR /

# 启动命令
CMD ["/run.sh"]