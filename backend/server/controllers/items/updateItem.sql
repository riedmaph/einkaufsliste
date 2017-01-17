UPDATE ${schemaname:raw}.Item 
SET list=${listid}, name=${name}, checked=(case when ${checked}=true then CURRENT_TIMESTAMP else null end), amount=${amount}, unit=${unit} 
WHERE id=${id}