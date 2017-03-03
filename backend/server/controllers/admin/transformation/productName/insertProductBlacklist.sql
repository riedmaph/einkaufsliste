INSERT INTO $(schemaTransformed:raw).productnameblacklist
(blockedstring, userid)
VALUES(${string}, ${userid})
RETURNING *
