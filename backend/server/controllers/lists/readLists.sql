WITH 
	lists as (
		select 
			id, 
			"name", 
			0 as shared,
			NULL as owner
		from ${schemaname:raw}.list 
		where enduser=${userid}
		
		union
		
		select 
			l.id, 
			"name", 
			1 as shared,
			u.email as owner
		from 
			${schemaname:raw}.listshare s 
			inner join ${schemaname:raw}.list l on s.list = l.id 
			inner join ${schemaname:raw}.enduser u on l.enduser=u.id
		where s.enduser=${userid}
	)
	
SELECT
	l.id, 
    l."name", 
    CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item i WHERE i.list = l.id) as int) as "count",
    CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item i WHERE i.list = l.id AND i.checked is not null) as int) as completed,
    l.shared,
    l.owner
FROM 
	lists l
ORDER BY 
	l.shared, l."name";