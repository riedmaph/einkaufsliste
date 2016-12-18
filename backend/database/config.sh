#!/bin/bash

# Shell wraper for database configuration
# Parameter values are stored in config.json

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi

config="$DIR/../config/config.json"

function getDb {
	if [ -z "$1" ]; then
		local _db=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['selectedDb']"`
	else 
		local _db=$1
	fi
	local _host=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['databases']['$_db']['dbhost']"`
	local _port=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['databases']['$_db']['dbport']"`
	local _name=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['databases']['$_db']['dbname']"`
	eval "$2='$_host'"
	eval "$3='$_port'"
	eval "$4='$_name'"
	
	if [ -n "$5" ]; then
		local _prot=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['databases']['$_db']['protected']"`
		eval "$5='$_prot'"
	fi
}

function getUser {
	local _username=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['users']['$1']['username']"`
	local _pw=`cat $config | python -c "import sys, json; print json.load(sys.stdin)['users']['$1']['pw']"`
	eval "$2='$_username'"
	eval "$3='$_pw'"
}
