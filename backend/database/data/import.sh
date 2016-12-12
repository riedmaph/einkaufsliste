#!/bin/bash

. ../config.sh

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -d $dbname -U $dbusercrawler -f "./import.sql"