FROM mongo:4.2
# FROM mongo:5.0.5

# 时区问题
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo 'Asia/Shanghai' >/etc/timezone  

RUN mkdir -p /data/db/ && mkdir -p /var/log/mongodb
COPY ./docker/mongodb/mongod.conf /etc/
COPY ./docker/mongodb/run.sh /opt/

WORKDIR /opt

# 启动命令
EXPOSE 27017
CMD ["sh","run.sh"]