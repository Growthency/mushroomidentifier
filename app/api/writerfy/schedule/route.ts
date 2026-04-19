import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { checkWriterfyAuth } from '@/lib/writerfy-auth'

/**
 * POST /api/writerfy/schedule
 *
 * Marks a single draft to auto-publish at a specific future time. The
 * cron job at /api/cron/publish-scheduled (runs every 5 min) actually
 * does the draft → published flip when the time arrives.
 *
 * Body: { id, scheduledAt | publishAt, status: 'scheduled' }
 *   id                      — the post id returned by /api/writerfy/drafts
 *   scheduledAt / publishAt — ISO 8601 with timezone offset (either works)
 *   status                  — ignored, always treated as 'scheduled'
 *
 * Status codes match the spec:
 *   200 ok
 *   400 post already published / missing fields
 *   401 bad token
 *   404 post not found
 *   422 scheduledAt is in the past
 *
 * Same Bearer token as the other /api/writerfy/* endpoints.
 */

export const runtime = 'nodejs'

function supabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  if (!checkWriterfyAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid JSON body' },
      { status: 400 },
    )
  }

  const { id } = body
  // Spec says both scheduledAt and publishAt are sent for backward compat.
  // Accept either, prefer scheduledAt.
  const whenRaw: string | undefined = body.scheduledAt || body.publishAt
  if (!id || !whenRaw) {
    return NextResponse.json(
      { success: false, error: 'id and scheduledAt are required' },
      { status: 400 },
    )
  }

  const when = new Date(whenRaw)
  if (isNaN(when.getTime())) {
    return NextResponse.json(
      { success: false, error: 'scheduledAt is not a valid ISO 8601 timestamp' },
      { status: 400 },
    )
  }

  // Must be strictly in the future. A small grace period (5s) lets the
  // client's clock drift slightly without us rejecting their request.
  if (when.getTime() <= Date.now() - 5_000) {
    return NextResponse.json(
      { success: false, error: 'scheduledAt must be in the future' },
      { status: 422 },
    )
  }

  const db = supabase()

  // Fetch current post to validate state
  const { data: post, error: fetchErr } = await db
    .from('blog_posts')
    .select('id, slug, status')
    .eq('id', id)
    .maybeSingle()

  if (fetchErr) {
    return NextResponse.json(
      { success: false, error: fetchErr.message },
      { status: 500 },
    )
  }
  if (!post) {
    return NextResponse.json(
      { success: false, error: 'Post not found' },
      { status: 404 },
    )
  }
  if (post.status === 'published') {
    return NextResponse.json(
      { success: false, error: 'Post already published' },
      { status: 400 },
    )
  }

  // Update: flip to scheduled, save the target timestamp, clear any stale
  // published_at (in case this post was previously unpublished and is now
  // being re-scheduled — defensive; not strictly required since RLS hides
  // non-published posts anyway).
  const { data: updated, error: updateErr } = await db
    .from('blog_posts')
    .update({
      status: 'scheduled',
      scheduled_at: when.toISOString(),
      published_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, slug, scheduled_at')
    .single()

  if (updateErr || !updated) {
    return NextResponse.json(
      { success: false, error: updateErr?.message || 'update failed' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    id: updated.id,
    url: `https://mushroomidentifiers.com${updated.slug}`,
    scheduledAt: updated.scheduled_at,
  })
}
