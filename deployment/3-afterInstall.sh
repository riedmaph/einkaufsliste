#!/bin/bash

# All files are at their target location now

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. $DIR/config.sh

# backend
#=========

# install required node packages
cd $API_PATH
npm i



# frontend
#=========

# install required node packages
cd $APP_PATH
npm i

# build webapp
npm run build:dev