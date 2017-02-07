SELECT offer.id, offer.market, offer.offerprice, offer.offerfrom, offer.offerto, offer.discount, article.name as articlename, article.brand as articlebrand
FROM Grocerydata.Offer offer
JOIN Grocerydata.Article article ON offer.article = article.id
WHERE market = ${marketid}