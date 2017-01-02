SELECT *
FROM transformed.market
WHERE earth_box( ll_to_earth(48.174751, 11.633622), 300) @> ll_to_earth(latitude, longditude);