Temporary Database 
====================

Install PostgreSQL
------------------
```
$ sudo apt-get install postgresql
```

Set admin password and create database
--------------------------------------
Impersionate postgres user:
```
$ sudo -u postgres -i
```
Start postgres terminal
```
$ psql 
```
Change password of postgres to elite_se
```
=# \password postgres
```
Enter new password...  

Create database
```
=# create database shoppinglist;
```

finally press ctrl+D twice to exit psql and logout

Create schema 
-------------
```
$ psql -U postgres -h 127.0.0.1 shoppinglist -f schema.sql 
``