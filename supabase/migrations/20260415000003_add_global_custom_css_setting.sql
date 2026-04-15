-- Global sitewide Custom CSS (WordPress "Additional CSS" style)
-- Admin edits CSS from /admin/custom-css; rules inject into every page's <head>.
-- Loads AFTER global stylesheets so source-order specificity lets rules win.

INSERT INTO site_settings (key, value, type, group_name, label, description, sort_order) VALUES
  ('global_custom_css',
   '',
   'textarea',
   'styling',
   'Global Custom CSS',
   'CSS rules added here are injected into every page''s <head>. Loads after global stylesheets so your rules win by source-order specificity (matches WordPress Additional CSS behavior). Leave empty to disable.',
   1)
ON CONFLICT (key) DO NOTHING;
