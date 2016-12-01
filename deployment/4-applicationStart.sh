#!/bin/bash

# Here is the place to start the application

. ./config.sh

# start docker containers
cd $ELISA_PATH
docker-compose up -d