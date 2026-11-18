'use client'
/**
 * /admin — top-level admin Dashboard.
 *
 * Shows site-wide analytics in three tabs (Google Analytics, Search Console,
 * Bing Webmaster) so the
 * very first thing the owner sees on opening /admin is "how is the site
 * doing today?". Subscription health (revenue, plans, recent customers)
 * lives at /admin/subscription. The data contract
 * (`/api/admin/analytics`) is unchanged; this page is the same component
 * that previously rendered at /admin/analytics — moved here verbatim
 * with the heading copy adjusted so /admin/analytics now redirects.
 */
import { useState } from 'react'
import {
  Users, TrendingUp, Globe, Search, FileText,
  Calendar, BarChart3, Eye, Clock,
  MousePointerClick, Layers, Activity, CheckCircle2, XCircle,
  ChevronDown,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAdminData } from '@/hooks/useAdminData'
import ClearCacheButton from '@/components/admin/ClearCacheButton'
import BingPanel from '@/components/admin/BingPanel'
import GlossyStat from '@/components/admin/GlossyStat'

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
  channels?: { name: string; sessions: number }[]
  sources?: { source: string; medium: string; sessions: number }[]
  searchEngines?: { name: string; sessions: number }[]
  devices?: { name: string; users: number }[]
  dailySignups: { date: string; count: number }[]
  dailyClicks: { date: string; clicks: number; impressions: number; position?: number }[]
  topKeywords: { keyword: string; clicks: number; impressions: number; ctr: number; position: number }[]
  topSearchPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[]
  gaConnected: boolean
  gscConnected: boolean
  gaError?: string | null
  gscError?: string | null
  gscProperty?: string | null
}

type Tab = 'ga' | 'gsc' | 'bing'

const TABS: { value: Tab; label: string; icon: any }[] = [
  { value: 'ga', label: 'Google Analytics', icon: BarChart3 },
  { value: 'gsc', label: 'Google Search Console', icon: Search },
  { value: 'bing', label: 'Bing Webmaster', icon: Globe },
]

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

