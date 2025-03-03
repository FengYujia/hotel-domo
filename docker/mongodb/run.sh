#!/bin/sh

# 第一次启动
echo '1.first time start...'
mongod --bind_ip 0.0.0.0 &

# 心跳
while true
    do
        echo 'starting...'
        if bash -c "if mongo --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)'; then exit 0; fi; exit 1;"; then
            break
        fi
        if  [ "$counter" -gt 60 ] ; then
            break
        fi
        counter=$(($counter + 1))
        echo $counter
        sleep 2
done

# 设置权限
echo '2.set authentication...'
mongo <<EOF
use admin
db.createUser({user:"root",pwd:"123321",roles:[{role:'root',db:'admin'}]})
db.auth('root', '123321') 
use hotel
db.createUser({user:"admin",pwd:"123321",roles:[{role:'readWrite',db:'hotel'}]})
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

#停止服务
echo '2.stop mongo...'
mongod -shutdown -dbpath=/data/db

#开启mongo前台进程，由docker守护
echo '3.start mongo with console...'
# mongod --bind_ip 0.0.0.0 --wiredTigerCacheSizeGB 1

# 开启定时
service cron restart
# 
mongod --config /etc/mongod.conf 