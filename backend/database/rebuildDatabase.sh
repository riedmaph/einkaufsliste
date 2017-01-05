#!/bin/bash

. config.sh

getDb "$1" dbhost dbport dbname protected

if [ $protected = True ]; then
	echo "Error: Selected database is protected!"
	exit
fi

getUser "admin" dbuseradmin dbpassadmin
getUser "crawler" dbusercrawler dbpasscrawler
getUser "transformer" dbusertransformer dbpasstransformer
getUser "api" dbuserapi dbpassapi

read -p "Please enter postgres admin user (default: postgres): " pgun
read -s -p "Please enter postgres admin password: " pgpw

if [ -z $pgun ]; then
	pgun="postgres"
fi

PGPASSWORD=$pgpw psql -h $dbhost -p $dbport -U $pgun -d postgres -a -f "dropDb.sql" -v dbname=$dbname -v dbusercrawler=$dbusercrawler -v dbusertransformer=$dbusertransformer -v dbuserapi=$dbuserapi -v dbuseradmin=$dbuseradmin;
PGPASSWORD=$pgpw psql -h $dbhost -p $dbport -U $pgun -d postgres -a -f "createDb.sql" -v dbname=$dbname -v dbusercrawler=$dbusercrawler -v dbpasscrawler=$dbpasscrawler -v dbusertransformer=$dbusertransformer -v dbpasstransformer=$dbpasstransformer -v dbuserapi=$dbuserapi -v dbpassapi=$dbpassapi -v dbuseradmin=$dbuseradmin -v dbpassadmin=$dbpassadmin -v dbadmin=$pgun;
