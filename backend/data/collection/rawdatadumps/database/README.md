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


Create db and users for crawling and transformation
--------------------
```
$ ./rebuildDatabase.sh
```

Create schema crawled
--------------------
```
$ ./rebuildSchema.sh
```
