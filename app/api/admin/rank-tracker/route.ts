import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createAdminClient as createClient } from '@/lib/db'
import { getSessionUser } from '@/lib/session'
import { isAdminEmail } from '@/lib/admin'
import { googleAuth, searchConsoleProperty } from '@/lib/google-auth'

export const dynamic = 'force-dynamic'

const supabase = createClient()

async function requireAdmin() {
  const user = await getSessionUser()
  return user && isAdminEmail(user.email) ? user : null
}

/**
 * SerpAPI keys, in priority order. We support a primary + backup so the
 * site owner can stack two free-tier accounts (250 searches / 30 days
 * each) into an effective 500/30d. When the primary key returns a
 * quota-exhausted error, `serpFetch` automatically retries with the
 * backup. Both keys are read from env vars — never hardcoded — so the
 * repo stays safe to publish.
 */
const SERPAPI_KEYS: string[] = [
  process.env.SERPAPI_KEY,
  process.env.SERPAPI_KEY_BACKUP,
].filter(Boolean) as string[]
const SITE_DOMAIN = 'mushroomidentifiers.com'

// Free-tier SerpAPI plans reset on a rolling 30-day window anchored to
// the account's signup moment, NOT the 1st of the calendar month — the
// previous "first of next month" fallback was wrong for free accounts
// and made the dashboard show a refill date that came and went without
// the quota actually refilling. Keeping this constant explicit makes
// the math obvious.
const ROLLING_CYCLE_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Compute the next quota-reset moment for one SerpAPI account.
 *
 * Strategy (most-trusted → fallback):
 *   1. Honour any explicit reset field SerpAPI returns
 *      (`next_billing_at`, `subscription_renewed_at`, `reset_at`,
 *      `plan_next_reset_at`, `next_reset_at`).
 *   2. Compute from the account's signup timestamp + N rolling 30-day
 *      cycles — works for free-tier accounts where the API doesn't
 *      report an explicit next-reset. Looks at common signup-field
 *      names AND a manual override env var
 *      (SERPAPI_ACCOUNT_CREATED_AT / SERPAPI_ACCOUNT_CREATED_AT_BACKUP)
 *      so the owner can pin the correct anchor when the API doesn't
 *      surface it.
 *   3. Final fallback: 30 days from now (still better than the old
 *      "1st of next calendar month" which was always wrong for free).
 */
function computeResetAt(acc: any, anchorOverride?: string): string {
  // 1. Explicit reset fields
  const explicit = [
    acc?.next_billing_at,
    acc?.subscription_renewed_at,
    acc?.reset_at,
    acc?.plan_next_reset_at,
    acc?.next_reset_at,
  ]
  for (const c of explicit) {
    if (typeof c === 'string' && !isNaN(Date.parse(c))) {
      return new Date(c).toISOString()
    }
    if (typeof c === 'number' && c > 0) {
      // SerpAPI sometimes uses unix-seconds, sometimes ms — distinguish
      // by magnitude so we don't land in the year 50000.
      return new Date(c < 1e12 ? c * 1000 : c).toISOString()
    }
  }

  // 2. Compute from account-creation anchor
  const creationCandidates = [
    acc?.account_created_at,
    acc?.created_at,
    acc?.plan_subscription_started_at,
    anchorOverride,
  ]
  for (const c of creationCandidates) {
    if (typeof c === 'string' && !isNaN(Date.parse(c))) {
      const created = new Date(c).getTime()
      const now = Date.now()
      const cyclesPassed = Math.floor(Math.max(0, now - created) / ROLLING_CYCLE_MS)
      const nextReset = created + (cyclesPassed + 1) * ROLLING_CYCLE_MS
      return new Date(nextReset).toISOString()
    }
  }

  // 3. Final fallback — 30 days out, NOT 1st of next calendar month.
  return new Date(Date.now() + ROLLING_CYCLE_MS).toISOString()
}

interface KeyQuota {
  used: number
  limit: number
  remaining: number
  resetAt: string
  planName: string | null
}

/**
 * Fetch quota for one SerpAPI key, returning null if the key is missing
 * fields (e.g. invalid response, network error). The optional
 * `anchorOverride` lets the caller pass a known signup date when SerpAPI
 * doesn't include one.
 */
