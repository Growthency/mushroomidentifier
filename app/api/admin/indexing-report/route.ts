import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { google } from 'googleapis'
import sitemap from '@/app/sitemap'

const SITE_URL = 'https://mushroomidentifiers.com'
const INDEXNOW_KEY = 'a1b2c3d4e5f6g7h8i9j0mushroomid2026'

function getAuth(scopes: string[]) {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes,
  })
}

async function adminCheck(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

function getAdmin() {
  const { createClient: c } = require('@supabase/supabase-js')
  return c(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// ── GET — return cached results ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!(await adminCheck(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = getAdmin()
  const { data: cache, error } = await admin
    .from('indexing_cache')
    .select('*')
    .order('url')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Enrich each cache row with a publish date so the admin UI can show
  // "Published N days ago" under the indexing status. The indexing_cache
  // table only tracks crawl/index state — the date has to come from
  // elsewhere. We resolve it from TWO sources so EVERY page gets a date
  // (root cause of the earlier "some show, some don't"):
  //
  //   1. blog_posts.published_at — exact publish date for DB-backed
  //      posts (Writerfy + admin-created articles).
  //   2. sitemap.ts lastModified — fallback for hardcoded static React
  //      pages (species guides, /about, /contact, …) that have no
  //      blog_posts row. The sitemap already carries a per-URL
  //      lastModified that IS the canonical publish/update date used for
  //      SEO, so reusing it keeps the dates honest and consistent.
  //
  // Pathnames are normalised (trailing slash stripped, except root) on
  // every side so Google's returned URL, the DB slug, and the sitemap
  // URL all match regardless of trailing-slash quirks.
  const normalizePath = (raw: string): string => {
    let p: string
    try { p = new URL(raw).pathname || '/' } catch { p = raw || '/' }
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
    return p
  }

  const dateByPath = new Map<string, string>()

  // Source 1: DB posts (highest priority — real publish date)
  const { data: posts } = await admin
    .from('blog_posts')
    .select('slug, published_at, created_at')
  for (const p of posts || []) {
    const d = p.published_at || p.created_at
    if (p.slug && d) dateByPath.set(normalizePath(p.slug), d)
  }

  // Source 2: sitemap lastModified (fallback for hardcoded static pages)
  try {
    const sm = await sitemap()
    for (const entry of sm) {
      const path = normalizePath(entry.url)
      if (dateByPath.has(path)) continue // DB date wins
      const lm = (entry as any).lastModified
      if (!lm) continue
      const iso = lm instanceof Date ? lm.toISOString() : new Date(lm).toISOString()
      if (!isNaN(Date.parse(iso))) dateByPath.set(path, iso)
    }
  } catch {
    // Sitemap fetch failing just means hardcoded pages show no date —
    // DB-backed posts still get theirs from source 1.
  }

  const results = (cache || []).map((r: any) => ({
    ...r,
    published_at: dateByPath.get(normalizePath(r.url)) || null,
  }))
  const indexed = results.filter((r: any) => r.status === 'indexed')
  const notIndexed = results.filter((r: any) => r.status !== 'indexed' && r.status !== 'error')
  const errors = results.filter((r: any) => r.status === 'error')

  // Find the most recent check time
  let lastScan: string | null = null
  for (const r of results) {
    if (r.checked_at && (!lastScan || r.checked_at > lastScan)) lastScan = r.checked_at
  }

  return NextResponse.json({
    total: results.length,
    indexed: indexed.length,
    notIndexed: notIndexed.length,
    errors: errors.length,
    indexRate: results.length > 0
      ? Math.round((indexed.length / results.length) * 1000) / 10
      : 0,
    results,
    lastScan,
  })
}

// ── POST — actions ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await adminCheck(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body
  const admin = getAdmin()

  // ─── Get all URLs from sitemap ─────────────────────────────────────────────
  if (action === 'get-urls') {
    try {
      const res = await fetch(`${SITE_URL}/sitemap.xml`, {
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'MushroomAdmin/1.0' },
      })
      const xml = await res.text()
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map(m => m[1])
        .filter(u => u.includes('mushroomidentifiers.com'))

      return NextResponse.json({ urls, count: urls.length })
    } catch (err: any) {
      return NextResponse.json({ error: 'Failed to fetch sitemap', details: err.message }, { status: 500 })
    }
  }

  // ─── Check a batch of URLs via URL Inspection API ──────────────────────────
  if (action === 'check-batch') {
    const { urls } = body
    if (!urls?.length) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 })
    }

    const batch = urls.slice(0, 5) // max 5 per call for safety
    const auth = getAuth(['https://www.googleapis.com/auth/webmasters'])
    const sc = google.searchconsole({ version: 'v1', auth })
    const results: any[] = []

    for (const url of batch) {
      try {
        const inspection = await sc.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl: url,
            siteUrl: `${SITE_URL}/`,
          },
        })

        const idx = inspection.data.inspectionResult?.indexStatusResult
        const coverageState = idx?.coverageState || 'Unknown'
        const isIndexed =
          coverageState.toLowerCase().includes('submitted and indexed') ||
          (coverageState.toLowerCase().includes('indexed') &&
            !coverageState.toLowerCase().includes('not indexed'))

        const record = {
          url,
          status: isIndexed ? 'indexed' : 'not_indexed',
          coverage_state: coverageState,
          last_crawl_time: idx?.lastCrawlTime || null,
          indexing_state: idx?.indexingState || null,
          page_fetch_state: idx?.pageFetchState || null,
          robots_txt_state: idx?.robotsTxtState || null,
          checked_at: new Date().toISOString(),
        }

        await admin.from('indexing_cache').upsert(record, { onConflict: 'url' })
        results.push(record)
      } catch (err: any) {
        const record = {
          url,
          status: 'error',
          coverage_state: err.message?.slice(0, 200) || 'API Error',
          checked_at: new Date().toISOString(),
        }
        await admin.from('indexing_cache').upsert(record, { onConflict: 'url' })
        results.push(record)
      }

      // Rate limit: ~1 req/sec
      if (batch.indexOf(url) < batch.length - 1) {
        await new Promise(r => setTimeout(r, 1200))
      }
    }

    return NextResponse.json({ results, checked: results.length })
  }

  // ─── Request indexing via Indexing API ──────────────────────────────────────
  if (action === 'request-index') {
    const { url } = body
    if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 })

    try {
      const auth = getAuth(['https://www.googleapis.com/auth/indexing'])
      const indexing = google.indexing({ version: 'v3', auth })

      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      })

      await admin.from('indexing_cache').upsert(
        { url, index_requested_at: new Date().toISOString() },
        { onConflict: 'url' }
      )

      return NextResponse.json({ success: true, url })
    } catch (err: any) {
      return NextResponse.json({
        error: 'Indexing request failed',
        details: err.message,
        hint: 'Ensure service account has Indexing API access and is owner in Search Console.',
      }, { status: 500 })
    }
  }

  // ─── Bulk request indexing ─────────────────────────────────────────────────
  if (action === 'bulk-request') {
    const { urls } = body
    if (!urls?.length) return NextResponse.json({ error: 'No URLs' }, { status: 400 })

    const auth = getAuth(['https://www.googleapis.com/auth/indexing'])
    const indexing = google.indexing({ version: 'v3', auth })
    let success = 0
    let failed = 0

    for (const url of urls.slice(0, 10)) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: { url, type: 'URL_UPDATED' },
        })
        await admin.from('indexing_cache').upsert(
          { url, index_requested_at: new Date().toISOString() },
          { onConflict: 'url' }
        )
        success++
      } catch {
        failed++
      }
      await new Promise(r => setTimeout(r, 500))
    }

    return NextResponse.json({ success, failed, total: success + failed })
  }

  // ─── IndexNow — submit URLs to Bing/Yandex/Google ─────────────────────────
  if (action === 'indexnow-submit') {
    const { urls } = body
    if (!urls?.length) return NextResponse.json({ error: 'No URLs' }, { status: 400 })

    const batch = urls.slice(0, 100) // IndexNow allows up to 10,000 but we batch
    const results: { engine: string; status: number; ok: boolean }[] = []

    const payload = {
      host: 'mushroomidentifiers.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: batch,
    }

    // Submit to multiple IndexNow endpoints
    const engines = [
      { name: 'Bing', url: 'https://www.bing.com/indexnow' },
      { name: 'Yandex', url: 'https://yandex.com/indexnow' },
      { name: 'IndexNow.org', url: 'https://api.indexnow.org/indexnow' },
    ]

    for (const engine of engines) {
      try {
        const res = await fetch(engine.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        })
        results.push({ engine: engine.name, status: res.status, ok: res.ok || res.status === 200 || res.status === 202 })
      } catch (err: any) {
        results.push({ engine: engine.name, status: 0, ok: false })
      }
    }

    // Save indexnow_requested_at for each URL in batch
    const anyOk = results.some(r => r.ok)
    if (anyOk) {
      const now = new Date().toISOString()
      for (const url of batch) {
        await admin.from('indexing_cache').upsert(
          { url, indexnow_requested_at: now },
          { onConflict: 'url' }
        )
      }
    }

    return NextResponse.json({
      success: true,
      submitted: batch.length,
      engines: results,
    })
  }

  // ─── Sitemap Submit — submit sitemap to Google Search Console ────────────
  if (action === 'submit-sitemap') {
    const results: { engine: string; ok: boolean; detail: string }[] = []

    // Google: Submit via Search Console API
    try {
      const auth = getAuth(['https://www.googleapis.com/auth/webmasters'])
      const sc = google.searchconsole({ version: 'v1', auth })
      await (sc as any).sitemaps.submit({
        siteUrl: `${SITE_URL}/`,
        feedpath: `${SITE_URL}/sitemap.xml`,
      })
      results.push({ engine: 'Google Search Console', ok: true, detail: 'Sitemap submitted' })
    } catch (err: any) {
      results.push({ engine: 'Google Search Console', ok: false, detail: err.message?.slice(0, 100) || 'Failed' })
    }

    // Bing: Submit via IndexNow (Bing deprecated ping endpoint)
    try {
      const res = await fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'mushroomidentifiers.com',
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: [`${SITE_URL}/sitemap.xml`],
        }),
        signal: AbortSignal.timeout(10000),
      })
      results.push({ engine: 'Bing (IndexNow)', ok: res.ok || res.status === 202, detail: `Status ${res.status}` })
    } catch {
      results.push({ engine: 'Bing (IndexNow)', ok: false, detail: 'Request failed' })
    }

    return NextResponse.json({
      success: true,
      submitted: results,
      sitemapUrl: `${SITE_URL}/sitemap.xml`,
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
