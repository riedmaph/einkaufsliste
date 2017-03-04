INSERT INTO $(schemaTransformed:raw).productnameforce
(title,productname, userid)
VALUES(${title},${target}, ${userid})
RETURNING *
