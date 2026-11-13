import { google } from 'googleapis'
import { googleAuth, googleErrorMessage, searchConsoleProperty } from '@/lib/google-auth'

function getAuth() {
  return googleAuth([
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/webmasters.readonly',
  ])
}

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '529177700'

// ── Google Analytics 4 Data ──
//
// GA4 allows only 10 concurrent requests per property. The dashboard used to
// fire six at once per load, so two admins or two tabs exhausted the quota
// ("Exhausted concurrent requests quota"). Now: one report call at a time,
// 7-day and today folded into the overview as extra date ranges, results
// cached for a few minutes, identical requests share one fetch, and a quota
// error is retried once after a pause.

// Never let a stalled Google call hang the dashboard.
const GOOGLE_TIMEOUT_MS = 12000
const GA_CACHE_MS = 5 * 60 * 1000
const gaCache = new Map<string, { at: number; data: GA4Dashboard }>()
const gaInflight = new Map<string, Promise<GA4Dashboard>>()

export interface GA4Dashboard {
  overview: { activeUsers: number; sessions: number; pageViews: number; newUsers: number }
  users7d: number
  usersToday: number
  topPages: { slug: string; title: string; views: number }[]
  topCountries: { country: string; users: number }[]
  dailyUsers: { date: string; count: number }[]
}

// Worth a retry: GA4's concurrent-request quota, and Google's own 5xx hiccups
// (which arrive as an HTML "Error 502 (Server Error)!!1" page).
const isRetryable = (err: any) => {
  const code = Number(err?.code || err?.response?.status || 0)
  return code === 429 || code >= 500 || /concurrent requests quota|RESOURCE_EXHAUSTED|quota|Server Error/i.test(String(err?.message || err))
}

async function runReport(analyticsData: any, requestBody: any) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await analyticsData.properties.runReport({ property: `properties/${GA4_PROPERTY_ID}`, requestBody }, { timeout: GOOGLE_TIMEOUT_MS })
      return res.data
    } catch (err: any) {
      // A stalled call is not retried: the user is waiting on the dashboard.
      if (/timeout|ETIMEDOUT|ECONNRESET|ESOCKETTIMEDOUT/i.test(String(err?.code || '') + String(err?.message || ''))) {
        throw new Error(`Google Analytics did not answer within ${GOOGLE_TIMEOUT_MS / 1000} s. Try again in a minute.`)
      }
      if (attempt === 3 || !isRetryable(err)) throw err
      await new Promise(r => setTimeout(r, 2500 * attempt))
    }
  }
}

async function fetchGA4Dashboard(startDate: string, endDate: string): Promise<GA4Dashboard> {
  const t0 = Date.now()
  const auth = getAuth()
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth })
  const step = (name: string) => console.log(`[analytics] GA4 ${name} ${Date.now() - t0}ms`)

  // Overview for the period, the last 7 days and today in ONE request. GA4
  // returns a row per date range, tagged in the trailing "dateRange" dimension.
  const overviewData = await runReport(analyticsData, {
    dateRanges: [
      { startDate, endDate, name: 'period' },
      { startDate: '7daysAgo', endDate: 'today', name: 'week' },
      { startDate: 'today', endDate: 'today', name: 'today' },
    ],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'newUsers' }],
  })
  step('overview')
  const byRange: Record<string, any[]> = {}
  for (const row of overviewData.rows ?? []) {
    const range = row.dimensionValues?.[0]?.value || 'period'
    byRange[range] = row.metricValues ?? []
  }
  const metric = (range: string, i: number) => Number(byRange[range]?.[i]?.value || 0)

  const pagesData = await runReport(analyticsData, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 25,
  })
  step('pages')
  const countriesData = await runReport(analyticsData, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 25,
  })
  step('countries')
  const dailyData = await runReport(analyticsData, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
  })

  step('daily (done)')
  return {
    overview: {
      activeUsers: metric('period', 0),
      sessions: metric('period', 1),
      pageViews: metric('period', 2),
      newUsers: metric('period', 3),
    },
    users7d: metric('week', 0),
    usersToday: metric('today', 0),
    topPages: (pagesData.rows ?? []).map((row: any) => ({
      slug: row.dimensionValues?.[0]?.value || '/',
      title: row.dimensionValues?.[1]?.value || 'Unknown',
      views: Number(row.metricValues?.[0]?.value || 0),
    })),
    topCountries: (countriesData.rows ?? []).map((row: any) => ({
      country: row.dimensionValues?.[0]?.value || 'Unknown',
      users: Number(row.metricValues?.[0]?.value || 0),
    })),
    dailyUsers: (dailyData.rows ?? []).map((row: any) => ({
      date: formatGADate(row.dimensionValues?.[0]?.value || ''),
      count: Number(row.metricValues?.[0]?.value || 0),
    })),
  }
}

