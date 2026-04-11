'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  Users, DollarSign, TrendingUp, TrendingDown,
  CreditCard, UserCheck, UserX, Percent,
  ArrowUpRight, ArrowDownRight, Loader2,
  Calendar, ChevronDown, Globe,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

type Period = '7d' | '30d' | 'this_month' | 'last_month' | '365d' | 'year_vs_year'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  'this_month': 'This Month',
  'last_month': 'Last Month',
  '365d': 'Last 365 Days',
  'year_vs_year': 'Last Year vs This Year',
}

interface Stats {
  users: { total: number; free: number; paid: number; conversionRate: number; uniqueCountries: number }
  revenue: { lifetime: number; thisMonth: number; period: number; earningsChangePercent: number }
  recentUsers: { id: string; email: string; full_name: string; plan: string; created_at: string; country: string | null }[]
  recentTransactions: { id: string; user_id: string; pack_name: string; amount_paid: number; created_at: string }[]
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AdminDashboard() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30d')
  const [showPeriod, setShowPeriod] = useState(false)

  const loadStats = useCallback((p: Period) => {
    setLoading(true)
    fetch(`/api/admin/stats?period=${p}`)
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadStats(period) }, [period, loadStats])

  const cardBg = dark ? 'rgba(255,255,255,0.03)' : '#fff'
  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const dividerColor = dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }
  if (!stats) return <p className="text-red-400">Failed to load stats</p>

  const changeUp = stats.revenue.earningsChangePercent >= 0

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Dashboard Overview</h1>
          <p className="text-sm mt-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Real-time stats for Mushroom Identifiers</p>
        </div>
        {/* Period Filter */}
        <div className="relative">
          <button
            onClick={() => setShowPeriod(!showPeriod)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors"
            style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: dark ? '#fff' : '#0f172a' }}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            {PERIOD_LABELS[period]}
            <ChevronDown className="w-3.5 h-3.5" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
          </button>
          {showPeriod && (
            <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl overflow-hidden shadow-xl" style={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
              {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); setShowPeriod(false) }}
                  className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
                  style={{
                    color: p === period ? '#10b981' : dark ? '#e2e8f0' : '#334155',
                    background: p === period ? (dark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)') : 'transparent',
                  }}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── User Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <GlassCard icon={Users} label="Total Users" value={stats.users.total} color="blue" dark={dark} />
        <GlassCard icon={UserCheck} label="Paid Users" value={stats.users.paid} color="emerald" dark={dark} />
        <GlassCard icon={UserX} label="Free Users" value={stats.users.free} color="slate" dark={dark} />
        <GlassCard icon={Globe} label="Countries" value={stats.users.uniqueCountries} color="purple" dark={dark} />
        <GlassCard icon={Percent} label="Conversion Rate" value={`${stats.users.conversionRate}%`} color="amber" dark={dark} />
      </div>

      {/* ── Revenue cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard icon={DollarSign} label="Lifetime Earnings" value={fmt(stats.revenue.lifetime)} color="emerald" dark={dark} />
        <GlassCard icon={CreditCard} label="This Month" value={fmt(stats.revenue.thisMonth)} color="blue" dark={dark} />
        <GlassCard icon={CreditCard} label={PERIOD_LABELS[period]} value={fmt(stats.revenue.period)} color="purple" dark={dark} />
        <div className="p-5 rounded-2xl backdrop-blur-sm" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: dark ? '#64748b' : '#94a3b8' }}>vs Previous Period</span>
            <div className={`p-2 rounded-xl ${changeUp ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              {changeUp
                ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                : <TrendingDown className="w-4 h-4 text-red-400" />
              }
            </div>
          </div>
          <p className={`text-[28px] font-bold tracking-tight ${changeUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeUp ? '+' : ''}{stats.revenue.earningsChangePercent}%
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            {changeUp
              ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500/60" />
              : <ArrowDownRight className="w-3.5 h-3.5 text-red-500/60" />
            }
            <span className="text-[11px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>period over period</span>
          </div>
        </div>
      </div>

      {/* ── Recent tables ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <h2 className="font-semibold text-[13px] tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Recent Users</h2>
          </div>
          <div>
            {stats.recentUsers.map(u => (
              <div key={u.id} className="px-5 py-3.5 flex items-center justify-between transition-colors" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: dark ? '#fff' : '#0f172a' }}>{u.full_name || u.email}</p>
                  <p className="text-[11px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{u.email}</p>
                  {u.country && (
                    <p className="text-[10px] mt-0.5" style={{ color: dark ? '#475569' : '#a1a1aa' }}>{u.country}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold ${
                    u.plan && u.plan !== 'free'
                      ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                      : dark
                        ? 'bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.06]'
                        : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                  }`}>
                    {u.plan || 'free'}
                  </span>
                  <p className="text-[10px] mt-1" style={{ color: dark ? '#334155' : '#94a3b8' }}>{timeAgo(u.created_at)}</p>
                </div>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <p className="px-5 py-8 text-[13px] text-center" style={{ color: dark ? '#334155' : '#94a3b8' }}>No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <h2 className="font-semibold text-[13px] tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Recent Transactions</h2>
          </div>
          <div>
            {stats.recentTransactions.map(tx => (
              <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between transition-colors" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                <div>
                  <p className="text-[13px] font-medium capitalize" style={{ color: dark ? '#fff' : '#0f172a' }}>{tx.pack_name} Pack</p>
                  <p className="text-[11px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{timeAgo(tx.created_at)}</p>
                </div>
                <span className="text-[14px] font-bold text-emerald-400">{fmt(tx.amount_paid)}</span>
              </div>
            ))}
            {stats.recentTransactions.length === 0 && (
              <p className="px-5 py-8 text-[13px] text-center" style={{ color: dark ? '#334155' : '#94a3b8' }}>No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Glass Card component ──
function GlassCard({ icon: Icon, label, value, color, dark }: {
  icon: any; label: string; value: string | number; color: string; dark: boolean
}) {
  const iconBg: Record<string, string> = {
    blue:    'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber:   'bg-amber-500/10 text-amber-400',
    purple:  'bg-purple-500/10 text-purple-400',
    slate:   dark ? 'bg-white/[0.05] text-slate-400' : 'bg-slate-100 text-slate-500',
    red:     'bg-red-500/10 text-red-400',
  }
  return (
    <div className="p-5 rounded-2xl backdrop-blur-sm" style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#fff', border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{label}</span>
        <div className={`p-2 rounded-xl ${iconBg[color] ?? iconBg.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-[28px] font-bold tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>{value}</p>
    </div>
  )
}
