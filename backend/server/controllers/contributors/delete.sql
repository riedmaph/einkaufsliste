DELETE from ${schemaname:raw}.ListShare 
WHERE list=${listid} and enduser=(SELECT id FROM ${schemaname:raw}.enduser where email=${email})