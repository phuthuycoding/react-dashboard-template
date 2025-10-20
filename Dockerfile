FROM alpine:latest

RUN apk add --no-cache lighttpd

COPY ./dist /var/www/localhost/htdocs

COPY ./lighttpd.conf /etc/lighttpd/lighttpd.conf

EXPOSE 80
CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
