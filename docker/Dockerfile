FROM ubuntu
RUN mkdir xtens-app
WORKDIR /xtens-app
COPY . /xtens-app
COPY ./docker/config/local.js /xtens-app/config/local.js
# RUN git clone https://github.com/xtens-suite/xtens-app.git
# ADD . /xtens-app
RUN apt-get update
RUN apt-get install -y git nodejs npm ruby-full autogen autoconf libtool make
# RUN git config --global url."https://".insteadOf git://
RUN npm i pm2 -g
RUN npm i sails
RUN npm i
RUN npm i grunt-cli -g
RUN npm i bower -g
RUN rm -rf node_modules/waterline
RUN npm i waterline@0.11.9
RUN apt-get install -y ruby
RUN gem install sass
RUN grunt bower
WORKDIR /
RUN git clone https://github.com/xtens-suite/migrate-utils.git
WORKDIR /migrate-utils
COPY ./docker/config/migrate-utils.config.js /migrate-utils/config/local.js
WORKDIR /xtens-app

EXPOSE 1337
# CMD ["pm2", "start", "ecosystem.config.js"]
