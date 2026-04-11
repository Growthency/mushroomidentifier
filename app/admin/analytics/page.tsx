'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  Users, TrendingUp, Globe, Search, FileText,
  Loader2, Calendar, BarChart3, Eye, Clock,
  MousePointerClick, Layers, Activity, CheckCircle2, XCircle,
  ChevronDown,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface AnalyticsData {
  users30d: number
  users7d: number
  usersToday: number
  totalUsers: number
  sessions30d: number
  pageViews30d: number
  newUsers30d: number
  topPages: { slug: string; title: string; views: number }[]
  topCountries: { country: string; users: number }[]
  dailySignups: { date: string; count: number }[]
  dailyClicks: { date: string; clicks: number; impressions: number }[]
  topKeywords: { keyword: string; clicks: number; impressions: number; ctr: number; position: number }[]
  topSearchPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[]
  gaConnected: boolean
  gscConnected: boolean
}

type Period = '7d' | '30d' | 'this_month' | 'last_month' | '365d' | 'lifetime'
type ChartType = 'users' | 'clicks' | 'both'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  'this_month': 'This Month',
  'last_month': 'Last Month',
  '365d': 'Last 365 Days',
  'lifetime': 'Lifetime',
}

const CHART_LABELS: Record<ChartType, string> = {
  users: 'Daily Active Users',
  clicks: 'Daily Active Clicks',
  both: 'Clicks vs Users',
}

