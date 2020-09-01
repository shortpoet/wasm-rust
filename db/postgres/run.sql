

-- Database: vcc

-- -- https://dba.stackexchange.com/questions/11893/force-drop-db-while-others-may-be-connected
\c postgres postgres

-- IMPORTANT
-- env vars create primary db
-- must COMMENT CREATE DB before creating schema with that USER
-- on docker we are logged in as test from beginning
-- *
-- THIS ONLY ON LOCAL RUN
-- *
-- UPDATE pg_database SET datallowconn = 'true' WHERE datname = 'rust_test';
-- SELECT pg_terminate_backend(pid)
-- FROM pg_stat_activity
-- WHERE datname = 'rust_test';

-- https://stackoverflow.com/questions/51256454/cannot-drop-postgresql-role-error-cannot-be-dropped-because-some-objects-depe
-- Role: rust_user
DROP OWNED BY rust_user;
DROP ROLE rust_user;

CREATE ROLE rust_user WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  PASSWORD 'test';

DROP DATABASE rust_test;

CREATE DATABASE rust_test;

-- ####
-- don't forget to connect to test (when has test db) before creating schema or seeding

-- ALWAYS
GRANT ALL ON DATABASE rust_test TO rust_user;
\i init/01-create-schema.sql
\i init/02-create-user.sql
\i init/03-seed-data.sql
