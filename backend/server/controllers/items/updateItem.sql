UPDATE ${schemaname:raw}.Item 
SET list=${listid}, name=${name}, checked=(SELECT TIMESTAMP 'epoch' + ${checked} * INTERVAL '1 second'), amount=${amount}, unit=${unit} 
WHERE id=${id}