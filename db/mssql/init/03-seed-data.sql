USE shortpoetdb




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
