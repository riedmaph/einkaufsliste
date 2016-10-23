Temporary Database 
====================

Host: localhost  
Port: 5432  
Name: articledb  
User: postgres  
Pwd:  elite_se


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

finally press ctrl+D twice to exit psql and logout

Create db and schema 
--------------------
```
$ ./run_scripts.sh
```
or on windows
```
> run_scripts.bat
```