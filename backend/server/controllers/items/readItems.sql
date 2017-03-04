SELECT * 
FROM ${schemaname:raw}.Item 
WHERE list = ${listid}
ORDER BY position
