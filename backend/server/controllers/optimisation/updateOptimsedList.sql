UPDATE ${schemaname:raw}.OptimisedList
SET savings = (savings + ${savingschange})
WHERE id = ${optimisedlistid}