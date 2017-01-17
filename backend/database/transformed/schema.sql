DROP TABLE IF EXISTS Transformed.Article;
DROP TABLE IF EXISTS transformed.TransformationPhase;
DROP TABLE IF EXISTS transformed.UnitDictionary;
DROP TABLE IF EXISTS Transformed.UnitTranslation;

DROP TABLE IF EXISTS transformed.DiscoverLogBrand;
DROP TABLE IF EXISTS transformed.DiscoverLogProductNam;
DROP TABLE IF EXISTS transformed.MineLogSize;
DROP TABLE IF EXISTS transformed.MineLogBrand;
DROP TABLE IF EXISTS transformed.MineLogProductName;
DROP TABLE IF EXISTS transformed.PreprocessingLogBrand;
DROP TABLE IF EXISTS transformed.PreprocessingLogProductName;

DROP VIEW IF EXISTS Transformed.ProductName;
DROP TABLE IF EXISTS Transformed.ProductNameForce;
DROP TABLE IF EXISTS Transformed.ProductNameBlacklist;
DROP TABLE IF EXISTS Transformed.ProductNameVerification;
DROP TABLE IF EXISTS Transformed.ProductNameSource;
DROP TABLE IF EXISTS Transformed.ProductNameDictionary;

DROP VIEW IF EXISTS Transformed.Brand;
DROP TABLE IF EXISTS Transformed.BrandForce;
DROP TABLE IF EXISTS Transformed.BrandBlacklist;
DROP TABLE IF EXISTS Transformed.BrandVerification;
DROP TABLE IF EXISTS Transformed.BrandSource;
DROP TABLE IF EXISTS Transformed.BrandDictionary;

DROP TABLE IF EXISTS Transformed.ArticleRaw;
DROP VIEW IF EXISTS Transformed.SourceProb;
DROP TABLE IF EXISTS Transformed.Source;
DROP TABLE IF EXISTS Transformed.Invoker;

DROP SCHEMA IF EXISTS Transformed;

CREATE SCHEMA Transformed;

CREATE TABLE Transformed.Invoker (
    name TEXT PRIMARY KEY   
);

INSERT INTO Transformed.Invoker VALUES ('crawler'),('user');

