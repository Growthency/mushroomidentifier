import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const period = request.nextUrl.searchParams.get('period') || '30d'

  // Use service role for full access
  const { createClient: createAdmin } = await import('@supabase/supabase-js')
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date()
  const { rangeStart, prevStart, prevEnd } = getPeriodRange(period, now)

  // ── Users ──
  const { count: totalUsers } = await admin
    .from('profiles').select('*', { count: 'exact', head: true })

  const { count: freeUsers } = await admin
    .from('profiles').select('*', { count: 'exact', head: true })
    .or('plan.is.null,plan.eq.free')

  const paidUsers = (totalUsers ?? 0) - (freeUsers ?? 0)
  const conversionRate = totalUsers ? ((paidUsers / totalUsers) * 100).toFixed(1) : '0'

  // ── Unique countries ──
  const { data: countryRows } = await admin
    .from('profiles')
    .select('country')
    .not('country', 'is', null)
    .neq('country', '')

  const uniqueCountries = new Set((countryRows ?? []).map(r => r.country)).size

  // ── Revenue ──
  const { data: allTx } = await admin
    .from('transactions').select('amount_paid, created_at')

  const lifetimeEarnings = (allTx ?? []).reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const periodTx = (allTx ?? []).filter(t => new Date(t.created_at) >= rangeStart)
  const periodEarnings = periodTx.reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const prevTx = (allTx ?? []).filter(t => {
    const d = new Date(t.created_at)
    return d >= prevStart && d < prevEnd
  })
  const prevEarnings = prevTx.reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const earningsChange = prevEarnings > 0
    ? (((periodEarnings - prevEarnings) / prevEarnings) * 100).toFixed(1)
    : periodEarnings > 0 ? '100' : '0'

  // This month (always show separately)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthTx = (allTx ?? []).filter(t => new Date(t.created_at) >= thisMonthStart)
  const thisMonthEarnings = thisMonthTx.reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  // ── Recent users (top 25) ──
  const { data: recentUsers } = await admin
    .from('profiles')
    .select('id, email, full_name, plan, created_at, country')
    .order('created_at', { ascending: false })
    .limit(25)

  // ── Recent transactions (top 25) ──
  const { data: recentTx } = await admin
    .from('transactions')
    .select('id, user_id, pack_name, amount_paid, created_at')
    .order('created_at', { ascending: false })
    .limit(25)

  // ── Users by country (ranked) ──
  const countryMap: Record<string, number> = {}
  for (const r of countryRows ?? []) {
    if (r.country) countryMap[r.country] = (countryMap[r.country] || 0) + 1
  }
  const countryUsers = Object.entries(countryMap)
    .map(([country, users]) => ({ country, users }))
    .sort((a, b) => b.users - a.users)

  return NextResponse.json({
    users: {
      total: totalUsers ?? 0,
      free: freeUsers ?? 0,
      paid: paidUsers,
      conversionRate: Number(conversionRate),
      uniqueCountries,
    },
    revenue: {
      lifetime: lifetimeEarnings,
      thisMonth: thisMonthEarnings,
      period: periodEarnings,
      earningsChangePercent: Number(earningsChange),
    },
    recentUsers: recentUsers ?? [],
    recentTransactions: recentTx ?? [],
    countryUsers,
    period,
  })
}

function getPeriodRange(period: string, now: Date) {
  switch (period) {
    case '7d': {
      const rangeStart = new Date(now.getTime() - 7 * 86400000)
      const prevStart = new Date(now.getTime() - 14 * 86400000)
      return { rangeStart, prevStart, prevEnd: rangeStart }
    }
    case '30d': {
      const rangeStart = new Date(now.getTime() - 30 * 86400000)
      const prevStart = new Date(now.getTime() - 60 * 86400000)
      return { rangeStart, prevStart, prevEnd: rangeStart }
    }
    case 'this_month': {
      const rangeStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return { rangeStart, prevStart, prevEnd: rangeStart }
    }
    case 'last_month': {
      const rangeStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      const prevEnd = rangeStart
      return { rangeStart, prevStart, prevEnd }
    }
    case '365d': {
      const rangeStart = new Date(now.getTime() - 365 * 86400000)
      const prevStart = new Date(now.getTime() - 730 * 86400000)
      return { rangeStart, prevStart, prevEnd: rangeStart }
    }
    case 'year_vs_year': {
      const rangeStart = new Date(now.getFullYear(), 0, 1)
      const prevStart = new Date(now.getFullYear() - 1, 0, 1)
      return { rangeStart, prevStart, prevEnd: rangeStart }
    }
    default: {
      const rangeStart = new Date(now.getTime() - 30 * 86400000)
      const prevStart = new Date(now.getTime() - 60 * 86400000)
      return { rangeStart, prevStart, prevEnd: rangeStart }
    }
  }
}
