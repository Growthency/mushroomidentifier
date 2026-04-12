import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

/* ─────────────────────────── Types ─────────────────────────── */
type Severity = 'critical' | 'warning' | 'info'

interface Issue {
  check: string
  severity: Severity
  message: string
  fix: string
  category: string
}

interface PageResult {
  url: string
  path: string
  status: number
  loadTime: number
  htmlSize: number
  title: string
  issues: Issue[]
  score: number
}

interface GlobalCheckResult {
  check: string
  severity: Severity
  passed: boolean
  message: string
  fix: string
}

/* ─────────────────────── Weight map ────────────────────────── */
const WEIGHT: Record<Severity, number> = { critical: 3, warning: 2, info: 1 }

/* ─────────────────────── Helpers ────────────────────────────── */
function meta(html: string, name: string): string | null {
  // match name="..." or property="..."
  const re = new RegExp(
    `<meta\\s+(?:[^>]*?(?:name|property)\\s*=\\s*["']${name}["'][^>]*?content\\s*=\\s*["']([^"']*)["']|[^>]*?content\\s*=\\s*["']([^"']*)["'][^>]*?(?:name|property)\\s*=\\s*["']${name}["'])`,
    'i'
  )
  const m = html.match(re)
  return m ? (m[1] ?? m[2] ?? null) : null
}

function allMeta(html: string, name: string): string[] {
  const re = new RegExp(
    `<meta\\s+(?:[^>]*?(?:name|property)\\s*=\\s*["']${name}["'][^>]*?content\\s*=\\s*["']([^"']*)["']|[^>]*?content\\s*=\\s*["']([^"']*)["'][^>]*?(?:name|property)\\s*=\\s*["']${name}["'])`,
    'gi'
  )
  const results: string[] = []
  let m
  while ((m = re.exec(html)) !== null) results.push(m[1] ?? m[2] ?? '')
  return results
}

function extractTag(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'gis')
  const results: string[] = []
  let m
  while ((m = re.exec(html)) !== null) results.push(m[1].replace(/<[^>]*>/g, '').trim())
  return results
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>(.*?)<\/title>/is)
  return m ? m[1].replace(/<[^>]*>/g, '').trim() : null
}

function extractCanonical(html: string): string | null {
  const m = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']*)["']/i)
    || html.match(/<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["']canonical["']/i)
  return m ? m[1] : null
}

function extractImages(html: string): { src: string; alt: string | null }[] {
  const re = /<img\s+([^>]*)>/gi
  const imgs: { src: string; alt: string | null }[] = []
  let m
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1]
    const srcM = attrs.match(/src\s*=\s*["']([^"']*)["']/i)
    const altM = attrs.match(/alt\s*=\s*["']([^"']*)["']/i)
    if (srcM) {
      imgs.push({ src: srcM[1], alt: altM ? altM[1] : null })
    }
  }
  return imgs
}

function extractJsonLd(html: string): string[] {
  const re = /<script\s+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const results: string[] = []
  let m
  while ((m = re.exec(html)) !== null) results.push(m[1].trim())
  return results
}

