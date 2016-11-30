#!/bin/bash

# This is the first lifecyle event, nothing is deployed yet

APP_PATH="/autodeploy/frontend"

# stop nginx
cd $APP_PATH
docker-compose stop