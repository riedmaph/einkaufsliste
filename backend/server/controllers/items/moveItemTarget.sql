Select p.position 
FROM (
  SELECT position, row_number() OVER (ORDER BY position) as rank
  FROM ${schemaname:raw}.Item
  WHERE list=${listid}
) p
WHERE p.rank = ${targetposition};
