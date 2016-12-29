DROP TABLE IF EXISTS Transformed.ArticleTag;
DROP TABLE IF EXISTS Transformed.Tag;
DROP TABLE IF EXISTS Transformed.Article;
DROP TABLE IF EXISTS Transformed.Offer;
DROP TABLE IF EXISTS Transformed.Market;

DROP SCHEMA IF EXISTS Transformed;

CREATE SCHEMA Transformed;

CREATE TABLE IF NOT EXISTS Transformed.Article (
    id SERIAL PRIMARY KEY,
    title TEXT,
    name TEXT,
    brand TEXT,
    price NUMERIC(10,2),
    size TEXT,
    packagesize INT,
    amount REAL,
    unit TEXT,
    url TEXT,
    shop INT    
);

CREATE TABLE IF NOT EXISTS Transformed.Tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Transformed.ArticleTag (
    article INT NOT NULL REFERENCES Transformed.Article(id) ON DELETE CASCADE,
    tag INT NOT NULL REFERENCES Transformed.Tag(id) ON DELETE CASCADE,
    preference INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Transformed.Market
(
  id serial primary key,
  name text,
  latitude double precision,
  longditude double precision,
  extid integer,
  shop integer,
  street text,
  zip text,
  city text
);

CREATE TABLE IF NOT EXISTS Transformed.Offer
(
  id integer primary key,
  title text,
  price double precision,
  offerfrom date,
  offerto date,
  "coalesce" text,
  name text,
  size text,
  discount text,
  productid integer,
  minimumquantityfordiscount text,
  extid text,
  market integer,
  description text
);

