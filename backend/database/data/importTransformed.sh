#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname
getUser "crawler" dbusercrawler dbpasscrawler

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -d $dbname -U $dbusercrawler -f "importTransformed.sql"