/**
 * Everything the dashboard's Google Analytics tab shows. Cached per period;
 * on an API error the last good result (if any) is returned instead.
 */
export async function getGA4Dashboard(startDate: string, endDate: string, fresh = false): Promise<GA4Dashboard> {
  const key = `${startDate}|${endDate}`
  const hit = gaCache.get(key)
  if (!fresh && hit && Date.now() - hit.at < GA_CACHE_MS) return hit.data
  if (gaInflight.has(key)) return gaInflight.get(key)!

  const p = fetchGA4Dashboard(startDate, endDate)
    .then((data) => {
      gaCache.set(key, { at: Date.now(), data })
      return data
    })
    .catch((err) => {
      const message = googleErrorMessage(err)
      console.error('GA4 API error:', message)
      if (hit) return hit.data
      throw new Error(message)
    })
    .finally(() => gaInflight.delete(key))
  gaInflight.set(key, p)
  return p
}

/** Drop the cached GA4 reports (admin "Clear Cache"). */
export function clearGA4Cache() {
  gaCache.clear()
}

// ── Google Search Console ──

export async function getSearchConsoleData(startDate: string, endDate: string) {
  const auth = getAuth()
  const searchConsole = google.searchconsole({ version: 'v1', auth })

  const t0 = Date.now()
  try {
    const siteUrl = await searchConsoleProperty()
    console.log(`[analytics] GSC property ${Date.now() - t0}ms`)
    // Top queries (keywords), top pages, daily clicks
    const [queriesRes, pagesRes, dailyRes] = await Promise.all([
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 25,
          type: 'web',
        },
      }, { timeout: GOOGLE_TIMEOUT_MS }),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 25,
          type: 'web',
        },
      }, { timeout: GOOGLE_TIMEOUT_MS }),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['date'],
          type: 'web',
        },
      }, { timeout: GOOGLE_TIMEOUT_MS }),
    ])

    console.log(`[analytics] GSC queries done ${Date.now() - t0}ms`)
    const topKeywords = (queriesRes.data.rows ?? []).map(row => ({
      keyword: row.keys?.[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Number(((row.ctr || 0) * 100).toFixed(1)),
      position: Number((row.position || 0).toFixed(1)),
    }))

    const topSearchPages = (pagesRes.data.rows ?? []).map(row => ({
      page: row.keys?.[0]?.replace('https://mushroomidentifiers.com', '') || '/',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Number(((row.ctr || 0) * 100).toFixed(1)),
      position: Number((row.position || 0).toFixed(1)),
    }))

    const dailyClicks = (dailyRes.data.rows ?? []).map(row => ({
      date: row.keys?.[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      position: row.position || 0,
    }))

    return { topKeywords, topSearchPages, dailyClicks, siteUrl }
  } catch (err: any) {
    const message = googleErrorMessage(err)
    console.error('Search Console API error:', message)
    throw new Error(message)
  }
}

// Helper: GA date format "20260410" → "2026-04-10"
function formatGADate(d: string): string {
  if (d.length !== 8) return d
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
}
