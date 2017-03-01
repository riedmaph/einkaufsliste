UPDATE ${schemaname:raw}.OptimisedItem 
SET name=${name}, amount=${amount}, unit=${unit}, offerUser=${offeruser}
WHERE item=${itemid} AND optimisedlist = ${optimisedlistid}