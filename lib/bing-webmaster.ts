/**
 * Bing Webmaster Tools reads for the admin Dashboard ("Bing" tab).
 *
 * Env: BING_WEBMASTER_API_KEY (Bing Webmaster Tools → Settings → API access),
 *      optional BING_SITE_URL, the site exactly as verified in Bing.
 *
 * Bing keeps about six months of data and updates it once a day, so the raw
 * answers are cached in memory for a while and filtered per period here.
 * Server-only.
 */
const API = 'https://ssl.bing.com/webmaster/api.svc/json'
const SITE_URL = 'https://mushroomidentifiers.com'
const CACHE_MS = 15 * 60 * 1000
const TOP_LIMIT = 50
const cache = new Map<string, { at: number; data: any[] }>()

export function bingConfigured(): boolean {
  return !!(process.env.BING_WEBMASTER_API_KEY || '').trim()
}

export function bingSiteUrl(): string {
  const raw = (process.env.BING_SITE_URL || '').trim() || `${SITE_URL}/`
  return raw.endsWith('/') ? raw : `${raw}/`
}

async function request(method: string, opts: { query?: Record<string, string>; body?: any } = {}) {
  const qs = new URLSearchParams({ ...(opts.query || {}), apikey: String(process.env.BING_WEBMASTER_API_KEY).trim() })
  const res = await fetch(`${API}/${method}?${qs}`, {
    method: opts.body ? 'POST' : 'GET',
    headers: opts.body ? { 'Content-Type': 'application/json; charset=utf-8' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  })
  const text = await res.text()
  let json: any = null
  try {
    json = JSON.parse(text)
  } catch {
    // Bing answers errors as JSON, but a proxy page is possible.
  }
  if (!res.ok) throw new Error(`Bing ${method}: ${json?.Message || json?.message || `HTTP ${res.status}`}`)
  return json?.d
}

/** GET a per-site list (traffic, queries, pages, sitemaps), cached for CACHE_MS. */
async function call(method: string, fresh = false): Promise<any[]> {
  const siteUrl = bingSiteUrl()
  const key = `${method}|${siteUrl}`
  const hit = cache.get(key)
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.data
  const d = await request(method, { query: { siteUrl } })
  const data = Array.isArray(d) ? d : []
  cache.set(key, { at: Date.now(), data })
  return data
}

const sameSite = (a: string, b: string) =>
  String(a || '').replace(/\/+$/, '').toLowerCase() === String(b || '').replace(/\/+$/, '').toLowerCase()

/** "/Date(1316156400000-0700)/" → "2011-09-16" (the epoch value is UTC). */
function bingDate(value: any): string {
  const ms = Number(/\/Date\((-?\d+)/.exec(String(value || ''))?.[1])
  return Number.isFinite(ms) ? new Date(ms).toISOString().slice(0, 10) : ''
}

const inRange = (date: string, start: string, end: string) => !!date && date >= start && date <= end

/** Is the site in this Bing account and verified, and which sitemaps does Bing know? */
export async function getBingSiteStatus() {
  const siteUrl = bingSiteUrl()
  const sites: any[] = (await request('GetUserSites')) || []
  const site = sites.find((s) => sameSite(s.Url, siteUrl))
  const feeds = site ? await call('GetFeeds', true) : []
  return {
    siteUrl,
    inAccount: !!site,
    verified: !!site?.IsVerified,
    otherSites: sites.filter((s) => !sameSite(s.Url, siteUrl)).map((s) => s.Url).slice(0, 10),
    sitemaps: feeds.map((f) => ({
      url: f.Url,
      status: f.Status || '',
      urlCount: Number(f.UrlCount) || 0,
      submitted: bingDate(f.Submitted),
      lastCrawled: bingDate(f.LastCrawled),
    })),
  }
}

/** Add a sitemap to the site in Bing Webmaster Tools (SubmitFeed). */
export async function submitBingSitemap(feedUrl: string) {
  await request('SubmitFeed', { body: { siteUrl: bingSiteUrl(), feedUrl } })
  cache.delete(`GetFeeds|${bingSiteUrl()}`)
}

/** Sum Bing's weekly query / page rows per key inside the range. */
function aggregate(rows: any[], start: string, end: string) {
  const map = new Map<string, { key: string; clicks: number; impressions: number; posWeighted: number }>()
  for (const row of rows) {
    if (!inRange(bingDate(row.Date), start, end)) continue
    const key = row.Query || ''
    const g = map.get(key) || { key, clicks: 0, impressions: 0, posWeighted: 0 }
    const impressions = Number(row.Impressions) || 0
    g.clicks += Number(row.Clicks) || 0
    g.impressions += impressions
    const pos = Number(row.AvgImpressionPosition)
    if (pos > 0) g.posWeighted += pos * impressions
    map.set(key, g)
  }
  return Array.from(map.values())
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, TOP_LIMIT)
    .map((g) => ({
      key: g.key,
      clicks: g.clicks,
      impressions: g.impressions,
      ctr: g.impressions ? Number(((g.clicks / g.impressions) * 100).toFixed(1)) : 0,
      position: g.impressions && g.posWeighted ? Number((g.posWeighted / g.impressions).toFixed(1)) : 0,
    }))
}

/** Daily clicks, top keywords and top pages for "YYYY-MM-DD" start/end. Throws on API errors. */
export async function getBingData(start: string, end: string) {
  const [traffic, queries, pages] = await Promise.all([
    call('GetRankAndTrafficStats'),
    call('GetQueryStats'),
    call('GetPageStats'),
  ])
  const daily = traffic
    .map((row) => ({ date: bingDate(row.Date), clicks: Number(row.Clicks) || 0, impressions: Number(row.Impressions) || 0 }))
    .filter((d) => inRange(d.date, start, end))
    .sort((a, b) => a.date.localeCompare(b.date))
  return {
    daily,
    topKeywords: aggregate(queries, start, end).map(({ key, ...r }) => ({ keyword: key, ...r })),
    topPages: aggregate(pages, start, end).map(({ key, ...r }) => ({
      page: key.replace(/^https?:\/\/(www\.)?mushroomidentifiers\.com/i, '') || '/',
      ...r,
    })),
  }
}