export default function AdminDashboard() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [period, setPeriod] = useState<Period>('30d')
  const [tab, setTab] = useState<Tab>('ga')
  const [gaChartType, setChartType] = useState<ChartType>('users')
  const chartType: ChartType = tab === 'gsc' ? 'clicks' : gaChartType
  const [showPeriod, setShowPeriod] = useState(false)
  const [showChart, setShowChart] = useState(false)

  // Cached fetch — flipping between period values that have already been
  // viewed in this session is instant; first-time periods background-fetch
  // while a skeleton renders below.
  const {
    data,
    isInitialLoading,
    error,
  } = useAdminData<AnalyticsData>(`/api/admin/analytics?period=${period}`)

  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const dividerColor = dark ? '#334155' : '#f1f5f9'

  if (isInitialLoading) {
    return <DashboardSkeleton dark={dark} />
  }

  if (!data || error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: dark ? '#fff' : '#0f172a' }}>Dashboard</h1>
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

  // Search Console totals for the selected period
  const gscClicks = clicksChart.reduce((n, d) => n + d.clicks, 0)
  const gscImpressions = clicksChart.reduce((n, d) => n + d.impressions, 0)
  const gscCtr = gscImpressions ? Number(((gscClicks / gscImpressions) * 100).toFixed(1)) : 0
  const gscPosition = gscImpressions
    ? Number((clicksChart.reduce((n, d) => n + (d.position || 0) * d.impressions, 0) / gscImpressions).toFixed(1))
    : 0

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Real-time data from Google Analytics, Search Console & Bing</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Clear Cache button — sits BEFORE the period filter so the
              "purge cache" affordance is visible from both Dashboard and
              Subscriptions, not buried behind a click. */}
          <ClearCacheButton dark={dark} />

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

      {/* Source tabs */}
      <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-2xl border p-1 mb-6" style={{ background: cardBg, borderColor: cardBorder }}>
        {TABS.map(t => {
          const on = t.value === tab
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.value)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={{ background: on ? '#10b981' : 'transparent', color: on ? '#fff' : dark ? '#94a3b8' : '#475569' }}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'ga' && data.gaError && <SourceError title="Google Analytics could not be read" message={data.gaError} dark={dark} />}
      {tab === 'gsc' && data.gscError && <SourceError title="Search Console could not be read" message={data.gscError} dark={dark} />}

      {tab === 'bing' && <BingPanel period={period} periodLabel={PERIOD_LABELS[period]} dark={dark} />}

      {/* Overview Stats */}
      {tab === 'ga' && <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <GlossyStat icon={Users} label={`Users · ${PERIOD_LABELS[period]}`} value={data.users30d} hint="active users" tone="ga" dark={dark} />
        <GlossyStat icon={Calendar} label="Users · 7 days" value={data.users7d} hint="last 7 days" tone="ga" dark={dark} />
        <GlossyStat icon={Clock} label="Today" value={data.usersToday} hint="so far today" tone="ga" dark={dark} />
        <GlossyStat icon={TrendingUp} label="New users" value={data.newUsers30d} hint={PERIOD_LABELS[period].toLowerCase()} tone="ga" dark={dark} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <GlossyStat icon={Activity} label="Sessions" value={data.sessions30d} hint={PERIOD_LABELS[period].toLowerCase()} tone="ga" dark={dark} />
        <GlossyStat icon={Eye} label="Page views" value={data.pageViews30d} hint={PERIOD_LABELS[period].toLowerCase()} tone="ga" dark={dark} />
        <GlossyStat icon={Layers} label="Total active users" value={data.totalUsers} hint="all sessions counted" tone="ga" dark={dark} />
      </div>
      </>}

      {tab === 'gsc' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlossyStat icon={MousePointerClick} label="Clicks" value={gscClicks} hint="from Google Search" tone="gsc" dark={dark} />
          <GlossyStat icon={Eye} label="Impressions" value={gscImpressions} hint="times shown in results" tone="gsc" dark={dark} />
          <GlossyStat icon={Activity} label="CTR" value={`${gscCtr}%`} hint="clicks ÷ impressions" tone="gsc" dark={dark} />
          <GlossyStat icon={TrendingUp} label="Avg. position" value={gscPosition} hint="lower is better" tone="gsc" dark={dark} />
        </div>
      )}

      {/* Daily Chart */}
      {tab !== 'bing' && <div className="rounded-xl border p-5 mb-6" style={{ background: cardBg, borderColor: cardBorder }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>
              {CHART_LABELS[chartType]} — {PERIOD_LABELS[period]}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Chart Type Toggle */}
            {tab === 'ga' && <div className="relative">
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
            </div>}
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
      </div>}

      {/* Top Pages + Top Countries */}
      {tab === 'ga' && <div className="grid lg:grid-cols-2 gap-6 mb-6">
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
      </div>}

      {/* Acquisition: how visitors arrive, search engines, devices, sources */}
      {tab === 'ga' && <>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <BreakdownCard
            title="How visitors arrive" subtitle="share of visits" unit="visits" dark={dark}
            rows={(data.channels || []).map(c => ({ label: c.name, value: c.sessions }))}
            footnote={<><b>Direct</b> — typed the address or used a saved link. <b>Organic Search</b> — came from a search engine. <b>Organic Social</b> — Facebook, YouTube and the like. <b>Referral</b> — a link on another website. <b>AI Assistant</b> — ChatGPT, Perplexity, Gemini and similar.</>}
          />
          <BreakdownCard
            title="Which search engine" subtitle="share of search visits" unit="visits" dark={dark}
            rows={(data.searchEngines || []).map(e => ({ label: e.name.charAt(0).toUpperCase() + e.name.slice(1), value: e.sessions }))}
            empty="No organic search visits in this period"
          />
          <BreakdownCard
            title="Which device" subtitle="share of visitors" unit="visitors" dark={dark}
            rows={(data.devices || []).map(d => ({ label: d.name.charAt(0).toUpperCase() + d.name.slice(1), value: d.users }))}
          />
        </div>

        <div className="rounded-2xl border overflow-hidden mb-6" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>Top 25 sources</h2>
            <span className="text-[10px] ml-auto" style={{ color: dark ? '#64748b' : '#94a3b8' }}>where exactly each visit came from</span>
          </div>
          <div className="p-3">
            {(() => {
              const rows = data.sources || []
              const total = rows.reduce((n, r) => n + r.sessions, 0) || 1
              const max = rows[0]?.sessions || 1
              if (!rows.length) return <p className="px-2 py-6 text-sm text-center" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No source data</p>
              return rows.map((r, i) => {
                const isDirect = r.source === '(direct)'
                const label = isDirect ? 'Direct — typed address or saved link' : r.source
                const sub = isDirect ? 'no referrer' : r.medium
                return (
                  <div key={`${r.source}|${r.medium}`} className="relative flex items-center justify-between px-3 py-2 my-1 rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: `${Math.max(2, (r.sessions / max) * 100)}%`, background: dark ? 'rgba(16,185,129,0.14)' : 'rgba(16,185,129,0.10)' }} />
                    <div className="relative flex items-center gap-3 min-w-0">
                      <span className="text-[11px] font-bold w-7 shrink-0" style={{ color: i < 3 ? '#10b981' : dark ? '#64748b' : '#94a3b8' }}>#{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: dark ? '#fff' : '#0f172a' }}>{label}</p>
                        <p className="text-[11px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{sub} · {((r.sessions / total) * 100).toFixed(1)}% of visits</p>
                      </div>
                    </div>
                    <span className="relative text-sm font-bold ml-3 shrink-0" style={{ color: dark ? '#fff' : '#0f172a' }}>{r.sessions.toLocaleString()}</span>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </>}

      {/* Search Console: Keywords + Search Pages */}
      {tab === 'gsc' && <div className="grid lg:grid-cols-2 gap-6 mb-6">
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
      </div>}
    </div>
  )
}

function SourceError({ title, message, dark }: { title: string; message: string; dark: boolean }) {
  return (
    <div className="rounded-xl border p-4 mb-6 text-sm" style={{ background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', borderColor: dark ? 'rgba(239,68,68,0.3)' : '#fecaca', color: dark ? '#fca5a5' : '#b91c1c' }}>
      <p className="font-semibold mb-1">{title}</p>
      <p className="break-words">{message}</p>
    </div>
  )
}

/** Share-of-total bars: "Organic Social 77% · 1,276 visits". */
function BreakdownCard({ title, subtitle, unit, rows, footnote, empty, dark }: {
  title: string; subtitle: string; unit: string
  rows: { label: string; value: number }[]
  footnote?: React.ReactNode; empty?: string; dark: boolean
}) {
  const total = rows.reduce((n, r) => n + r.value, 0)
  return (
    <div className="rounded-2xl border p-5" style={{ background: dark ? '#1e293b' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>{title}</h2>
        <span className="text-[10px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{subtitle}</span>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-sm text-center" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{empty || 'No data for this period'}</p>
      ) : rows.map(r => {
        const pct = total ? (r.value / total) * 100 : 0
        return (
          <div key={r.label} className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm" style={{ color: dark ? '#e2e8f0' : '#0f172a' }}>{r.label}</span>
              <span className="text-xs" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
                <b style={{ color: dark ? '#fff' : '#0f172a' }}>{pct < 10 ? pct.toFixed(1) : Math.round(pct)}%</b> · {r.value.toLocaleString()} {unit}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(71,85,105,0.3)' : '#e2e8f0' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 0.8)}%`, background: 'linear-gradient(to right, #047857, #10b981)' }} />
            </div>
          </div>
        )
      })}
      {footnote && <p className="text-[11px] leading-relaxed mt-4" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{footnote}</p>}
    </div>
  )
}

// ── Dashboard first-visit skeleton ──
function DashboardSkeleton({ dark }: { dark: boolean }) {
  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const pulse = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded animate-pulse" style={{ background: pulse }} />
          <div className="h-3 w-64 rounded animate-pulse" style={{ background: pulse }} />
        </div>
        <div className="h-9 w-40 rounded-xl animate-pulse" style={{ background: pulse }} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border" style={{ background: cardBg, borderColor: cardBorder }}>
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 rounded animate-pulse" style={{ background: pulse }} />
              <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: pulse }} />
            </div>
            <div className="h-7 w-16 rounded animate-pulse" style={{ background: pulse }} />
          </div>
        ))}
      </div>
      <div className="rounded-xl border mb-6" style={{ background: cardBg, borderColor: cardBorder, height: 280 }}>
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
          <div className="h-4 w-44 rounded animate-pulse" style={{ background: pulse }} />
        </div>
        <div className="p-5">
          <div className="h-48 w-full rounded animate-pulse" style={{ background: pulse }} />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border" style={{ background: cardBg, borderColor: cardBorder, height: 360 }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
              <div className="h-4 w-32 rounded animate-pulse" style={{ background: pulse }} />
            </div>
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, j) => (
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
