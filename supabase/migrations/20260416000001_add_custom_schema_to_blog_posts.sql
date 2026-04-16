-- =============================================================================
-- Migration: per-post custom JSON-LD schema field.
-- =============================================================================
-- Lets admins paste arbitrary JSON-LD structured data per page/post. When set,
-- the custom schema REPLACES the default Article + BreadcrumbList schema that
-- the site generates automatically — only on this specific page.
--
-- Rationale: some pages need tailored schema (HowTo, Recipe, FAQPage, Course,
-- VideoObject, Product, SoftwareApplication, etc.) that the generic Article
-- schema can't express. Admin can paste a hand-crafted @graph and this post
-- will emit ONLY that JSON in its single ld+json script tag.
--
-- Safety: the SEO Health scanner still detects this and warns about missing
-- required fields, invalid JSON, or duplicate schemas on the same page.
-- =============================================================================

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS custom_schema TEXT;

COMMENT ON COLUMN blog_posts.custom_schema IS
  'Per-post JSON-LD schema. If set, replaces the default Article + BreadcrumbList schema on this page only. Must be valid JSON. NULL/empty = use default schema.';