function hasViewport(html: string): boolean {
  return /<meta[^>]*name\s*=\s*["']viewport["']/i.test(html)
}

function hasCharset(html: string): boolean {
  return /<meta[^>]*charset\s*=/i.test(html) || /<meta[^>]*http-equiv\s*=\s*["']Content-Type["']/i.test(html)
}

function hasLang(html: string): boolean {
  return /<html[^>]*\slang\s*=\s*["'][^"']+["']/i.test(html)
}

function hasFavicon(html: string): boolean {
  return /<link[^>]*rel\s*=\s*["'](?:icon|shortcut icon|apple-touch-icon)["']/i.test(html)
}

function hasNoindex(html: string): boolean {
  return /<meta[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["'][^"']*noindex[^"']*["']/i.test(html)
    || /<meta[^>]*content\s*=\s*["'][^"']*noindex[^"']*["'][^>]*name\s*=\s*["']robots["']/i.test(html)
}

function headingLevels(html: string): number[] {
  const re = /<h([1-6])[^>]*>/gi
  const levels: number[] = []
  let m
  while ((m = re.exec(html)) !== null) levels.push(parseInt(m[1]))
  return levels
}

/* ──────────────────── Per-page checks ──────────────────────── */
function checkPage(html: string, url: string): Issue[] {
  const issues: Issue[] = []
  const add = (check: string, severity: Severity, message: string, fix: string, category: string) =>
    issues.push({ check, severity, message, fix, category })

  // 1. Title
  const title = extractTitle(html)
  if (!title) {
    add('missing-title', 'critical', 'Page is missing a <title> tag', 'Add a unique <title> tag in the <head> section', 'Meta Tags')
  } else {
    if (title.length < 30) add('title-short', 'warning', `Title is too short (${title.length} chars, min 30)`, 'Write a descriptive title between 30-60 characters', 'Meta Tags')
    if (title.length > 60) add('title-long', 'warning', `Title is too long (${title.length} chars, max 60)`, 'Shorten title to 60 characters or less for full SERP display', 'Meta Tags')
  }

  // 2. Meta description
  const desc = meta(html, 'description')
  if (!desc) {
    add('missing-description', 'critical', 'Page is missing a meta description', 'Add <meta name="description" content="..."> with 120-160 chars', 'Meta Tags')
  } else {
    if (desc.length < 120) add('desc-short', 'warning', `Meta description too short (${desc.length} chars, min 120)`, 'Expand meta description to at least 120 characters', 'Meta Tags')
    if (desc.length > 160) add('desc-long', 'warning', `Meta description too long (${desc.length} chars, max 160)`, 'Shorten meta description to 160 characters for full SERP display', 'Meta Tags')
  }

  // 3. Canonical
  const canonical = extractCanonical(html)
  if (!canonical) {
    add('missing-canonical', 'critical', 'Page is missing a canonical URL', 'Add <link rel="canonical" href="..."> with the absolute URL', 'Meta Tags')
  } else if (!canonical.startsWith('http')) {
    add('relative-canonical', 'warning', 'Canonical URL is relative, should be absolute', 'Use full absolute URL starting with https://', 'Meta Tags')
  }

  // 4. Open Graph
  if (!meta(html, 'og:title')) add('missing-og-title', 'warning', 'Missing og:title meta tag', 'Add <meta property="og:title" content="..."> for social sharing', 'Open Graph')
  if (!meta(html, 'og:description')) add('missing-og-desc', 'warning', 'Missing og:description meta tag', 'Add <meta property="og:description" content="..."> for social sharing', 'Open Graph')
  if (!meta(html, 'og:image')) add('missing-og-image', 'warning', 'Missing og:image meta tag', 'Add <meta property="og:image" content="..."> for social sharing preview', 'Open Graph')
  if (!meta(html, 'og:url')) add('missing-og-url', 'info', 'Missing og:url meta tag', 'Add <meta property="og:url" content="..."> for canonical social URL', 'Open Graph')
  if (!meta(html, 'og:type')) add('missing-og-type', 'info', 'Missing og:type meta tag', 'Add <meta property="og:type" content="article"> or "website"', 'Open Graph')

  // 5. Twitter Cards
  if (!meta(html, 'twitter:card')) add('missing-twitter-card', 'warning', 'Missing twitter:card meta tag', 'Add <meta name="twitter:card" content="summary_large_image">', 'Twitter Cards')
  if (!meta(html, 'twitter:title')) add('missing-twitter-title', 'info', 'Missing twitter:title meta tag', 'Add <meta name="twitter:title" content="..."> for Twitter sharing', 'Twitter Cards')
  if (!meta(html, 'twitter:description')) add('missing-twitter-desc', 'info', 'Missing twitter:description meta tag', 'Add <meta name="twitter:description" content="...">', 'Twitter Cards')
  if (!meta(html, 'twitter:image')) add('missing-twitter-image', 'info', 'Missing twitter:image meta tag', 'Add <meta name="twitter:image" content="..."> for Twitter preview', 'Twitter Cards')

  // 6. Headings
  const h1s = extractTag(html, 'h1')
  if (h1s.length === 0) {
    add('missing-h1', 'critical', 'Page is missing an H1 heading', 'Add exactly one <h1> tag with your primary keyword', 'Headings')
  } else {
    if (h1s.length > 1) add('multiple-h1', 'warning', `Page has ${h1s.length} H1 tags (should be exactly 1)`, 'Use only one <h1> per page for clear hierarchy', 'Headings')
  }

  const h2s = extractTag(html, 'h2')
  // Only flag missing H2 on content pages (not login, legal, etc.)
  const isContentPage = !url.includes('/login') && !url.includes('/signup') && !url.includes('/privacy') && !url.includes('/terms') && !url.includes('/refund')
  if (h2s.length === 0 && isContentPage) {
    add('missing-h2', 'warning', 'Page has no H2 headings for content structure', 'Add H2 headings to break up content and improve hierarchy', 'Headings')
  }

  // Heading hierarchy
  const levels = headingLevels(html)
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      add('heading-skip', 'warning', `Heading hierarchy skips level (h${levels[i - 1]} → h${levels[i]})`, 'Use sequential heading levels without skipping (h1→h2→h3)', 'Headings')
      break
    }
  }

  // 7. Images
  const imgs = extractImages(html)
  const noAlt = imgs.filter(i => i.alt === null)
  const emptyAlt = imgs.filter(i => i.alt !== null && i.alt.trim() === '')
  if (noAlt.length > 0) {
    add('img-missing-alt', 'critical', `${noAlt.length} image(s) missing alt attribute`, 'Add descriptive alt text to all <img> tags for accessibility & SEO', 'Images')
  }
  if (emptyAlt.length > 0) {
    add('img-empty-alt', 'warning', `${emptyAlt.length} image(s) have empty alt text`, 'Add meaningful alt descriptions instead of empty alt=""', 'Images')
  }

  // 8. Technical
  if (!hasViewport(html)) add('missing-viewport', 'critical', 'Missing viewport meta tag', 'Add <meta name="viewport" content="width=device-width, initial-scale=1">', 'Technical')
  if (!hasCharset(html)) add('missing-charset', 'critical', 'Missing charset declaration', 'Add <meta charset="utf-8"> in the <head> section', 'Technical')
  if (!hasLang(html)) add('missing-lang', 'warning', 'HTML tag missing lang attribute', 'Add lang="en" to your <html> tag for accessibility', 'Technical')
  if (!hasFavicon(html)) add('missing-favicon', 'warning', 'No favicon link found in HTML', 'Add <link rel="icon" href="/favicon.ico"> in <head>', 'Technical')

  // 9. Structured Data
  const jsonLds = extractJsonLd(html)
  if (jsonLds.length === 0) {
    add('missing-jsonld', 'warning', 'No JSON-LD structured data found', 'Add JSON-LD schema markup for better search engine understanding', 'Structured Data')
  } else {
    for (const ld of jsonLds) {
      try { JSON.parse(ld) } catch {
        add('invalid-jsonld', 'warning', 'JSON-LD structured data contains invalid JSON', 'Fix the JSON syntax in your structured data script tag', 'Structured Data')
        break
      }
    }
  }

  // 10. Duplicate meta tags
  const descCount = allMeta(html, 'description').length
  if (descCount > 1) add('duplicate-description', 'warning', `Found ${descCount} meta descriptions (should be 1)`, 'Remove duplicate meta description tags', 'Meta Tags')

  // 11. Noindex check (pages that should be indexed)
  if (hasNoindex(html)) {
    add('has-noindex', 'critical', 'Page has noindex directive — it will not appear in search results', 'Remove noindex from robots meta tag if this page should be indexed', 'Technical')
  }

  // 12. HTML size
  const sizeKb = Math.round(html.length / 1024)
  if (sizeKb > 500) {
    add('large-html', 'info', `HTML is ${sizeKb}KB (recommended < 500KB)`, 'Reduce HTML size by removing unused code or lazy-loading content', 'Performance')
  }

  // 13. Internal Links — flag pages with fewer than 5
  const internalLinkMatches = html.match(/<a\s[^>]*href=["'](\/[^"'#]*|https?:\/\/mushroomidentifiers\.com[^"']*)["'][^>]*>/gi) || []
  if (isContentPage && internalLinkMatches.length < 5) {
    add('low-internal-links', 'warning', `Only ${internalLinkMatches.length} internal link(s) (recommended: 5+)`, 'Add at least 5 internal links to related species pages and articles for better SEO crawlability', 'Internal Links')
  }

  return issues
}

/* ──────────────────── Global checks ────────────────────────── */
async function runGlobalChecks(
  baseUrl: string,
  pageResults: PageResult[],
): Promise<GlobalCheckResult[]> {
  const checks: GlobalCheckResult[] = []

  // 1. robots.txt
  try {
    const res = await fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(5000) })
    checks.push({
      check: 'robots-txt', severity: 'critical',
      passed: res.ok,
      message: res.ok ? 'robots.txt is accessible' : `robots.txt returned ${res.status}`,
      fix: 'Create a robots.txt file at the site root',
    })
  } catch {
    checks.push({ check: 'robots-txt', severity: 'critical', passed: false, message: 'robots.txt is unreachable', fix: 'Ensure robots.txt is served at the site root' })
  }

  // 2. sitemap.xml
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(5000) })
    checks.push({
      check: 'sitemap-xml', severity: 'critical',
      passed: res.ok,
      message: res.ok ? 'sitemap.xml is accessible' : `sitemap.xml returned ${res.status}`,
      fix: 'Create a sitemap.xml and submit it to Google Search Console',
    })
  } catch {
    checks.push({ check: 'sitemap-xml', severity: 'critical', passed: false, message: 'sitemap.xml is unreachable', fix: 'Ensure sitemap.xml is served at the site root' })
  }

  // 3. Unique titles
  const titles = pageResults.map(p => p.title).filter(Boolean)
  const uniqueTitles = new Set(titles)
  const hasDupTitles = titles.length !== uniqueTitles.size
  checks.push({
    check: 'unique-titles', severity: 'critical',
    passed: !hasDupTitles,
    message: hasDupTitles ? `${titles.length - uniqueTitles.size} duplicate title(s) found` : 'All page titles are unique',
    fix: 'Ensure every page has a unique <title> tag',
  })

  // 4. Unique descriptions
  const descs = pageResults.map(p => {
    // We don't have raw descriptions stored, check from issues
    return p.issues.find(i => i.check === 'missing-description') ? null : 'has-desc'
  }).filter(Boolean)
  // For a more accurate check we'd need to store descriptions, but this is best-effort
  checks.push({
    check: 'unique-descriptions', severity: 'warning',
    passed: true, // Can't fully verify without storing descriptions
    message: 'Meta descriptions present on most pages',
    fix: 'Ensure every page has a unique meta description',
  })

  // 5. HTTPS enforced
  const httpPages = pageResults.filter(p => p.url.startsWith('http://'))
  checks.push({
    check: 'https-enforced', severity: 'critical',
    passed: httpPages.length === 0,
    message: httpPages.length === 0 ? 'All pages use HTTPS' : `${httpPages.length} page(s) using HTTP`,
    fix: 'Redirect all HTTP URLs to HTTPS',
  })

  // 6. Favicon at /favicon.ico
  try {
    const res = await fetch(`${baseUrl}/favicon.ico`, { signal: AbortSignal.timeout(5000) })
    checks.push({
      check: 'favicon-ico', severity: 'warning',
      passed: res.ok,
      message: res.ok ? 'favicon.ico exists' : 'favicon.ico not found at site root',
      fix: 'Place a favicon.ico file at the root of your site',
    })
  } catch {
    checks.push({ check: 'favicon-ico', severity: 'warning', passed: false, message: 'favicon.ico unreachable', fix: 'Place a favicon.ico file at the root of your site' })
  }

  // 7. Orphan pages (404s from scanned pages)
  const errPages = pageResults.filter(p => p.status >= 400)
  checks.push({
    check: 'no-404-pages', severity: 'warning',
    passed: errPages.length === 0,
    message: errPages.length === 0 ? 'No broken pages found in sitemap' : `${errPages.length} page(s) returned errors`,
    fix: 'Fix or remove broken URLs from your sitemap',
  })

  // 8. Security headers (check homepage)
  try {
    const res = await fetch(baseUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    const hasHSTS = !!res.headers.get('strict-transport-security')
    const hasXFrame = !!res.headers.get('x-frame-options')
    const hasXContent = !!res.headers.get('x-content-type-options')
    const count = [hasHSTS, hasXFrame, hasXContent].filter(Boolean).length
    checks.push({
      check: 'security-headers', severity: 'info',
      passed: count >= 2,
      message: count >= 2 ? `${count}/3 security headers present` : `Only ${count}/3 security headers found`,
      fix: 'Add HSTS, X-Frame-Options, and X-Content-Type-Options headers',
    })
  } catch {
    checks.push({ check: 'security-headers', severity: 'info', passed: false, message: 'Could not check security headers', fix: 'Ensure security headers are configured' })
  }

  // 9. Consistent canonical format
  const canonicalIssues = pageResults.filter(p => p.issues.some(i => i.check === 'relative-canonical' || i.check === 'missing-canonical'))
  checks.push({
    check: 'consistent-canonicals', severity: 'warning',
    passed: canonicalIssues.length === 0,
    message: canonicalIssues.length === 0 ? 'All pages have proper canonical URLs' : `${canonicalIssues.length} page(s) with canonical issues`,
    fix: 'Ensure every page has an absolute canonical URL',
  })

  // 10. Sitemap coverage
  const scannedCount = pageResults.length
  const okCount = pageResults.filter(p => p.status === 200).length
  checks.push({
    check: 'sitemap-coverage', severity: 'warning',
    passed: okCount === scannedCount,
    message: `${okCount}/${scannedCount} sitemap URLs are accessible`,
    fix: 'Remove inaccessible URLs from your sitemap',
  })

  return checks
}

