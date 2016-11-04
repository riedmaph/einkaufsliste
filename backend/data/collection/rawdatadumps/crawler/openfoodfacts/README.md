Openfoodfacts Article Crawler
======================

Requirements
-------------
### Mongo DB
Install (on Mac):
```
brew install mongodb
```
Setup data directory
```
sudo mkdir -p /data/db
sudo chown $USER /data/db
```
Start daemon
```
mongod
```
Import DB dump
(download and extract http://world.openfoodfacts.org/data/openfoodfacts-mongodbdump.tar.gz)
```
mongorestore ~/Downloads/dump
```

### Python 2.7
```
sudo apt-get install python
```

Packages: pymongo (MongoDB driver), psycopg2 (postgres driver)
```
$ pip install pymongo
$ pip install psycopg2
```

Run
------
```
$ python openfoodfacts.py
```