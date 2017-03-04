FROM node:boron

RUN mkdir -p /usr/src/app

RUN npm install nodemon -g

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install cmake -y

CMD npm install && nodemon -L bin/www
