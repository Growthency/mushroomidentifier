'use client'
import { useEffect, useState } from 'react'
import {
  Users, DollarSign, TrendingUp, TrendingDown,
  CreditCard, UserCheck, UserX, Percent,
  ArrowUpRight, ArrowDownRight, Loader2,
  Calendar, ChevronDown, Zap, Check,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAdminData } from '@/hooks/useAdminData'

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
  countryUsers: { country: string; users: number }[]
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
  const [period, setPeriod] = useState<Period>('30d')
  const [showPeriod, setShowPeriod] = useState(false)

  // Clear-cache button state — loading while the invalidation fires,
  // success flash shown for 3s, last-cleared timestamp persisted in
  // localStorage so admin can see when they last hit it even after
  // navigating away.
  const [clearing, setClearing] = useState(false)
  const [clearedFlash, setClearedFlash] = useState(false)
  const [lastCleared, setLastCleared] = useState<string | null>(null)

  useEffect(() => {
    setLastCleared(localStorage.getItem('mi-admin-last-cache-clear'))
  }, [])

  // Stats fetch goes through the shared admin cache so revisits and
  // period switches that hit a previously-loaded URL are instant.
  const {
    data: stats,
    isInitialLoading,
    isRefreshing,
    error,
  } = useAdminData<Stats>(`/api/admin/stats?period=${period}`)

  async function clearCache() {
    if (clearing) return
    setClearing(true)
    try {
      const res = await fetch('/api/admin/clear-cache', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Clear failed')
      setClearedFlash(true)
      const ts = new Date().toISOString()
      localStorage.setItem('mi-admin-last-cache-clear', ts)
      setLastCleared(ts)
      setTimeout(() => setClearedFlash(false), 3000)
    } catch (err: any) {
      alert('Clear cache failed: ' + (err?.message || err))
    } finally {
      setClearing(false)
    }
  }

  const cardBg = dark ? 'rgba(255,255,255,0.03)' : '#fff'
  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const dividerColor = dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'

  // First-ever visit (no cached data anywhere yet) — show a skeleton
  // that mimics the real dashboard layout instead of a centered spinner.
  // This is the *only* loading state the user will see; subsequent
  // navigations render instantly from cache.
  if (isInitialLoading) {
    return <DashboardSkeleton dark={dark} />
  }
  if (error && !stats) {
    return <p className="text-red-400">Failed to load stats: {error.message}</p>
  }
  if (!stats) return <DashboardSkeleton dark={dark} />

  const changeUp = stats.revenue.earningsChangePercent >= 0

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Dashboard Overview</h1>
          <p className="text-sm mt-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Real-time stats for Mushroom Identifiers</p>
        </div>

        <div className="flex items-center gap-2">
        {/* ── Clear Cache button ─────────────────────────────────────
            One-click invalidation of every Next.js cache + tag. Mirrors
            W3 Total Cache's "Empty all caches" in WordPress.
        */}
        <div className="relative">
          <button
            onClick={clearCache}
            disabled={clearing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors disabled:opacity-60"
            style={{
              background: clearedFlash
                ? (dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)')
                : (dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
              border: `1px solid ${clearedFlash ? 'rgba(16,185,129,0.4)' : cardBorder}`,
              color: clearedFlash ? '#10b981' : dark ? '#fff' : '#0f172a',
            }}
            title={
              lastCleared
                ? `Last cleared: ${new Date(lastCleared).toLocaleString()}`
                : 'Purge all cached pages & data so the site serves fresh content'
            }
          >
            {clearing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              : clearedFlash
                ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                : <Zap className="w-3.5 h-3.5 text-emerald-400" />
            }
            {clearing ? 'Clearing…' : clearedFlash ? 'Cache cleared' : 'Clear Cache'}
          </button>
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
        </div>{/* /flex items-center gap-2 (header right-side cluster) */}
      </div>

      {/* ── User Stat cards ── */}
      {/* Country counter removed — IP→country lookup isn't currently being
          captured for new signups so the value was always stale/zero. The
          "Users by Country" panel below was dropped at the same time. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GlassCard icon={Users} label="Total Users" value={stats.users.total} color="blue" dark={dark} />
        <GlassCard icon={UserCheck} label="Paid Users" value={stats.users.paid} color="emerald" dark={dark} />
        <GlassCard icon={UserX} label="Free Users" value={stats.users.free} color="slate" dark={dark} />
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
        {/* Recent Users (top 25) */}
        <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <h2 className="font-semibold text-[13px] tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Recent Users</h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: dark ? '#64748b' : '#94a3b8' }}>
              Top 25
            </span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
            {stats.recentUsers.map(u => (
              <div key={u.id} className="px-5 py-3.5 flex items-center justify-between transition-colors" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-[13px] font-medium truncate" style={{ color: dark ? '#fff' : '#0f172a' }}>{u.full_name || u.email}</p>
                  <p className="text-[11px] truncate" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{u.email}</p>
                  {/* Country line removed — see comment above the user-stats
                      grid; geolocation isn't being recorded reliably enough
                      to surface here. */}
                </div>
                <div className="text-right shrink-0">
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

        {/* Recent Transactions (top 25) */}
        <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <h2 className="font-semibold text-[13px] tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Recent Transactions</h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: dark ? '#64748b' : '#94a3b8' }}>
              Top 25
            </span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
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

        {/* Users by Country panel removed — the country tracking pipeline
            wasn't capturing data for new signups so the panel was always
            empty. Recent Users + Recent Transactions are the two surfaces
            the dashboard now keeps. */}
      </div>
    </div>
  )
}

// ── Dashboard skeleton ── shown only on the very first visit (no cache).
// Mirrors the real layout (4 stat cards + 4 revenue cards + 2 recent panels)
// so the page chrome doesn't pop. Pure CSS pulse, no spinners.
function DashboardSkeleton({ dark }: { dark: boolean }) {
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : '#fff'
  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const pulse = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const SkelCard = ({ tall = false }: { tall?: boolean }) => (
    <div className="p-5 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 rounded animate-pulse" style={{ background: pulse }} />
        <div className="w-8 h-8 rounded-xl animate-pulse" style={{ background: pulse }} />
      </div>
      <div className="h-7 w-16 rounded animate-pulse" style={{ background: pulse }} />
      {tall && <div className="h-3 w-20 rounded mt-2 animate-pulse" style={{ background: pulse }} />}
    </div>
  )
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-6 w-56 rounded animate-pulse" style={{ background: pulse }} />
          <div className="h-3 w-72 rounded mt-2 animate-pulse" style={{ background: pulse }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => <SkelCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <SkelCard key={i} tall />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}`, height: 320 }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
              <div className="h-4 w-32 rounded animate-pulse" style={{ background: pulse }} />
            </div>
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: pulse }} />
                  <div className="h-3 w-12 rounded animate-pulse" style={{ background: pulse }} />
                </div>
              ))}
            </div>
          </div>
        ))}
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
