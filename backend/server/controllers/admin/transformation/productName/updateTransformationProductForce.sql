UPDATE $(schemaTransformed:raw).article
SET name = pf.name, likelihoodname = 1, nametransformationphase='forcing', transformationtime=now()
FROM (SELECT *
  FROM $(schemaTransformed:raw).productnameforce pf
  WHERE pf.title=title)
WHERE id = ${id};
