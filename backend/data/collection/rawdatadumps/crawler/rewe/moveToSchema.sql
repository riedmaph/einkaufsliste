begin transaction;


DO language plpgsql $$
BEGIN
  RAISE NOTICE 'Drop all tables';
END
$$;

DROP TABLE IF EXISTS rewerawinsertshoptmp;
DROP TABLE IF EXISTS rewerawinsertcategorytmp;
DROP TABLE IF EXISTS rewerawinsertcategorytmp2;
DROP TABLE IF EXISTS rewerawinsertarticletmp;
DROP TABLE IF EXISTS rewerawinsertattributmp;

DO language plpgsql $$
BEGIN
	RAISE NOTICE 'Create tmp table';
END
$$;

CREATE TABLE rewerawinsertshoptmp AS
Select nextval('shop_sid_seq'::regclass) sid, base.* FROM (Select distinct 'REWE' as name, 'https://shop.rewe.de/' as url from rewerawdata) base;

CREATE TABLE rewerawinsertcategorytmp AS 
Select nextval('category_caid_seq'::regclass) as caid,base.*
FROM (
	Select distinct value as name,NULL::INTEGER as pcaid,sid,NULL::TEXT  as url
	from rewerawdata r cross join (Select * FROM rewerawinsertshoptmp where name='REWE' LIMIT 1) s 
	where key='Category'
) base;

CREATE TABLE rewerawinsertcategorytmp2 AS 
Select nextval('category_caid_seq'::regclass) as caid,base.*
FROM (
	Select distinct rc.value as name,cp.caid as pcaid,s.sid,NULL::TEXT  as url
	from rewerawdata rc join rewerawdata rp on rc.rowid=rp.rowid
	join rewerawinsertcategorytmp cp on cp.name = rp.value
	cross join (Select * FROM rewerawinsertshoptmp where name='REWE' LIMIT 1) s 
	where rc.key='Category2' and rp.key='Category'
) base;

CREATE TABLE rewerawinsertarticletmp AS
Select r1.rowid,nextval('article_arid_seq'::regclass) arid,r1.value as name,r1.source as url,cc.caid as caid
from rewerawdata r1 join rewerawdata rcc on r1.rowid=rcc.rowid
join rewerawdata rcp on r1.rowid=rcp.rowid
join rewerawinsertcategorytmp2 cc on cc.name=rcc.value
join rewerawinsertcategorytmp cp on cp.name=rcp.value and cc.pcaid=cp.caid
WHERE r1.key='Article' and rcc.key='Category2' and rcp.key='Category';


CREATE TABLE rewerawinsertattributmp AS
Select nextval('attribute_atid_seq'::regclass) as atid,r.key as name, r.value as content,at.arid
from rewerawdata r
join rewerawinsertarticletmp at on r.rowid=at.rowid;

DO language plpgsql $$
BEGIN
	RAISE NOTICE 'INSERT into tables';
END
$$;
INSERT into shop (sid,name,url)
Select * from rewerawinsertshoptmp;

INSERT INTO category (caid,name,pcaid,sid,url)
Select * from rewerawinsertcategorytmp;

INSERT INTO category (caid,name,pcaid,sid,url)
Select * from rewerawinsertcategorytmp2;

Insert INTO article (arid,name,url,caid)
Select arid,name,url,caid FROM rewerawinsertarticletmp;

Insert INTO attribute (atid,name,content,arid)
Select atid,name,content,arid FROM rewerawinsertattributmp;

DO language plpgsql $$
BEGIN
	RAISE NOTICE 'Drop tmp tables';END
$$;

DROP TABLE IF EXISTS rewerawinsertshoptmp;
DROP TABLE IF EXISTS rewerawinsertcategorytmp;
DROP TABLE IF EXISTS rewerawinsertcategorytmp2;
DROP TABLE IF EXISTS rewerawinsertarticletmp;
DROP TABLE IF EXISTS rewerawinsertattributmp;
commit;
