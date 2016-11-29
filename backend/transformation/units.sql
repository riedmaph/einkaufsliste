DROP TABLE transformed.sizeTransforming;
CREATE TABLE transformed.sizeTransforming AS
SELECT id, size, packagesize, coalesce(sizeAmount::REAL,amount) AS amount, coalesce(wpa.unit,SizeUnit,withPack.unit) AS unit, url FROM
   (SELECT id, name, brand, size, coalesce(packagesize::TEXT,
   substring(a.size from '(\d+) ?x')) packagesize,
   regexp_replace(substring(a.size from '[0-9]*,?[0-9]+(?!.*x)'),',','.') SizeAmount, substring(a.size from '[0-9]*[,.]?[0-9]+(?!.*x)[\s\d+-]*?(\w*)') SizeUnit,
   amount,
   coalesce(ua.unit,a.unit) as unit,
   url
   from articleCleaned a 
   left outer join transformed.unit_translation ua on a.unit=ua.alias
   where a.unit is not NULL) withPack
left outer join transformed.unit_translation wpa on withPack.sizeUnit=wpa.alias;

INSERT INTO transformed.sizeTransforming
SELECT id,SIZE,packagesize,amount,coalesce(u.name,ut.unit) AS unit,url
   FROM
   (SELECT id, brand,SIZE,
   substring(a.size from '(\d+) ?[xà]')::INT packagesize,
   regexp_replace(substring(a.size from '[0-9]*,?[0-9]+(?!.*[xà])'),',','.')::REAL amount,
   substring(a.size from '[0-9]*[,.]?[0-9]+(?!.*[xà])[\s\d+-]*?(\w*)') unit,
   url
   FROM articleCleaned a 
   WHERE id not IN (SELECT id FROM sizeTransforming)) t
LEFT OUTER JOIN transformed.unit_translation ut ON t.unit = ut.alias
LEFT OUTER JOIN transformed.unit u ON t.unit = u.name;

SELECT distinct unit FROM  transformed.sizetransforming;





