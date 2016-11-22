
CREATE USER :dbusercrawler WITH PASSWORD :'dbpasscrawler';
GRANT :dbusercrawler TO :dbadmin;

CREATE USER :dbusertransformer WITH PASSWORD :'dbpasstransformer';
GRANT :dbusertransformer TO :dbadmin;

CREATE USER :dbuserapi WITH PASSWORD :'dbpassapi';
GRANT :dbuserapi TO :dbadmin;


CREATE DATABASE :dbname WITH OWNER :dbusercrawler ENCODING 'UTF8';
