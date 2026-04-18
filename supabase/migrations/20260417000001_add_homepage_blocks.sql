-- =============================================================================
-- Migration: Homepage content blocks — admin-editable homepage body.
-- =============================================================================
-- The homepage's middle section (between the hero/upload widget and the
-- reviews/CTA) is normally hardcoded in app/page.tsx. This table lets admins
-- replace that middle section with a custom sequence of content blocks.
--
-- Render rule:
--   • If homepage_blocks has ≥1 visible row → render those blocks in the body
--     position of the homepage (between <HomeIdentifier /> and <HomeReviews />)
--   • If empty → fall back to the hardcoded default content (safe rollout)
--
-- Keeps the upload widget (critical) and reviews/CTA (conversion) untouched.
--
-- block_type values:
--   'heading'       { eyebrow?, title, subtitle?, align: 'center'|'left' }
--   'rich-text'     { html } — full WYSIWYG HTML from the RichEditor
--   'image'         { src, alt, caption?, credit?, maxHeight?, rounded? }
--   'two-column'    { html, imageSrc, imageAlt, reverse?, imageCaption? }
--   'visual-break'  { src, alt, credit?, height? }
--   'cta-box'       { variant: 'info'|'success'|'warning'|'danger',
--                     heading, text, buttonText?, buttonHref? }
--   'feature-grid'  { columns: 2|3|4, items: [{ icon?, title, description }] }
--
-- The 'data' column is JSONB so each block stores only the fields its type
-- actually uses — schemaless-at-the-DB-level, validated client-side.
-- =============================================================================

CREATE TABLE IF NOT EXISTS homepage_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index INTEGER NOT NULL DEFAULT 0,
  block_type  TEXT NOT NULL,
  data        JSONB NOT NULL DEFAULT '{}'::jsonb,
  visible     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_blocks_order
  ON homepage_blocks (order_index)
  WHERE visible = TRUE;

COMMENT ON TABLE homepage_blocks IS
  'Admin-managed content blocks for the homepage middle section. See migration header for block types and render rule.';

COMMENT ON COLUMN homepage_blocks.block_type IS
  'One of: heading, rich-text, image, two-column, visual-break, cta-box, feature-grid';

COMMENT ON COLUMN homepage_blocks.data IS
  'Block-specific fields as JSONB. Shape depends on block_type — see migration header.';

-- Public read (for home page SSR) — writes gated by the admin service-role key.
ALTER TABLE homepage_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read homepage blocks" ON homepage_blocks;
CREATE POLICY "Public read homepage blocks"
  ON homepage_blocks
  FOR SELECT
  USING (visible = TRUE);
