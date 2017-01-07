#!/bin/bash

. config.sh

if [ -z $1 ]; then
  echo "Usage: $0 <user> [<db>]"
   echo " user: crawler | transformer | api | admin"
   echo " db:   database identifier (selectedDb if omitted)"
   exit
fi

getDb "$2" dbhost dbport dbname protected
getUser $1 user pw

echo "User: $user"
echo "DB:   $dbhost:$dbport/$dbname"

if [ $protected = True ]; then
  echo "WARNING: Selected database is protected!"
fi

PGPASSWORD=$pw psql -h $dbhost -p $dbport -U $user -d $dbname