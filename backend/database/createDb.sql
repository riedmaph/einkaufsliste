CREATE USER :dbuseradmin WITH PASSWORD :'dbpassadmin';
GRANT :dbuseradmin TO :dbadmin;

CREATE USER :dbusercrawler WITH PASSWORD :'dbpasscrawler';
GRANT :dbusercrawler TO :dbuseradmin;

CREATE USER :dbusertransformer WITH PASSWORD :'dbpasstransformer';
GRANT :dbusertransformer TO :dbuseradmin;

CREATE USER :dbuserapi WITH PASSWORD :'dbpassapi';
GRANT :dbuserapi TO :dbuseradmin;


CREATE DATABASE :dbname WITH OWNER :dbuseradmin ENCODING 'UTF8';

GRANT CREATE ON DATABASE :dbname to :dbusercrawler;
GRANT CREATE ON DATABASE :dbname to :dbusertransformer;
GRANT CREATE ON DATABASE :dbname to :dbuserapi;