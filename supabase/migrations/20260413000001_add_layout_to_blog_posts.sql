-- Add layout field to blog_posts: 'with-sidebar' (default) or 'full-page'
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'with-sidebar';
