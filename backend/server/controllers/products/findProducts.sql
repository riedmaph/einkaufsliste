SELECT name
FROM Grocerydata.categorytag
WHERE LOWER(name) like LOWER('%${searchstring:raw}%')
ORDER BY name ASC
LIMIT 20