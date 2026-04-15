-- =============================================================================
-- Migration: per-post custom CSS field.
-- =============================================================================
-- Lets admins paste arbitrary CSS per page/post (WordPress-style "Additional
-- CSS" behaviour). The CSS is injected in-page via a <style> tag inside the
-- article wrapper, so it loads AFTER the site's global stylesheet and wins on
-- source-order specificity — ideal for quick design overrides without shipping
-- a whole new Tailwind class.
--
-- Scope of the <style> block is the article page only: the column lives on
-- blog_posts, so the CSS only runs when that specific post is rendered.
-- =============================================================================

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS custom_css TEXT;

COMMENT ON COLUMN blog_posts.custom_css IS
  'Per-post CSS injected inside a <style> tag on this post''s public page. Loads after global CSS for high override priority. NULL/empty = no custom CSS.';
