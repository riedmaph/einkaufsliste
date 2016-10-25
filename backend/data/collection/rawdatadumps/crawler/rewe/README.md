# Requirements
Maven
Java
Psql
Postgres db

# Execute
Inside the direcctory crawler/REWE
For a complete build execute 
chmod u+x loadData.sh
./loadData.sh

If any but the last downloaded file prints a log message, rerun the downloadscript with those reported files by changing the for loop to those values. E.g. if Files 1 and 4 were not complete change it to:for i in 1 4
Then execute all steps listed in loadData.sh manually
 
Or execute the individual steps as listed in loadData.sh
