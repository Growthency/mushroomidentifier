import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role for full access
  const { createClient: createAdmin } = await import('@supabase/supabase-js')
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // ── Users ──
  const { count: totalUsers } = await admin
    .from('profiles').select('*', { count: 'exact', head: true })

  const { count: freeUsers } = await admin
    .from('profiles').select('*', { count: 'exact', head: true })
    .or('plan.is.null,plan.eq.free')

  const paidUsers = (totalUsers ?? 0) - (freeUsers ?? 0)
  const conversionRate = totalUsers ? ((paidUsers / totalUsers) * 100).toFixed(1) : '0'

  // ── Revenue ──
  const { data: allTx } = await admin
    .from('transactions').select('amount_paid, created_at')

  const lifetimeEarnings = (allTx ?? []).reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const thisMonthTx = (allTx ?? []).filter(t => new Date(t.created_at) >= thisMonthStart)
  const thisMonthEarnings = thisMonthTx.reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const last30Tx = (allTx ?? []).filter(t => new Date(t.created_at) >= thirtyDaysAgo)
  const last30Earnings = last30Tx.reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const prev30Tx = (allTx ?? []).filter(t => {
    const d = new Date(t.created_at)
    return d >= sixtyDaysAgo && d < thirtyDaysAgo
  })
  const prev30Earnings = prev30Tx.reduce((s, t) => s + (Number(t.amount_paid) || 0), 0)

  const earningsChange = prev30Earnings > 0
    ? (((last30Earnings - prev30Earnings) / prev30Earnings) * 100).toFixed(1)
    : last30Earnings > 0 ? '100' : '0'

  // ── Recent users ──
  const { data: recentUsers } = await admin
    .from('profiles')
    .select('id, email, full_name, plan, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  // ── Recent transactions ──
  const { data: recentTx } = await admin
    .from('transactions')
    .select('id, user_id, pack_name, amount_paid, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return NextResponse.json({
    users: {
      total: totalUsers ?? 0,
      free: freeUsers ?? 0,
      paid: paidUsers,
      conversionRate: Number(conversionRate),
    },
    revenue: {
      lifetime: lifetimeEarnings,
      thisMonth: thisMonthEarnings,
      last30Days: last30Earnings,
      earningsChangePercent: Number(earningsChange),
    },
    recentUsers: recentUsers ?? [],
    recentTransactions: recentTx ?? [],
  })
}
