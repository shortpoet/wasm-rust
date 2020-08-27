-- \connect shortpoetdb test


\c rust_test rust_user
INSERT INTO "rust"."content_categories"
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

INSERT INTO "rust"."content_projects"
( -- columns to insert data into
 name, category_id
)
VALUES
( 
 'hello-rust', 4
),
( 
 'quadratic', 4
),
( 
 'functions', 4
);



INSERT INTO "rust"."content_posts"
( -- columns to insert data into
 title, type, markdown, html, project_id, category_id, created
)
VALUES
( 
 'hello-rust', 'intro', '# Hello Rust', '<h1>Hello Rust</h1>', 1, 4, NOW()
),
( 
 'quadratic', 'intro', '# Quadratic', '<h1>Quadratic</h1>', 2, 4, CURRENT_DATE - integer '6'
),
( 
 'functions', 'intro', '# Functions', '<h1>Functions</h1>', 3, 4, CURRENT_DATE - integer '13'
);


INSERT INTO "rust"."content_tags"
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

INSERT INTO "rust"."content_posts_tags"
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



-- update content_posts set created = (select current_date - integer '6') where id = 2;

SELECT setval(
    pg_get_serial_sequence('"rust"."content_categories"', 'id'),
    (SELECT MAX("id") FROM "rust"."content_categories") + 1
);
SELECT setval(
    pg_get_serial_sequence('"rust"."content_posts"', 'id'),
    (SELECT MAX("id") FROM "rust"."content_posts") + 1
);
SELECT setval(
    pg_get_serial_sequence('"rust"."content_tags"', 'id'),
    (SELECT MAX("id") FROM "rust"."content_tags") + 1
);
SELECT setval(
    pg_get_serial_sequence('"rust"."content_posts_tags"', 'id'),
    (SELECT MAX("id") FROM "rust"."content_posts_tags") + 1
);
