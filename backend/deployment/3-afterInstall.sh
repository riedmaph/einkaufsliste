#!/bin/bash

# All files are at their target location now

API_PATH="/autodeploy/backend/"

# install required node packages
cd $API_PATH
npm i

# install 'npm start' as service 'elisa-api'
cp $API_PATH/elisa-api.service /etc/systemd/system/
systemctl daemon-reload