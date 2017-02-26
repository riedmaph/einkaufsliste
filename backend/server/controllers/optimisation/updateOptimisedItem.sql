UPDATE ${schemaname:raw}.OptimisedItem 
SET name=${name}, amount=${amount}, unit=${unit}, offerAlgorithm=${offerAlgorithm}, offerUser=${offerUser}
WHERE id=${id}