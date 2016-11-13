with 
	fields as (
		select
			row_number() over (order by x.name) id,
			x.name fld
		from crawled."attribute" x 
			inner join crawled.article a on x.article=a.id 
			inner join crawled.category c on a.category=c.id
			inner join crawled.shop s on c.shop=s.id
		where s.name='rewe-api'
		group by x.name
	),
	selects as (
		select 
			string_agg(', x' || id || '.content "' || fld || '"', '' order by id) exp
		from fields
	),
	ljoins as (
		select 
			string_agg(' left join crawled.attribute x' || id || ' on x' || id || '.article = a.id and x' || id || '.name=''' || fld || '''', '') as exp
		from fields
	)
	
select 
	'SELECT a.id, a.title' || s.exp || 
	' FROM crawled.article a inner join crawled.category c on a.category=c.id inner join crawled.shop s on c.shop=s.id ' || 
	j.exp ||
	' WHERE s.name=''rewe-api''' as qrystr
from selects s, ljoins j