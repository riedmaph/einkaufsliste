INSERT INTO  $(schemaTransformed:raw).minelogsize (transformation, packagesize, amount, unit, likelihood)
VALUES (${id}, ${packagesize}, ${amount}, ${unit},2) 
RETURNING *
;
