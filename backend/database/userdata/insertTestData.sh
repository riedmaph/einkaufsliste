#!/bin/bash

. ../config.sh

PGPASSWORD=$dbpassapi psql -h $dbhost -p $dbport -U $dbuserapi -d $dbname -a -f "testData.sql"; 