async function fetchKeyQuota(key: string, anchorOverride?: string): Promise<KeyQuota | null> {
  try {
    const res = await fetch(`https://serpapi.com/account.json?api_key=${key}`, { cache: 'no-store' })
    const acc = await res.json()
    if (acc?.total_searches_left === undefined && acc?.searches_per_month === undefined) {
      return null
    }
    const limit = acc.searches_per_month || 250
    const planLeft = acc.plan_searches_left ?? acc.total_searches_left ?? limit
    const totalLeft = acc.total_searches_left ?? planLeft
    const used = Math.max(0, limit - planLeft)
    return {
      used,
      limit,
      remaining: totalLeft,
      resetAt: computeResetAt(acc, anchorOverride),
      planName: acc.plan_name || acc.plan_id || null,
    }
  } catch {
    return null
  }
}

/**
 * Combined quota across all configured keys, so the dashboard shows
 * "X / 500 used" instead of "X / 250" when both primary + backup are
 * active. Reset date is the earliest upcoming refill across keys —
 * that's the next moment the user's TOTAL pool actually grows.
 */
async function getCombinedQuota() {
  if (SERPAPI_KEYS.length === 0) {
    return {
      used: 0,
      limit: 0,
      remaining: 0,
      resetAt: computeResetAt(null),
      planName: null,
      keyCount: 0,
    }
  }

  const anchors = [
    process.env.SERPAPI_ACCOUNT_CREATED_AT,
    process.env.SERPAPI_ACCOUNT_CREATED_AT_BACKUP,
  ]
  const results = await Promise.all(
    SERPAPI_KEYS.map((k, i) => fetchKeyQuota(k, anchors[i]))
  )

  let used = 0, limit = 0, remaining = 0
  let earliestReset: number | null = null
  let planName: string | null = null
  let keyCount = 0
  for (const r of results) {
    if (!r) continue
    keyCount += 1
    used += r.used
    limit += r.limit
    remaining += r.remaining
    const ts = new Date(r.resetAt).getTime()
    if (earliestReset === null || ts < earliestReset) earliestReset = ts
    planName = planName || r.planName
  }

  return {
    used,
    limit: limit || 250,
    remaining,
    resetAt: earliestReset ? new Date(earliestReset).toISOString() : computeResetAt(null),
    planName,
    keyCount,
  }
}

/**
 * SerpAPI quota-exhausted error message detector. SerpAPI uses several
 * variants depending on tier and exhaustion path; we accept any of them.
 */
function isQuotaError(msg: string | undefined | null): boolean {
  if (!msg) return false
  return /search(es)?\s+(ran|run)\s+out|exceeded|out of (search|credit)|monthly\s+limit|account\s+ran|over\s+the\s+limit|hourly\s+searches/i.test(msg)
}

/**
 * Fan-out search call: tries the primary key, automatically retries with
 * the backup key on a quota-exhausted error. Pass everything except
 * `api_key` in `searchParams` — this helper handles the key rotation.
 */
async function serpFetch(searchParams: Record<string, string>): Promise<{ data: any; keyIndex: number }> {
  if (SERPAPI_KEYS.length === 0) {
    return { data: { error: 'No SERPAPI_KEY configured' }, keyIndex: -1 }
  }
  let lastError: any = null
  for (let i = 0; i < SERPAPI_KEYS.length; i++) {
    const key = SERPAPI_KEYS[i]
    const params = new URLSearchParams({ ...searchParams, api_key: key })
    const url = `https://serpapi.com/search.json?${params.toString()}`
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data?.error && isQuotaError(data.error) && i < SERPAPI_KEYS.length - 1) {
        // Quota exhausted on this key AND we have another to try — fail over.
        lastError = data.error
        continue
      }
      return { data, keyIndex: i }
    } catch (e: any) {
      lastError = e?.message || String(e)
      if (i >= SERPAPI_KEYS.length - 1) break
    }
  }
  return { data: { error: lastError || 'All SerpAPI keys exhausted' }, keyIndex: -1 }
}

// One request per keyword: Google's top 100 in a single page, so a check
// costs 1 credit instead of up to 10 and positions need no page math.
const SERP_BASE_PARAMS = {
  engine: 'google',
  location: 'United States',
  google_domain: 'google.com',
  gl: 'us',
  hl: 'en',
  num: '100',
}

type Device = 'desktop' | 'mobile'
const asDevice = (v: any): Device => (v === 'mobile' ? 'mobile' : 'desktop')

