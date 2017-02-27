WITH OptimisedListID AS (
  SELECT id 
  FROM ${schemaname:raw}.OptimisedList 
  WHERE list = ${listid} AND endDate IS NULL 
  AND startDate = (SELECT MAX(startDate) 
                  FROM ${schemaname:raw}.OptimisedList 
                  WHERE list = ${listid}  AND endDate IS NULL)
)

UPDATE ${schemaname:raw}.Item AS i
SET name=oi.name, amount=oi.amount, unit=oi.unit
FROM ${schemaname:raw}.OptimisedItem AS oi
WHERE i.id=oi.item AND oi.optimisedlist = (SELECT id FROM ${schemaname:raw}.OptimisedList 
                                          WHERE list = ${listid} AND endDate IS NULL 
                                          AND startDate = (SELECT MAX(startDate) 
                                                          FROM ${schemaname:raw}.OptimisedList 
                                                          WHERE list = ${listid}  AND endDate IS NULL));

UPDATE ${schemaname:raw}.OptimisedList 
SET endDate = CURRENT_TIMESTAMP 
WHERE id = (SELECT id FROM ${schemaname:raw}.OptimisedList 
            WHERE list = ${listid} AND endDate IS NULL 
            AND startDate = (SELECT MAX(startDate) 
                            FROM ${schemaname:raw}.OptimisedList 
                            WHERE list = ${listid}  AND endDate IS NULL));