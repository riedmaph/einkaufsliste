#!/bin/bash

. config.sh

read -s -p "Please enter postgres admin password: " pspw

PGPASSWORD=$pspw psql -h $dbhost -p $dbport -U postgres -a -f "dropDb.sql" -v dbname=$dbname -v dbuser=$dbuser; 
PGPASSWORD=$pspw psql -h $dbhost -p $dbport -U postgres -a -f "createDb.sql" -v dbname=$dbname -v dbuser=$dbuser -v dbpass=$dbpass;
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -a -f "createSchema.sql"; 
