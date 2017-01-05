#!/bin/bash

. ../config.sh

getDb "$1" dbhost dbport dbname protected

if [ $protected = True ]; then
	echo "Error: Selected database is protected!"
	exit
fi

psql -h $dbhost -p $dbport -U postgres -d $dbname -f data.sql