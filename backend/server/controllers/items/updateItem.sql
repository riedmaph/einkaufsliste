UPDATE ${schemaname:raw}.Item 
SET list=${listid}, name=${name}, checked=(case when ${checked}=true then CURRENT_TIMESTAMP else null end), 
amount=${amount}, unit=${unit}, categorytag=${product}, articlevariation=${article}
WHERE id=${id}