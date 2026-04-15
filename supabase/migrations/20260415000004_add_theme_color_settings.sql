-- Theme color customizer — admin can override site CSS variables per theme mode.
-- Accepts any valid CSS color value: hex (#16a34a), rgb/rgba, hsl/hsla, OR full
-- linear-gradient / radial-gradient strings. Empty value = use default from
-- globals.css.
--
-- Layout injects a <style> block that overrides the CSS variables defined in
-- globals.css's `:root, [data-theme="dark"]` and `[data-theme="light"]` blocks.

INSERT INTO site_settings (key, value, type, group_name, label, description, sort_order) VALUES
  -- Dark mode
  ('theme_accent_dark',     '',  'text',     'theme', 'Dark: Accent color',       'Primary brand color in dark mode. Hex (#6fcf7f), rgb(), hsl(), or leave empty for default.', 1),
  ('theme_btn_dark',        '',  'text',     'theme', 'Dark: Button color',       'Primary button color in dark mode. Hex, rgb(), hsl(), or empty for default.',               2),
  ('theme_bg_dark',         '',  'textarea', 'theme', 'Dark: Page background',    'Solid color OR gradient in dark mode. Examples: #0b1912 or linear-gradient(145deg, #0b1912 0%, #190e28 100%).', 3),

  -- Light mode
  ('theme_accent_light',    '',  'text',     'theme', 'Light: Accent color',      'Primary brand color in light mode. Hex, rgb(), hsl(), or empty for default.',               4),
  ('theme_btn_light',       '',  'text',     'theme', 'Light: Button color',      'Primary button color in light mode. Hex, rgb(), hsl(), or empty for default.',              5),
  ('theme_bg_light',        '',  'textarea', 'theme', 'Light: Page background',   'Solid color OR gradient in light mode. Examples: #ffffff or linear-gradient(145deg, #eaf8f2 0%, #f8f0e5 100%).', 6)
ON CONFLICT (key) DO NOTHING;