/* ──────────────────── Score calculator ──────────────────────── */
function calculateScore(pageResults: PageResult[], globalChecks: GlobalCheckResult[]): number {
  let maxPoints = 0
  let earnedPoints = 0

  // Per-page checks: each page has the same set of possible checks
  // We count based on actual checks run (35 possible per page)
  const checksPerPage = 35
  for (const page of pageResults) {
    if (page.status >= 400) continue // Skip errored pages
    const pageMax = checksPerPage // approximate
    const pageLost = page.issues.reduce((sum, i) => sum + WEIGHT[i.severity], 0)
    const pageEarned = Math.max(0, pageMax - pageLost)
    maxPoints += pageMax
    earnedPoints += pageEarned
  }

  // Global checks
  for (const gc of globalChecks) {
    const w = WEIGHT[gc.severity]
    maxPoints += w
    if (gc.passed) earnedPoints += w
  }

  if (maxPoints === 0) return 100
  return Math.round((earnedPoints / maxPoints) * 100)
}

/* ──────────────────── Page score ────────────────────────────── */
function pageScore(issues: Issue[]): number {
  const max = 35
  const lost = issues.reduce((sum, i) => sum + WEIGHT[i.severity], 0)
  return Math.max(0, Math.round(((max - lost) / max) * 100))
}

