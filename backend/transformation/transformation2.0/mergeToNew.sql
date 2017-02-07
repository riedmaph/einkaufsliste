/* *************************************************************************************************
 * *************************************************************************************************
 * Brands
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
DELETE FROM transformed.branddictionary;

INSERT INTO transformed.branddictionary (name,occurences,corrections)
SELECT brand, count(*), 0 FROM crawled.article WHERE brand <> '' GROUP BY brand;

UPDATE transformed.branddictionary SET occurences = occurences+1
WHERE name IN (SELECT name FROM transformed.branddictionary);

INSERT INTO transformed.branddictionary (name,occurences,corrections)
SELECT brand,2,0 FROM public.brandl WHERE brand <> ''
AND public.brandl.brand NOT IN (SELECT name FROM transformed.branddictionary);

INSERT INTO transformed.brandsource (brand,source)
SELECT brand,shop
FROM (
    SELECT a.id,min(brand) brand,min(shop.name) shop 
    FROM crawled.article a JOIN crawled.category c ON a.category=c.id JOIN crawled.shop ON c.shop=shop.id
    GROUP BY a.id
) t
WHERE t.brand <> '' GROUP BY t.brand,shop;

/* *************************************************************************************************
 * *************************************************************************************************
 * ProdcutNames
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
INSERT INTO transformed.productnamedictionary (name,occurences,corrections)
SELECT cleanString(name), count(*),0 FROM crawled.article WHERE cleanString(name) <> '' AND character_length(cleanString(name))>3 GROUP BY cleanString(name);

INSERT INTO transformed.productnamesource (productname,source)
SELECT cleanString(name), 'edeka.de' FROM crawled.article WHERE cleanString(name) <> '' GROUP BY cleanString(name);


/* *************************************************************************************************
 * *************************************************************************************************
 * Already Mined brands
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
CREATE TEMP TABLE brandtemp AS
SELECT brand AS name,count(*),0
FROM brandtransforming
WHERE brand NOT IN (SELECT b.name FROM transformed.branddictionary b)
GROUP BY brand;

INSERT INTO transformed.branddictionary (name,occurences,corrections)
SELECT * FROM brandtemp;

INSERT INTO transformed.brandsource
SELECT name, '#oldtransformation'
FROM brandtemp;

UPDATE transformed.SOURCE SET occurences=occurences+(SELECT count(*) FROM brandtemp) WHERE name='#oldtransformation';

DROP TABLE brandtemp;

SELECT * FROM transformed.brandsource;


/* *************************************************************************************************
 * *************************************************************************************************
 * Already mined product Names
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
CREATE TEMP TABLE prodtemp AS
SELECT cleanString(name) AS name,count(*),0
FROM nametransforming
WHERE cleanString(name) NOT IN (SELECT p.name FROM transformed.productnamedictionary p)
GROUP BY cleanString(name);

INSERT INTO transformed.productnamedictionary (name,occurences,corrections)
SELECT * FROM prodtemp;

INSERT INTO transformed.productnamesource
SELECT name, '#oldtransformation'
FROM prodtemp;

UPDATE transformed.SOURCE SET occurences=occurences+(SELECT count(*) FROM prodtemp) WHERE name='#oldtransformation';

DROP TABLE prodtemp;

/* *************************************************************************************************
 * *************************************************************************************************
 * Categories
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
INSERT INTO transformed.categorytagsdictionary
SELECT DISTINCT trim(name),1 FROM transformed_old.tag FULL OUTER JOIN transformed_old.articletag a ON tag.id=a.tag WHERE preference=1;


INSERT INTO transformed.categorytagsdictionary
SELECT DISTINCT trim(name),3 FROM transformed_old.tag FULL OUTER JOIN transformed_old.articletag a ON tag.id=a.tag WHERE tag.name NOT IN (SELECT name FROM transformed.categorytagsdictionary); 


/* *************************************************************************************************
 * *************************************************************************************************
 * Crawled Articlesac
 * *************************************************************************************************
 * *************************************************************************************************
 * *************************************************************************************************
 */
INSERT INTO transformed.articleraw
(title, "name", brand, "size", packagesize, amount, unit, url, price, "invoker", invokerrefid, categories, "source")
WITH RECURSIVE cp(id, parent,inherit) AS (
   SELECT id,parent,id,name
   FROM crawled.category
   UNION ALL
   SELECT p.id,p.parent,c.inherit,p.name
   FROM crawled.category p
   JOIN cp c ON c.parent =p.id
),
cats AS (SELECT id AS target,inherit AS SOURCE FROM cp),
cat AS (SELECT a.id, ARRAY_agg(trim(cat.name) ORDER BY cat.id) AS cats FROM crawled.article a JOIN cats c ON a.category=c.SOURCE JOIN crawled.category cat ON c.TARGET=cat.id GROUP BY a.id),
shopname AS (SELECT a.id AS aid, min(s.name) shopname FROM crawled.article a JOIN crawled.category c ON a.category=c.id JOIN crawled.shop s ON s.id=c.shop GROUP BY a.id)
SELECT a.title,cleanString(a.name),a.brand,a.SIZE,a.packagesize,a.amount,a.unit,a.url,a.price,'crawler',a.id,cat.cats,s.shopname
FROM crawled.article a
JOIN shopname s ON a.id =s.aid
LEFT OUTER JOIN cat ON a.id=cat.id;



