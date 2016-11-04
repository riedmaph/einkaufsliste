DROP TABLE IF EXISTS Transformed.Tag;
DROP TABLE IF EXISTS Transformed.Article;

DROP SCHEMA IF EXISTS Transformed;

CREATE SCHEMA Transformed;

CREATE TABLE IF NOT EXISTS Transformed.Article (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    brand VARCHAR(255),
    price NUMERIC(10,2),
    unit VARCHAR(255),
    amount NUMERIC(10,2),
    url VARCHAR(255)    
);

CREATE TABLE IF NOT EXISTS Transformed.Tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Transformed.ArticleTag (
    article INT NOT NULL REFERENCES Transformed.Article(id) ON DELETE CASCADE,
    tag INT NOT NULL REFERENCES Transformed.Tag(id) ON DELETE CASCADE
);
