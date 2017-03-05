SELECT o.id, o.title, o.market, o.offerprice, o.offerfrom, o.offerto, o.discount, a.name as articlename, a.brand as articlebrand, m.id as marketid, m.name as marketname, m.street as marketstreet, m.zip as marketzip, m.city as marketcity
FROM Grocerydata.offer o
LEFT JOIN Grocerydata.article a ON o.article = a.id
JOIN Grocerydata.market m ON o.market = m.id
WHERE (LOWER(a.brand || ' ' || a.name) like LOWER('%${name:raw}%') OR LOWER(a.name || ' ' || a.brand) like LOWER('%${name:raw}%') OR LOWER(o.title) like LOWER('%${name:raw}%'))
AND o.market in (SELECT market FROM ${schemaname:raw}.favouritemarket WHERE enduser = ${userid})