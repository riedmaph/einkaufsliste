SELECT *
FROM $(schemaTransformed:raw).source
WHERE name = ${userid};
