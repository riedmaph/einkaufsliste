UPDATE $(schemaTransformed:raw)."source" SET corrections = corrections + t.count
FROM (SELECT ps."source",count(*) AS count FROM $(schemaTransformed:raw).productnameblacklist pl
  JOIN $(schemaTransformed:raw).productnamesource ps ON ps.productname=pl.blockedstring
  WHERE pl.blockedstring = ${string}
  GROUP BY ps."source") t
WHERE t."source" = "name";
