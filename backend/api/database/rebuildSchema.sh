#!/bin/bash

. config.sh

read -s -p "Please enter postgres admin password: " pspw;

PGPASSWORD=$pspw psql -h $dbhost -p $dbport -U postgres -a -f "grantPermissions.sql" -v dbname=$dbname -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi;
PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -a -f "createSchema.sql"; 
