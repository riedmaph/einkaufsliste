SELECT o.id, o.title, o.market, o.offerprice, o.offerfrom, o.offerto, o.discount, a.name as articlename, a.brand as articlebrand
FROM Grocerydata.offer o
JOIN Grocerydata.article a ON o.article = a.id
WHERE LOWER(a.name) like LOWER('%${name:raw}%')
AND o.market in (SELECT market FROM ${schemaname:raw}.favouritemarket WHERE enduser = ${userid})