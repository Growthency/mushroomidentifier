import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { getGA4Report, getGA4Users7d, getGA4UsersToday, getSearchConsoleData } from '@/lib/google-analytics'

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

  // Fetch GA4 + Search Console data in parallel
  const [ga4Data, ga4Users7d, ga4UsersToday, searchData] = await Promise.all([
    getGA4Report(startDate, endDate),
    getGA4Users7d(),
    getGA4UsersToday(),
    getSearchConsoleData(
      getDateString(days),
      getDateString(0)
    ),
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
