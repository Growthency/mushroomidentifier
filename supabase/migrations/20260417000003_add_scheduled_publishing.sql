-- =============================================================================
-- Migration: Scheduled publishing for blog_posts.
-- =============================================================================
-- Adds a third status value ('scheduled') and a scheduled_at timestamp so
-- Writerfy (and any future bulk-scheduler UI) can queue drafts to auto-
-- publish at a specific future time.
--
-- Flow:
--   1. Admin/Writerfy POSTs to /api/writerfy/schedule with an ISO timestamp
--      → post.status becomes 'scheduled', post.scheduled_at is set
--   2. The Vercel cron job /api/cron/publish-scheduled runs every 5 min:
--      SELECT * FROM blog_posts
--      WHERE status = 'scheduled' AND scheduled_at <= NOW()
--      → flips each to status='published' and sets published_at=NOW()
--
-- Public visibility: all public read paths already filter status='published'
-- (verified in app/blog, app/[slug], sitemap, feed, api/blog/*), so the
-- scheduled state is invisible to visitors until the cron flips it. RLS also
-- enforces status='published' as a policy-level guarantee.
-- =============================================================================

-- 1. Add the scheduled_at column (nullable — only set when status='scheduled')
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN blog_posts.scheduled_at IS
  'When status=scheduled, the ISO timestamp the cron job should flip the post to published. NULL when status is draft or published.';

-- 2. Partial index that makes the cron query cheap: only indexes rows the
-- cron actually cares about. Tiny, stays tiny forever (rows move to
-- published and drop out of this index).
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled
  ON blog_posts (scheduled_at)
  WHERE status = 'scheduled';

-- 3. Status column has no CHECK constraint — 'scheduled' works as a string
-- value without further changes. Document the new accepted values.
COMMENT ON COLUMN blog_posts.status IS
  'Post lifecycle: draft (invisible) → scheduled (invisible, awaiting scheduled_at) → published (live). Cron job handles the scheduled → published transition.';
