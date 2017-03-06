/*set from item's position to targetposition position*/
UPDATE ${schemaname:raw}.Item 
SET position=${targetposition}
WHERE id=${id};
