#!/bin/bash
psql -d postgres -a -f 00_drop_db.sql
psql -d postgres -a -f 01_create_db.sql
psql -d articledb -a -f 02_create_schema.sql
