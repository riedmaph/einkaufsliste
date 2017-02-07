<<<<<<< HEAD
SELECT 
	market.id, 
	market.name, 
	market.latitude, 
	market.longditude, 
	market.street, 
	market.zip, 
	market.city, 
	(CASE WHEN LOWER(market.name)LIKE'%rewe%'THEN 'REWE' ELSE 'EDEKA' END) as shop,
	earth_distance(ll_to_earth(${latitude}, ${longditude}), ll_to_earth(market.latitude, market.longditude)) as distance
FROM 
	Transformed.Market market
WHERE 
	earth_box(ll_to_earth(${latitude}, ${longditude}), ${maxdistance}) @> ll_to_earth(market.latitude, market.longditude)
ORDER BY
	distance
;
=======
SELECT
  market.id, 
  market.name, 
  market.latitude, 
  market.longitude, 
  market.street, 
  market.zip, 
  market.city, 
  (CASE WHEN LOWER(market.name)LIKE'%rewe%'THEN 'REWE' ELSE 'EDEKA' END) as shop,
  earth_distance(ll_to_earth(${latitude}, ${longitude}), ll_to_earth(market.latitude, market.longitude)) as distance
FROM Grocerydata.Market market
WHERE 
	earth_box(ll_to_earth(${latitude}, ${longitude}), ${maxdistance}) @> ll_to_earth(market.latitude, market.longitude) -- Index search
	and earth_distance(ll_to_earth(${latitude}, ${longitude}), ll_to_earth(market.latitude, market.longitude)) < ${maxdistance} -- Filter out superfluous results after index search
ORDER BY  distance;
>>>>>>> master
