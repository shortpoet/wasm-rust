CREATE TABLE [RUST].[content_projects] (
  id INT PRIMARY KEY CLUSTERED IDENTITY(1,1),
  name VARCHAR(100) CHECK(name not like '%[ ]%') NOT NULL,
  category_id INTEGER NOT NULL,
);


EXEC sys.sp_addextendedproperty @name=N'Comment', 
@value=N'This holds projects for the sample apps on rust.' , @level0type=N'SCHEMA',@level0name=N'RUST', 
@level1type=N'TABLE',@level1name=N'content_projects'

CREATE UNIQUE INDEX projects_name_idx ON  [RUST].[content_projects](name);

CREATE TABLE [RUST].[content_sections] (
  id INT PRIMARY KEY CLUSTERED IDENTITY(1,1),
  project_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
);


EXEC sys.sp_addextendedproperty @name=N'Comment', 
@value=N'This holds sections for the posts on rust.' , @level0type=N'SCHEMA',@level0name=N'RUST', 
@level1type=N'TABLE',@level1name=N'content_sections'

ALTER TABLE [RUST].[content_projects] ADD FOREIGN KEY (category_id) REFERENCES [RUST].[content_categories](id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts] ADD FOREIGN KEY (project_id) REFERENCES [RUST].[content_projects](id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts] ADD FOREIGN KEY (section_id) REFERENCES [RUST].[content_sections](id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts] ADD FOREIGN KEY (category_id) REFERENCES [RUST].[content_categories](id) ON DELETE NO ACTION ON UPDATE CASCADE;

CREATE TABLE [RUST].[content_posts] (
  id INT PRIMARY KEY CLUSTERED IDENTITY(1,1),
  title VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  markdown VARCHAR(max) NULL,
  html VARCHAR(max) NULL,
  section_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  created DATETIME2 NOT NULL
);

CREATE UNIQUE INDEX posts_title_idx ON  [RUST].[content_posts](title);

EXEC sys.sp_addextendedproperty @name=N'Comment', 
@value=N'This holds posts for the sample apps on rust.' , @level0type=N'SCHEMA',@level0name=N'RUST', 
@level1type=N'TABLE',@level1name=N'content_posts'


CREATE TABLE [RUST].[content_categories] (
  id INT PRIMARY KEY CLUSTERED IDENTITY(1,1),
  name VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX categories_name_idx ON  [RUST].[content_categories](name);

EXEC sys.sp_addextendedproperty @name=N'Comment', 
@value=N'This holds categories for the posts' , @level0type=N'SCHEMA',@level0name=N'RUST', 
@level1type=N'TABLE',@level1name=N'content_categories'

CREATE TABLE [RUST].[content_tags] (
  id INT PRIMARY KEY CLUSTERED IDENTITY(1,1),
  name VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX tags_name_idx ON [RUST].[content_tags](name);

EXEC sys.sp_addextendedproperty @name=N'Comment', 
@value=N'This holds tags for the posts' , @level0type=N'SCHEMA',@level0name=N'RUST', 
@level1type=N'TABLE',@level1name=N'content_tags'

CREATE TABLE [RUST].[content_posts_tags] (
  id INT PRIMARY KEY CLUSTERED IDENTITY(1,1),
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL
);

ALTER TABLE [RUST].[content_posts_tags] ADD FOREIGN KEY (post_id) REFERENCES [RUST].[content_posts](id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts_tags] ADD FOREIGN KEY (tag_id) REFERENCES [RUST].[content_tags](id) ON DELETE NO ACTION ON UPDATE CASCADE;

EXEC sys.sp_addextendedproperty @name=N'Comment', 
@value=N'This is a join table for the posts and tags' , @level0type=N'SCHEMA',@level0name=N'RUST', 
@level1type=N'TABLE',@level1name=N'content_posts_tags'

-- check COMMENT
-- https://stackoverflow.com/questions/378700/is-it-possible-to-add-a-description-comment-to-a-table-in-microsoft-sql-2000

-- SELECT *
-- FROM fn_listextendedproperty (NULL, 'schema','RUST', 'table', 'content_posts', default, default);

-- SELECT
-- p.name AS [Name],p.value
-- FROM
-- sys.tables AS tbl
-- INNER JOIN sys.extended_properties AS p ON p.major_id=tbl.object_id AND p.minor_id=0 AND p.class=1
-- WHERE
-- (tbl.name=N'content_posts' and SCHEMA_NAME(tbl.schema_id)=N'RUST')
-- ORDER BY
-- [Name] ASC
