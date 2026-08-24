-- ============================================================
-- Adify — ad management (Adsterra & any ad-network code)
-- ============================================================
-- WordPress "Ad Inserter"-style ad management, but engineered for this
-- Next.js site. Each ad unit stores a RAW ad-network snippet (verbatim —
-- never rewritten) plus placement + targeting metadata. The frontend
-- renders each unit inside its own isolated, sandboxed, lazy-loaded
-- <iframe> so multiple Adsterra "iframe" tags never collide on the same
-- global (atOptions) and can't hijack the parent page.
--
-- Managed from /admin/adify.
-- ============================================================

CREATE TABLE IF NOT EXISTS ad_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Human label shown in admin ("Leaderboard 728x90", "Mobile Anchor", ...)
  name TEXT NOT NULL,

  -- Raw ad-network snippet, stored EXACTLY as pasted (both <script> blocks
  -- for Adsterra). Rendered verbatim inside an isolated iframe.
  code TEXT NOT NULL,

  -- Reserved box size (prevents layout shift / CLS). Auto-detected from the
  -- Adsterra atOptions width/height when the admin pastes a snippet.
  width INT NOT NULL DEFAULT 300,
  height INT NOT NULL DEFAULT 250,

  -- Where on the page this ad appears.
  --   header        — full-width strip directly under the navbar
  --   content_top   — top of the article body, above the first heading
  --   in_content    — after the Nth paragraph inside the article body
  --   content_bottom— end of the article body
  --   sidebar       — inside the blog/species right rail
  --   footer        — full-width strip directly above the footer
  --   sticky        — fixed anchor bar pinned to the bottom of the viewport
  placement TEXT NOT NULL DEFAULT 'content_bottom'
    CHECK (placement IN (
      'header', 'content_top', 'in_content', 'content_bottom',
      'sidebar', 'footer', 'sticky'
    )),

  -- For placement='in_content': insert after this many <p> paragraphs.
  paragraph_number INT NOT NULL DEFAULT 3,

  -- Which page types to show on. Values: 'all', 'home', 'article'.
  -- 'all' (default) shows everywhere.
  page_types TEXT[] NOT NULL DEFAULT ARRAY['all'],

  -- Device targeting.
  show_desktop BOOLEAN NOT NULL DEFAULT true,
  show_mobile  BOOLEAN NOT NULL DEFAULT true,

  -- Lazy-load with IntersectionObserver (recommended — protects page speed).
  lazy_load BOOLEAN NOT NULL DEFAULT true,

  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_units_enabled   ON ad_units (enabled);
CREATE INDEX IF NOT EXISTS idx_ad_units_placement ON ad_units (placement);

-- RLS — public visitors read only ENABLED units (so the frontend provider
-- can fetch them); all writes go through the admin API using the service
-- role, which bypasses RLS.
ALTER TABLE ad_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read enabled ad units" ON ad_units;
CREATE POLICY "Anyone can read enabled ad units"
  ON ad_units
  FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

-- Auto-touch updated_at on every change.
CREATE OR REPLACE FUNCTION update_ad_units_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ad_units_updated_at ON ad_units;
CREATE TRIGGER trg_ad_units_updated_at
  BEFORE UPDATE ON ad_units
  FOR EACH ROW
  EXECUTE FUNCTION update_ad_units_updated_at();
