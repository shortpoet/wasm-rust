-- ####
-- don't forget to connect to test before creating schema or seeding

-- \connect shortpoetdb rust_user
\c rust_test rust_user
-- schema
CREATE SCHEMA "rust";

-- content_projects table
CREATE TABLE "rust"."content_projects" (
  id serial primary key,
  category_id INTEGER NOT NULL,
  name VARCHAR 
  CHECK(name !~ '\s') NOT NULL
);

CREATE UNIQUE INDEX projects_name_idx ON "rust"."content_projects"(name);

COMMENT ON TABLE "rust"."content_projects" IS
'This holds projects for the sample apps on rust.';


-- content_projects table
CREATE TABLE "rust"."content_sections" (
  id serial primary key,
  project_id INTEGER NOT NULL,
  name VARCHAR NOT NULL
);


COMMENT ON TABLE "rust"."content_sections" IS
'This holds sections for the posts on rust.';


-- content_posts table
CREATE TABLE "rust"."content_posts" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  markdown TEXT NULL,
  html TEXT NULL,
  section_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  created TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX posts_title_idx ON "rust"."content_posts"(title);

COMMENT ON TABLE "rust"."content_posts" IS
'This holds posts for the sample apps on rust.';


-- content_categories table
CREATE TABLE "rust"."content_categories" (
  id serial primary key,
  name TEXT NOT NULL
);

CREATE UNIQUE INDEX categories_name_idx ON "rust"."content_categories"(name);


ALTER TABLE "rust"."content_projects" ADD FOREIGN KEY (category_id) REFERENCES "rust"."content_categories"(id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "rust"."content_posts" ADD FOREIGN KEY (project_id) REFERENCES "rust"."content_projects"(id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "rust"."content_posts" ADD FOREIGN KEY (section_id) REFERENCES "rust"."content_sections"(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rust"."content_posts" ADD FOREIGN KEY (category_id) REFERENCES "rust"."content_categories"(id) ON DELETE NO ACTION ON UPDATE NO ACTION;


COMMENT ON TABLE "rust"."content_categories" IS
'This holds categories for the posts';

-- content_tags table
CREATE TABLE "rust"."content_tags" (
  id serial primary key,
  name TEXT NOT NULL
);

CREATE UNIQUE INDEX tags_name_idx ON "rust"."content_tags"(name);

COMMENT ON TABLE "rust"."content_tags" IS
'This holds tags for the posts';

-- content_posts_tags join table
CREATE TABLE "rust"."content_posts_tags" (
  id serial primary key,
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL
);

ALTER TABLE "rust"."content_posts_tags" ADD FOREIGN KEY (post_id) REFERENCES "rust"."content_posts"(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rust"."content_posts_tags" ADD FOREIGN KEY (tag_id) REFERENCES "rust"."content_tags"(id) ON DELETE CASCADE ON UPDATE CASCADE;

COMMENT ON TABLE "rust"."content_categories" IS
'This is a join table for the posts and tags';



-- ##
-- test database

-- \connect rust_test rust_user
-- -- schema
-- CREATE SCHEMA "rust";

-- -- content_posts table
-- CREATE TABLE "rust"."content_posts" (
--   id SERIAL PRIMARY KEY,
--   title TEXT NOT NULL,
--   markdown TEXT NULL,
--   html TEXT NULL,
--   category_id INTEGER NOT NULL,
--   tag_id INTEGER NOT NULL,
--   created TIMESTAMP NOT NULL
-- );

-- CREATE UNIQUE INDEX posts_title_idx ON "rust"."content_posts"(title);

-- COMMENT ON TABLE "rust"."content_posts" IS
-- 'This holds posts for the sample apps on rust.';


-- -- content_categories table
-- CREATE TABLE "rust"."content_categories" (
--   id serial primary key,
--   name TEXT NOT NULL,
--   post_id INTEGER NOT NULL
-- );

-- CREATE UNIQUE INDEX categories_name_idx ON "rust"."content_categories"(name);


-- ALTER TABLE "rust"."content_posts" ADD FOREIGN KEY (category_id) REFERENCES "rust"."content_categories"(id) ON DELETE CASCADE ON UPDATE NO ACTION;

-- ALTER TABLE "rust"."content_categories" ADD FOREIGN KEY (post_id) REFERENCES "rust"."content_posts"(id) ON DELETE CASCADE ON UPDATE NO ACTION;

-- COMMENT ON TABLE "rust"."content_categories" IS
-- 'This holds categories for the posts';

-- -- content_tags table
-- CREATE TABLE "rust"."content_tags" (
--   id serial primary key,
--   name TEXT NOT NULL,
-- );

-- CREATE UNIQUE INDEX categories_name_idx ON "rust"."content_tags"(name);

-- ALTER TABLE "rust"."content_tags" ADD FOREIGN KEY (post_id) REFERENCES "rust"."content_posts"(id) ON DELETE CASCADE ON UPDATE NO ACTION;

-- COMMENT ON TABLE "rust"."content_tags" IS
-- 'This holds tags for the posts';

-- -- content_posts_tags join table
-- CREATE TABLE "rust"."content_posts_tags" (
--   id serial primary key,
--   post_id INTEGER NOT NULL,
--   tag_id INTEGER NOT NULL
-- );

-- ALTER TABLE "rust"."content_posts_tags" ADD FOREIGN KEY (post_id) REFERENCES "rust"."content_posts"(id) ON DELETE CASCADE ON UPDATE NO ACTION;
-- ALTER TABLE "rust"."content_posts_tags" ADD FOREIGN KEY (tag_id) REFERENCES "rust"."content_tags"(id) ON DELETE CASCADE ON UPDATE NO ACTION;

-- COMMENT ON TABLE "rust"."content_categories" IS
-- 'This is a join table for the posts and tags';
