-- Replace the seeded short safety_disclaimer text with the longer
-- compliance-grade version that explicitly names two deadly lookalikes
-- (Amanita phalloides + Galerina marginata) and instructs users to
-- confirm with a qualified expert before consuming.
--
-- Why a migration: the Footer fallback constant in code was already
-- updated, but `Footer.tsx`'s `s()` helper reads `site_settings`
-- BEFORE the fallback (`settings?.[key] || FALLBACK_SETTINGS[key]`),
-- and the original site-content seed had stamped the old short text
-- into the row at /admin/footer-settings → public site. The fallback
-- only kicks in when the DB row is empty / missing.
--
-- Idempotent + admin-respectful: we only update rows whose current
-- value still matches the original seed string. If the site owner has
-- already customised the disclaimer through /admin/footer-settings the
-- WHERE clause won't match and their bespoke text is left untouched.

UPDATE site_settings
SET value = '⚠️ Safety Disclaimer: This mushroom identifier tool provides AI-assisted suggestions only and is not a guarantee of accurate identification. Many mushrooms have toxic lookalikes, including deadly species like Amanita phalloides and Galerina marginata.

Never consume a mushroom based solely on this tool. Always confirm identification with a qualified expert or local mycologist.'
WHERE key = 'safety_disclaimer'
  AND value = '⚠️ Never consume any wild mushroom based solely on AI identification. Always consult a professional mycologist.';
