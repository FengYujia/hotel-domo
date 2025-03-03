#!/bin/sh

# 设置错误时退出
set -e

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 检查服务是否就绪
check_service() {
    local service=$1
    local port=$2
    local max_attempts=$3
    local attempt=1

    log "等待 $service 服务启动..."
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port; then
            log "$service 服务已就绪"
            return 0
        fi
        log "尝试 $attempt/$max_attempts: $service 服务未就绪"
        attempt=$((attempt + 1))
        sleep 2
    done
    log "错误: $service 服务启动失败"
    return 1
}

# 初始化 MongoDB
init_mongodb() {
    log "初始化 MongoDB..."
    
    # 确保数据目录存在并设置权限
    mkdir -p /data/db
    chown -R mongodb:mongodb /data/db
    chmod 755 /data/db

    # 启动 MongoDB
    mongod --config /etc/mongod.conf &
    
    # 等待 MongoDB 就绪
    if ! check_service "MongoDB" 27017 200; then
        exit 1
    fi

    # 设置用户权限
    log "设置 MongoDB 用户权限..."
    mongo << 'EOF'
use admin
db.createUser({user:"root",pwd:"123321",roles:[{role:'root',db:'admin'}]})
db.auth('root', '123321') 
use hotel
if(!db.getUser('admin')) {
    db.createUser({user:"admin",pwd:"123321",roles:[{role:'readWrite',db:'hotel'}]})
}
db.auth('admin', '123321')
if(!db.managers.findOne({managerName:'root'})) {
    db.managers.insertOne({
        managerName: 'root',
        managerNo: '0001', 
        phone: '123456789',
        password: 'C66B1895749F096600B1DFBC75A5B6CB2DC38667B253CD564FA0AFE848F0F557'
    })
}
exit
EOF
}

# 配置后端
setup_backend() {
    log "配置后端服务..."
    
    # 检查是否需要重启
    if [ -f /backend/restart ]; then
        log "检测到重启标志，更新配置文件..."
        rm -f /backend/restart
    fi

    # 更新配置文件
    if [ -n "$MONGODB_URI" ]; then
        echo "{\"mongodb\":{\"uri\":\"$MONGODB_URI\"}}" > /backend/config/default.json
    fi
}

# 启动所有服务
start_services() {
    log "启动所有服务..."
    
    # 启动 MongoDB
    mongod --config /etc/mongod.conf &
    
    # 等待 MongoDB 就绪
    if ! check_service "MongoDB" 27017 30; then
        exit 1
    fi

    # 启动后端服务
    cd /backend
    node app.js --name "backend" &
    
    # 等待后端服务就绪
    if ! check_service "Backend" 4000 30; then
        exit 1
    fi

    # 启动 Nginx
    nginx -g 'daemon off;'
}

# 主函数
main() {
    log "开始初始化服务..."
    
    # 初始化 MongoDB
    init_mongodb
    
    # 配置后端
    setup_backend
    
    # 启动所有服务
    start_services
}

# 执行主函数
main
