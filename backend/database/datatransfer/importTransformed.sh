#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname
getUser "admin" dbuseradmin dbpassadmin

PGPASSWORD=$dbpassadmin psql -h $dbhost -p $dbport -d $dbname -U $dbuseradmin -f "importTransformed.sql"