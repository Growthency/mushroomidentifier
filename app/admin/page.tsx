'use client'
import { useEffect, useState } from 'react'
import {
  Users, DollarSign, TrendingUp, TrendingDown,
  CreditCard, UserCheck, UserX, Percent,
  ArrowUpRight, ArrowDownRight, Loader2,
} from 'lucide-react'

interface Stats {
  users: { total: number; free: number; paid: number; conversionRate: number }
  revenue: { lifetime: number; thisMonth: number; last30Days: number; earningsChangePercent: number }
  recentUsers: { id: string; email: string; full_name: string; plan: string; created_at: string }[]
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
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time stats for Mushroom Identifiers</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={stats.users.total} color="blue" />
        <StatCard icon={UserCheck} label="Paid Users" value={stats.users.paid} color="emerald" />
        <StatCard icon={UserX} label="Free Users" value={stats.users.free} color="slate" />
        <StatCard icon={Percent} label="Conversion Rate" value={`${stats.users.conversionRate}%`} color="amber" />
      </div>

      {/* ── Revenue cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Lifetime Earnings" value={fmt(stats.revenue.lifetime)} color="emerald" />
        <StatCard icon={CreditCard} label="This Month" value={fmt(stats.revenue.thisMonth)} color="blue" />
        <StatCard icon={CreditCard} label="Last 30 Days" value={fmt(stats.revenue.last30Days)} color="purple" />
        <div
          className="p-5 rounded-xl border"
          style={{ background: '#1e293b', borderColor: '#334155' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">vs Previous 30 Days</span>
            <div className={`p-1.5 rounded-lg ${changeUp ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
              {changeUp
                ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                : <TrendingDown className="w-4 h-4 text-red-400" />
              }
            </div>
          </div>
          <p className={`text-2xl font-bold ${changeUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeUp ? '+' : ''}{stats.revenue.earningsChangePercent}%
          </p>
          <div className="flex items-center gap-1 mt-1">
            {changeUp
              ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              : <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            }
            <span className="text-xs text-slate-500">month over month</span>
          </div>
        </div>
      </div>

      {/* ── Recent tables ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#334155' }}>
            <h2 className="font-semibold text-white text-sm">Recent Users</h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#334155' }}>
            {stats.recentUsers.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{u.full_name || u.email}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.plan && u.plan !== 'free'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-slate-500/15 text-slate-400'
                  }`}>
                    {u.plan || 'free'}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{timeAgo(u.created_at)}</p>
                </div>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-500 text-center">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#334155' }}>
            <h2 className="font-semibold text-white text-sm">Recent Transactions</h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#334155' }}>
            {stats.recentTransactions.map(tx => (
              <div key={tx.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white capitalize">{tx.pack_name} Pack</p>
                  <p className="text-xs text-slate-500">{timeAgo(tx.created_at)}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-400">{fmt(tx.amount_paid)}</span>
              </div>
            ))}
            {stats.recentTransactions.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-500 text-center">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Stat card component ──
function StatCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: string | number; color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/15 text-blue-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
    purple: 'bg-purple-500/15 text-purple-400',
    slate: 'bg-slate-500/15 text-slate-400',
    red: 'bg-red-500/15 text-red-400',
  }
  return (
    <div className="p-5 rounded-xl border" style={{ background: '#1e293b', borderColor: '#334155' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <div className={`p-1.5 rounded-lg ${colorMap[color] ?? colorMap.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
