#!/bin/bash

# Here is the place to start the application

ELISA_PATH=/autodeploy
API_PATH=$ELISA_PATH/backend/server
APP_PATH=$ELISA_PATH/frontend/webapp

# start docker containers
cd $ELISA_PATH
docker-compose up -d