UPDATE $(schemaTransformed:raw).source
SET occurences=occurences+1
WHERE name = ${userid}
RETURNING *;
