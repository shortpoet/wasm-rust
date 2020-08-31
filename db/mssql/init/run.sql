-- :r "/usr/src/app/00-create-schema.sql";
-- GO
-- :r "/usr/src/app/01-create-user.sql";
-- GO
-- :r "/usr/src/app/02-create-tables.sql";
-- GO
-- :r "/usr/src/app/03-seed-data.sql";
-- GO

 USE master;
 ALTER DATABASE rust_test SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
 DROP DATABASE rust_test;
 DROP USER rust
 DROP ROLE RustAppUser_Role
 DROP LOGIN rust
-- :setvar MSSQL_PASSWORD ''

-- https://github.com/lkurzyniec/netcore-boilerplate/blob/master/db/mssql/mssql-cars.sql
IF DB_ID('rust_test') IS NOT NULL
  set noexec on               -- prevent creation when already exists

CREATE DATABASE rust_test;

GO

USE rust_test;

GO

CREATE SCHEMA RUST;

GO


DECLARE @user varchar(32);
DECLARE @defaultSchema varchar(32);
DECLARE @role varchar(32);
DECLARE @authorization varchar(32);
DECLARE @pass varchar(64);
DECLARE @test varchar(64);

SET @user = 'rust';
SET @defaultSchema = 'RUST';
SET @role = 'RUSTAppUser_Role';
SET @authorization = 'dbo';

SET @pass = '$(MSSQL_PASSWORD)';
-- PRINT('##########################')
-- PRINT(@pass)
-- PRINT('##########################')
-- SET @test = '$(MSSQL_PASSWORD)';
-- PRINT(@test)
-- vs --
-- w/o single quote which fails
-- SET @test = $(MSSQL_PASSWORD);
-- PRINT(@test)

--create @user user login
--create user in  database
--create role
--apply permissions to schemas
--ensure role membership is correct
--allow users to create tables in defaultSchema
--Allow user to connect to database
DECLARE @cmd nvarchar(max);
SET @cmd = 
'BEGIN
	CREATE LOGIN '+ @user + ' WITH PASSWORD=N''' + @pass + '''
	
	CREATE USER ' + @user + ' FOR LOGIN ' + @user + ' WITH DEFAULT_SCHEMA=' + @defaultSchema + '
	
	CREATE ROLE ' + @role + ' AUTHORIZATION ' + @authorization + '
	
	GRANT ALTER ON SCHEMA::' + @defaultSchema +' TO ' + @role + '
	
	GRANT CONTROL ON SCHEMA::' + @defaultSchema +' TO ' + @role + '
	
	GRANT SELECT ON SCHEMA::' + @defaultSchema +' TO ' + @role + '
	
	GRANT DELETE ON SCHEMA::' + @authorization + ' TO ' + @role + '
	
	GRANT INSERT ON SCHEMA::' + @authorization + ' TO ' + @role + '
	
	GRANT SELECT ON SCHEMA::' + @authorization + ' TO ' + @role + '
	
	GRANT UPDATE ON SCHEMA::' + @authorization + ' TO ' + @role + '
	
	GRANT REFERENCES ON SCHEMA::' + @authorization + ' TO ' + @role + '
	
	EXEC sp_addrolemember N''' + @role +''', ' + @user + '
	
	GRANT CREATE TABLE TO ' + @role + '
	
	GRANT CONNECT TO ' + @user +
' END';
-- PRINT(@cmd)
EXEC sp_executesql @cmd;

GO

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

ALTER TABLE [RUST].[content_projects] ADD FOREIGN KEY (category_id) REFERENCES [RUST].[content_categories](id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts] ADD FOREIGN KEY (project_id) REFERENCES [RUST].[content_projects](id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts] ADD FOREIGN KEY (section_id) REFERENCES [RUST].[content_sections](id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE [RUST].[content_posts] ADD FOREIGN KEY (category_id) REFERENCES [RUST].[content_categories](id) ON DELETE NO ACTION ON UPDATE NO ACTION;


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

GO

USE rust_test;

GO

USE rust_test

GO


INSERT INTO [RUST].[content_categories]
( -- columns to insert data into
 name
)
VALUES
( 
 'browser'
),
( 
 'deno'
),
( 
 'faas'
),
( 
 'nodejs'
),
( 
 'rust'
),
( 
 'ssvm'
),
( 
 'tencentcloud'
);

INSERT INTO [RUST].[content_sections]
( -- columns to insert data into
 name, project_id
)
VALUES
( 
 'say', 1
),
( 
 'solve', 2
),
( 
 'say', 3
);

INSERT INTO [RUST].[content_projects]
( -- columns to insert data into
 name, category_id
)
VALUES
( 
 'hello-wasm', 4
),
( 
 'quadratic-solve', 4
),
( 
 'functions-say', 4
);



INSERT INTO [RUST].[content_posts]
( -- columns to insert data into
 title, type, markdown, html, section_id, project_id, category_id, created
)
VALUES
( 
 'hello-wasm-say-intro', 'intro', '# Hello Rust', '<h1>Hello Rust</h1>', 1, 1, 4,  GETDATE()
),
( 
 'quadratic-solve-intro', 'intro', '# Quadratic', '<h1>Quadratic</h1>', 2, 2, 4, DATEADD(day, -7, GETDATE())
),
( 
 'functions-say-intro', 'intro', '# Functions', '<h1>Functions</h1>', 3, 3, 4, DATEADD(day, -14, GETDATE())
);



INSERT INTO [RUST].[content_tags]
( -- columns to insert data into
 name
)
VALUES
( 
 'node'
),
( 
 'rust'
),
( 
 'math'
);

INSERT INTO [RUST].[content_posts_tags]
( -- columns to insert data into
 post_id, tag_id
)
VALUES
( 
 1 , 1
),
( 
 2, 2
),
( 
 3, 3
);

GO