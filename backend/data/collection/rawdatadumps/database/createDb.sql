
CREATE USER :dbusercrawler WITH PASSWORD :'dbpasscrawler';

CREATE USER :dbusertransformer WITH PASSWORD :'dbpasstransformer';

CREATE USER :dbuserapi WITH PASSWORD :'dbpassapi';

CREATE DATABASE :dbname
   WITH OWNER :dbusercrawler
   TEMPLATE template0
   ENCODING 'UTF8'
   TABLESPACE  pg_default
CONNECTION LIMIT -1;
