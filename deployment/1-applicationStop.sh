#!/bin/bash

# This is the first lifecyle event, nothing is deployed yet

. config.sh

# Stop docker containers
cd $ELISA_PATH
docker-compose stop