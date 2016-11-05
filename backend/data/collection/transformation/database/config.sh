#!/bin/bash

# Shell wraper for database configuration
# Parameter values are stored in config.json

config="config.json"

dbhost=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbhost']"`
dbport=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbport']"`
dbname=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbname']"`
dbusertransformer=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbusertransformer']"`
dbpasstransformer=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbpasstransformer']"`
