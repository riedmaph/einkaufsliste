#!/bin/bash

# Shell wraper for database configuration
# Parameter values are stored in config.json

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi

config="$DIR/config.json"

dbhost=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbhost']"`
dbport=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbport']"`

dbname=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbname']"`

dbschemanameuserdata=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbschemanameuserdata']"`
dbschemanameuserdatatest=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbschemanameuserdatatest']"`

dbusercrawler=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbusercrawler']"`
dbpasscrawler=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbpasscrawler']"`

dbusertransformer=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbusertransformer']"`
dbpasstransformer=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbpasstransformer']"`

dbuserapi=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbuserapi']"`
dbpassapi=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['dbpassapi']"`