/** Hostname of a displayed_link like "https://www.site.com › path" or "site.com/path". */
function hostOf(value: string): string {
  const raw = String(value || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
  return raw.split(/[\s/›>]/)[0]
}

const isOurHost = (host: string) => host === SITE_DOMAIN || host.endsWith(`.${SITE_DOMAIN}`)

/** Google's /goto redirect wrapper (SerpAPI sometimes passes it through). */
const isGotoLink = (link: string) => /google\.[a-z.]+\/(goto|url)\?/i.test(String(link || ''))

const gotoCache = new Map<string, string | null>()

/** Follow a google.com/goto link once to learn the destination; null when Google won't say. */
async function resolveGoto(link: string): Promise<string | null> {
  if (gotoCache.has(link)) return gotoCache.get(link)!
  let target: string | null = null
  try {
    const u = new URL(link)
    const direct = u.searchParams.get('url') || u.searchParams.get('q')
    if (direct && /^https?:\/\//i.test(direct)) target = direct
    if (!target) {
      const res = await fetch(link, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(6000), headers: { 'User-Agent': 'Mozilla/5.0' } })
      const loc = res.headers.get('location')
      if (loc && /^https?:\/\//i.test(loc)) target = loc
    }
  } catch {
    target = null
  }
  gotoCache.set(link, target)
  return target
}

/**
 * Find mushroomidentifiers.com in a SerpAPI result list. Matches on the
 * real link, on displayed_link (which still shows the true domain when
 * the link is a Google /goto redirect) and, as a last resort, by resolving
 * the redirect. Returns the absolute position and the page URL.
 */
async function findOurs(organic: any[]): Promise<{ position: number; url: string } | null> {
  for (let i = 0; i < organic.length; i++) {
    const r = organic[i]
    const link: string = r.link || ''
    const position = Number(r.position) || i + 1
    let host = ''
    try { host = new URL(link).hostname.replace(/^www\./, '').toLowerCase() } catch { host = hostOf(link) }
    if (isOurHost(host)) return { position, url: link }
    if (isGotoLink(link)) {
      const shown = hostOf(r.displayed_link || '')
      if (isOurHost(shown)) {
        const real = await resolveGoto(link)
        return { position, url: real && isOurHost(hostOf(real)) ? real : `https://${SITE_DOMAIN}/` }
      }
    }
  }
  return null
}

/** One SerpAPI call (top 100); throws with SerpAPI's message on error. */
async function lookupRank(keyword: string, device: Device) {
  const { data } = await serpFetch({ ...SERP_BASE_PARAMS, q: keyword, device })
  if (data.error) {
    // "Google hasn't returned any results" is a real answer, not a failure.
    if (/hasn't returned any results/i.test(data.error)) return { position: null, url: '', total: 0 }
    throw new Error(data.error)
  }
  const organic: any[] = data.organic_results || []
  let found = await findOurs(organic)
  if (!found) {
    const featured = data.answer_box || data.knowledge_graph
    const fl: string = featured?.link || ''
    if (fl && (isOurHost(hostOf(fl)) || (isGotoLink(fl) && isOurHost(hostOf(featured?.displayed_link || ''))))) {
      found = { position: 1, url: isGotoLink(fl) ? `https://${SITE_DOMAIN}/` : fl }
    }
  }
  return { position: found?.position ?? null, url: found?.url ?? '', total: organic.length }
}

/** Check one keyword row and save it; an API error keeps the old position. */
async function checkKeyword(kw: any, device: Device) {
  const prevPosition = kw.position
  try {
    const { position, url, total } = await lookupRank(kw.keyword, device)
    const change = prevPosition && position ? prevPosition - position : null
    await supabase.from('rank_keywords').update({
      prev_position: prevPosition,
      position,
      rank_url: url || null,
      change,
      device,
      last_error: null,
      checked_at: new Date().toISOString(),
    }).eq('id', kw.id)
    return { id: kw.id, keyword: kw.keyword, position, prev_position: prevPosition, change, rank_url: url, total_organic: total, device }
  } catch (err: any) {
    const message = String(err?.message || err).slice(0, 200)
    await supabase.from('rank_keywords').update({ last_error: message, checked_at: new Date().toISOString() }).eq('id', kw.id)
    return { id: kw.id, keyword: kw.keyword, position: prevPosition, prev_position: kw.prev_position, change: kw.change, rank_url: kw.rank_url, error: message, device }
  }
}

// Search Console's own average position per tracked keyword (last 28 days,
// all countries and devices): Google's number next to the SERP check.
const gscCache = new Map<string, { at: number; rows: Map<string, any> }>()

async function gscPositions(keywords: string[]) {
  const key = keywords.slice().sort().join('|')
  const hit = gscCache.get(key)
  if (hit && Date.now() - hit.at < 60 * 60 * 1000) return hit.rows
  const rows = new Map<string, any>()
  try {
    const auth = googleAuth(['https://www.googleapis.com/auth/webmasters.readonly'])
    const sc = google.searchconsole({ version: 'v1', auth })
    const siteUrl = await searchConsoleProperty()
    const end = new Date(); end.setDate(end.getDate() - 1)
    const start = new Date(end); start.setDate(start.getDate() - 27)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)
    for (const kw of keywords) {
      const res = await sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: fmt(start), endDate: fmt(end), dimensions: ['query'], type: 'web', rowLimit: 1,
          dimensionFilterGroups: [{ filters: [{ dimension: 'query', operator: 'equals', expression: kw }] }],
        },
      }, { timeout: 10000 })
      const row = res.data.rows?.[0]
      if (row) rows.set(kw, { position: Number((row.position || 0).toFixed(1)), clicks: row.clicks || 0, impressions: row.impressions || 0 })
    }
    gscCache.set(key, { at: Date.now(), rows })
  } catch (err: any) {
    console.error('[rank-tracker] GSC positions failed:', err?.message || err)
  }
  return rows
}