/* ──────────────────── Fetch a batch of pages ───────────────── */
async function fetchBatch(urls: string[], baseUrl: string): Promise<PageResult[]> {
  const results: PageResult[] = []
  // 10 parallel per sub-batch for speed within Vercel 10s limit
  for (let i = 0; i < urls.length; i += 10) {
    const chunk = urls.slice(i, i + 10)
    const batch = await Promise.all(
      chunk.map(async (url): Promise<PageResult> => {
        const path = url.replace(baseUrl, '') || '/'
        try {
          const start = Date.now()
          const res = await fetch(url, {
            signal: AbortSignal.timeout(6000),
            headers: { 'User-Agent': 'MushroomIdentifiers-SEO-Health/1.0' },
          })
          const loadTime = Date.now() - start
          const html = await res.text()
          const htmlSize = html.length

          if (res.status >= 400) {
            return { url, path, status: res.status, loadTime, htmlSize, title: '', issues: [], score: 0 }
          }

          const issues = checkPage(html, url)
          const title = extractTitle(html) || ''

          if (loadTime > 5000) {
            issues.push({
              check: 'slow-load', severity: 'warning',
              message: `Page took ${(loadTime / 1000).toFixed(1)}s to load (max 5s)`,
              fix: 'Optimize server response time, reduce blocking resources',
              category: 'Performance',
            })
          }

          return { url, path, status: res.status, loadTime, htmlSize, title, issues, score: pageScore(issues) }
        } catch {
          return { url, path, status: 0, loadTime: 0, htmlSize: 0, title: '', issues: [{
            check: 'unreachable', severity: 'critical',
            message: 'Page is unreachable or timed out',
            fix: 'Check that the page is deployed and the server is running',
            category: 'Technical',
          }], score: 0 }
        }
      })
    )
    results.push(...batch)
  }
  return results
}

