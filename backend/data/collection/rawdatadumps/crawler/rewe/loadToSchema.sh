#!/bin/bash

currentdir=$(pwd)
cd ../../database
. ./config.sh
cd $currentdir

PGPASSWORD=$dbpass psql -h $dbhost -p $dbport -U $dbuser -d $dbname -f "moveToSchema.sql"; 

