#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname protected

if [ $protected = True ]; then
	echo "Error: Selected database is protected!"
	exit
fi

getUser "crawler" dbusercrawler dbpasscrawler

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -U $dbusercrawler -d $dbname -a -f "schema.sql";
