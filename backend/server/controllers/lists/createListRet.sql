INSERT INTO ${schemaname:raw}.List(id, enduser, name)
VALUES(${id}, ${userid}, ${name})
RETURNING id;
