#!/bin/bash

# Here is the place to start the application

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. $DIR/config.sh

# start docker containers
cd $ELISA_PATH
docker-compose up -d