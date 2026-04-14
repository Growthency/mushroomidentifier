-- WordPress-style dynamic menus. Manages header nav + footer columns from admin dashboard.
-- Locations: 'header', 'footer_explore', 'footer_company', 'footer_bottom'
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL CHECK (location IN ('header', 'footer_explore', 'footer_company', 'footer_bottom')),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_location ON menu_items (location);
CREATE INDEX IF NOT EXISTS idx_menu_items_enabled ON menu_items (enabled);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON menu_items (location, sort_order);

-- RLS — public can read enabled items (needed for header/footer rendering)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled menu items"
  ON menu_items
  FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON menu_items;
CREATE TRIGGER trg_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_items_updated_at();

-- Seed with current hardcoded menu items so nothing changes after deploy
-- Use ON CONFLICT DO NOTHING via unique check on (location, label) if needed
INSERT INTO menu_items (location, label, url, sort_order, enabled, target) VALUES
  -- Header (from Navbar.tsx NAV_LINKS)
  ('header', 'Home',        '/',            1, true, '_self'),
  ('header', 'Identifiers', '/#identifier', 2, true, '_self'),
  ('header', 'Mushrooms',   '/blog',        3, true, '_self'),
  ('header', 'Pricing',     '/pricing',     4, true, '_self'),
  ('header', 'About',       '/about',       5, true, '_self'),
  ('header', 'Contact',     '/contact',     6, true, '_self'),

  -- Footer — Explore column
  ('footer_explore', 'Mushroom Identifier',          '/#identifier',                  1, true, '_self'),
  ('footer_explore', 'Mushroom Parts',               '/mushroom-parts-explained',     2, true, '_self'),
  ('footer_explore', 'Mushroom Identifier Book',     '/mushroom-identifier-book',     3, true, '_self'),
  ('footer_explore', 'Mushroom identification Quiz', '/mushroom-identification-quiz', 4, true, '_self'),
  ('footer_explore', 'Mushrooms Blog',               '/blog',                         5, true, '_self'),
  ('footer_explore', 'Mushroom Identification Price','/pricing',                      6, true, '_self'),

  -- Footer — Company column
  ('footer_company', 'About Us',         '/about',    1, true, '_self'),
  ('footer_company', 'Pricing',          '/pricing',  2, true, '_self'),
  ('footer_company', 'Blog',             '/blog',     3, true, '_self'),
  ('footer_company', 'Contact',          '/contact',  4, true, '_self'),
  ('footer_company', 'Privacy Policy',   '/privacy',  5, true, '_self'),
  ('footer_company', 'Terms of Service', '/terms',    6, true, '_self'),
  ('footer_company', 'Refund Policy',    '/refund',   7, true, '_self'),

  -- Footer — Bottom bar (after copyright)
  ('footer_bottom', 'Privacy',       '/privacy', 1, true, '_self'),
  ('footer_bottom', 'Terms',         '/terms',   2, true, '_self'),
  ('footer_bottom', 'Refund Policy', '/refund',  3, true, '_self')
ON CONFLICT DO NOTHING;
