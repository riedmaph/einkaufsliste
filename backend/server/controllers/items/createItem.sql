WITH NextPosition AS (
  SELECT (COALESCE(MAX(position),0) + 1) as newposition
  FROM ${schemaname:raw}.Item
  WHERE list = ${listid}
)

INSERT INTO ${schemaname:raw}.Item(id, list, name, position, amount, unit, created) 
VALUES(${id}, ${listid}, ${name}, (SELECT newposition FROM NextPosition), ${amount}, ${unit}, CURRENT_TIMESTAMP)