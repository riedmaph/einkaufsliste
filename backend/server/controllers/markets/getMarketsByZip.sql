SELECT market.id, market.name, market.latitude, market.longditude, market.street, market.zip, market.city
FROM Transformed.Market market
WHERE market.zip = ${zip}