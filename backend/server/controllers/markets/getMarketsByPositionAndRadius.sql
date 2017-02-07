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
WHERE earth_distance(ll_to_earth(${latitude}, ${longitude}), ll_to_earth(market.latitude, market.longitude)) <  ${maxdistance}
ORDER BY  distance;