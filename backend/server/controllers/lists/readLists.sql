SELECT 
    list.id as id, 
    list.name as name, 
    CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item item WHERE item.list = list.id) as int) as count,
    CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item item WHERE item.list = list.id AND item.checked is not null) as int) as completed 
FROM 
    ${schemaname:raw}.List list
WHERE 
    list.enduser = ${userid}
ORDER BY 
	list.name
