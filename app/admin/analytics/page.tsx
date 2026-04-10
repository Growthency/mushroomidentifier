'use client'
import { useEffect, useState } from 'react'
import {
  Users, TrendingUp, Globe, Search, FileText,
  Loader2, Calendar, BarChart3, Eye, Clock,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

interface AnalyticsData {
  users30d: number
  users7d: number
  usersToday: number
  totalUsers: number
  topPages: { slug: string; title: string; views: number }[]
  topCountries: { country: string; users: number }[]
  dailySignups: { date: string; count: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
        <div className="rounded-xl border p-8 text-center" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Failed to Load Analytics</h2>
          <p className="text-sm text-slate-400">Please check your database connection and try again.</p>
        </div>
      </div>
    )
  }

  const maxBarViews = data.topPages.length > 0 ? data.topPages[0].views : 1
  const maxBarUsers = data.topCountries.length > 0 ? data.topCountries[0].users : 1

  // Chart data for daily signups
  const chartMax = data.dailySignups.length > 0
    ? Math.max(...data.dailySignups.map(d => d.count), 1)
    : 1

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Website traffic and content performance</p>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={data.totalUsers} color="slate" />
        <StatCard icon={Calendar} label="Last 30 Days" value={data.users30d} color="blue" />
        <StatCard icon={TrendingUp} label="Last 7 Days" value={data.users7d} color="emerald" />
        <StatCard icon={Clock} label="Today" value={data.usersToday} color="purple" />
      </div>

      {/* Daily Signups Chart */}
      <div className="rounded-xl border p-5 mb-6" style={{ background: '#1e293b', borderColor: '#334155' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-white text-sm">User Signups — Last 30 Days</h2>
          </div>
          <span className="text-xs text-slate-500">{data.users30d} new users</span>
        </div>

        {data.dailySignups.length > 0 ? (
          <div className="flex items-end gap-[3px] h-40">
            {data.dailySignups.map((day, i) => {
              const pct = (day.count / chartMax) * 100
              const date = new Date(day.date)
              const label = `${date.getMonth() + 1}/${date.getDate()}`
              return (
                <div
                  key={day.date}
                  className="flex-1 group relative flex flex-col items-center justify-end"
                  style={{ height: '100%' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
                      <span className="text-white font-medium">{day.count}</span>
                      <span className="text-slate-400 ml-1">{label}</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t transition-all group-hover:bg-emerald-400"
                    style={{
                      height: `${Math.max(pct, 3)}%`,
                      background: day.count > 0
                        ? `linear-gradient(to top, rgba(16,185,129,0.6), rgba(16,185,129,${0.2 + (pct / 100) * 0.6}))`
                        : 'rgba(71,85,105,0.3)',
                      minHeight: '2px',
                    }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <p className="text-sm text-slate-500">No signup data for this period</p>
          </div>
        )}

        {/* X-axis labels */}
        {data.dailySignups.length > 0 && (
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-slate-500">
              {new Date(data.dailySignups[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-[10px] text-slate-500">
              {new Date(data.dailySignups[data.dailySignups.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top Pages */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: '#334155' }}>
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-white text-sm">Top 10 Pages by Views</h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#334155' }}>
            {data.topPages.length > 0 ? data.topPages.map((p, i) => {
              const pct = (p.views / maxBarViews) * 100
              return (
                <div key={p.slug} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`text-xs font-bold w-6 shrink-0 ${i < 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        #{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{p.title}</p>
                        <p className="text-xs text-slate-500 truncate">{p.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3 shrink-0">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-sm font-semibold text-emerald-400">{p.views.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div className="ml-9 h-1 rounded-full bg-slate-700/50 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(to right, #10b981, #34d399)',
                      }}
                    />
                  </div>
                </div>
              )
            }) : (
              <p className="px-5 py-8 text-sm text-slate-500 text-center">No page data yet</p>
            )}
          </div>
        </div>

        {/* Top Countries */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: '#334155' }}>
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-white text-sm">Top 10 Countries</h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#334155' }}>
            {data.topCountries.length > 0 ? data.topCountries.map((c, i) => {
              const pct = (c.users / maxBarUsers) * 100
              return (
                <div key={c.country} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-6 ${i < 3 ? 'text-blue-400' : 'text-slate-500'}`}>
                        #{i + 1}
                      </span>
                      <span className="text-sm text-white">{c.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-400">{c.users.toLocaleString()}</span>
                  </div>
                  <div className="ml-9 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
                      }}
                    />
                  </div>
                </div>
              )
            }) : (
              <p className="px-5 py-8 text-sm text-slate-500 text-center">No country data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Keywords note */}
      <div className="rounded-xl border p-5" style={{ background: '#1e293b', borderColor: '#334155' }}>
        <div className="flex items-start gap-3">
          <Search className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Top Search Keywords</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Keyword data comes from Google Search Console. Your site is verified with Search Console
              (ID: <code className="text-emerald-400 bg-slate-800 px-1 rounded text-[10px]">dipMWRMeOiWrrLH32OCvAQS-wR14IzCVSCLFUt9mH-0</code>).
              To see keywords here, connect the Search Console API with a service account.
              Your GA4 tracking ID is <code className="text-emerald-400 bg-slate-800 px-1 rounded text-[10px]">G-X00VE6WCX6</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: number; color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/15 text-blue-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    purple: 'bg-purple-500/15 text-purple-400',
    slate: 'bg-slate-500/15 text-slate-400',
  }
  return (
    <div className="p-5 rounded-xl border" style={{ background: '#1e293b', borderColor: '#334155' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <div className={`p-1.5 rounded-lg ${colorMap[color] ?? colorMap.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  )
}
