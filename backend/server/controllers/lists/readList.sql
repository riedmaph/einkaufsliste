SELECT list.id as id, list.name as name, CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item item WHERE item.list = list.id) as int) as count 
FROM ${schemaname:raw}.List list
WHERE list.id = CASE WHEN LOWER(${id}) = 'default'
  THEN (SELECT enduser.recentlist FROM ${schemaname:raw}.EndUser WHERE enduser.id = ${userid})
  ELSE NULLIF(LOWER(${id}),'default')::UUID
  END
