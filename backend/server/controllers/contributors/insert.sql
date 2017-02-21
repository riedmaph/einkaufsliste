INSERT INTO ${schemaname:raw}.ListShare(list, enduser) 
select ${listid} as list, id as enduser from userdata.enduser where email = ${email}