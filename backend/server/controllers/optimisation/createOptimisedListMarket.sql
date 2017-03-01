INSERT INTO ${schemaname:raw}.OptimisedListMarket(optimisedlist, market) 
SELECT ${optimisedlistid}, (SELECT market FROM GroceryData.Offer where id = ${offerid})
WHERE NOT EXISTS (
  SELECT * 
  FROM ${schemaname:raw}.OptimisedListMarket 
  WHERE optimisedlist = ${optimisedlistid} AND
        market = (SELECT market FROM GroceryData.Offer where id = ${offerid})
);