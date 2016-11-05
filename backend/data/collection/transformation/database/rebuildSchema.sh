#!/bin/bash

. config.sh

read -s -p "Please enter postgres admin password: " pspw;

PGPASSWORD=$pspw psql -h $dbhost -p $dbport -U postgres -a -f "grantPermissions.sql" -v dbname=$dbname -v dbusertransformer=$dbusertransformer -v dbpasstransformer=$dbpasstransformer;
PGPASSWORD=$dbpasstransformer psql -h $dbhost -p $dbport -U $dbusertransformer -d $dbname -a -f "createSchema.sql"; 
