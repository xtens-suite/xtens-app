FROM ubuntu
RUN mkdir app
WORKDIR /app
COPY . /app
COPY ./docker/config/local.js /app/config/local.js
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
RUN apt-get install -y ruby
RUN gem install sass
RUN grunt bower
EXPOSE 1337
# CMD ["pm2", "start", "ecosystem.config.js"]
