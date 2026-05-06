-- Rename the site's default author from "Paul Stamets" to "Nathan Cole"
-- across every existing blog post. Frontend templates already hardcode
-- "Nathan Cole" in the AuthorBlock and blog-listing cards, so this is
-- mostly belt-and-braces: it ensures the admin Edit-Post screen shows
-- the new name in the author input, keeps any future code paths that
-- DO surface `posts.author_name` honest, and prevents the stored value
-- from drifting from the rendered one.
--
-- We only touch rows that still carry the old name — anything else the
-- admin has customised (per-post bylines, guest posts) is preserved.

UPDATE blog_posts
SET author_name = 'Nathan Cole'
WHERE author_name = 'Paul Stamets';
