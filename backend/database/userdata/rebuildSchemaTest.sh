#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname

getUser "api" dbuserapi dbpassapi
getUser "admin" dbuseradmin dbpassadmin

PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -a -f "schema.sql" -v schemaname="userdata_test";
PGPASSWORD=$dbpassadmin psql -h $dbhost -p $dbport -U $dbuseradmin -d $dbname -a -f "permissions.sql" -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi;
