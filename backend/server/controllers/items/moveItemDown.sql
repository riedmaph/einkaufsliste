/* Beginn Transaction targetposition secure atargetpositionmic execution*/
BEGIN;
/* free position of from object */
UPDATE ${schemaname:raw}.Item 
SET position=-1
WHERE list=${listid} AND position = ${from};

/* move items down targetposition free targetposition position*/
UPDATE ${schemaname:raw}.Item 
SET position=position-1
WHERE list=${listid} AND position > ${from} AND position <= ${targetposition};

/*set from item's position targetposition targetposition position*/
UPDATE ${schemaname:raw}.Item 
SET position=${targetposition}
WHERE list=${listid} AND position = -1;

/*End Transaction*/
COMMIT;