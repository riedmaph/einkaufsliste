DROP TABLE IF EXISTS Grocerydata.ArticleCategoryTag;
DROP TABLE IF EXISTS Grocerydata.CategoryTag;
DROP TABLE IF EXISTS Grocerydata.Offer;
DROP TABLE IF EXISTS Grocerydata.ArticleLocation;
DROP TABLE IF EXISTS Grocerydata.Market;
DROP TABLE IF EXISTS Grocerydata.Shop;
DROP TABLE IF EXISTS Grocerydata.ArticleVariation;
DROP TABLE IF EXISTS Grocerydata.Article;
DROP TABLE IF EXISTS Grocerydata.Brand;
DROP TABLE IF EXISTS Grocerydata.ProductName;
DROP SCHEMA IF EXISTS Grocerydata;

CREATE SCHEMA Grocerydata;

CREATE TABLE Grocerydata.ProductName (
    name TEXT PRIMARY KEY
);

CREATE TABLE Grocerydata.Brand (
    name TEXT PRIMARY KEY
);

CREATE TABLE Grocerydata.Article (
    id SERIAL PRIMARY KEY,
    name TEXT REFERENCES Grocerydata.ProductName(name) DEFERRABLE NOT NULL  ,
    brand TEXT REFERENCES Grocerydata.Brand DEFERRABLE,
    UNIQUE (name,brand)
);

CREATE TABLE Grocerydata.ArticleVariation (
    id SERIAL PRIMARY KEY,
    article INTEGER REFERENCES Grocerydata.Article(id) DEFERRABLE,
    title  TEXT,
    SIZE TEXT,
    packagesize INT,
    amount REAL,
    unit TEXT,
    UNIQUE(article,packagesize,amount,unit)
);

CREATE TABLE Grocerydata.Shop (
    name TEXT PRIMARY KEY
);

CREATE TABLE Grocerydata.Market (
  id integer primary key,
  name text,
  latitude double precision,
  longitude double precision,
  extid integer,
  shop TEXT REFERENCES Grocerydata.shop DEFERRABLE,
  street text,
  zip text,
  city text
 );


CREATE TABLE Grocerydata.ArticleLocation (
  id SERIAL PRIMARY KEY,
  variation INT REFERENCES Grocerydata.Article(id) DEFERRABLE,
  shop TEXT REFERENCES Grocerydata.shop(name) DEFERRABLE,
  market INTEGER REFERENCES Grocerydata.market(id) DEFERRABLE,
  price DOUBLE PRECISION
);

CREATE TABLE Grocerydata.Offer (
  id SERIAL PRIMARY KEY,
  article INTEGER REFERENCES Grocerydata.ArticleVariation(id) DEFERRABLE,
  offerprice double precision,
  discount TEXT,
  minimumquantityfordiscount TEXT,
  offerfrom date,
  offerto date,
  market INTEGER REFERENCES Grocerydata.Market (id) DEFERRABLE
);

CREATE TABLE Grocerydata.CategoryTag (
  name TEXT PRIMARY KEY
);

CREATE TABLE Grocerydata.ArticleCategoryTag (
  article INTEGER REFERENCES Grocerydata.Article (id) DEFERRABLE,
  tag TEXT REFERENCES Grocerydata.CategoryTag (name) DEFERRABLE,
  preference INTEGER,
  PRIMARY KEY (article,tag)
);

CREATE INDEX Grocerydata_Market_Geo_Index on Grocerydata.Market USING gist(ll_to_earth(latitude, longitude));
