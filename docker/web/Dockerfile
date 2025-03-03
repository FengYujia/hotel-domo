FROM nginx:1.21.4-alpine

ADD ./web/dist /www
COPY ./docker/web/nginx.conf /etc/nginx/nginx.conf

ADD ./docker/web/run.sh /opt/run.sh
RUN chmod +x /opt/*.sh

WORKDIR /opt
CMD ["sh","run.sh"]
