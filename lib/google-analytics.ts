import { google } from 'googleapis'

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ],
  })
}

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '529177700'

// ── Google Analytics 4 Data ──

export async function getGA4Report(startDate: string, endDate: string) {
  const auth = getAuth()
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

  try {
    // Active users, sessions, pageviews
    const [overviewRes, pagesRes, countriesRes, dailyRes] = await Promise.all([
      // Overview metrics
      analyticsData.properties.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [
            { startDate, endDate },
          ],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'newUsers' },
          ],
        },
      }),

      // Top pages
      analyticsData.properties.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [{ name: 'screenPageViews' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        },
      }),

      // Top countries
      analyticsData.properties.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 10,
        },
      }),

      // Daily active users (for chart)
      analyticsData.properties.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
        },
      }),
    ])

    // Parse overview
    const overviewRow = overviewRes.data.rows?.[0]
    const overview = {
      activeUsers: Number(overviewRow?.metricValues?.[0]?.value || 0),
      sessions: Number(overviewRow?.metricValues?.[1]?.value || 0),
      pageViews: Number(overviewRow?.metricValues?.[2]?.value || 0),
      newUsers: Number(overviewRow?.metricValues?.[3]?.value || 0),
    }

    // Parse top pages
    const topPages = (pagesRes.data.rows ?? []).map(row => ({
      slug: row.dimensionValues?.[0]?.value || '/',
      title: row.dimensionValues?.[1]?.value || 'Unknown',
      views: Number(row.metricValues?.[0]?.value || 0),
    }))

    // Parse top countries
    const topCountries = (countriesRes.data.rows ?? []).map(row => ({
      country: row.dimensionValues?.[0]?.value || 'Unknown',
      users: Number(row.metricValues?.[0]?.value || 0),
    }))

    // Parse daily users
    const dailyUsers = (dailyRes.data.rows ?? []).map(row => ({
      date: formatGADate(row.dimensionValues?.[0]?.value || ''),
      count: Number(row.metricValues?.[0]?.value || 0),
    }))

    return { overview, topPages, topCountries, dailyUsers }
  } catch (err: any) {
    console.error('GA4 API error:', err.message)
    return null
  }
}

// Get 7-day data separately
export async function getGA4Users7d() {
  const auth = getAuth()
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

  try {
    const res = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
      },
    })
    return Number(res.data.rows?.[0]?.metricValues?.[0]?.value || 0)
  } catch {
    return 0
  }
}

// Get today's data
export async function getGA4UsersToday() {
  const auth = getAuth()
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

  try {
    const res = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
      },
    })
    return Number(res.data.rows?.[0]?.metricValues?.[0]?.value || 0)
  } catch {
    return 0
  }
}

// ── Google Search Console ──

export async function getSearchConsoleData(startDate: string, endDate: string) {
  const auth = getAuth()
  const searchConsole = google.searchconsole({ version: 'v1', auth })

  const siteUrl = 'https://mushroomidentifiers.com'

  try {
    // Top queries (keywords), top pages, daily clicks
    const [queriesRes, pagesRes, dailyRes] = await Promise.all([
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 10,
          type: 'web',
        },
      }),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 10,
          type: 'web',
        },
      }),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['date'],
          type: 'web',
        },
      }),
    ])

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
    }))

    return { topKeywords, topSearchPages, dailyClicks }
  } catch (err: any) {
    console.error('Search Console API error:', err.message)
    return null
  }
}

// Helper: GA date format "20260410" → "2026-04-10"
function formatGADate(d: string): string {
  if (d.length !== 8) return d
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
}
