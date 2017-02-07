SELECT id, size, packagesize, coalesce(sizeAmount::REAL,amount) AS amount, coalesce(wpa.unit,SizeUnit,t.unit) AS unit
FROM
  (SELECT id,
    size,
    coalesce(packagesize::INT,substring(a.size from '(\d+) ?[xà]')::INT) packagesize,
    regexp_replace(substring(a.size from '[0-9]*,?[0-9]+(?!.*[xà])'),',','.') SizeAmount,
    substring(a.size from '[0-9]*[,.]?[0-9]+(?!.*[xà])[\s\d+-]*?(\w*)') SizeUnit,
    amount,
    coalesce(ua.unit,a.unit) as unit
  FROM $(schemaTransformed:raw).articleraw a 
  LEFT OUTER JOIN  $(schemaTransformed:raw).UnitTranslation ua ON a.unit=ua.alias
  WHERE a.unit <> ''
  AND id = $(id:raw)) t
left outer join  $(schemaTransformed:raw).UnitTranslation wpa on t.sizeUnit=wpa.alias
UNION ALL
SELECT id, size,packagesize,amount,coalesce(u.name,ut.unit) AS unit
  FROM
  (SELECT id,
    size,
    coalesce(packagesize::INT,substring(a.size from '(\d+) ?[xà]')::INT) packagesize,
    regexp_replace(substring(a.size from '[0-9]*,?[0-9]+(?!.*[xà])'),',','.')::REAL amount,
    substring(a.size from '[0-9]*[,.]?[0-9]+(?!.*[xà])[\s\d+-]*?(\w*)') unit
    FROM $(schemaTransformed:raw).articleraw a
    WHERE a.unit = '' OR a.unit IS NULL
    AND id = $(id:raw)) t
LEFT OUTER JOIN $(schemaTransformed:raw).UnitTranslation ut ON t.unit = ut.alias
LEFT OUTER JOIN $(schemaTransformed:raw).UnitDictionary u ON t.unit = u.name;
