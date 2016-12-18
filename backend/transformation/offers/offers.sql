WITH relevantNames AS (SELECT a.id,a.title,n.name
   FROM crawled.offer a, (SELECT * FROM transformed.productName WHERE name IS NOT NULL AND trim(name) <> '') n
   WHERE title IS NOT null
   AND a.title LIKE '%'||n.name||'%'),
nameGot AS (
SELECT a.id AS nid,min(a.name) AS name
FROM relevantNames a join (SELECT id, max(character_length(name)) AS len,min(position(Lower(name) IN Lower(title))) AS pos FROM relevantNames GROUP BY id) m ON a.id = m.id AND character_length(a.name)=m.len
join (SELECT id, max(character_length(name)) AS len,min(position(Lower(name) IN Lower(title))) AS pos FROM relevantNames GROUP BY id) m2 ON a.id = m2.id AND character_length(a.name)=m2.len
WHERE CASE WHEN m.len<>m2.len THEN m.len<m2.len ELSE TRUE END
GROUP BY a.id),
brandGot AS (SELECT a.id AS bid, substring(a.title FROM 0 FOR max(character_length(b.brand)+1)) AS brandG
FROM (SELECT id,cleanString(title) title, lower(cleanString(title)) titlej, left(lower(cleanString(title)),3) fast_join  FROM crawled.offer) a
JOIN (SELECT lower(brand)||' %' brand,left(lower(brand),3) fast_join FROM transformed.brand WHERE brand<>'' AND brand IS NOT null) b ON a.fast_join=b.fast_join
WHERE a.titlej LIKE b.brand
GROUP BY a.id,a.title)
Insert into transformed.offer
SELECT id,
trim(cleanString(entity2char(COALESCE(title, substring(description FROM (position('<strong>' IN description)+char_length('<strong>')) for (GREATEST(0,position('</strong>' IN description) - (position('<strong>' IN description)+char_length('<strong>'))))))))) AS title,
price::DOUBLE PRECISION,
offerfrom::DATE,
offerto::DATE,
COALESCE(brand,bg.brandG),
ng.name,
size,
discount,
productid,
minimumquantityfordiscount,
extid,
market::INTEGER,
description
FROM crawled.offer
LEFT OUTER JOIN nameGot ng ON ng.nid=id
LEFT OUTER JOIN brandGot bg ON bg.bid=id;
