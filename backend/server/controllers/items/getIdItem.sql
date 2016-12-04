SELECT COALESCE(MAX(id),0) as maxid
FROM ${schemaname:raw}.Item