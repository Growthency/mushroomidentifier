-- =============================================================================
-- Migration: brand_logo_emoji field now accepts EITHER an emoji OR an image URL/path.
-- =============================================================================
-- The Footer component was updated to auto-detect: if the value starts with `/`,
-- `http://`, `https://`, or ends in a common image extension, it renders as an
-- <img>; otherwise as plain text (emoji / glyph).
--
-- This migration:
--   1. Upgrades the default value from '🍄' to the new branded app-icon logo at
--      /logo-header.png — but ONLY for rows that still hold the stock '🍄'
--      emoji, so any admin who already customised the field keeps their value.
--   2. Clarifies the admin UI label + description so operators know they can
--      paste either an emoji or an image URL.
--
-- Idempotent: safe to re-run. Uses WHERE guards so repeated runs are no-ops.
-- =============================================================================

UPDATE site_settings
SET
  value = '/logo-header.png',
  label = 'Logo (emoji or image URL)',
  description = 'Paste an emoji (e.g. 🍄) OR an image path/URL (e.g. /logo-header.png, https://example.com/logo.svg). Image paths that start with / are loaded from the public folder.'
WHERE key = 'brand_logo_emoji'
  AND value = '🍄';

-- For rows that already hold a custom value, only update the label + description
-- so the admin UI explains both options, without touching the value itself.
UPDATE site_settings
SET
  label = 'Logo (emoji or image URL)',
  description = 'Paste an emoji (e.g. 🍄) OR an image path/URL (e.g. /logo-header.png, https://example.com/logo.svg). Image paths that start with / are loaded from the public folder.'
WHERE key = 'brand_logo_emoji'
  AND (label IS DISTINCT FROM 'Logo (emoji or image URL)'
       OR description IS DISTINCT FROM 'Paste an emoji (e.g. 🍄) OR an image path/URL (e.g. /logo-header.png, https://example.com/logo.svg). Image paths that start with / are loaded from the public folder.');
