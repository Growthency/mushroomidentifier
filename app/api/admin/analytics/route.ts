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

  // ── Top 10 pages by views ──
  const { data: topPages } = await admin
    .from('blog_posts')
    .select('slug, title, views')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(10)

  // ── Top countries (from profiles.country if available, otherwise from signup metadata) ──
  // We'll try to aggregate countries from profiles
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
    users30d: users30d ?? 0,
    users7d: users7d ?? 0,
    usersToday: usersToday ?? 0,
    topPages: topPages ?? [],
    topCountries,
  })
}
