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
    name TEXT REFERENCES Grocerydata.ProductName(name) NOT NULL,
    brand TEXT REFERENCES Grocerydata.Brand,
    UNIQUE (name,brand)
);

CREATE TABLE Grocerydata.ArticleVariation (
    id SERIAL PRIMARY KEY,
    article INTEGER REFERENCES Grocerydata.Article(id),
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

INSERT INTO Grocerydata.shop VALUES ('EDEKA'),('REWE');

CREATE TABLE Grocerydata.Market (
  id integer primary key,
  name text,
  latitude double precision,
  longitude double precision,
  extid integer,
  shop TEXT REFERENCES Grocerydata.shop,
  street text,
  zip text,
  city text,
  UNIQUE(latitude,longitude,name)
);


CREATE TABLE Grocerydata.ArticleLocation (
  id SERIAL PRIMARY KEY,
  variation INT REFERENCES Grocerydata.Article(id),
  shop TEXT REFERENCES Grocerydata.shop(name),
  market INTEGER REFERENCES Grocerydata.market(id),
  price DOUBLE PRECISION
);

CREATE TABLE Grocerydata.Offer (
  id SERIAL PRIMARY KEY,
  article INTEGER REFERENCES Grocerydata.ArticleVariation(id),
  offerprice double precision,
  discount TEXT,
  minimumquantityfordiscount TEXT,
  offerfrom date,
  offerto date,
  market INTEGER REFERENCES Grocerydata.Market (id)
);

CREATE TABLE Grocerydata.CategoryTag (
  name TEXT PRIMARY KEY
);

CREATE TABLE Grocerydata.ArticleCategoryTag (
  article INTEGER REFERENCES Grocerydata.Article (id),
  tag TEXT REFERENCES Grocerydata.CategoryTag (name),
  preference INTEGER,
  PRIMARY KEY (article,tag)
);
