import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { createClient as createAdmin } from '@supabase/supabase-js'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // ── Total users ──
  const { count: totalUsers } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // ── Users in time ranges ──
  const { count: users30d } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: users7d } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString())

  const { count: usersToday } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString())

  // ── Daily signups for last 30 days (for chart) ──
  const { data: recentProfiles } = await admin
    .from('profiles')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // Aggregate by day
  const dailyMap: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    dailyMap[key] = 0
  }
  ;(recentProfiles ?? []).forEach((p: any) => {
    const key = new Date(p.created_at).toISOString().split('T')[0]
    if (dailyMap[key] !== undefined) dailyMap[key]++
  })

  const dailySignups = Object.entries(dailyMap).map(([date, count]) => ({ date, count }))

  // ── Top 10 pages by views ──
  const { data: topPages } = await admin
    .from('blog_posts')
    .select('slug, title, views')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(10)

  // ── Top countries ──
  const { data: profileCountries } = await admin
    .from('profiles')
    .select('country')
    .not('country', 'is', null)
    .not('country', 'eq', '')

  const countryMap: Record<string, number> = {}
  ;(profileCountries ?? []).forEach((p: any) => {
    if (p.country) {
      const c = p.country.trim()
      countryMap[c] = (countryMap[c] || 0) + 1
    }
  })

  const topCountries = Object.entries(countryMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, users]) => ({ country, users }))

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    users30d: users30d ?? 0,
    users7d: users7d ?? 0,
    usersToday: usersToday ?? 0,
    topPages: topPages ?? [],
    topCountries,
    dailySignups,
  })
}
