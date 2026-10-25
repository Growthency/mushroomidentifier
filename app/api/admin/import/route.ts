import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getDb, getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * ONE-TIME data import from the Supabase export (2026-10 move to our own
 * server). Disabled unless IMPORT_TOKEN_SHA256 is set; the caller must send
 * the token whose SHA-256 matches. Remove this route after the move.
 *
 *   POST  { table, rows, replace? }  → insert/upsert rows (replace = wipe table first)
 *   PUT   ?path=<bucket>/<file>      → store one file (raw body) under UPLOAD_DIR
 */
const TABLES = new Set([
  'user', 'account', 'achievements', 'ad_units', 'analyses', 'blog_comments', 'blog_posts', 'chat_messages',
  'community_comments', 'community_posts', 'contact_requests', 'external_links_nofollow', 'follows', 'footer_badges',
  'homepage_blocks', 'indexing_cache', 'ip_usage', 'journal_entries', 'menu_items', 'mushrooms', 'page_views',
  'payment_methods', 'post_comments', 'post_likes', 'posts', 'profiles', 'rank_keywords', 'saved_articles',
  'scan_images', 'scans', 'site_scripts', 'site_settings', 'social_links', 'transactions', 'user_credits',
])
const PK: Record<string, string> = {
  site_settings: 'key', indexing_cache: 'url', page_views: 'slug', ip_usage: 'ip_address', user_credits: 'user_id',
  follows: 'follower_id,following_id', post_likes: 'post_id,user_id',
}

function authorized(req: NextRequest) {
  const expected = (process.env.IMPORT_TOKEN_SHA256 || '').trim().toLowerCase()
  if (!/^[0-9a-f]{64}$/.test(expected)) return false
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
  if (token.length < 32) return false
  const got = createHash('sha256').update(token).digest()
  return timingSafeEqual(got, Buffer.from(expected, 'hex'))
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { table, rows, replace } = await req.json()
  if (!TABLES.has(table) || !Array.isArray(rows)) return NextResponse.json({ error: 'bad table' }, { status: 400 })
  const pool = getPool()
  if (!pool) return NextResponse.json({ error: 'no database' }, { status: 503 })

  if (replace) await pool.query(`DELETE FROM "${table}"`)
  const db = getDb()
  let done = 0
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200)
    const { error } = await db.from(table).upsert(chunk, { onConflict: PK[table] || 'id' })
    if (error) return NextResponse.json({ error: error.message, at: i, done }, { status: 500 })
    done += chunk.length
  }
  // Identity columns: continue numbering after the imported ids.
  if (['blog_posts', 'rank_keywords', 'contact_requests'].includes(table)) {
    await pool.query(
      `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), GREATEST((SELECT COALESCE(MAX(id), 0) FROM "${table}"), 1), (SELECT COUNT(*) > 0 FROM "${table}"))`
    )
  }
  const { rows: c } = await pool.query(`SELECT count(*)::int AS n FROM "${table}"`)
  return NextResponse.json({ ok: true, done, total: c[0].n })
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const rel = req.nextUrl.searchParams.get('path') || ''
  const [bucket, ...rest] = rel.split('/')
  if (!bucket || !rest.length) return NextResponse.json({ error: 'bad path' }, { status: 400 })
  const bytes = new Uint8Array(await req.arrayBuffer())
  const { error } = await getDb().storage.from(bucket).upload(rest.join('/'), bytes, { upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, size: bytes.length })
}
