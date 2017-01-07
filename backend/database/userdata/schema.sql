DROP TABLE IF EXISTS :schemaname.Item;
DROP TABLE IF EXISTS :schemaname.List;
DROP TABLE IF EXISTS :schemaname.Enduser;

DROP SCHEMA IF EXISTS :schemaname;

CREATE SCHEMA :schemaname;

CREATE TABLE IF NOT EXISTS :schemaname.Enduser (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS :schemaname.List (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    enduser UUID NOT NULL REFERENCES :schemaname.Enduser(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS :schemaname.Item (
    id UUID PRIMARY KEY,
    position INTEGER,
    name TEXT,
    checked BOOLEAN DEFAULT FALSE,
    amount REAL,
    unit TEXT,
    list UUID NOT NULL REFERENCES :schemaname.List(id) ON DELETE CASCADE
);

