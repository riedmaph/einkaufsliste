SELECT enduser.id as id, enduser.email as email, enduser.password as password 
FROM ${schemaname:raw}.Enduser 
WHERE email = ${email}