DROP TABLE IF EXISTS Crawled.Brand CASCADE;
DROP TABLE IF EXISTS Crawled.Attribute CASCADE;
DROP TABLE IF EXISTS Crawled.Article CASCADE;
DROP TABLE IF EXISTS Crawled.Category CASCADE;
DROP TABLE IF EXISTS Crawled.Shop CASCADE;
DROP TABLE IF EXISTS Crawled.Market CASCADE;
DROP TABLE IF EXISTS Crawled.Offer CASCADE;
DROP TABLE IF EXISTS Crawled.ProcessedMarket CASCADE;

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
    name TEXT,
    brand TEXT,
    price NUMERIC(10,2),
    size TEXT,
    packagesize INT,
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


CREATE TABLE IF NOT EXISTS Crawled.Market (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    latitude double precision,
    longditude double precision,
    street TEXT,
    zip TEXT,
    city TEXT,
    hours TEXT,
    hours2 TEXT,
    extId int,
    shop INT NOT NULL REFERENCES Crawled.Shop(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Crawled.Offer (
    id SERIAL PRIMARY KEY,
    title TEXT,
    price NUMERIC(10,2) NOT NULL,
    offerFrom date,
    offerTo date,
    description TEXT,
    brand TEXT,
    priceNormal NUMERIC(10,2),
    size TEXT,
    discount TEXT,
    basePrice TEXT,
    productId INT,
    minimumQuantityForDiscount TEXT,
    extId TEXT,
    market INT NOT NULL REFERENCES Crawled.Market(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Crawled.ProcessedMarket (
    market INT NOT NULL REFERENCES Crawled.Market(id) ON DELETE CASCADE,
    count int,
    crawled timestamp DEFAULT CURRENT_TIMESTAMP
)

create index idx_category_shop on crawled.category(shop);
create index idx_category_parent on crawled.category(parent);
create index idx_article_category on crawled.article(category);
create index idx_attribute_article on crawled.attribute(article);
create index idx_brand_shop on crawled.brand(shop);
create index idx_market_shop on crawled.market(shop);
create index idx_market_extid on crawled.market(extid);
create index idx_offer_market on crawled.offer(market);
create index idx_ProcessedMarket_market on crawled.ProcessedMarket(market);
