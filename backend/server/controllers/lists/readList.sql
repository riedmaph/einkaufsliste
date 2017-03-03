SELECT list.id as id, list.name as name, CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item item WHERE item.list = list.id) as int) as count 
FROM ${schemaname:raw}.List list
WHERE list.id = COALESCE(${id}, (SELECT enduser.recentlist FROM ${schemaname:raw}.EndUser WHERE enduser.id = ${userid}))
