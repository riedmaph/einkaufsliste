#!/bin/bash

# All files are at their target location now

ELISA_PATH="/autodeploy"
API_PATH=$ELISA_PATH/backend
APP_PATH=$ELISA_PATH/frontend

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