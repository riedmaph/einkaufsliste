SELECT list.id as id, list.name as name, (SELECT COUNT(*) FROM ${schemaname:raw}.Item item WHERE item.list = list.id) as count 
FROM ${schemaname:raw}.List list
WHERE list.enduser = ${userid}