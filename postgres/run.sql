

-- Database: vcc

-- -- https://dba.stackexchange.com/questions/11893/force-drop-db-while-others-may-be-connected
\c postgres postgres
-- UPDATE pg_database SET datallowconn = 'true' WHERE datname = 'postgres';
-- SELECT pg_terminate_backend(pid)
-- FROM pg_stat_activity
-- WHERE datname = 'postgres';
-- DROP DATABASE shortpoetdb;
DROP DATABASE rust_test;

-- env vars create primary db
-- must do this before creating schema with that USER
-- on docker we are logged in as test from beginning
-- CREATE DATABASE shortpoetdb;
-- GRANT ALL ON DATABASE shortpoetdb TO test;
CREATE DATABASE rust_test;
GRANT ALL ON DATABASE rust_test TO rust_user;

-- ####
-- don't forget to connect to test before creating schema or seeding

\i init/01-create-schema.sql
\i init/02-create-user.sql
\i init/03-seed-data.sql
