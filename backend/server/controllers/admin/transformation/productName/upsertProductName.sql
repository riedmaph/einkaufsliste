WITH upsert AS
(UPDATE $(schemaTransformed:raw).productnamedictionary
  SET occurences=occurences+1
  WHERE name = ${productName}
  RETURNING name)
INSERT INTO $(schemaTransformed:raw).productnamedictionary
(name,occurences,corrections)
Select ${productName},1,0
WHERE NOT EXISTS (SELECT name FROM upsert)
RETURNING *;
