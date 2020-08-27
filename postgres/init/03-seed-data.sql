-- \connect shortpoetdb test


\c rust_test rust_user
-- Insert rows into table 'posts'

INSERT INTO "rust"."content_categories"
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
 'bash'
);


INSERT INTO "rust"."content_posts"
( -- columns to insert data into
 title, markdown, html, category_id, created
)
VALUES
( 
 'Today', 'Content', '<p>Content</p>', 1, NOW()
),
( 
 'This Week','Content', '<p>Content</p>', 2, CURRENT_DATE - integer '6'
),
( 
 'This Month','Content', '<p>Content</p>', 3, CURRENT_DATE - integer '13'
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
 'bash'
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
