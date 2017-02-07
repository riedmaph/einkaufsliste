SELECT a.id,a.title,b.name as brand,
  b.reliability*
    normalDistributionPDF(character_length(a.title)::Double PRECISION/2,10,character_length(b.name))*
    exponentialDistributionPDF(0.9,position(b.name IN a.title))
  AS likelihood
FROM $(schemaTransformed:raw).articleraw a
JOIN $(schemaTransformed:raw).brand b ON a.title LIKE '%'||b.name||'%'
WHERE id = ${id}
AND b.name not in (Select blockedString FROM $(schemaTransformed:raw).BrandBlacklist);
