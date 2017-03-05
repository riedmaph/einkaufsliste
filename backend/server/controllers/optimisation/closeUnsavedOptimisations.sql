UPDATE ${schemaname:raw}.OptimisedList
SET endDate = CURRENT_TIMESTAMP, saved = false
WHERE list = ${listid} and endDate is null