#!/bin/bash

. config.sh

read -s -p "Please enter postgres admin password: " pspw

PGPASSWORD=$pspw psql -h $dbhost -p $dbport -U postgres -a -f "dropDb.sql" -v dbname=$dbname -v dbusercrawler=$dbusercrawler -v dbusertransformer=$dbusertransformer -v dbuserapi=$dbuserapi; 
PGPASSWORD=$pspw psql -h $dbhost -p $dbport -U postgres -a -f "createDb.sql" -v dbname=$dbname -v dbusercrawler=$dbusercrawler -v dbpasscrawler=$dbpasscrawler -v dbusertransformer=$dbusertransformer -v dbpasstransformer=$dbpasstransformer -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi; 
