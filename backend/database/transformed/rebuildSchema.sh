#!/bin/bash

. ../config.sh

PGPASSWORD=$dbpasstransformer psql -h $dbhost -p $dbport -U $dbusertransformer -d $dbname -a -f "schema.sql";
PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -U $dbusercrawler -d $dbname -a -f "permissions.sql" -v dbname=$dbname -v dbusertransformer=$dbusertransformer -v dbuserapi=$dbuserapi;