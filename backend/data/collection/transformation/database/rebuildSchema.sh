#!/bin/bash

cd ../../rawdatadumps/database
. config.sh
cd ../../transformation/database

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -U $dbusercrawler -d $dbname -a -f "grantPermissions.sql" -v dbname=$dbname -v dbusertransformer=$dbusertransformer -v dbpasstransformer=$dbpasstransformer;
PGPASSWORD=$dbpasstransformer psql -h $dbhost -p $dbport -U $dbusertransformer -d $dbname -a -f "createSchema.sql"; 
