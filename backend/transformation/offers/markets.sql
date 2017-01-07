INSERT INTO transformed.market Select id,name,latitude,longditude,extid,shop,street,zip,city FROM crawled.market;
