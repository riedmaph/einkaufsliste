DROP TABLE IF EXISTS :schemaname.Item;
DROP TABLE IF EXISTS :schemaname.List;
DROP TABLE IF EXISTS :schemaname.Enduser;
DROP TABLE IF EXISTS :schemaname.FavouriteMarket;

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
    amount REAL,
    unit TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checked TIMESTAMP DEFAULT NULL,
    list UUID NOT NULL REFERENCES :schemaname.List(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS :schemaname.ListShare (
    list UUID NOT NULL REFERENCES :schemaname.List(id) ON DELETE CASCADE,
    enduser UUID NOT NULL REFERENCES :schemaname.Enduser(id) ON DELETE CASCADE,
    UNIQUE(list, enduser)

CREATE TABLE IF NOT EXISTS :schemaname.FavouriteMarket (
    enduser UUID NOT NULL REFERENCES :schemaname.Enduser(id) ON DELETE CASCADE,
    market int NOT NULL REFERENCES Transformed.Market(id) ON DELETE CASCADE,
    UNIQUE(enduser, market)
);