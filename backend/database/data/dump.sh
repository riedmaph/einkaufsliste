#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname
getUser "admin" dbuseradmin dbpassadmin

PGPASSWORD=$dbpassadmin pg_dump -h $dbhost -p $dbport -U $dbuseradmin -d $dbname -f data.sql