#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname protected

if [ $protected = True ]; then
	echo "Error: Selected database is protected!"
	exit
fi

getUser "transformer" dbusertransformer dbpasstransformer
getUser "admin" dbuseradmin dbpassadmin

PGPASSWORD=$dbpasstransformer psql -h $dbhost -p $dbport -U $dbusertransformer -d $dbname -a -f "schema.sql";
PGPASSWORD=$dbpassadmin psql -h $dbhost -p $dbport -U $dbuseradmin -d $dbname -a -f "permissions.sql" -v dbusertransformer=$dbusertransformer;
