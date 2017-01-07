Temporary Database 
====================
Parameters are stored in config.json

Install PostgreSQL
------------------
```
$ sudo apt-get install postgresql
```

Set admin password
------------------
Impersionate postgres user:
```
$ sudo -u postgres -i
```
Start postgres terminal
```
$ psql 
```
Change password of postgres
```
=# \password postgres
```
Enter new password for postgres admin account

finally press ctrl+D twice to exit psql and logout


Create db and users for crawling, transformation and user data
--------------------
```
$ ./rebuildDatabase.sh [<db>]
```

Create schemata
--------------------
Execute scripts in corresponding subfolder (see instructions there)


Population of crawled and transformed data
--------------------
see ```../crawling``` and ```../transformation```