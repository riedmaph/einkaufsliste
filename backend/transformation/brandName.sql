-- Does productNames and brand Cleaning and mining


/*
 * 
 * Collect aready knwon data, i.e. brand and producct from crawled informtion or another table
 * 
 */
DROP TABLE transformation.brand;
CREATE TABLE  transformation.brand AS
SELECT DISTINCT brand FROM articlecleaned WHERE brand IS NOT null;
INSERT INTO transformation.brand SELECT DISTINCT brand FROM brand_extended WHERE brand NOT IN (SELECT brand FROM transformation.brand);

DROP TABLE transformation.productName;
CREATE TABLE  transformation.productName AS
SELECT DISTINCT name FROM articlecleaned WHERE name IS NOT null;

/*
 * 
 * Mine new brands, everything before a known product is a brand and that occures more than once
 * 
 */
DROP TABLE brand_b;
--mine new brands, everything before a known product is a brand 
CREATE TEMP TABLE brand_b AS
SELECT a.*, trim(substring(title FROM 0 FOR min(position(lower(' '||n.name) IN lower(a.title))))) brand_guess
FROM (SELECT id,title FROM articlecleaned WHERE name IS NULL) a CROSS JOIN (SELECT name FROM transformation.productName) n
WHERE position(lower(' '||n.name) IN lower(a.title))>0
GROUP BY a.id,a.title;

--Insert, with if there is enogh data (more than 10 times)
INSERT INTO transformation.brand
SELECT DISTINCT brand_guess FROM brand_b WHERE brand_guess NOT IN (SELECT brand FROM transformation.brand) GROUP BY brand_guess
HAVING count(*)>=10;


/*
 * 
 * Mine new products, everything between brand and unit
 * 
 */
DROP TABLE prods_b;
--get new products
CREATE TEMP TABLE prods_b AS
SELECT trim(substring(i.name_guess FROM 0 FOR COALESCE(NULLIF(position(lower(coalesce(t.packagesize::TEXT,t.amount::TEXT,t.unit::TEXT)) IN i.name_guess),0),9999))) name_guess FROM 
(SELECT a.*,trim(substring(title FROM max(position(lower(b.brand||' ') IN lower(a.title))+char_length(lower(b.brand||' '))) FOR 9999)) name_guess
FROM (SELECT id,title FROM articlecleaned WHERE brand IS NULL) a CROSS JOIN (SELECT brand FROM transformation.brand WHERE brand IS NOT NULL AND brand <> '') b
WHERE position(lower(b.brand||' ') IN lower(a.title))>0
GROUP BY a.id,a.title) i JOIN sizeTransforming t ON i.id=t.id;


INSERT INTO transformation.productName
SELECT name_guess FROM prods_b
WHERE name_guess NOT IN (SELECT DISTINCT name_guess FROM prods_b JOIN transformation.brand on lower(name_guess) LIKE lower(brand)||' %') AND name_guess ~ '^[^0-9]+$'
AND name_guess NOT IN (SELECT name FROM transformation.productName)
GROUP BY name_guess HAVING count(*) BETWEEN 2 AND 30;


/*
 * 
 * Add extra brands
 * 
 */

DROP TABLE brands_c;
--Move to Brands before constructive match!
CREATE TEMP TABLE brands_c AS
SELECT a.*, trim(substring(title FROM 0 FOR min(position(lower(' '||n.name) IN lower(a.title))))) brand_guess
FROM (SELECT id,title FROM articlecleaned WHERE id NOT IN (SELECT id FROM transformation.brandTransforming)) a CROSS JOIN (SELECT name FROM transformation.productName) n
WHERE position(lower(' '||n.name) IN lower(a.title))>0
GROUP BY a.id,a.title;

INSERT INTO transformation.brand
SELECT brand_guess
FROM brands_c WHERE brand_guess NOT IN (SELECT name FROM transformation.productName) AND brand_guess NOT IN (SELECT brand FROM transformation.brand) 
GROUP BY brand_guess HAVING count(*) > 1;



/*
 * 
 * Create brandTransforming
 * 
 */

DROP TABLE transformation.brandTransforming;
---now fill the table, already known ones 
CREATE TABLE transformation.brandTransforming AS
SELECT id, brand FROM articlecleaned WHERE brand IS NOT NULL AND brand <> '';

-- Do the constructive match, where the brand is given go for a max lengt match
INSERT INTO transformation.brandTransforming
SELECT a.id, substring(a.title FROM 0 FOR max(character_length(b.brand)+1))
FROM (SELECT id,title FROM articlecleaned WHERE id NOT IN (SELECT id FROM transformation.brandTransforming)) a 
JOIN (SELECT brand FROM transformation.brand WHERE NULLIF(brand,'') IS NOT null) b ON lower(a.title) LIKE lower(b.brand)||' %'
GROUP BY a.id,a.title;


/*
 * 
 * Insert nameTransforming
 * 
 */
--easy one,already known
CREATE TABLE nameTransforming AS
SELECT id,name FROM articlecleaned WHERE name IS NOT NULL;

--Already in productName, is uggly as if more are possible we take the longest match that occures first
WITH relevantNames AS (SELECT a.id,a.title,n.name
   FROM articlecleaned a, (SELECT * FROM transformation.productName WHERE name IS NOT NULL AND trim(name) <> '') n 
   WHERE a.id NOT IN (SELECT id FROM nameTransforming)
   AND a.title LIKE '%'||n.name||'%')
INSERT INTO nameTransforming
SELECT a.id,min(a.name) AS name
FROM af a 
join (SELECT id, max(character_length(name)) AS len,min(position(Lower(name) IN Lower(title))) AS pos FROM relevantNames GROUP BY id) m ON a.id = m.id AND character_length(a.name)=m.len
join (SELECT id, max(character_length(name)) AS len,min(position(Lower(name) IN Lower(title))) AS pos FROM relevantNames GROUP BY id) m2 ON a.id = m2.id AND character_length(a.name)=m2.len
WHERE CASE WHEN m.len<>m2.len THEN m.len<m2.len ELSE TRUE END
GROUP BY a.id;

DROP TABLE x;
-- GET NEW product names
CREATE TEMP TABLE prods_b AS
SELECT t.*,i.title, trim(substring(i.name_guess FROM 0 FOR COALESCE(NULLIF(position(lower(coalesce(t.packagesize::TEXT,t.amount::TEXT,t.unit::TEXT)) IN i.name_guess),0),9999))) name_guess
FROM (
   SELECT a.*,trim(substring(title FROM max(position(lower(b.brand||' ') IN lower(a.title))+char_length(lower(b.brand||' '))) FOR 9999)) name_guess
   FROM (
      SELECT id,title FROM articlecleaned WHERE id NOT IN (SELECT id FROM nametransforming)
   ) a
   CROSS JOIN (
      SELECT brand FROM transformation.brand WHERE brand IS NOT NULL AND brand <> ''
   ) b
   WHERE position(lower(b.brand||' ') IN lower(a.title))>0
   GROUP BY a.id,a.title
) i
JOIN sizeTransforming t ON i.id=t.id;

-- If no digits inside insert name
INSERT INTO nameTransforming
SELECT id,name_guess FROM prods_b WHERE name_guess<>'' AND name_guess !~* '\d' AND id NOT IN (SELECT id FROM nametransforming);

-- Get replace all digits, might be still ok
INSERT INTO nameTransforming
SELECT * FROM (
SELECT id,trim(substring(name_guess FROM '^[^\d]+')) AS name FROM prods_b WHERE id NOT IN (SELECT id FROM nametransforming) AND name_guess<>''
) x WHERE name IS NOT NULL AND name <> '';
