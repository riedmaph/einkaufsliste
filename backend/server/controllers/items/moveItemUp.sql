/* Beginn Transaction to secure atomic execution*/
BEGIN;
/* free position of from object */
UPDATE ${schemaname:raw}.Item 
SET position=-1
WHERE list=${listid} AND position = ${from};

/* move items down to free to position*/
UPDATE ${schemaname:raw}.Item 
SET position=position+1
WHERE list=${listid} AND position >= ${to} AND position < ${from};

/*set from item's position to to position*/
UPDATE ${schemaname:raw}.Item 
SET position=${to}
WHERE list=${listid} AND position = -1;

/*End Transaction*/
COMMIT;