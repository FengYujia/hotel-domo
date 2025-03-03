FROM node:16-alpine3.12


RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

RUN apk add -U tzdata && rm -rf /etc/localtime \
  && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone

ADD ./backend /www/backend
ADD ./backend/config /www/backend/config_backup
ADD ./docker/backend/run.sh /www/backend/run.sh

ENV NODE_ENV=production

EXPOSE 4000

RUN npm config set registry http://registry.npmmirror.com \
  && npm install pm2 -g \
  && cd /www/backend && npm i --legacy-peer-deps \
  &&chmod +x /www/backend/run.sh
WORKDIR /www/backend

CMD ["sh", "run.sh" ]