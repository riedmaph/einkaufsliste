DROP TABLE IF EXISTS Crawled.Brand;
DROP TABLE IF EXISTS Crawled.Attribute;
DROP TABLE IF EXISTS Crawled.Article;
DROP TABLE IF EXISTS Crawled.Category;
DROP TABLE IF EXISTS Crawled.Shop;

DROP SCHEMA IF EXISTS Crawled;

CREATE SCHEMA Crawled;

CREATE TABLE IF NOT EXISTS Crawled.Shop (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT
);

CREATE TABLE IF NOT EXISTS Crawled.Category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    shop INT REFERENCES Crawled.Shop(id) ON DELETE CASCADE,
    parent INT REFERENCES Crawled.Category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Crawled.Article (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC(10,2),
    amount REAL,
    unit TEXT,
    url TEXT,
    category INT NOT NULL REFERENCES Crawled.Category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Crawled.Attribute (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT,
    article INT NOT NULL REFERENCES Crawled.Article(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Crawled.Brand (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    shop INT REFERENCES Crawled.Shop(id) ON DELETE CASCADE
);
