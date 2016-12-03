/*
 * This files converts categories to tags. If possible the rewe id is taken
 * 
 * Afterwards new tags are generate and assigned. When:
 * a) for each name from rewe if all entries with this name have the same tag, we infer that every item in the database gets this tag
 * b) same for brand 
 */
DELETE FROM transformed.tag;

DROP TABLE tagging;
--Flatten
CREATE TEMP TABLE tagging AS
WITH RECURSIVE cp(id, parent,inherit) AS (
   SELECT id,parent,id
   FROM crawled.category
   UNION ALL
   SELECT p.id,p.parent,c.inherit
   FROM crawled.category p
   JOIN cp c ON c.parent =p.id
)
SELECT id AS target,inherit AS SOURCE FROM cp;

DROP TABLE rewenormalisation;
--Rewe applie Normalisation
CREATE TEMP TABLE rewenormalisation AS
SELECT c.id AS SOURCE,r.id AS target FROM crawled.category c
JOIN (
   SELECT *
   FROM crawled.category
   WHERE shop=(SELECT id FROM crawled.shop WHERE name='rewe')
   ) r 
ON c.name=r.name;

--Get rid of duplicates which were not in rewe
CREATE TEMP TABLE normalisation AS
SELECT name, unnest(agg) AS SOURCE, target
FROM (
   SELECT name,array_agg(id) AS agg,min(id) AS target
   FROM crawled.category
   WHERE "name" NOT IN (SELECT name FROM crawled.category WHERE shop = (SELECT id FROM crawled.shop WHERE name='rewe'))
   GROUP BY name
) g;

--ned this table first to generate tag and than we can do this
CREATE TEMP TABLE articletagTemp AS
SELECT a.id AS article, coalesce(r.target,n.target,t.target) AS tag,CASE WHEN r.target IS NOT NULL THEN 1 ELSE 3 END AS  preference
FROM crawled.article a
LEFT OUTER JOIN tagging t
ON a.category=t.SOURCE
LEFT OUTER JOIN rewenormalisation r ON t.target=r.SOURCE
LEFT OUTER JOIN normalisation n ON t.target=n.SOURCE;

--insert only needed once
INSERT INTO transformed.tag
SELECT id,name FROM crawled.category WHERE id IN (SELECT tag FROM  articletagTemp);

-- Not tag is filled so we can insert
INSERT INTO transformed.articletag SELECT * FROM articletagTemp;


/*
 * 
 * Generate new tags based on information
 * 
 */
-- New tags with name
-- for each name from rewe if all entries with this name have the same tag, we infer that every item in the database gets this tag
WITH rewetaged AS (SELECT * FROM transformed.articletag WHERE preference =1),
nametag AS (SELECT a.name,r.tag, count(*) FROM transformed.article a JOIN rewetaged r ON a.id=r.article GROUP BY a.name,r.tag),
name AS (SELECT a.name,count(*) FROM transformed.article a JOIN rewetaged r ON a.id=r.article GROUP BY a.name),
newtag AS (SELECT DISTINCT nt.name, nt.tag FROM nametag nt JOIN name n ON nt.name=n.name AND nt.count=n.count)
Insert INTO transformed.articletag
SELECT id,tag,2 FROM transformed.article a JOIN newtag t ON a.name=t.name WHERE Row(a.id,t.tag) NOT IN (SELECT article, tag FROM transformed.articletag);

-- New tags with brand
WITH rewetaged AS (SELECT * FROM transformed.articletag WHERE preference =1),
brandtag AS (SELECT a.brand,r.tag, count(*) FROM transformed.article a JOIN rewetaged r ON a.id=r.article GROUP BY a.brand,r.tag),
brand AS (SELECT a.brand,count(*) FROM transformed.article a JOIN rewetaged r ON a.id=r.article GROUP BY a.brand),
newtag AS (SELECT DISTINCT nt.brand, nt.tag FROM brandtag nt JOIN brand n ON nt.brand=n.brand AND nt.count=n.count)
Insert INTO transformed.articletag
SELECT id,tag,2 FROM transformed.article a JOIN newtag t ON a.brand=t.brand WHERE Row(a.id,t.tag) NOT IN (SELECT article, tag FROM transformed.articletag);




