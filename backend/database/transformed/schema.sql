DROP TABLE IF EXISTS Transformed.ArticleTag;
DROP TABLE IF EXISTS Transformed.Tag;
DROP TABLE IF EXISTS Transformed.Article;

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
