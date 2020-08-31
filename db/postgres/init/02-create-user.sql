-- Role: rust_user
-- DROP ROLE rust_user;

-- CREATE ROLE rust_user WITH
--   LOGIN
--   NOSUPERUSER
--   INHERIT
--   NOCREATEDB
--   NOCREATEROLE
--   NOREPLICATION
--   PASSWORD 'test';

-- env vars create role
-- uncomment for local
-- https://stackoverflow.com/questions/10352695/grant-all-on-a-specific-schema-in-the-db-to-a-group-role-in-postgresql

-- \connect shortpoetdb postgres

GRANT USAGE ON SCHEMA "rust" TO rust_user;
GRANT USAGE ON SCHEMA "rust" TO rust_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "rust" TO rust_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "rust" TO rust_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "rust" TO rust_user;

-- \connect rust_user rust_user

-- GRANT USAGE ON SCHEMA "rust" TO rust_user;
-- GRANT USAGE ON SCHEMA "rust" TO rust_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "rust" TO rust_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "rust" TO rust_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "rust" TO rust_user;
