SELECT name
FROM grocerydata.categorytag
WHERE LOWER(name) like LOWER('%${searchstring:raw}%')
ORDER BY name ASC
LIMIT 20