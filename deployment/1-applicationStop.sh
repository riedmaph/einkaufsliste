#!/bin/bash

# This is the first lifecyle event, nothing is deployed yet

ELISA_PATH="/autodeploy"
API_PATH=$ELISA_PATH/backend
APP_PATH=$ELISA_PATH/frontend

# Stop docker containers
cd $ELISA_PATH
docker-compose stop