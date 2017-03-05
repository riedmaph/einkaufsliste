SELECT id, position, name, amount, unit
FROM ${schemaname:raw}.Item 
WHERE list = ${listid}
ORDER BY position asc