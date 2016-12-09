SELECT name
FROM transformed.tag
WHERE LOWER(name) like LOWER('${searchstring:raw}%')
LIMIT 20