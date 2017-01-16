SELECT offer.id, offer.market, offer.price as offerprice, offer.offerfrom, offer.offerto, offer.discount, offer.title as name, 'BRAND' as brand, offer.price
FROM Transformed.Offer offer
WHERE market = ${marketid}