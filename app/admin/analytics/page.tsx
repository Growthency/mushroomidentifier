'use client'
import { useEffect, useState } from 'react'
import {
  Users, TrendingUp, Globe, Search, FileText,
  Loader2, Calendar, BarChart3, Eye,
} from 'lucide-react'

interface AnalyticsData {
  users30d: number
  users7d: number
  usersToday: number
  topPages: { slug: string; title: string; views: number }[]
  topCountries: { country: string; users: number }[]
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
        <p className="text-slate-400 text-sm mb-8">Website traffic and performance data</p>

        <div className="rounded-xl border p-8 text-center" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Analytics Data Loading</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Analytics data is collected from your Supabase database. Make sure your blog_posts table
            has view counts and your profiles table tracks user signups.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Website traffic and content performance</p>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Last 30 Days Users" value={data.users30d} color="blue" />
        <StatCard icon={Calendar} label="Last 7 Days Users" value={data.users7d} color="emerald" />
        <StatCard icon={TrendingUp} label="Today" value={data.usersToday} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: '#334155' }}>
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-white text-sm">Top 10 Pages</h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#334155' }}>
            {data.topPages.length > 0 ? data.topPages.map((p, i) => (
              <div key={p.slug} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-500 w-6">#{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{p.title}</p>
                    <p className="text-xs text-slate-500 truncate">{p.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-3">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-sm font-semibold text-emerald-400">{p.views.toLocaleString()}</span>
                </div>
              </div>
            )) : (
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
              const maxUsers = data.topCountries[0]?.users || 1
              const pct = (c.users / maxUsers) * 100
              return (
                <div key={c.country} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 w-6">#{i + 1}</span>
                      <span className="text-sm text-white">{c.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-400">{c.users.toLocaleString()}</span>
                  </div>
                  <div className="ml-9 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${pct}%` }}
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

      {/* Note */}
      <div className="mt-6 rounded-xl border p-5" style={{ background: '#1e293b', borderColor: '#334155' }}>
        <div className="flex items-start gap-3">
          <Search className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Top Keywords</h3>
            <p className="text-xs text-slate-400">
              Keyword data requires Google Search Console integration. Connect your Search Console account
              to view top search queries driving traffic to your site.
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
