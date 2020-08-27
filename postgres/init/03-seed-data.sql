-- \connect shortpoetdb test


\c rust_test rust_user
-- Insert rows into table 'posts'

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


INSERT INTO "rust"."content_posts"
( -- columns to insert data into
 title, markdown, html, category_id, created
)
VALUES
( 
 'hello-rust', '# Hello Rust', '<h1>Hello Rust</h1>', 4, NOW()
),
( 
 'quadratic','# Quadratic', '<h1>Quadratic</h1>', 4, CURRENT_DATE - integer '6'
),
( 
 'functions','# Functions', '<h1>Functions</h1>', 4, CURRENT_DATE - integer '13'
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
