-- =============================================================================
-- Migration: rewrite sitewide CTA button to "Start Free — No Credit Card →"
--            + redirect click to /signup instead of /#identifier
-- =============================================================================
-- Context: the app now requires a free account to use the free tier (3
-- lifetime identifications), so "No Signup" was misleading. New copy
-- reframes the CTA around the real no-friction value prop ("No Credit
-- Card") and sends clicks to /signup instead of the on-page identifier
-- anchor.
--
-- Surgical rewrite: text only changes if the row still contains one of
-- the old phrases ("No Signup" OR "Free Account Required"). href only
-- changes if still pointing at the on-page anchor. Admin customisations
-- to other values are preserved.
-- =============================================================================

-- 1. Update the button text
UPDATE site_settings
SET    value = 'Start Free — No Credit Card →'
WHERE  key = 'cta_primary_text'
  AND  (value LIKE '%No Signup%' OR value LIKE '%Free Account Required%');

-- 2. Update the button link destination
UPDATE site_settings
SET    value = '/signup'
WHERE  key = 'cta_primary_href'
  AND  value IN ('/#identifier', '#identifier', '/');
