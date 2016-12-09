GRANT ALL PRIVILEGES ON DATABASE :dbname to :dbusertransformer;
GRANT USAGE ON SCHEMA Transformed TO :dbuserapi;
GRANT SELECT ON ALL TABLES IN SCHEMA Transformed TO :dbuserapi;
