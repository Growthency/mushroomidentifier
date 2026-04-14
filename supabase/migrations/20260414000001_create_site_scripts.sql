-- Site-wide custom scripts (Google Analytics, Search Console, Meta Pixel, etc.)
-- WordPress-style header/body script injection managed from admin dashboard.
CREATE TABLE IF NOT EXISTS site_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'head' CHECK (position IN ('head', 'body_start', 'body_end')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_scripts_enabled ON site_scripts (enabled);
CREATE INDEX IF NOT EXISTS idx_site_scripts_position ON site_scripts (position);

-- RLS — only server-side reads via service role (public pages fetch via server component)
ALTER TABLE site_scripts ENABLE ROW LEVEL SECURITY;

-- Anon users can read enabled scripts (so layout can inject them for public visitors)
CREATE POLICY "Anyone can read enabled scripts"
  ON site_scripts
  FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

-- Only service role (admin API) can INSERT/UPDATE/DELETE; no policy needed for service role
-- (service role bypasses RLS by default)

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_site_scripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_site_scripts_updated_at ON site_scripts;
CREATE TRIGGER trg_site_scripts_updated_at
  BEFORE UPDATE ON site_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_site_scripts_updated_at();
