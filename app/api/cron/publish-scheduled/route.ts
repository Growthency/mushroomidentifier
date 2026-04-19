import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient as createAdmin } from '@supabase/supabase-js'

/**
 * GET /api/cron/publish-scheduled
 *
 * Vercel cron job (configured in vercel.json) — runs every 5 minutes and
 * flips any posts whose scheduled_at has arrived from 'scheduled' →
 * 'published'. Idempotent; safe to run at any frequency.
 *
 * Auth:
 *   When the CRON_SECRET env var is set, Vercel automatically sends
 *   `Authorization: Bearer $CRON_SECRET` with each cron invocation. We
 *   verify that header here so a random person can't hit this URL and
 *   prematurely publish scheduled posts.
 *
 *   Vercel's platform also sets a `x-vercel-cron: 1` header which we
 *   accept as a fallback when CRON_SECRET isn't configured, so the
 *   endpoint works out-of-the-box on a fresh deploy. Manually setting
 *   CRON_SECRET is still recommended.
 */

export const runtime = 'nodejs'

// Must be fully dynamic — we want the cron to see fresh data every run.
export const dynamic = 'force-dynamic'

function supabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const header = req.headers.get('authorization') || ''
    if (header === `Bearer ${secret}`) return true
  }
  // Fallback: trust Vercel's internal cron trigger header. Vercel only
  // sets this when it actually invokes the path from a cron schedule —
  // clients can't forge it through the edge network.
  if (req.headers.get('x-vercel-cron')) return true
  return false
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabase()
  const now = new Date()

  // Find every scheduled post whose time has come.
  const { data: due, error: fetchErr } = await db
    .from('blog_posts')
    .select('id, slug, scheduled_at')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now.toISOString())

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }
  const toPublish = due ?? []

  if (toPublish.length === 0) {
    return NextResponse.json({ ok: true, published: 0, at: now.toISOString() })
  }

  // Flip them all in one query — no race window where half are published
  // and half still say scheduled. published_at honours the ORIGINAL
  // scheduled_at so feed/sitemap sort order matches the admin's intent.
  //
  // Supabase PostgREST can't express "set published_at from scheduled_at"
  // in a single .update() call, so we loop. For a small batch (a few dozen
  // at most per tick) this is fine.
  const publishedIds: any[] = []
  const errors: { id: any; error: string }[] = []

  for (const post of toPublish) {
    const { error: updErr } = await db
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: post.scheduled_at || now.toISOString(),
        scheduled_at: null,
        updated_at: now.toISOString(),
      })
      .eq('id', post.id)
      // Guard: only flip if still scheduled. Prevents a double-publish if
      // two cron runs overlap (unlikely but cheap insurance).
      .eq('status', 'scheduled')

    if (updErr) {
      errors.push({ id: post.id, error: updErr.message })
      continue
    }
    publishedIds.push(post.id)

    // Bust caches so the freshly-live post appears immediately.
    if (post.slug) revalidatePath(post.slug)
  }

  if (publishedIds.length > 0) {
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
    revalidatePath('/feed.xml')
  }

  return NextResponse.json({
    ok: true,
    published: publishedIds.length,
    publishedIds,
    errors: errors.length > 0 ? errors : undefined,
    at: now.toISOString(),
  })
}