// ── GET: list keywords + account quota ──
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: keywords, error } = await supabase
    .from('rank_keywords')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const gsc = await gscPositions((keywords || []).map((k: any) => k.keyword))
  const withGsc = (keywords || []).map((k: any) => ({ ...k, gsc: gsc.get(k.keyword) || null }))

  // Combined quota across all configured SerpAPI keys (primary + backup).
  // The dashboard now sees one pooled "X / 500 used" number with a single
  // earliest-refill date instead of per-key noise.
  const quota = await getCombinedQuota()

  return NextResponse.json({ keywords: withGsc, quota })
}

// ── POST: add keyword OR run check ──
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const device = asDevice(body.device)

  // --- Add keyword ---
  if (body.action === 'add') {
    const keyword = (body.keyword || '').trim().toLowerCase()
    if (!keyword || keyword.length < 2) {
      return NextResponse.json({ error: 'Keyword too short' }, { status: 400 })
    }

    // Check duplicate
    const { data: existing } = await supabase
      .from('rank_keywords')
      .select('id')
      .eq('keyword', keyword)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Keyword already exists' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('rank_keywords')
      .insert({ keyword })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ keyword: data })
  }

  // --- Run rank check (all keywords) ---
  if (body.action === 'check') {
    if (SERPAPI_KEYS.length === 0) {
      return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 })
    }
    const { data: keywords } = await supabase
      .from('rank_keywords')
      .select('*')
      .order('created_at', { ascending: true })
    if (!keywords?.length) {
      return NextResponse.json({ error: 'No keywords to check' }, { status: 400 })
    }
    const results = []
    for (const kw of keywords) results.push(await checkKeyword(kw, device))
    return NextResponse.json({ results, checked: results.length, device })
  }

  // --- Check single keyword ---
  if (body.action === 'check_single') {
    if (SERPAPI_KEYS.length === 0) {
      return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 })
    }
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing keyword id' }, { status: 400 })
    const { data: kw, error: kwErr } = await supabase
      .from('rank_keywords')
      .select('*')
      .eq('id', id)
      .single()
    if (kwErr || !kw) return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
    const result = await checkKeyword(kw, device)
    if (result.error) return NextResponse.json({ error: result.error, result }, { status: 502 })
    return NextResponse.json({ result })
  }

  // --- Debug: test a single keyword and return raw results ---
  if (body.action === 'debug') {
    const keyword = (body.keyword || '').trim()
    if (!keyword) return NextResponse.json({ error: 'Missing keyword' }, { status: 400 })

    if (SERPAPI_KEYS.length === 0) {
      return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 })
    }

    const { data, keyIndex } = await serpFetch({
      ...SERP_BASE_PARAMS,
      q: keyword,
      device,
    })

    // Extract just the info we need for debugging
    const organic = (data.organic_results || []).map((r: any, i: number) => ({
      pos: r.position ?? i + 1,
      title: r.title?.slice(0, 60),
      link: r.link,
      displayed: r.displayed_link,
    }))
    const ours = await findOurs(data.organic_results || [])

    return NextResponse.json({
      error: data.error || null,
      device,
      search_info: data.search_information,
      total_organic: organic.length,
      top_results: organic.slice(0, 15),
      our_match: ours,
      // Surface which key handled this debug call so the owner can
      // verify the failover is wired (0 = primary, 1 = backup).
      key_used: keyIndex,
      keys_configured: SERPAPI_KEYS.length,
    })
  }

  // --- Update volume ---
  if (body.action === 'update_volume') {
    const { id, volume } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase
      .from('rank_keywords')
      .update({ volume: volume || null })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// ── DELETE: remove keyword ──
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('rank_keywords')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
