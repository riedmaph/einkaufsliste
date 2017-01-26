SELECT market.id, market.name, market.latitude, market.longitude, market.street, market.zip, market.city
FROM Grocerydata.Market market
WHERE earth_box(ll_to_earth(${latitude}, ${longitude}), ${maxdistance}) @> ll_to_earth(market.latitude, market.longitude);