#!/bin/bash

# Here is the place to start the application

APP_PATH="/autodeploy/frontend"

# start nginx container in detached mode
cd $APP_PATH
docker-compose up -d