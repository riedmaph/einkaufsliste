INSERT INTO transformed.article
(id, title, "name", likelihoodname, namefromtransformationphase, brand, likelihoodbrand, brandfromtransformationphase, "size", packagesize, amount, unit, likelihoodsize, sizefromtransformationphase, url, price, "invoker", invokerrefid, categories, "source")
SELECT a.id, a.title,
    COALESCE(a.name,mlp.productname), COALESCE(mlp.likelihood,1), CASE WHEN a.name IS NOT NULL THEN 'original' WHEN mlp.productname IS NOT NULL THEN 'mining' ELSE NULL END,
    COALESCE(a.brand,mlb.brand), COALESCE(mlb.likelihood,1), CASE WHEN a.brand IS NOT NULL THEN 'original' WHEN mlb.brand IS NOT NULL THEN 'mining' ELSE NULL END,
    "size", COALESCE(a.packagesize,mls.packagesize), COALESCE(a.amount,mls.amount), COALESCE(a.unit,mls.unit), COALESCE(mls.likelihood,1), CASE WHEN mls.amount IS NULL THEN 'mining' ELSE 'original' END,
    a.url, a.price, a."invoker", a.invokerrefid, a.categories, a."source"
FROM
$(schemaTransformed:raw).articleraw a
LEFT OUTER JOIN (
  SELECT o.*
  FROM $(schemaTransformed:raw).minelogsize o
  JOIN (SELECT transformation, max(likelihood) max FROM $(schemaTransformed:raw).minelogsize WHERE transformation=${id} GROUP BY transformation) m ON o.transformation=m.transformation AND o.likelihood=m.max
  WHERE o.transformation=${id}
) mls ON a.id = mls.transformation AND a.packagesize IS NULL AND a.amount IS NULL AND a.unit IS NULL
LEFT OUTER JOIN  (
SELECT o.*
  FROM $(schemaTransformed:raw).minelogbrand o
  JOIN (SELECT transformation, max(likelihood) max FROM $(schemaTransformed:raw).minelogbrand WHERE transformation=${id} GROUP BY transformation) m ON o.transformation=m.transformation AND o.likelihood=m.max
  WHERE o.transformation=${id}
) mlb ON a.id = mlb.transformation AND a.brand IS NULL
LEFT OUTER JOIN  (
SELECT o.*
  FROM $(schemaTransformed:raw).minelogproductname o
  JOIN (SELECT transformation, max(likelihood) max FROM $(schemaTransformed:raw).minelogproductname WHERE transformation=${id} GROUP BY transformation) m ON o.transformation =m.transformation AND o.likelihood=m.max
  WHERE o.transformation=${id}
) mlp ON a.id = mlp.transformation AND a.name IS NULL
WHERE a.id=${id}
RETURNING *;
