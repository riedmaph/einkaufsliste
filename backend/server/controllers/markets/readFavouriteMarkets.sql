SELECT market.id, market.name, market.latitude, market.longditude, market.street, market.zip, market.city
FROM Transformed.Market market
JOIN ${schemaname:raw}.Favouritemarket favmarket ON market.id = favmarket.market
WHERE favmarket.enduser = ${userid}