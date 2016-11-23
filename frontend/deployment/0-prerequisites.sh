#!/bin/bash

# This file is NOT executed by autodeploy!

APP_PATH="/autodeploy/frontend"

# insatll docker
curl -sSL https://get.docker.com/ | sh

# install docker-compose (1.9.0)
curl -L https://github.com/docker/compose/releases/download/1.9.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# start nginx container
cd $APP_PATH
docker-compose up &