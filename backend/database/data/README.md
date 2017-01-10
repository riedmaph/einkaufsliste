
Data import / export
--------------------

Dump database `<db>` to file `data.sql`:
```
$ ./dump.sh [<db>]
```

Restore database `<db>` from file `data.sql`:
```
$ ./restore.sh [<db>]
```

Import schema transformed only 
------------------------------
To insert the current transformed data do the following steps:
- download the actual transformed data into `backend/database/data` (get link from the responsible team member)
- execute `backend/database/data/importTransformed.sh`