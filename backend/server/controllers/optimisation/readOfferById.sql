SELECT o.id, o.market, o.offerprice, o.offerfrom, o.offerto, o.discount
FROM Grocerydata.offer o
WHERE o.id = ${offerid}