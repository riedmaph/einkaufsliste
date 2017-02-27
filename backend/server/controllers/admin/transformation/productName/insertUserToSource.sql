INSERT INTO $(schemaTransformed:raw).source
(name,occurences,corrections)
VALUES(${userid},1,0)
RETURNING *
