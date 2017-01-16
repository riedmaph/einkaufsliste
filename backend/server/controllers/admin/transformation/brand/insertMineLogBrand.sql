INSERT INTO $(schemaTransformed:raw).minelogbrand
(transformation, brand, likelihood)
VALUES(${id},${brand}, ${likelihood})
RETURNING *
;
