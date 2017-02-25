SELECT a.id,a.title,p.name as productname,
  p.reliability*
    exponentialDistributionPDF(1/(character_length(a.title)::Double PRECISION/2),character_length(a.title)-character_length(p.name))*
    normalDistributionPDF(character_length(a.title)::Double PRECISION/2,character_length(a.title)::Double PRECISION/2,position(p.name in a.title))
  AS likelihood
FROM $(schemaTransformed:raw).articleraw a
JOIN $(schemaTransformed:raw).productName p ON a.title LIKE '%'||p.name||'%'
WHERE id = ${id}
AND p.name not in (Select blockedString FROM $(schemaTransformed:raw).ProductNameBlacklist);
