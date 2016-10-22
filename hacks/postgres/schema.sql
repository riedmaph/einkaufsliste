
--DROP database IF EXISTS shoppinglist;
--create database shoppinglist;

DROP table IF EXISTS ArticleDetails CASCADE;
DROP table IF EXISTS Article CASCADE;
DROP table IF EXISTS Category CASCADE;
DROP table IF EXISTS Shop CASCADE;

create table Shop (
	ID serial primary key,					-- id
	"Name" varchar(100) not null,			-- description
	URL varchar(100)						-- url
);

create table Category (
	ID serial primary key,					-- id
	parent int references Category,			-- parent category / NULL for top-level categories
	"Name" varchar(255) not null,			-- category name
	shop int references Shop,				-- shop key
	url varchar(255) null					-- url to retrieve corresponding articles
);

create table Article (
	ID serial primary key,					-- id
	"Name" varchar(255) not null,			-- description
	artno varchar(100),						-- (external) article number
	url varchar(255) null,					-- url to retrieve article details
	category int references Category,		-- category in which the article was found
	price numeric(12,2),					-- article price
	amount float,							-- amount in unit
	unit varchar(10),						-- unit for amount
	data text								-- additional information (maybe use ArticleDetails instead)
);

create table ArticleDetails (
	article int references Article not null,	-- article
	field varchar(255) not null,				-- field name
	value text,									-- field value
	constraint pk_articledetails primary key (article, field)
);