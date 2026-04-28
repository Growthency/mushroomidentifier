import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'

/**
 * Admin CRUD for /admin/external-links — the nofollow rule registry.
 *
 *   GET    → list all rules (enabled + disabled, for the admin table)
 *   POST   → create a rule. Body { pattern, match_type, note?, enabled? }
 *   PATCH  → update a rule (toggle enabled, edit pattern/note).
 *            Body { id, ...partial fields }
 *   DELETE → remove a rule. Body { id }
 *
 * Every write revalidates the `nofollow-rules` cache tag so the public
 * site sees the change within a request, not the next 60s window.
 */

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

// Heuristic — if the pasted string contains a slash or a query string,
// treat it as an exact URL; otherwise treat it as a domain. Admin can
// override by passing match_type explicitly in the body.
function inferMatchType(pattern: string): 'domain' | 'url' {
  const trimmed = pattern.trim()
  if (/^https?:\/\//i.test(trimmed)) return 'url'
  if (trimmed.includes('/') || trimmed.includes('?')) return 'url'
  return 'domain'
}

function flushCaches() {
  try { revalidateTag('nofollow-rules') } catch { /* noop */ }
}

// ── GET ─────────────────────────────────────────────────────────────────
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await admin
    .from('external_links_nofollow')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rules: data ?? [] })
}

// ── POST ────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const pattern = String(body.pattern ?? '').trim()
  if (!pattern) {
    return NextResponse.json({ error: 'Pattern is required' }, { status: 400 })
  }
  const match_type =
    body.match_type === 'domain' || body.match_type === 'url'
      ? body.match_type
      : inferMatchType(pattern)
  const note = body.note ? String(body.note).trim() : null
  const enabled = body.enabled === false ? false : true

  const { data, error } = await admin
    .from('external_links_nofollow')
    .insert({ pattern, match_type, note, enabled })
    .select()
    .single()

  if (error) {
    // Friendlier error for the unique-key violation.
    if (error.code === '23505' || error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'A rule for this pattern already exists.' },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  flushCaches()
  return NextResponse.json({ rule: data })
}

// ── PATCH ───────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const id = body.id
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const update: Record<string, any> = {}
  if (typeof body.pattern === 'string') update.pattern = body.pattern.trim()
  if (body.match_type === 'domain' || body.match_type === 'url') {
    update.match_type = body.match_type
  }
  if (typeof body.note === 'string') update.note = body.note.trim() || null
  if (typeof body.enabled === 'boolean') update.enabled = body.enabled

  const { data, error } = await admin
    .from('external_links_nofollow')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  flushCaches()
  return NextResponse.json({ rule: data })
}

// ── DELETE ──────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const id = body.id
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await admin
    .from('external_links_nofollow')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  flushCaches()
  return NextResponse.json({ ok: true })
}
