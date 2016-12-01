#!/bin/bash

# This is the first lifecyle event, nothing is deployed yet

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. $DIR/config.sh

# Stop docker containers
cd $ELISA_PATH
docker-compose stop