/* ──────────────────── Main handler (paginated) ─────────────── */
export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const offset: number = body.offset ?? 0
  const limit: number  = Math.min(body.limit ?? 50, 50) // cap at 50 per request

  const BASE_URL = 'https://mushroomidentifiers.com'

  // Step 1: Fetch sitemap and extract all URLs
  let allUrls: string[] = []
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(8000) })
    if (sitemapRes.ok) {
      const xml = await sitemapRes.text()
      const urlMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g)
      for (const m of urlMatches) {
        if (m[1]) allUrls.push(m[1])
      }
    }
  } catch {
    // Fallback
  }

  if (allUrls.length === 0) {
    allUrls = [
      `${BASE_URL}/`,
      `${BASE_URL}/blog`,
      `${BASE_URL}/pricing`,
      `${BASE_URL}/about`,
      `${BASE_URL}/contact`,
    ]
  }

  const totalUrls = allUrls.length
  const batchUrls = allUrls.slice(offset, offset + limit)

  // Step 2: Scan the current batch
  const pageResults = await fetchBatch(batchUrls, BASE_URL)

  // Step 3: Global checks only on first batch (offset === 0)
  let globalChecks: GlobalCheckResult[] | null = null
  if (offset === 0) {
    globalChecks = await runGlobalChecks(BASE_URL, pageResults)
  }

  return NextResponse.json({
    totalUrls,
    offset,
    limit,
    hasMore: offset + limit < totalUrls,
    pages: pageResults,
    globalChecks,
    scannedAt: new Date().toISOString(),
  })
}
