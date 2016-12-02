#!/bin/bash

. ../config.sh

PGPASSWORD=$dbpasscrawler psql -h $dbhost -p $dbport -U $dbusercrawler -d $dbname -a -f "schema.sql";
