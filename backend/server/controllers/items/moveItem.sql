/* select fromposition by ID*/
WITH fromposition AS (
  SELECT Item.position
  FROM ${schemaname:raw}.Item
  WHERE id = ${id})

/* move items down to free targetposition position*/
UPDATE ${schemaname:raw}.Item 
SET position = position + (CASE (SELECT * FROM fromposition) < ${targetposition} WHEN true THEN -1 ELSE 1 END) 
WHERE list=${listid} AND 
(CASE (SELECT * FROM fromposition) < ${targetposition} 
  WHEN true THEN (position > (SELECT * FROM fromposition) AND position <= ${targetposition})
  ELSE (position >= ${targetposition} AND position < (SELECT * FROM fromposition))
END);
