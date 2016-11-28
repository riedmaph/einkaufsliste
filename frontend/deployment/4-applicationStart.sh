#!/bin/bash

# Here is the place to start the application

APP_PATH="/autodeploy/frontend"

# start nginx container
cd $APP_PATH
docker-compose up &