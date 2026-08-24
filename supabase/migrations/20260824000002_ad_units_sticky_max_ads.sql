-- Adify v2: sticky ads + per-article ad cap
--
--   sticky   — header/sidebar ads can pin themselves and follow the scroll.
--              Defaults TRUE (the admin can untick per ad).
--   max_ads  — for in_content units: the maximum number of ads inserted
--              into one article (admin-typed, e.g. 10 / 15 / 20).
ALTER TABLE ad_units
  ADD COLUMN IF NOT EXISTS sticky BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS max_ads INT NOT NULL DEFAULT 10;
