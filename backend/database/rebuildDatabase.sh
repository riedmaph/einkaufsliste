#!/bin/bash

. config.sh

read -p "Please enter postgres admin user (default: postgres): " pgun
read -s -p "Please enter postgres admin password: " pgpw

if [ -z $pgun ]; then
	pgun="postgres"
fi

PGPASSWORD=$pgpw psql -h $dbhost -p $dbport -U $pgun -d postgres -a -f "dropDb.sql" -v dbname=$dbname -v dbusercrawler=$dbusercrawler -v dbusertransformer=$dbusertransformer -v dbuserapi=$dbuserapi;
PGPASSWORD=$pgpw psql -h $dbhost -p $dbport -U $pgun -d postgres -a -f "createDb.sql" -v dbname=$dbname -v dbusercrawler=$dbusercrawler -v dbpasscrawler=$dbpasscrawler -v dbusertransformer=$dbusertransformer -v dbpasstransformer=$dbpasstransformer -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi -v dbadmin=$pgun;
