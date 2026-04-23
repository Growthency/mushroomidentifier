-- =============================================================================
-- Migration: update sitewide CTA button text from "No Signup" → "Free Account Required"
-- =============================================================================
-- The hardcoded fallback in components/layout/Footer.tsx was updated but the
-- DB row in site_settings had been seeded/edited earlier with the old text,
-- and the DB value wins over the fallback. This migration surgically rewrites
-- the value ONLY when it still matches the old "No Signup" phrasing — if the
-- admin has customized it to something else entirely, we leave their choice
-- alone.
-- =============================================================================

UPDATE site_settings
SET    value = 'Try Free — Free Account Required →'
WHERE  key = 'cta_primary_text'
  AND  value LIKE '%No Signup%';
