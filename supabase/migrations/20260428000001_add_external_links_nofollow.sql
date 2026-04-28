-- =============================================================================
-- Migration: External-Links nofollow rules
-- =============================================================================
-- Lets the admin centrally control which outbound links on the site get
-- rel="nofollow" attached to them. Two granularities:
--
--   • match_type = 'domain'  — every link whose URL points at this hostname
--                              (and any subdomain) gets nofollow. Typical use
--                              case: paste "amazon.com" once and have all
--                              30k Amazon affiliate links across 1k articles
--                              become nofollow without touching a single
--                              article body.
--
--   • match_type = 'url'     — only this exact URL gets nofollow. Useful
--                              when you want to nofollow a single
--                              competitor link or one specific outbound
--                              source while leaving the rest of that domain
--                              follow.
--
-- The rules live in a tiny lookup table read at request time (cached for
-- 60s via Next.js fetch cache + a `nofollow-rules` revalidate tag, flushed
-- by the admin API on write). Public RLS is read-only for enabled rows.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.external_links_nofollow (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern     TEXT         NOT NULL,
  match_type  TEXT         NOT NULL CHECK (match_type IN ('domain', 'url')),
  note        TEXT,
  enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Same pattern + same match_type = same rule. Prevents the admin UI from
-- accidentally inserting "amazon.com" twice.
CREATE UNIQUE INDEX IF NOT EXISTS external_links_nofollow_pattern_type_idx
  ON public.external_links_nofollow (LOWER(pattern), match_type);

-- Fast lookup of enabled rules (the only ones the public site reads).
CREATE INDEX IF NOT EXISTS external_links_nofollow_enabled_idx
  ON public.external_links_nofollow (enabled);

-- Auto-bump updated_at on every UPDATE. Keeps cache-bust logic honest.
CREATE OR REPLACE FUNCTION public.set_external_links_nofollow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS external_links_nofollow_updated_at_trg
  ON public.external_links_nofollow;

CREATE TRIGGER external_links_nofollow_updated_at_trg
  BEFORE UPDATE ON public.external_links_nofollow
  FOR EACH ROW
  EXECUTE FUNCTION public.set_external_links_nofollow_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────
-- Public (anon + authenticated) can READ enabled rules so the article
-- renderer on the public site can fetch them. Writes are restricted to
-- the service-role client used inside the admin API routes.
ALTER TABLE public.external_links_nofollow ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS external_links_nofollow_read_enabled
  ON public.external_links_nofollow;

CREATE POLICY external_links_nofollow_read_enabled
  ON public.external_links_nofollow
  FOR SELECT
  USING (enabled = TRUE);
