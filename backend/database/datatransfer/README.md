
Data import / export
--------------------

Dump database `<db>` to file `data/data.sql`:
```
$ ./dump.sh [<db>]
```

Restore database `<db>` from file `data/data.sql`:
```
$ ./restore.sh [<db>]
```

Import schema transformed only 
------------------------------
To insert the current transformed data do the following steps:
- download the current transformed data into `backend/database/datatransfer/data` (get link from the responsible team member)
- execute `backend/database/datatransfer/importTransformed.sh`