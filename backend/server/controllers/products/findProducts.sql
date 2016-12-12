SELECT name
FROM transformed.tag
WHERE LOWER(name) like LOWER('${searchstring:raw}%')
ORDER BY name ASC
LIMIT 20