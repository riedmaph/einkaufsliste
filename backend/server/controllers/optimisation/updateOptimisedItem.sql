UPDATE ${schemaname:raw}.OptimisedItem 
SET name=${name}, amount=${amount}, unit=${unit}, offerUser=${userSelectedOffer}
WHERE item=${itemid} AND optimisedlist = ${optimisedlistid}