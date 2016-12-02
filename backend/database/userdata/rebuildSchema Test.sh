#!/bin/bash

. ../config.sh

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -U $dbusercrawler -d $dbname -a -f "permissions.sql" -v dbname=$dbname -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi;
PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -v schemaname=$dbschemanameuserdatatest -a -f "schema.sql";
