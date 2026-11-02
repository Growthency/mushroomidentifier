import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { google } from 'googleapis'
import { createAdminClient as createAdmin } from '@/lib/db'
import { googleAuth } from '@/lib/google-auth'

/**
 * GET /api/cron/publish-scheduled
 *
 * Called every 5 minutes by scripts/cron.mjs (started next to the server in
 * the Docker container) — flips any posts whose scheduled_at has arrived
 * from 'scheduled' → 'published'. Idempotent; safe to run at any frequency.
 *
 * Auth: `Authorization: Bearer $CRON_SECRET` (Coolify generates the
 * secret), so a random person can't hit this URL.
 */

export const runtime = 'nodejs'

// Must be fully dynamic — we want the cron to see fresh data every run.
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://mushroomidentifiers.com'
const INDEXNOW_KEY = 'a1b2c3d4e5f6g7h8i9j0mushroomid2026'

/** Tells IndexNow and Google about posts that just went live. A failure here never blocks publishing. */
async function announce(urls: string[]) {
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: 'mushroomidentifiers.com', key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList: urls }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    console.error('[publish-scheduled] IndexNow failed', err)
  }
  try {
    const indexing = google.indexing({ version: 'v3', auth: googleAuth(['https://www.googleapis.com/auth/indexing']) })
    for (const url of urls) await indexing.urlNotifications.publish({ requestBody: { url, type: 'URL_UPDATED' } })
  } catch (err) {
    console.error('[publish-scheduled] Google request failed', err)
  }
}

function supabase() {
  return createAdmin()
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const header = req.headers.get('authorization') || ''
    if (header === `Bearer ${secret}`) return true
  }
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
  const liveUrls: string[] = []
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
    if (post.slug) liveUrls.push(`${SITE_URL}${post.slug}`)

    // Bust caches so the freshly-live post appears immediately.
    if (post.slug) revalidatePath(post.slug)
  }

  if (publishedIds.length > 0) {
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
    revalidatePath('/feed.xml')
    if (liveUrls.length > 0) await announce(liveUrls)
  }

  return NextResponse.json({
    ok: true,
    published: publishedIds.length,
    publishedIds,
    errors: errors.length > 0 ? errors : undefined,
    at: now.toISOString(),
  })
}
