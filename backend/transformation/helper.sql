CREATE OR REPLACE FUNCTION public.cleanstring(text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
    SELECT regexp_replace($1,'[^\x20-\x7E\xA1-\xFF]+',' ','g');
$function$
