SELECT o.id, o.market, o.offerprice, o.offerfrom, o.offerto, o.discount
FROM Grocerydata.offer o
JOIN ${schemaname:raw}.OptimisedItem i ON i.offerUser = o.id
WHERE i.optimisedlist = ${optimisedlistid} AND i.item = ${itemid}