FROM ubuntu

RUN apt-get update\
    && DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata\
    && apt-get install -y --no-install-recommends nginx php-fpm vim-tiny net-tools less

COPY default /etc/nginx/sites-enabled/default

CMD service nginx start\
    && service php7.2-fpm start\
    && exec tail -f /dev/null
