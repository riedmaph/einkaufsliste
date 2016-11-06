DROP TABLE IF EXISTS Crawled.Brand CASCADE;
DROP TABLE IF EXISTS Crawled.Attribute CASCADE;
DROP TABLE IF EXISTS Crawled.Article CASCADE;
DROP TABLE IF EXISTS Crawled.Category CASCADE;
DROP TABLE IF EXISTS Crawled.Shop CASCADE;

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

create index idx_category_shop on crawled.category(shop);
create index idx_category_parent on crawled.category(parent);
create index idx_article_category on crawled.article(category);
create index idx_attribute_article on crawled.attribute(article);
create index idx_brand_shop on crawled.brand(shop);
