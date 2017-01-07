#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname
getUser "api" dbuserapi dbpassapi

PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -a -f "testData.sql"; 
