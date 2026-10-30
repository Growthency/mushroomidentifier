import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server-client'
import { isAdminEmail } from '@/lib/admin'
import { getGA4Report, getGA4Users7d, getGA4UsersToday, getSearchConsoleData } from '@/lib/google-analytics'
import { bingConfigured, bingSiteUrl, getBingData, getBingSiteStatus } from '@/lib/bing-webmaster'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const period = request.nextUrl.searchParams.get('period') || '30d'
  const chartType = request.nextUrl.searchParams.get('chart') || 'users'

  const { startDate, days } = getPeriodDates(period)
  const endDate = 'today'

  // Bing tab — fetched on its own so a Bing problem never touches GA / GSC.
  if (request.nextUrl.searchParams.get('source') === 'bing') {
    const siteUrl = bingSiteUrl()
    if (!bingConfigured()) return NextResponse.json({ configured: false, connected: false, siteUrl })
    const start = getDateString(days)
    const [dataRes, siteRes] = await Promise.allSettled([getBingData(start, getDateString(0)), getBingSiteStatus()])
    const site = siteRes.status === 'fulfilled' ? siteRes.value : null
    if (dataRes.status === 'rejected') {
      return NextResponse.json({ configured: true, connected: false, siteUrl, site, error: String(dataRes.reason?.message || dataRes.reason).slice(0, 300) })
    }
    const { daily, topKeywords, topPages } = dataRes.value
    const clicks = daily.reduce((n, d) => n + d.clicks, 0)
    const impressions = daily.reduce((n, d) => n + d.impressions, 0)
    return NextResponse.json({
      configured: true, connected: true, siteUrl, site, daily, topKeywords, topPages,
      totals: { clicks, impressions, ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(1)) : 0 },
    })
  }

  // Fetch GA4 + Search Console data in parallel
  let gaError: string | null = null
  let gscError: string | null = null
  const [ga4Data, ga4Users7d, ga4UsersToday, searchData] = await Promise.all([
    getGA4Report(startDate, endDate).catch((err) => { gaError = err.message; return null }),
    getGA4Users7d(),
    getGA4UsersToday(),
    getSearchConsoleData(
      getDateString(days),
      getDateString(0)
    ).catch((err) => { gscError = err.message; return null }),
  ])

  return NextResponse.json({
    // GA4 overview
    totalUsers: ga4Data?.overview.activeUsers ?? 0,
    users30d: ga4Data?.overview.activeUsers ?? 0,
    users7d: ga4Users7d,
    usersToday: ga4UsersToday,
    sessions30d: ga4Data?.overview.sessions ?? 0,
    pageViews30d: ga4Data?.overview.pageViews ?? 0,
    newUsers30d: ga4Data?.overview.newUsers ?? 0,

    // GA4 top pages & countries
    topPages: ga4Data?.topPages ?? [],
    topCountries: ga4Data?.topCountries ?? [],

    // GA4 daily chart
    dailySignups: ga4Data?.dailyUsers ?? [],

    // Search Console
    topKeywords: searchData?.topKeywords ?? [],
    topSearchPages: searchData?.topSearchPages ?? [],
    dailyClicks: searchData?.dailyClicks ?? [],

    // Source flags
    gaConnected: !!ga4Data,
    gscConnected: !!searchData,
    gaError,
    gscError,
    gscProperty: searchData?.siteUrl ?? null,

    // Meta
    period,
    chartType,
  })
}

function getPeriodDates(period: string): { startDate: string; days: number } {
  const now = new Date()
  switch (period) {
    case '7d':
      return { startDate: '7daysAgo', days: 7 }
    case '30d':
      return { startDate: '30daysAgo', days: 30 }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { startDate: start.toISOString().split('T')[0], days: Math.ceil((now.getTime() - start.getTime()) / 86400000) }
    }
    case 'last_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { startDate: start.toISOString().split('T')[0], days: Math.ceil((end.getTime() - start.getTime()) / 86400000) }
    }
    case '365d':
      return { startDate: '365daysAgo', days: 365 }
    case 'lifetime':
      return { startDate: '2020-01-01', days: Math.ceil((now.getTime() - new Date('2020-01-01').getTime()) / 86400000) }
    default:
      return { startDate: '30daysAgo', days: 30 }
  }
}

function getDateString(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}
