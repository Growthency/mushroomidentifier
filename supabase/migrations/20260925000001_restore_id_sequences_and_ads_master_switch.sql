-- 1) Restore auto-increment ids lost in the 2026-08-26 project migration.
--    blog_posts.id and rank_keywords.id came over as plain integers with no
--    default, so every new insert failed with
--    "null value in column "id" of relation "blog_posts" violates not-null constraint".

CREATE SEQUENCE IF NOT EXISTS blog_posts_id_seq OWNED BY blog_posts.id;
ALTER TABLE blog_posts ALTER COLUMN id SET DEFAULT nextval('blog_posts_id_seq');
SELECT setval('blog_posts_id_seq', COALESCE((SELECT MAX(id) FROM blog_posts), 0) + 1, false);

CREATE SEQUENCE IF NOT EXISTS rank_keywords_id_seq OWNED BY rank_keywords.id;
ALTER TABLE rank_keywords ALTER COLUMN id SET DEFAULT nextval('rank_keywords_id_seq');
SELECT setval('rank_keywords_id_seq', COALESCE((SELECT MAX(id) FROM rank_keywords), 0) + 1, false);

-- 2) Adify master switch — 'false' makes the whole site ad-free without
--    touching individual ad units.
INSERT INTO site_settings (key, value, type, group_name, label, description, sort_order) VALUES
  ('ads_enabled',
   'true',
   'text',
   'ads',
   'Ads master switch',
   'Managed from /admin/adify. "false" hides every ad unit sitewide.',
   1)
ON CONFLICT (key) DO NOTHING;
