/* Beginn Transaction to secure atomic execution*/
BEGIN;
DO $$

/* Select fromPosition by ID  */
DECLARE fromposition INTEGER;
BEGIN
  fromposition :=
  (SELECT Item.position
		FROM ${schemaname:raw}.Item
		WHERE id = ${id});

/* move items down to free targetposition position*/
UPDATE ${schemaname:raw}.Item 
SET position = position + (CASE fromposition < ${targetposition} WHEN true THEN -1 ELSE 1 END) 
WHERE list=${listid} AND 
(CASE fromposition < ${targetposition} 
	WHEN true THEN (position > fromposition AND position <= ${targetposition})
	ELSE (position >= ${targetposition} AND position < fromposition)
END);

/*set from item's position to targetposition position*/
UPDATE ${schemaname:raw}.Item 
SET position=${targetposition}
WHERE id=${id};

END $$;
/*End Transaction*/
COMMIT;