SELECT 
	list.id as id, 
	list.name as name, 
	CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item item WHERE item.list = list.id) as int) as count,
	exists (select enduser from ${schemaname:raw}.listshare s where s.list=list.id ) as shared
FROM 
	${schemaname:raw}.List list
WHERE 
	list.id = ${id}