export default function AnalyticsPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30d')
  const [chartType, setChartType] = useState<ChartType>('users')
  const [showPeriod, setShowPeriod] = useState(false)
  const [showChart, setShowChart] = useState(false)

  const loadData = useCallback((p: Period) => {
    setLoading(true)
    fetch(`/api/admin/analytics?period=${p}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadData(period) }, [period, loadData])

  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const dividerColor = dark ? '#334155' : '#f1f5f9'

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
        <h1 className="text-2xl font-bold mb-2" style={{ color: dark ? '#fff' : '#0f172a' }}>Analytics</h1>
        <div className="rounded-xl border p-8 text-center" style={{ background: cardBg, borderColor: cardBorder }}>
          <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: dark ? '#334155' : '#cbd5e1' }} />
          <h2 className="text-lg font-semibold mb-2" style={{ color: dark ? '#fff' : '#0f172a' }}>Failed to Load Analytics</h2>
          <p className="text-sm" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Please check your API connections and try again.</p>
        </div>
      </div>
    )
  }

  const maxBarViews = data.topPages.length > 0 ? data.topPages[0].views : 1
  const maxBarUsers = data.topCountries.length > 0 ? data.topCountries[0].users : 1

  // Chart data
  const usersChart = data.dailySignups || []
  const clicksChart = data.dailyClicks || []
  const chartMax = chartType === 'users'
    ? Math.max(...usersChart.map(d => d.count), 1)
    : chartType === 'clicks'
      ? Math.max(...clicksChart.map(d => d.clicks), 1)
      : Math.max(...usersChart.map(d => d.count), ...clicksChart.map(d => d.clicks), 1)
  const chartData = chartType === 'clicks' ? clicksChart : usersChart

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Real-time data from Google Analytics & Search Console</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowPeriod(!showPeriod); setShowChart(false) }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: dark ? '#fff' : '#0f172a' }}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {PERIOD_LABELS[period]}
              <ChevronDown className="w-3.5 h-3.5" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
            </button>
            {showPeriod && (
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl overflow-hidden shadow-xl" style={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${cardBorder}` }}>
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
          {/* Connection status */}
          <span className="flex items-center gap-1.5 text-xs">
            {data.gaConnected
              ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">GA4 Connected</span></>
              : <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">GA4 Error</span></>
            }
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            {data.gscConnected
              ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Search Console</span></>
              : <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">GSC Error</span></>
            }
          </span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Users (30d)" value={data.users30d} color="blue" dark={dark} />
        <StatCard icon={Calendar} label="Users (7d)" value={data.users7d} color="emerald" dark={dark} />
        <StatCard icon={Clock} label="Today" value={data.usersToday} color="purple" dark={dark} />
        <StatCard icon={TrendingUp} label="New Users (30d)" value={data.newUsers30d} color="amber" dark={dark} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Activity} label="Sessions (30d)" value={data.sessions30d} color="blue" dark={dark} />
        <StatCard icon={Eye} label="Page Views (30d)" value={data.pageViews30d} color="emerald" dark={dark} />
        <StatCard icon={Layers} label="Total Active Users" value={data.totalUsers} color="slate" dark={dark} />
      </div>

      {/* Daily Chart */}
      <div className="rounded-xl border p-5 mb-6" style={{ background: cardBg, borderColor: cardBorder }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>
              {CHART_LABELS[chartType]} — {PERIOD_LABELS[period]}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Chart Type Toggle */}
            <div className="relative">
              <button
                onClick={() => { setShowChart(!showChart); setShowPeriod(false) }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: `1px solid ${cardBorder}`, color: dark ? '#e2e8f0' : '#334155' }}
              >
                {CHART_LABELS[chartType]}
                <ChevronDown className="w-3 h-3" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
              </button>
              {showChart && (
                <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl overflow-hidden shadow-xl" style={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${cardBorder}` }}>
                  {(Object.keys(CHART_LABELS) as ChartType[]).map(ct => (
                    <button
                      key={ct}
                      onClick={() => { setChartType(ct); setShowChart(false) }}
                      className="w-full text-left px-4 py-2.5 text-[12px] transition-colors"
                      style={{
                        color: ct === chartType ? '#10b981' : dark ? '#e2e8f0' : '#334155',
                        background: ct === chartType ? (dark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)') : 'transparent',
                      }}
                    >
                      {CHART_LABELS[ct]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              {chartType === 'clicks' ? 'from Search Console' : chartType === 'both' ? 'GA4 + GSC' : 'from Google Analytics'}
            </span>
          </div>
        </div>

        {chartType === 'both' ? (
          /* Combined chart */
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#10b981' }}>
                <span className="w-3 h-1.5 rounded-full" style={{ background: '#10b981' }} /> Users
              </span>
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#3b82f6' }}>
                <span className="w-3 h-1.5 rounded-full" style={{ background: '#3b82f6' }} /> Clicks
              </span>
            </div>
            {usersChart.length > 0 ? (
              <div className="flex items-end gap-[3px] h-44">
                {usersChart.map((day, i) => {
                  const clickDay = clicksChart[i]
                  const userPct = (day.count / chartMax) * 100
                  const clickPct = clickDay ? (clickDay.clicks / chartMax) * 100 : 0
                  const date = new Date(day.date)
                  const label = `${date.getMonth() + 1}/${date.getDate()}`
                  return (
                    <div key={day.date} className="flex-1 group relative flex items-end gap-[1px] justify-center" style={{ height: '100%' }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="rounded-lg px-2 py-1 text-xs whitespace-nowrap" style={{ background: dark ? '#0f172a' : '#fff', border: `1px solid ${cardBorder}` }}>
                          <span style={{ color: '#10b981' }}>{day.count}u</span>
                          <span className="mx-1" style={{ color: dark ? '#334155' : '#cbd5e1' }}>|</span>
                          <span style={{ color: '#3b82f6' }}>{clickDay?.clicks ?? 0}c</span>
                          <span className="ml-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{label}</span>
                        </div>
                      </div>
                      <div className="w-1/2 rounded-t" style={{ height: `${Math.max(userPct, 3)}%`, background: 'rgba(16,185,129,0.6)', minHeight: '2px' }} />
                      <div className="w-1/2 rounded-t" style={{ height: `${Math.max(clickPct, 3)}%`, background: 'rgba(59,130,246,0.6)', minHeight: '2px' }} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center">
                <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No data for this period</p>
              </div>
            )}
          </div>
        ) : (
          /* Single chart */
          chartData.length > 0 ? (
            <div className="flex items-end gap-[3px] h-44">
              {chartData.map((day: any) => {
                const val = chartType === 'clicks' ? day.clicks : day.count
                const pct = (val / chartMax) * 100
                const date = new Date(day.date)
                const label = `${date.getMonth() + 1}/${date.getDate()}`
                const barColor = chartType === 'clicks' ? 'rgba(59,130,246' : 'rgba(16,185,129'
                return (
                  <div key={day.date} className="flex-1 group relative flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="rounded-lg px-2 py-1 text-xs whitespace-nowrap" style={{ background: dark ? '#0f172a' : '#fff', border: `1px solid ${cardBorder}` }}>
                        <span className="font-medium" style={{ color: dark ? '#fff' : '#0f172a' }}>{val}</span>
                        <span className="ml-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{label}</span>
                      </div>
                    </div>
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${Math.max(pct, 3)}%`,
                        background: val > 0
                          ? `linear-gradient(to top, ${barColor},0.7), ${barColor},${0.2 + (pct / 100) * 0.6}))`
                          : dark ? 'rgba(71,85,105,0.3)' : 'rgba(203,213,225,0.4)',
                        minHeight: '2px',
                      }}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <p className="text-sm" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No data for this period</p>
            </div>
          )
        )}

        {chartData.length > 0 && (
          <div className="flex justify-between mt-2">
            <span className="text-[10px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              {new Date(chartData[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-[10px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              {new Date(chartData[chartData.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Top Pages + Top Countries */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top Pages */}
        <div className="rounded-xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>Top 25 Pages</h2>
            <span className="text-[10px] ml-auto" style={{ color: dark ? '#64748b' : '#94a3b8' }}>by pageviews</span>
          </div>
          <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
            {data.topPages.length > 0 ? data.topPages.map((p, i) => {
              const pct = (p.views / maxBarViews) * 100
              return (
                <div key={p.slug} className="px-5 py-3" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`text-xs font-bold w-6 shrink-0 ${i < 3 ? 'text-emerald-400' : ''}`} style={i >= 3 ? { color: dark ? '#64748b' : '#94a3b8' } : undefined}>#{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate" style={{ color: dark ? '#fff' : '#0f172a' }}>{p.title}</p>
                        <p className="text-xs truncate" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{p.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3 shrink-0">
                      <Eye className="w-3.5 h-3.5" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
                      <span className="text-sm font-semibold text-emerald-400">{p.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="ml-9 h-1 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(71,85,105,0.3)' : '#e2e8f0' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(to right, #10b981, #34d399)' }} />
                  </div>
                </div>
              )
            }) : <p className="px-5 py-8 text-sm text-center" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No page data</p>}
          </div>
        </div>

        {/* Top Countries */}
        <div className="rounded-xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>Top 25 Countries</h2>
            <span className="text-[10px] ml-auto" style={{ color: dark ? '#64748b' : '#94a3b8' }}>by active users</span>
          </div>
          <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
            {data.topCountries.length > 0 ? data.topCountries.map((c, i) => {
              const pct = (c.users / maxBarUsers) * 100
              return (
                <div key={c.country} className="px-5 py-3" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-6 ${i < 3 ? 'text-blue-400' : ''}`} style={i >= 3 ? { color: dark ? '#64748b' : '#94a3b8' } : undefined}>#{i + 1}</span>
                      <span className="text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>{c.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-400">{c.users.toLocaleString()}</span>
                  </div>
                  <div className="ml-9 h-1.5 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(71,85,105,0.3)' : '#e2e8f0' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(to right, #3b82f6, #60a5fa)' }} />
                  </div>
                </div>
              )
            }) : <p className="px-5 py-8 text-sm text-center" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No country data</p>}
          </div>
        </div>
      </div>

      {/* Search Console: Keywords + Search Pages */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top Keywords */}
        <div className="rounded-xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <Search className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>Top 25 Search Keywords</h2>
            <span className="text-[10px] ml-auto" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Google Search Console</span>
          </div>
          <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
          {data.topKeywords.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10" style={{ background: cardBg }}>
                <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
                  <th className="text-left px-5 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>#</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Keyword</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Clicks</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Impr.</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>CTR</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Pos.</th>
                </tr>
              </thead>
              <tbody>
                {data.topKeywords.map((kw, i) => (
                  <tr key={kw.keyword} style={{ borderBottom: `1px solid ${dividerColor}` }}>
                    <td className="px-5 py-2.5"><span className={`text-xs font-bold ${i < 3 ? 'text-amber-400' : ''}`} style={i >= 3 ? { color: dark ? '#64748b' : '#94a3b8' } : undefined}>#{i + 1}</span></td>
                    <td className="px-2 py-2.5 text-xs truncate max-w-[180px]" style={{ color: dark ? '#fff' : '#0f172a' }}>{kw.keyword}</td>
                    <td className="px-2 py-2.5 text-right text-emerald-400 font-semibold text-xs">{kw.clicks.toLocaleString()}</td>
                    <td className="px-2 py-2.5 text-right text-xs" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{kw.impressions.toLocaleString()}</td>
                    <td className="px-2 py-2.5 text-right text-blue-400 text-xs">{kw.ctr}%</td>
                    <td className="px-5 py-2.5 text-right text-xs" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{kw.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-8 text-sm text-center" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No keyword data available</p>
          )}
          </div>
        </div>

        {/* Top Search Pages */}
        <div className="rounded-xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <MousePointerClick className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>Top 25 Search Pages</h2>
            <span className="text-[10px] ml-auto" style={{ color: dark ? '#64748b' : '#94a3b8' }}>by clicks</span>
          </div>
          <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
          {data.topSearchPages.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10" style={{ background: cardBg }}>
                <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
                  <th className="text-left px-5 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>#</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Page</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Clicks</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Impr.</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-medium uppercase" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Pos.</th>
                </tr>
              </thead>
              <tbody>
                {data.topSearchPages.map((pg, i) => (
                  <tr key={pg.page} style={{ borderBottom: `1px solid ${dividerColor}` }}>
                    <td className="px-5 py-2.5"><span className={`text-xs font-bold ${i < 3 ? 'text-purple-400' : ''}`} style={i >= 3 ? { color: dark ? '#64748b' : '#94a3b8' } : undefined}>#{i + 1}</span></td>
                    <td className="px-2 py-2.5 text-xs truncate max-w-[200px]" style={{ color: dark ? '#fff' : '#0f172a' }}>{pg.page}</td>
                    <td className="px-2 py-2.5 text-right text-emerald-400 font-semibold text-xs">{pg.clicks.toLocaleString()}</td>
                    <td className="px-2 py-2.5 text-right text-xs" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{pg.impressions.toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-right text-xs" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{pg.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-8 text-sm text-center" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No search page data available</p>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, dark }: {
  icon: any; label: string; value: number; color: string; dark: boolean
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/15 text-blue-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    purple: 'bg-purple-500/15 text-purple-400',
    slate: dark ? 'bg-slate-500/15 text-slate-400' : 'bg-slate-100 text-slate-500',
    amber: 'bg-amber-500/15 text-amber-400',
  }
  return (
    <div className="p-5 rounded-xl border" style={{ background: dark ? '#1e293b' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{label}</span>
        <div className={`p-1.5 rounded-lg ${colorMap[color] ?? colorMap.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>{value.toLocaleString()}</p>
    </div>
  )
}
