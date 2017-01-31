WITH 
	lists as (
		select 
			id, 
			"name", 
			0 as shared 
		from ${schemaname:raw}.list 
		where enduser=${userid}
		
		union
		
		select 
			l.id, 
			concat('⿻ ',l."name") as "name", 
			1 as shared 
		from ${schemaname:raw}.listshare s inner join ${schemaname:raw}.list l on s.list = l.id 
		where s.enduser=${userid}
	)
	
SELECT
	l.id, 
    l."name", 
    CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item i WHERE i.list = l.id) as int) as "count",
    CAST((SELECT COUNT(*) FROM ${schemaname:raw}.Item i WHERE i.list = l.id AND i.checked is not null) as int) as completed 
FROM 
	lists l
ORDER BY 
	l.shared, l."name";