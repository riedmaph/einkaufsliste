#!/bin/bash

# All files are at their target location now

APP_PATH="/autodeploy/frontend"

# install required node packages
cd $APP_PATH
npm i

# build webapp
npm run build:dev

