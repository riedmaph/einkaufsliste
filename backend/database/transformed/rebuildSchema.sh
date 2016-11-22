#!/bin/bash

. ../config.sh

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -U $dbusercrawler -d $dbname -a -f "permissions.sql" -v dbname=$dbname -v dbusertransformer=$dbusertransformer -v dbpasstransformer=$dbpasstransformer;
PGPASSWORD=$dbpasstransformer psql -h $dbhost -p $dbport -U $dbusertransformer -d $dbname -a -f "schema.sql"; 
