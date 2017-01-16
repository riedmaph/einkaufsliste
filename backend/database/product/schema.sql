DROP TABLE IF EXISTS Product.Offer
DROP TABLE IF EXISTS Product.ArticleLocation
DROP TABLE IF EXISTS Product.Market
DROP TABLE IF EXISTS Product.Shop
DROP TABLE IF EXISTS Product.ArticleVariation
DROP TABLE IF EXISTS Product.Article
DROP TABLE IF EXISTS Product.Brand;
DROP TABLE IF EXISTS Product.ProductName;
DROP SCHEMA IF EXISTS Product;

CREATE SCHEMA Product;

CREATE TABLE Product.Product (
    name TEXT PRIMARY KEY
);

CREATE TABLE Product.Brand (
    name TEXT PRIMARY KEY
);

CREATE TABLE Product.Article (
    id SERIAL PRIMARY KEY,
    name TEXT REFERENCES Product.Product(name) NOT NULL,
    brand TEXT REFERENCES Product.Brand,
    UNIQUE (name,brand)
);

CREATE TABLE Product.ArticleVariation (
    id SERIAL PRIMARY KEY,
    article INTEGER REFERENCES Product.Article(id),
    title  TEXT,
    SIZE TEXT,
    packagesize INT,
    amount REAL,
    unit TEXT,
    UNIQUE(article,packagesize,amount,unit)
);

CREATE TABLE Product.Shop (
    name TEXT PRIMARY KEY
);

INSERT INTO Product.shop VALUES ('EDEKA'),('REWE');

CREATE TABLE Product.Market (
  id integer primary key,
  name text,
  latitude double precision,
  longditude double precision,
  extid integer,
  shop TEXT REFERENCES Product.shop,
  street text,
  zip text,
  city text,
  UNIQUE(latitude,longitude)
);


CREATE TABLE Product.ArticleLocation (
  id SERIAL PRIMARY KEY,
  variation INT REFERENCES Product.ArticleVariation(id),
  shop TEXT REFERENCES Product.shop(name),
  market INTEGER REFERENCES Product.market(id),
  price DOUBLE PRECISION
);

CREATE TABLE Product.Offer (
  id SERIAL PRIMARY KEY,
  price double precision,
  offerfrom date,
  offerto date,
);