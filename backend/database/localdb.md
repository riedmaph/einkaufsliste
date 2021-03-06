# Local DB setup instructions

**Note**: The imaginary environment variable `$ELISA` refers to the root of the project.

## Start docker container postgres-db
```
cd $ELISA
docker-compose -f docker-compose.yml -f docker-compose.localdb.yml up -d postgres-db
```

### Note: 
The data is stored in a persistent docker volume. View volumes with
```
docker volume ls
```
To completely remove the local database use
```
docker rm postgres-db
docker volume rm elisa_psdata
```

## Set selectedDb to docker

Open `$ELISA/backend/config/config.json` and change the value of `selectedDb` to `docker`


## Rebuild local database

Close all connections to the local database first! Then run:
```
cd $ELISA/backend/database
./rebuildDatabase.sh
```
(leave admin username and password empty)

## Populate database with current snapshot
```
cd $ELISA/backend/database/datatransfer
```
If no up-to-date data.sql is available, create it with
```
./dump.sh rds
```
Now load the data into your local database
```
./restore.sh docker
```

## Alternatively create the plain schemas without data

Create schema `crawled`
```
cd $ELISA/backend/database/crawled
./rebuildSchema.sh
```

Create schema `transformed`
```
cd $ELISA/backend/database/transformed
./rebuildSchema.sh
```

Create schemas `userdata` and `userdata_test`
```
cd $ELISA/backend/database/userdata
./rebuildSchema.sh
./insertTestData.sh
```