CREATE TABLE Transformed.Source (
    name Text PRIMARY KEY,
    occurences BIGINT NOT NULL DEFAULT 1,
    corrections BIGINT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transformed.SOURCE VALUES ('edeka.de',3500,0),('edeka24',7753,0),('rewe',27274,0),('edeka-lebensmittel.de',11576,0),('rewe-api',11091,0),('#discovered',0,0),('#oldtransformation',0,0);

CREATE VIEW Transformed.SourceProb AS (
    WITH RECURSIVE
    probs (name,prob) AS (SELECT name, GREATEST(LEAST((occurences-corrections)::DOUBLE PRECISION/occurences,1),0) FROM transformed."source"),
    rec (subset,probAll,sign) AS (
        SELECT ARRAY[name],prob,1 FROM probs
        UNION
        SELECT subset||c.name,probAll*c.prob,sign*-1
        FROM rec CROSS JOIN probs AS c
        WHERE subset[array_length(subset,1)] < c.name )
    SELECT * FROM rec
);

CREATE TABLE Transformed.ArticleRaw (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    name TEXT,
    brand TEXT,
    size TEXT,
    packagesize INT,
    amount REAL,
    unit TEXT,
    url TEXT,
    price NUMERIC(10,2),
    invoker TEXT REFERENCES Transformed.Invoker(name) ON UPDATE CASCADE ON DELETE SET NULL,
    invokerRefId INT,
    categories TEXT[],
    source TEXT, -- Shop e.g  
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


/* *************************************************************************************************
 * *************************************************************************************************
 * Brands
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */


CREATE TABLE Transformed.BrandDictionary (
    name Text PRIMARY KEY,
    occurences BIGINT NOT NULL DEFAULT 1,
    corrections BIGINT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transformed.BrandSource (
    brand Text REFERENCES Transformed.BrandDictionary(name) ON UPDATE CASCADE ON DELETE CASCADE,
    source Text REFERENCES Transformed.Source(name) ON UPDATE CASCADE ON DELETE CASCADE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (brand,source)
);

CREATE TABLE Transformed.BrandVerification (
    brand TEXT REFERENCES Transformed.BrandDictionary(name) ON UPDATE CASCADE ON DELETE CASCADE,
    userid UUID,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (brand,userid)
);

CREATE TABLE Transformed.BrandBlacklist (
    blockedString TEXT PRIMARY KEY,
    userid UUID,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transformed.BrandForce (
    tite TEXT PRIMARY KEY,
    brand TEXT REFERENCES Transformed.BrandDictionary(name) ON UPDATE CASCADE ON DELETE SET NULL,
    userid UUID,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW transformed.Brand AS (
SELECT name,
    CASE WHEN bf.brand IS NOT NULL THEN 1
        ELSE GREATEST(LEAST((bd.occurences-bd.corrections)/bd.occurences::DOUBLE PRECISION,1),0)
    END AS reliability 
FROM transformed.branddictionary bd
LEFT OUTER JOIN (SELECT DISTINCT brand FROM transformed.brandverification) bf ON bd.name=bf.brand
);

/* *************************************************************************************************
 * *************************************************************************************************
 * Product Names
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */

CREATE TABLE Transformed.ProductNameDictionary (
    name Text PRIMARY KEY,
    occurences BIGINT NOT NULL DEFAULT 1,
    corrections BIGINT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transformed.ProductNameSource (
    ProductName Text REFERENCES Transformed.ProductNameDictionary(name) ON UPDATE CASCADE ON DELETE CASCADE,
    source Text REFERENCES Transformed.Source(name) ON UPDATE CASCADE ON DELETE CASCADE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ProductName,source)
);

CREATE TABLE Transformed.ProductNameVerification (
    ProductName TEXT REFERENCES Transformed.ProductNameDictionary(name) ON UPDATE CASCADE ON DELETE CASCADE,
    userid UUID,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ProductName,userid)
);

CREATE TABLE Transformed.ProductNameBlacklist (
    blockedString TEXT PRIMARY KEY,
    userid UUID,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transformed.ProductNameForce (
    tite TEXT PRIMARY KEY,
    ProductName TEXT REFERENCES Transformed.ProductNameDictionary(name) ON UPDATE CASCADE ON DELETE SET NULL,
    userid UUID,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW transformed.ProductName AS (
SELECT name,
    CASE WHEN pf.ProductName IS NOT NULL THEN 1
        ELSE GREATEST(LEAST((pd.occurences-pd.corrections)/pd.occurences::DOUBLE PRECISION,1),0)
    END AS reliability 
FROM transformed.productnamedictionary pd
LEFT OUTER JOIN (SELECT DISTINCT ProductName FROM transformed.productnameverification) pf ON pd.name=pf.ProductName
);


/* *************************************************************************************************
 * *************************************************************************************************
 * Mining Logs
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */

CREATE TABLE transformed.PreprocessingLogBrand (
    transformation BIGINT PRIMARY KEY REFERENCES Transformed.ArticleRaw(id),
    blacklist TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE transformed.PreprocessingLogProductName (
    transformation BIGINT PRIMARY KEY REFERENCES Transformed.ArticleRaw(id),
    blacklist TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE transformed.MineLogSize (
    transformation BIGINT REFERENCES Transformed.ArticleRaw(id),
    packagesize INT,
    amount REAL,
    unit TEXT,
    likelihood DOUBLE PRECISION NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transformation)
);

CREATE TABLE transformed.MineLogBrand (
    transformation BIGINT REFERENCES Transformed.ArticleRaw(id),
    brand TEXT REFERENCES Transformed.BrandDictionary(name) ON UPDATE CASCADE ON DELETE CASCADE,
    likelihood DOUBLE PRECISION NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transformation,brand)
);
CREATE TABLE transformed.MineLogProductName (
    transformation BIGINT REFERENCES Transformed.ArticleRaw(id),
    productName TEXT REFERENCES Transformed.ProductNameDictionary(name) ON UPDATE CASCADE ON DELETE CASCADE,
    likelihood DOUBLE PRECISION NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transformation,ProductName)
);

CREATE TABLE transformed.DiscoverLogBrand (
    transformation BIGINT REFERENCES Transformed.ArticleRaw(id),
    brand TEXT,
    likelihood DOUBLE PRECISION NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transformation,brand)
);
CREATE TABLE transformed.DiscoverLogProductNam (
    transformation BIGINT REFERENCES Transformed.ArticleRaw(id),
    productName TEXT,
    likelihood DOUBLE PRECISION NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transformation,ProductName)
);

CREATE TABLE transformed.TransformationPhase (
    name TEXT PRIMARY KEY
);
INSERT INTO transformed.TransformationPhase VALUES ('original'), ('preprocessing'), ('mining'), ('discovering');

CREATE TABLE Transformed.Article (
    id BIGSERIAL PRIMARY KEY REFERENCES Transformed.ArticleRaw(id),
    title TEXT NOT NULL,
    name TEXT REFERENCES Transformed.ProductNameDictionary(name) ON UPDATE CASCADE ON DELETE SET NULL,
    likelihoodName DOUBLE PRECISION NOT NULL DEFAULT 0,
    nameFromTransformationPhase TEXT REFERENCES Transformed.TransformationPhase(name) ON UPDATE CASCADE ON DELETE SET NULL DEFAULT NULL,
    brand TEXT REFERENCES Transformed.BrandDictionary(name) ON UPDATE CASCADE ON DELETE SET NULL,
    likelihoodBrand DOUBLE PRECISION NOT NULL DEFAULT 0,
    brandFromTransformationPhase TEXT REFERENCES Transformed.TransformationPhase(name) ON UPDATE CASCADE ON DELETE SET NULL DEFAULT NULL,
    size TEXT,
    packagesize INT,
    amount REAL,
    unit TEXT,
    sizeFromTransformationPhase TEXT REFERENCES Transformed.TransformationPhase(name) ON UPDATE CASCADE ON DELETE SET NULL DEFAULT NULL,
    likelihoodSize DOUBLE PRECISION NOT NULL DEFAULT 0,
    url TEXT,
    price NUMERIC(10,2),
    invoker TEXT REFERENCES Transformed.Invoker(name) ON UPDATE CASCADE ON DELETE SET NULL,
    invokerRefId INT,
    categories TEXT[],
    source TEXT -- Shop e.g   
);



/* *************************************************************************************************
 * *************************************************************************************************
 * Units
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
--manually generated tables
CREATE TABLE transformed.UnitDictionary (
    name text  PRIMARY KEY,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO transformed.UnitDictionary ("name") VALUES ('mm');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('cl');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('cm');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('Anwendungen');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('ml');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('g');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('l');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('m');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('Stk');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('kg');
INSERT INTO transformed.UnitDictionary ("name") VALUES ('Paar');


CREATE TABLE transformed.UnitTranslation (
    alias text PRIMARY KEY,
    unit text NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Beutel','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Blatt','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Kapseln','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Klöße','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Riegel, ','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Röhrchen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Schoten','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('St.','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Stk.','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Stück','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Stück, ','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Taco-Shells','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Tücher','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Tüllen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('stück','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Liter','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Ltr','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('ltr PET','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('ltr.','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Gramm','g');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Meter','m');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Milliliter','ml');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Halter','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Kartuschen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Kerzen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('er','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Pads','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('ltr','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Riegel','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Bl','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Bratpapiere','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Dragees','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Streifen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Pk','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('alkoholgehalt','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Rolle','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Rollen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Scheiben','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Unterlagen','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Waschladungen','WL');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Waschladung','WL');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('SIM','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Spülgänge','Anwendungen');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('St','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Kilogramm','kg');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('G','g');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('KG','kg');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('kg','kg');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('ML','ml');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('Ml','ml');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('M','m');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('ST','Stk');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('L','l');
INSERT INTO transformed.UnitTranslation (alias,unit) VALUES ('WL','Anwendungen');



































GRANT USAGE ON SCHEMA transformed TO elisatransformer;
GRANT ALL ON ALL SEQUENCES IN SCHEMA transformed TO elisatransformer;
GRANT SELECT ON ALL TABLES IN SCHEMA transformed TO elisatransformer;
GRANT INSERT ON ALL TABLES IN SCHEMA transformed TO elisatransformer;
GRANT UPDATE ON ALL TABLES IN SCHEMA transformed TO elisatransformer;
GRANT DELETE ON ALL TABLES IN SCHEMA transformed TO elisatransformer;


CREATE OR REPLACE FUNCTION public.normalDistributionPDF(double precision,double precision,double precision)
 RETURNS double precision
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
    SELECT 1/($2*sqrt(2*Pi()))*exp(-($3-$1)*($3-$1)/(2*$2*$2));
$function$;

CREATE OR REPLACE FUNCTION public.exponentialDistributionPDF(double precision,double precision)
 RETURNS double precision
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
    SELECT $1*exp(-$1*$2);
$function$;