begin transaction;


DO language plpgsql $$
BEGIN
  RAISE NOTICE 'Drop all tables';
END
$$;


DROP TABLE IF EXISTS rewerawinsertshoptmp;
DROP TABLE IF EXISTS rewerawinsertcategorytmp;
DROP TABLE IF EXISTS rewerawinsertarticletmp;
DROP TABLE IF EXISTS rewerawinsertattributmp;

DO language plpgsql $$
BEGIN
	RAISE NOTICE 'Create tmp table';
END
$$;

CREATE TABLE rewerawinsertshoptmp AS
Select nextval('shop_sid_seq'::regclass) sid, base.* FROM (Select distinct 'REWE' as name, source as url from rewerawdata) base;

CREATE TABLE rewerawinsertcategorytmp AS 
Select nextval('category_caid_seq'::regclass) as caid,base.* FROM (Select distinct value as name,NULL::INTEGER as pcaid,sid,source  as url from rewerawdata r join rewerawinsertshoptmp s on r.source=s.url where key='Category') base;

CREATE TABLE rewerawinsertarticletmp AS
Select r1.rowid,nextval('article_arid_seq'::regclass) arid,r1.value as name,r1.source as url,c.caid as caid from rewerawdata r1 join rewerawdata r2 on r1.title=r2.title and r1.source=r2.source and r1.rowid=r2.rowid join rewerawinsertcategorytmp c on c.name=r2.value and c.url=r2.source WHERE r1.key='Article' and r2.key='Category';

CREATE TABLE rewerawinsertattributmp AS
Select nextval('attribute_atid_seq'::regclass) as atid,r.key as name, r.value as content,at.arid from rewerawdata r join rewerawinsertarticletmp at on r.rowid=at.rowid;

DO language plpgsql $$
BEGIN
	RAISE NOTICE 'INSERT into tables';
END
$$;
INSERT into shop (sid,name,url)
Select * from rewerawinsertshoptmp;

INSERT INTO category (caid,name,pcaid,sid,url)
Select * from rewerawinsertcategorytmp;

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
DROP TABLE IF EXISTS rewerawinsertarticletmp;
DROP TABLE IF EXISTS rewerawinsertattributmp;
commit;

