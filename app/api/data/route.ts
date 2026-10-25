import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * The browser's data access (lib/browser-client.ts → .from()).
 *
 * Replaces the Supabase row-level-security policies: every read or delete is
 * pinned to the signed-in user's own rows on the server, whatever filters the
 * browser sent. Only these tables/operations exist:
 *   profiles         select own row; count of users this user referred
 *   analyses         select / delete own rows
 *   saved_articles   select / delete own rows
 *   contact_requests insert (anyone; name, email, subject, message)
 */
const OWNED: Record<string, { owner: string; ops: string[] }> = {
  profiles: { owner: 'id', ops: ['select'] },
  analyses: { owner: 'user_id', ops: ['select', 'delete'] },
  saved_articles: { owner: 'user_id', ops: ['select', 'delete'] },
}
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/
const FILTER_OPS = new Set(['eq', 'neq'])

function bad(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status })
}

export async function POST(req: NextRequest) {
  let q: any
  try {
    q = await req.json()
  } catch {
    return bad('Invalid request')
  }
  const table = String(q?.table || '')
  const op = String(q?.op || 'select')
  const db = getDb()

  // Contact form — public insert with a fixed column set.
  if (table === 'contact_requests' && op === 'insert') {
    const rows = (Array.isArray(q.values) ? q.values : [q.values]).slice(0, 1)
    const r = rows[0] || {}
    const clip = (v: any, n: number) => String(v ?? '').slice(0, n)
    if (!clip(r.email, 320).includes('@') || !clip(r.message, 10000).trim()) return bad('Please fill in your email and message')
    const { error } = await db.from('contact_requests').insert({
      name: clip(r.name, 200),
      email: clip(r.email, 320),
      subject: clip(r.subject, 200),
      message: clip(r.message, 10000),
    })
    if (error) return bad('Could not send your message', 500)
    return NextResponse.json({ data: null, error: null })
  }

  const rule = OWNED[table]
  if (!rule || !rule.ops.includes(op)) return bad('Not allowed', 403)

  const user = await getSessionUser()
  if (!user) return bad('Not signed in', 401)

  const filters: [string, string, any][] = Array.isArray(q.filters) ? q.filters : []
  for (const f of filters) {
    if (!Array.isArray(f) || !IDENT.test(String(f[0])) || !FILTER_OPS.has(String(f[1]))) return bad('Invalid filter')
  }

  // "How many people did I refer?" — the only cross-row read, count only.
  if (table === 'profiles' && q.head && q.count) {
    const onlyReferred = filters.length === 1 && filters[0][0] === 'referred_by' && filters[0][1] === 'eq'
    if (!onlyReferred) return bad('Not allowed', 403)
    const { count, error } = await db.from('profiles').select('id', { count: 'exact', head: true }).eq('referred_by', user.id)
    if (error) return bad('Query failed', 500)
    return NextResponse.json({ data: null, count, error: null })
  }

  let query: any = op === 'delete' ? db.from(table).delete() : db.from(table).select(String(q.columns || '*'), q.count ? { count: 'exact' } : {})
  // The owner filter always comes from the session, never from the browser.
  query = query.eq(rule.owner, user.id)
  for (const [col, fop, value] of filters) {
    if (col === rule.owner) continue
    query = fop === 'eq' ? query.eq(col, value) : query.neq(col, value)
  }
  if (op === 'select') {
    for (const o of Array.isArray(q.order) ? q.order : []) {
      if (IDENT.test(String(o?.[0]))) query = query.order(String(o[0]), { ascending: o[1] !== false })
    }
    if (q.offset != null && q.limit != null) query = query.range(Number(q.offset), Number(q.offset) + Number(q.limit) - 1)
    else if (q.limit != null) query = query.limit(Math.min(Number(q.limit) || 0, 1000))
    if (q.mode === 'single') query = query.single()
    else if (q.mode === 'maybe') query = query.maybeSingle()
  }

  try {
    const { data, count, error } = await query
    if (error) return NextResponse.json({ data: null, count: null, error: { message: error.message, code: error.code } })
    return NextResponse.json({ data, count: count ?? null, error: null })
  } catch (err: any) {
    return bad(err?.message || 'Query failed', 500)
  }
}
