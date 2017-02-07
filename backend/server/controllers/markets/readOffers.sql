SELECT offer.id, offer.market, offer.offerprice, offer.offerfrom, offer.offerto, offer.discount, offer.title as name, 'BRAND' as brand
FROM Grocerydata.Offer offer
WHERE market = ${marketid}