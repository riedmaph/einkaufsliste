#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname protected

if [ $protected = True ]; then
	echo "Error: Selected database is protected!"
	exit
fi

getUser "api" dbuserapi dbpassapi
getUser "admin" dbuseradmin dbpassadmin

PGPASSWORD=$dbpassadmin psql -h $dbhost -p $dbport -U $dbuseradmin -d $dbname -a -f "permissions.sql" -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi;
PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -a -f "schema.sql" -v schemaname="userdata";
PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -a -f "schema.sql" -v schemaname="userdata_test";