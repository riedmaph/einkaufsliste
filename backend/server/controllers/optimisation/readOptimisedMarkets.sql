SELECT market.id, market.name, market.latitude, market.longitude, market.street, market.zip, market.city, (CASE WHEN LOWER(market.name)LIKE'%rewe%'THEN 'REWE' ELSE 'EDEKA' END) as shop
FROM Grocerydata.Market market
JOIN ${schemaname:raw}.OptimisedListMarket olistmarket ON market.id = olistmarket.market
WHERE olistmarket.optimisedlist = ${optimisedlistid}
ORDER BY market.id