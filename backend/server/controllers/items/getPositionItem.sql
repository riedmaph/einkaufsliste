SELECT COALESCE(MAX(position),-1) as maxposition
FROM ${schemaname:raw}.Item
WHERE list = ${listid}