INSERT INTO $(schemaTransformed:raw).productnamesource
(productName, source)
Select ${productName},${userid}
WHERE NOT EXISTS (SELECT * FROM $(schemaTransformed:raw).productnamesource WHERE productName=${productName} AND  source=${userid})
RETURNING *
