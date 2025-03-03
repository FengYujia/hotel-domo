# hotel Demo


# docker打包
```
cd docker && sh build.sh
```

# docker启动脚本
```
cd images && sh setup.sh
```

# docker环境配置
```
在images文件夹下的.env文件修改本机端口和数据库共享文件夹
```

### 页面地址
```
用户预定页面   ：http://localhost/GuestReservation
管理员登录页面 : http://localhost/managerLogin
默认用户       :root
默认密码       : 123456
```

### 服务器地址
```
Server   : http://localhost:4000
GraphQL  : http://localhost:4000/graphql
REST API : http://localhost:4000/api
```

### 研发运行方法
```
cd backend && npm run dev
cd web && npm run dev
```


### API 测试方法
```
cd backend && npm run test
```


### API文档
```
doc文件夹内
```
