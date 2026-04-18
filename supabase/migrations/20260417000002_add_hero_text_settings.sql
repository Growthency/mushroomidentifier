-- =============================================================================
-- Migration: homepage hero text — admin-editable title, subtitle, eyebrow.
-- =============================================================================
-- The big H1 and paragraph at the very top of the homepage (above the upload
-- widget) live in app/page.tsx as hardcoded strings. This migration seeds the
-- three corresponding site_settings keys so admins can edit them from
-- /admin/homepage without touching code.
--
-- Fallback rule in app/page.tsx: if the setting value is blank, the original
-- hardcoded string is used — safe rollout.
-- =============================================================================

INSERT INTO site_settings (key, value, type, group_name, label, description, sort_order) VALUES
  ('hero_title',
   'Mushroom Identifier - Free Mushroom Identification App by Picture',
   'text',
   'hero',
   'Hero Title (H1)',
   'The big headline at the top of the homepage. Kept under ~80 chars for good LCP and readability.',
   1),
  ('hero_subtitle',
   'Use our Free mushroom identifier by photo for fast, accurate results with advanced mushroom identifier AI. Upload clear images from multiple angles to instantly identify fungi, detect key features, and receive toxicity warnings plus similar species alerts through our free mushroom identification app.',
   'textarea',
   'hero',
   'Hero Subtitle',
   'The paragraph directly under the H1. Should be 1-3 sentences introducing what the tool does.',
   2),
  ('hero_eyebrow',
   'AI-POWERED · 10,000+ SPECIES · 3 FREE SCANS',
   'text',
   'hero',
   'Hero Eyebrow Badge',
   'The small green pill-shaped badge above the H1. Use · (middle dot) to separate items. Leave blank to hide the badge entirely.',
   3)
ON CONFLICT (key) DO NOTHING;
