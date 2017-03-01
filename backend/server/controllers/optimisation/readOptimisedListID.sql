SELECT id 
FROM ${schemaname:raw}.OptimisedList 
WHERE list = ${listid} AND endDate IS NULL 
AND startDate = (SELECT MAX(startDate) 
                FROM ${schemaname:raw}.OptimisedList 
                WHERE list = ${listid}  AND endDate IS NULL)