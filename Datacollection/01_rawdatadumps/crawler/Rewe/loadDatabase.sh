#!/bin/bash
dbhost="127.0.0.1"
dbport=5432
dbname="articledb"
dbuser="postgres"
dbpass="elite_se"

PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -c "DROP TABLE IF EXISTS reweRawData;"
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -c "CREATE TABLE reweRawData (title TEXT,key TEXT,value TEXT,source TEXT);"
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -c "COPY reweRawData FROM '$(pwd)/articles.csv' CSV DELIMITER ';'"
