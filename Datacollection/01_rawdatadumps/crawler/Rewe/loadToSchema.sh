#!/bin/bash

. databaseSettings.sh

PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -f "moveToSchema.sql"; 

