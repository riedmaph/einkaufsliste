SELECT market.id, market.name, market.latitude, market.longditude, market.street, market.zip, market.city, (CASE WHEN LOWER(market.name)LIKE'%rewe%'THEN 'REWE' ELSE 'EDEKA' END) as shop
FROM Transformed.Market market
WHERE earth_box(ll_to_earth(${latitude}, ${longditude}), ${maxdistance}) @> ll_to_earth(market.latitude, market.longditude);