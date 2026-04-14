-- WordPress-style full footer/site content control
-- Admin can edit every text, image, social icon, payment badge, and partner badge
-- through the admin dashboard without touching code.

-- ============================================================================
-- 1. site_settings — key-value store for all text/URL content
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key          TEXT PRIMARY KEY,
  value        TEXT,
  type         TEXT NOT NULL DEFAULT 'text'
                 CHECK (type IN ('text', 'textarea', 'url', 'email', 'image', 'number')),
  group_name   TEXT NOT NULL DEFAULT 'general',
  label        TEXT,
  description  TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_group ON site_settings (group_name, sort_order);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- ============================================================================
-- 2. social_links — social media icons (Instagram, X, Facebook, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS social_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label       TEXT NOT NULL,
  href        TEXT NOT NULL,
  icon_svg    TEXT NOT NULL,
  bg_color    TEXT NOT NULL DEFAULT '#000000',
  icon_color  TEXT NOT NULL DEFAULT '#ffffff',
  sort_order  INT NOT NULL DEFAULT 0,
  enabled     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_sort ON social_links (sort_order);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read enabled social links" ON social_links;
CREATE POLICY "Anyone can read enabled social links"
  ON social_links FOR SELECT TO anon, authenticated USING (enabled = true);

CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_social_links_updated_at ON social_links;
CREATE TRIGGER trg_social_links_updated_at
  BEFORE UPDATE ON social_links FOR EACH ROW
  EXECUTE FUNCTION update_social_links_updated_at();

-- ============================================================================
-- 3. payment_methods — VISA, MasterCard, PayPal, etc.
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label         TEXT NOT NULL,          -- aria-label e.g. "VISA"
  display_html  TEXT NOT NULL,          -- inner content (plain text or HTML)
  bg_color      TEXT NOT NULL DEFAULT '#1A1F71',
  text_color    TEXT NOT NULL DEFAULT '#ffffff',
  sort_order    INT NOT NULL DEFAULT 0,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_sort ON payment_methods (sort_order);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read enabled payment methods" ON payment_methods;
CREATE POLICY "Anyone can read enabled payment methods"
  ON payment_methods FOR SELECT TO anon, authenticated USING (enabled = true);

CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER trg_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();

-- ============================================================================
-- 4. footer_badges — partner/feature badges (ShowMeBest, Fazier, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS footer_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location    TEXT NOT NULL CHECK (location IN ('footer_explore', 'footer_company')),
  image_url   TEXT NOT NULL,
  link_url    TEXT NOT NULL,
  alt_text    TEXT,
  width       INT NOT NULL DEFAULT 120,
  height      INT,
  sort_order  INT NOT NULL DEFAULT 0,
  enabled     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_footer_badges_location ON footer_badges (location, sort_order);

ALTER TABLE footer_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read enabled footer badges" ON footer_badges;
CREATE POLICY "Anyone can read enabled footer badges"
  ON footer_badges FOR SELECT TO anon, authenticated USING (enabled = true);

CREATE OR REPLACE FUNCTION update_footer_badges_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_footer_badges_updated_at ON footer_badges;
CREATE TRIGGER trg_footer_badges_updated_at
  BEFORE UPDATE ON footer_badges FOR EACH ROW
  EXECUTE FUNCTION update_footer_badges_updated_at();

-- ============================================================================
-- SEED: site_settings (all current hardcoded text — identical look after apply)
-- ============================================================================
INSERT INTO site_settings (key, value, type, group_name, label, sort_order) VALUES
  -- Brand (logo + brand column in footer)
  ('brand_logo_emoji',        '🍄',                                                                                         'text',     'brand',   'Logo emoji',                     1),
  ('brand_name_prefix',       'Mushroom',                                                                                    'text',     'brand',   'Brand name (first part)',        2),
  ('brand_name_suffix',       'Identifiers',                                                                                 'text',     'brand',   'Brand name (accent part)',       3),
  ('footer_description_1',    'AI-powered mushroom identification for safe foraging — instant species ID, toxicity warnings, and look-alike alerts.', 'textarea', 'brand', 'Footer description (line 1)', 4),
  ('footer_description_2',    'Trusted by foragers, hikers, and mycology enthusiasts worldwide. Upload a photo and get expert-level analysis in seconds.', 'textarea', 'brand', 'Footer description (line 2)', 5),
  ('footer_highlight',        'Free to start — no signup required.',                                                        'text',     'brand',   'Footer highlight line',          6),
  ('contact_email',           'support@mushroomidentifiers.com',                                                             'email',    'brand',   'Contact email',                  7),

  -- CTA section (above footer: "Start Identifying Safely Today")
  ('cta_heading',             'Start Identifying Safely Today',                                                              'text',     'cta',     'CTA heading',                    1),
  ('cta_subtitle',            'Join thousands of foragers using AI-powered identification',                                  'text',     'cta',     'CTA subtitle',                   2),
  ('cta_primary_text',        'Try Free — No Signup →',                                                                       'text',     'cta',     'Primary button text',            3),
  ('cta_primary_href',        '/#identifier',                                                                                'url',      'cta',     'Primary button URL',             4),
  ('cta_secondary_text',      'View Pricing',                                                                                'text',     'cta',     'Secondary button text',          5),
  ('cta_secondary_href',      '/pricing',                                                                                    'url',      'cta',     'Secondary button URL',           6),

  -- Payment / Secure Payment section
  ('payment_heading',         'Secure Payment',                                                                              'text',     'payment', 'Section heading',                1),
  ('payment_badge_label',     'Guaranteed',                                                                                  'text',     'payment', 'Trust badge label (small)',      2),
  ('payment_badge_sublabel',  'Secure Payment',                                                                              'text',     'payment', 'Trust badge sublabel',           3),
  ('payment_description',     '256-bit SSL encryption · No hidden charges',                                                  'text',     'payment', 'Trust badge description',        4),
  ('payment_accept_label',    'We Accept',                                                                                   'text',     'payment', '"We Accept" label',              5),
  ('premium_cta_text',        '✦ Get Premium Access',                                                                        'text',     'payment', 'Premium CTA button text',        6),
  ('premium_cta_href',        '/pricing',                                                                                    'url',      'payment', 'Premium CTA button URL',         7),

  -- Column headings
  ('footer_explore_heading',  'Explore',                                                                                     'text',     'columns', 'Explore column heading',         1),
  ('footer_company_heading',  'Company',                                                                                     'text',     'columns', 'Company column heading',         2),

  -- Bottom bar
  ('copyright_text',          '© 2026 MushroomIdentifiers.com · All rights reserved · Educational purposes only',            'text',     'bottom',  'Copyright text',                 1),
  ('safety_disclaimer',       '⚠️ Never consume any wild mushroom based solely on AI identification. Always consult a professional mycologist.', 'textarea', 'bottom',  'Safety disclaimer (bottom bar)', 2)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- SEED: social_links (current 6 platforms with exact SVGs)
-- ============================================================================
INSERT INTO social_links (label, href, icon_svg, bg_color, icon_color, sort_order, enabled) VALUES
  ('Instagram',
   'https://www.instagram.com/mushroomidentifiers/',
   '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>',
   '#E1306C', '#ffffff', 1, true),

  ('X (Twitter)',
   'https://x.com/MIdentifiers',
   '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>',
   '#000000', '#ffffff', 2, true),

  ('Facebook',
   'https://www.facebook.com/mushroomidentifiers/',
   '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>',
   '#1877F2', '#ffffff', 3, true),

  ('Pinterest',
   'https://www.pinterest.com/mushroomidentifiers/',
   '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>',
   '#E60023', '#ffffff', 4, true),

  ('LinkedIn',
   'https://www.linkedin.com/company/mushroom-identifiers/',
   '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>',
   '#0A66C2', '#ffffff', 5, true),

  ('About.me',
   'https://about.me/mushroomidentifiers',
   '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>',
   '#00A98F', '#ffffff', 6, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: payment_methods (current 8 badges with exact styling)
-- ============================================================================
INSERT INTO payment_methods (label, display_html, bg_color, text_color, sort_order, enabled) VALUES
  ('VISA',       'VISA',                                                                                                                                                                                                                                                                                       '#1A1F71', '#ffffff', 1, true),
  ('MasterCard', '<span style="width:16px;height:16px;border-radius:9999px;display:inline-block;background:#EB001B"></span><span style="width:16px;height:16px;border-radius:9999px;display:inline-block;background:#F79E1B;opacity:0.9;margin-left:-8px"></span>', '#252525', '#ffffff', 2, true),
  ('PayPal',     'Pay<span style="color:#009CDE">Pal</span>',                                                                                                                                                                                                                                                 '#003087', '#ffffff', 3, true),
  ('AMEX',       'AMEX',                                                                                                                                                                                                                                                                                       '#2E77BC', '#ffffff', 4, true),
  ('Apple Pay',  '⌘ Pay',                                                                                                                                                                                                                                                                                      '#000000', '#ffffff', 5, true),
  ('Google Pay', 'G Pay',                                                                                                                                                                                                                                                                                      '#ffffff', '#3c4043', 6, true),
  ('Paddle',     'Paddle',                                                                                                                                                                                                                                                                                     '#0070E0', '#ffffff', 7, true),
  ('2Checkout',  '2Checkout',                                                                                                                                                                                                                                                                                  '#E2342D', '#ffffff', 8, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: footer_badges (ShowMeBest + Fazier)
-- ============================================================================
INSERT INTO footer_badges (location, image_url, link_url, alt_text, width, height, sort_order, enabled) VALUES
  ('footer_explore',
   'https://showmebest.ai/badge/feature-badge-white.webp',
   'https://showmebest.ai',
   'Featured on ShowMeBestAI',
   180, 49, 1, true),

  ('footer_company',
   'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light',
   'https://fazier.com/launches/mushroomidentifiers.com',
   'Fazier badge',
   120, NULL, 1, true)
ON CONFLICT DO NOTHING;
