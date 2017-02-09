DROP TABLE IF EXISTS :schemaname.FavouriteMarket;
DROP TABLE IF EXISTS :schemaname.Admin;
DROP TABLE IF EXISTS :schemaname.OptimisedItem;
DROP TABLE IF EXISTS :schemaname.OptimisedListMarket;
DROP TABLE IF EXISTS :schemaname.OptimisedList;
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

CREATE TABLE IF NOT EXISTS :schemaname.Admin (
    userid UUID PRIMARY KEY REFERENCES :schemaname.Enduser(id)
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

CREATE TABLE IF NOT EXISTS :schemaname.FavouriteMarket (
    enduser UUID NOT NULL REFERENCES :schemaname.Enduser(id) ON DELETE CASCADE,
    market INTEGER NOT NULL REFERENCES Grocerydata.Market(id) ON DELETE CASCADE,
    UNIQUE(enduser, market)
);

CREATE TABLE IF NOT EXISTS :schemaname.OptimisedList (
    id UUID PRIMARY KEY,
    list UUID NOT NULL REFERENCES :schemaname.List(id),
    startDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    endDate TIMESTAMP DEFAULT NULL,
    savings double precision,
    distance double precision
);

CREATE TABLE IF NOT EXISTS :schemaname.OptimisedListMarket (
    optimisedlist UUID NOT NULL REFERENCES :schemaname.OptimisedList(id) ON DELETE CASCADE,
    market INTEGER NOT NULL REFERENCES Grocerydata.Market(id) ON DELETE CASCADE,
    UNIQUE(optimisedlist, market)
);

CREATE TABLE IF NOT EXISTS :schemaname.OptimisedItem (
    id UUID PRIMARY KEY,
    name TEXT,
    amount REAL,
    unit TEXT,
    offerAlgorithm INTEGER REFERENCES Grocerydata.Offer(id),
    offerUser INTEGER REFERENCES Grocerydata.Offer(id),
    optimisedlist UUID NOT NULL REFERENCES :schemaname.OptimisedList(id) ON DELETE CASCADE,
    item UUID NOT NULL REFERENCES :schemaname.Item(id) ON DELETE CASCADE 
);