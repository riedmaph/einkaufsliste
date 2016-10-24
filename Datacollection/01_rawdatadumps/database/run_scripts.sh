#!/bin/bash
psql -U postgres -d postgres -a -f 00_drop_db.sql
psql -U postgres -d postgres -a -f 01_create_db.sql
psql -U postgres -d articledb -a -f 02_create_schema.sql
