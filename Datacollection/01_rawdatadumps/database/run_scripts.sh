#!/bin/bash

. config.sh

PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d postgres -f "00_drop_db.sql"; 
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d postgres -f "01_create_db.sql"; 
PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -f "02_create_schema.sql"; 
