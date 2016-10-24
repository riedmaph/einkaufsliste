#!/bin/bash

. databaseSettings.sh

PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -c "DROP TABLE IF EXISTS reweRawData;"
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -c "CREATE TABLE reweRawData (rowid INT,title TEXT,key TEXT,value TEXT,source TEXT);"
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -c "COPY reweRawData FROM '$(pwd)/articles.csv' CSV DELIMITER ';'"
