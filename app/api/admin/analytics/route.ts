import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { getGA4Report, getGA4Users7d, getGA4UsersToday, getSearchConsoleData } from '@/lib/google-analytics'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch GA4 + Search Console data in parallel
  const [ga4Data, ga4Users7d, ga4UsersToday, searchData] = await Promise.all([
    getGA4Report('30daysAgo', 'today'),
    getGA4Users7d(),
    getGA4UsersToday(),
    getSearchConsoleData(
      getDateString(30),
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

    // Source flags
    gaConnected: !!ga4Data,
    gscConnected: !!searchData,
  })
}

function getDateString(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}
