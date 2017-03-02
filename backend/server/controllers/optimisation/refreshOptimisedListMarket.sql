WITH usedMarkets AS(
  SELECT DISTINCT offer.market as id
  FROM GroceryData.Offer offer
  JOIN ${schemaname:raw}.OptimisedItem oitem ON oitem.offerUser = offer.id
  WHERE oitem.optimisedlist = ${optimisedlistid}
)

DELETE FROM ${schemaname:raw}.OptimisedListMarket
WHERE optimisedlist = ${optimisedlistid};

INSERT INTO ${schemaname:raw}.OptimisedListMarket(optimisedlist, market) 
SELECT ${optimisedlistid}, market.id
FROM (SELECT DISTINCT offer.market as id
      FROM GroceryData.Offer offer
      JOIN ${schemaname:raw}.OptimisedItem oitem ON oitem.offerUser = offer.id
      WHERE oitem.optimisedlist = ${optimisedlistid}) as market
