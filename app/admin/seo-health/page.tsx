'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import {
  ShieldCheck, RefreshCw, AlertTriangle, AlertCircle, Info,
  CheckCircle2, ChevronDown, ChevronRight, Search, Globe,
  FileText, Share2, Type, Image as ImageIcon, Zap, Code2,
  ArrowUpRight, XCircle, ExternalLink, Twitter, Play, Square, Link2,
} from 'lucide-react'

/* ─────────────── Types ─────────────── */
interface Issue {
  check: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  fix: string
  category: string
  count?: number
}

interface PageResult {
  url: string
  path: string
  status: number
  loadTime: number
  htmlSize: number
  title: string
  issues: Issue[]
  score: number
}

interface GlobalCheck {
  check: string
  severity: 'critical' | 'warning' | 'info'
  passed: boolean
  message: string
  fix: string
}

/* ─────────────── Severity helpers ─────────────── */
const severityIcon = (s: string, size = 14) => {
  switch (s) {
    case 'critical': return <XCircle size={size} style={{ color: '#ef4444' }} />
    case 'warning': return <AlertTriangle size={size} style={{ color: '#f59e0b' }} />
    case 'info': return <Info size={size} style={{ color: '#3b82f6' }} />
    default: return <CheckCircle2 size={size} style={{ color: '#10b981' }} />
  }
}

const severityBg = (s: string) => {
  switch (s) {
    case 'critical': return { background: '#ef444415', color: '#ef4444' }
    case 'warning': return { background: '#f59e0b15', color: '#f59e0b' }
    case 'info': return { background: '#3b82f615', color: '#3b82f6' }
    default: return { background: '#10b98115', color: '#10b981' }
  }
}

const scoreColor = (score: number) => {
  if (score >= 90) return '#10b981'
  if (score >= 70) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}

const WEIGHT: Record<string, number> = { critical: 3, warning: 2, info: 1 }

const categoryIcon = (cat: string) => {
  switch (cat) {
    case 'Meta Tags': return <FileText size={18} />
    case 'Open Graph': return <Share2 size={18} />
    case 'Twitter Cards': return <Twitter size={18} />
    case 'Headings': return <Type size={18} />
    case 'Images': return <ImageIcon size={18} />
    case 'Structured Data': return <Code2 size={18} />
    case 'Technical': return <ShieldCheck size={18} />
    case 'Performance': return <Zap size={18} />
    case 'Internal Links': return <Link2 size={18} />
    default: return <Globe size={18} />
  }
}

/* ─────────────── Client-side aggregation ─────────────── */
function aggregate(pages: PageResult[], globalChecks: GlobalCheck[]) {
  const totalIssues = pages.reduce((s, p) => s + p.issues.length, 0)
  const criticalCount = pages.reduce((s, p) => s + p.issues.filter(i => i.severity === 'critical').length, 0)
  const warningCount = pages.reduce((s, p) => s + p.issues.filter(i => i.severity === 'warning').length, 0)
  const infoCount = pages.reduce((s, p) => s + p.issues.filter(i => i.severity === 'info').length, 0)
  const passedPages = pages.filter(p => p.status === 200 && p.issues.filter(i => i.severity === 'critical').length === 0).length

  // Score
  const checksPerPage = 35
  let maxPts = 0, earnedPts = 0
  for (const page of pages) {
    if (page.status >= 400) continue
    const lost = page.issues.reduce((s, i) => s + (WEIGHT[i.severity] || 0), 0)
    maxPts += checksPerPage
    earnedPts += Math.max(0, checksPerPage - lost)
  }
  for (const gc of globalChecks) {
    const w = WEIGHT[gc.severity] || 1
    maxPts += w
    if (gc.passed) earnedPts += w
  }
  const score = maxPts > 0 ? Math.round((earnedPts / maxPts) * 100) : 100

  // Categories
  const categories: Record<string, { total: number; passed: number }> = {}
  const catChecks: Record<string, number> = {
    'Meta Tags': 6, 'Open Graph': 5, 'Twitter Cards': 4,
    'Headings': 5, 'Images': 2, 'Structured Data': 2,
    'Technical': 5, 'Performance': 2, 'Internal Links': 1,
  }
  for (const page of pages) {
    if (page.status >= 400) continue
    for (const cat of Object.keys(catChecks)) {
      if (!categories[cat]) categories[cat] = { total: 0, passed: 0 }
      categories[cat].total += catChecks[cat]
      categories[cat].passed += catChecks[cat] - page.issues.filter(i => i.category === cat).length
    }
  }

  // Top issues
  const freq: Record<string, { count: number; issue: Issue }> = {}
  for (const page of pages) {
    for (const issue of page.issues) {
      if (!freq[issue.check]) freq[issue.check] = { count: 0, issue }
      freq[issue.check].count++
    }
  }
  const topIssues = Object.values(freq)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .map(({ count, issue }) => ({ ...issue, count }))

  return { score, totalIssues, criticalCount, warningCount, infoCount, passedPages, categories, topIssues }
}

/* ─────────────── Score Ring SVG ─────────────── */
function ScoreRing({ score, size = 160, stroke = 10 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.08} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

const BATCH_SIZE = 50
const STORAGE_KEY = 'seo-health-scan'

/* ─────────────── LocalStorage helpers ─────────────── */
interface StoredScan {
  allPages: PageResult[]
  globalChecks: GlobalCheck[]
  totalUrls: number
  scannedCount: number
  scannedAt: string
}

function saveScan(data: StoredScan) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function loadScan(): StoredScan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredScan
  } catch { return null }
}

/* ─────────────── Main Component ─────────────── */
export default function SeoHealthPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  // Accumulated state
  const [allPages, setAllPages] = useState<PageResult[]>([])
  const [globalChecks, setGlobalChecks] = useState<GlobalCheck[]>([])
  const [totalUrls, setTotalUrls] = useState(0)
  const [scannedCount, setScannedCount] = useState(0)
  const [scannedAt, setScannedAt] = useState('')

  // UI state
  const [scanning, setScanning] = useState(false)
  const [autoScanning, setAutoScanning] = useState(false)
  const stopRef = useRef(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'global'>('overview')
  const [expandedPage, setExpandedPage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  // Load saved scan on mount
  useEffect(() => {
    const saved = loadScan()
    if (saved && saved.allPages.length > 0) {
      setAllPages(saved.allPages)
      setGlobalChecks(saved.globalChecks)
      setTotalUrls(saved.totalUrls)
      setScannedCount(saved.scannedCount)
      setScannedAt(saved.scannedAt)
    }
  }, [])

  const hasResults = allPages.length > 0
  const hasMore = scannedCount < totalUrls
  const remaining = totalUrls - scannedCount

  /* ── Card style ── */
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
    borderRadius: 16,
    ...extra,
  })

  const textPrimary = dark ? '#fff' : '#0f172a'
  const textMuted = dark ? '#94a3b8' : '#64748b'
  const textFaint = dark ? '#475569' : '#cbd5e1'
  const borderColor = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'

  /* ── Scan one batch ── */
  const scanBatch = useCallback(async (offset: number, isFirst: boolean) => {
    const res = await fetch('/api/admin/seo-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offset, limit: BATCH_SIZE }),
    })
    if (!res.ok) throw new Error('Scan failed')
    const data = await res.json()

    let newPages: PageResult[]
    let newGlobal: GlobalCheck[]
    let newCount: number

    if (isFirst) {
      newPages = data.pages
      newGlobal = data.globalChecks || []
      newCount = data.pages.length
      setAllPages(newPages)
      setTotalUrls(data.totalUrls)
      setScannedCount(newCount)
      setGlobalChecks(newGlobal)
    } else {
      newPages = [...allPages, ...data.pages]
      newGlobal = globalChecks
      newCount = scannedCount + data.pages.length
      setAllPages(newPages)
      setScannedCount(newCount)
    }
    setScannedAt(data.scannedAt)

    // Persist to localStorage
    saveScan({
      allPages: newPages,
      globalChecks: newGlobal,
      totalUrls: data.totalUrls,
      scannedCount: newCount,
      scannedAt: data.scannedAt,
    })

    return { hasMore: data.hasMore, nextOffset: offset + BATCH_SIZE }
  }, [allPages, globalChecks, scannedCount])

  /* ── Run first batch (fresh scan) ── */
  const runScan = async () => {
    setScanning(true)
    setError('')
    setAllPages([])
    setGlobalChecks([])
    setTotalUrls(0)
    setScannedCount(0)
    stopRef.current = false
    try {
      await scanBatch(0, true)
      setActiveTab('overview')
    } catch {
      setError('Failed to run scan. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  /* ── Scan next batch ── */
  const scanNext = async () => {
    setScanning(true)
    setError('')
    try {
      await scanBatch(scannedCount, false)
    } catch {
      setError('Batch failed. Click "Scan Next" to retry.')
    } finally {
      setScanning(false)
    }
  }

  /* ── Scan all remaining (auto) ── */
  const scanAll = async () => {
    setAutoScanning(true)
    setScanning(true)
    setError('')
    stopRef.current = false

    try {
      let offset = scannedCount
      let more = true
      while (more && !stopRef.current) {
        const r = await scanBatch(offset, offset === 0)
        more = r.hasMore
        offset = r.nextOffset
      }
    } catch {
      setError('Auto-scan interrupted. Click "Scan Next" to continue.')
    } finally {
      setScanning(false)
      setAutoScanning(false)
    }
  }

  const stopScan = () => { stopRef.current = true }

  /* ── Computed stats ── */
  const stats = hasResults ? aggregate(allPages, globalChecks) : null

  /* ── Filtered pages ── */
  const sortedPages = [...allPages].sort((a, b) => a.score - b.score)
  const filteredPages = sortedPages.filter(p =>
    p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /* ── Progress percentage ── */
  const progressPct = totalUrls > 0 ? Math.round((scannedCount / totalUrls) * 100) : 0

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: textPrimary }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={18} className="text-white" />
            </div>
            SEO Health
          </h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>
            Comprehensive technical SEO audit for all your pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Re-scan / first scan */}
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <RefreshCw size={16} className={scanning && !autoScanning ? 'animate-spin' : ''} />
            {hasResults ? 'Re-scan' : scanning ? 'Scanning...' : 'Run Scan'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}>
          {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasResults && !scanning && (
        <div style={card({ padding: '80px 40px', textAlign: 'center' })}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={36} style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Ready to Scan</h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: textMuted }}>
            Click &quot;Run Scan&quot; to analyze your pages in batches of {BATCH_SIZE}. Supports up to 2,000+ pages within Vercel free tier limits.
          </p>
          <button
            onClick={runScan}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <ShieldCheck size={16} /> Start SEO Audit
          </button>
        </div>
      )}

      {/* ── Scanning state (first batch, no results yet) ── */}
      {scanning && !hasResults && (
        <div style={card({ padding: '80px 40px', textAlign: 'center' })}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 flex items-center justify-center mx-auto mb-6">
            <RefreshCw size={36} className="animate-spin" style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Scanning Your Site...</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: textMuted }}>
            Fetching pages from your sitemap and running 35+ SEO checks. First batch of {BATCH_SIZE} pages loading...
          </p>
          <div className="mt-6 w-64 h-2 rounded-full mx-auto overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
            <div className="h-full rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, #10b981, #059669)', width: '60%' }} />
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {hasResults && (
        <>
          {/* ── Progress bar + pagination controls ── */}
          <div style={card({ padding: '16px 20px', marginBottom: 16 })}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Progress info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold" style={{ color: textPrimary }}>
                    {scannedCount} / {totalUrls} pages scanned
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                    background: hasMore ? '#f59e0b15' : '#10b98115',
                    color: hasMore ? '#f59e0b' : '#10b981',
                  }}>
                    {hasMore ? `${remaining} remaining` : 'Complete'}
                  </span>
                  {scanning && (
                    <RefreshCw size={14} className="animate-spin" style={{ color: '#10b981' }} />
                  )}
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
                  />
                </div>
              </div>

              {/* Pagination buttons */}
              {hasMore && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {autoScanning ? (
                    <button
                      onClick={stopScan}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}
                    >
                      <Square size={12} /> Stop
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={scanNext}
                        disabled={scanning}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-60 transition-all"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <Play size={12} />
                        Scan Next {Math.min(BATCH_SIZE, remaining)}
                      </button>
                      <button
                        onClick={scanAll}
                        disabled={scanning}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-60 transition-all"
                        style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: textPrimary, border: `1px solid ${borderColor}` }}
                      >
                        <Zap size={12} />
                        Scan All ({remaining})
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Score Hero ── */}
          {stats && (
            <div style={card({ padding: '32px', marginBottom: 24 })}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={stats.score} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: scoreColor(stats.score) }}>{stats.score}</span>
                    <span className="text-xs font-medium" style={{ color: textMuted }}>/ 100</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold mb-1" style={{ color: textPrimary }}>
                    {stats.score >= 90 ? 'Excellent' : stats.score >= 70 ? 'Good' : stats.score >= 50 ? 'Needs Work' : 'Critical Issues'}
                  </h2>
                  <p className="text-sm mb-4" style={{ color: textMuted }}>
                    {scannedCount} pages scanned &middot; {stats.totalIssues} issues found
                    {hasMore && <span className="ml-1" style={{ color: '#f59e0b' }}>({remaining} pages remaining)</span>}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ ...severityBg('critical') }}>
                      {stats.criticalCount} Critical
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ ...severityBg('warning') }}>
                      {stats.warningCount} Warnings
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ ...severityBg('info') }}>
                      {stats.infoCount} Info
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ ...severityBg('passed') }}>
                      {stats.passedPages} Passed
                    </span>
                  </div>
                  {scannedAt && (
                    <p className="text-[11px] mt-3" style={{ color: textFaint }}>
                      Last scanned: {new Date(scannedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Summary Cards ── */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Critical', count: stats.criticalCount, color: '#ef4444', bg: '#ef444412', icon: <XCircle size={18} /> },
                { label: 'Warnings', count: stats.warningCount, color: '#f59e0b', bg: '#f59e0b12', icon: <AlertTriangle size={18} /> },
                { label: 'Info', count: stats.infoCount, color: '#3b82f6', bg: '#3b82f612', icon: <Info size={18} /> },
                { label: 'Pages Passed', count: stats.passedPages, color: '#10b981', bg: '#10b98112', icon: <CheckCircle2 size={18} /> },
              ].map(({ label, count, color, bg, icon }) => (
                <div key={label} style={card({ padding: '20px' })}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg, color }}>
                      {icon}
                    </div>
                    <span className="text-xs font-medium" style={{ color: textMuted }}>{label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color }}>{count}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f1f5f9' }}>
            {(['overview', 'pages', 'global'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all duration-200"
                style={{
                  background: activeTab === tab ? (dark ? 'rgba(255,255,255,0.08)' : '#fff') : 'transparent',
                  color: activeTab === tab ? textPrimary : textMuted,
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {tab === 'overview' ? 'Overview' : tab === 'pages' ? `Pages (${scannedCount})` : `Global Checks (${globalChecks.length})`}
              </button>
            ))}
          </div>

          {/* ══════════ TAB: Overview ══════════ */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-4" style={{ color: textPrimary }}>Category Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(stats.categories).map(([cat, { total, passed }]) => {
                    const pct = total > 0 ? Math.round((passed / total) * 100) : 100
                    return (
                      <div key={cat} style={card({ padding: '20px' })}>
                        <div className="flex items-center gap-2.5 mb-3" style={{ color: scoreColor(pct) }}>
                          {categoryIcon(cat)}
                          <span className="text-[13px] font-semibold" style={{ color: textPrimary }}>{cat}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: scoreColor(pct) }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: scoreColor(pct) }}>{pct}%</span>
                        </div>
                        <p className="text-[11px]" style={{ color: textMuted }}>{passed}/{total} checks passed</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {stats.topIssues.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: textPrimary }}>Top Issues</h3>
                  <div style={card({ overflow: 'hidden' })}>
                    {stats.topIssues.map((issue, idx) => (
                      <div
                        key={issue.check}
                        className="flex items-start gap-3 px-5 py-4"
                        style={{ borderBottom: idx < stats.topIssues.length - 1 ? `1px solid ${borderColor}` : 'none' }}
                      >
                        <div className="mt-0.5">{severityIcon(issue.severity, 16)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[13px] font-semibold" style={{ color: textPrimary }}>{issue.message}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={severityBg(issue.severity)}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: textMuted }}>{issue.fix}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-lg font-bold" style={{ color: textPrimary }}>{issue.count}</span>
                          <p className="text-[10px]" style={{ color: textMuted }}>pages</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════ TAB: Pages ══════════ */}
          {activeTab === 'pages' && (
            <div>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: textFaint }} />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    border: `1px solid ${borderColor}`,
                    color: textPrimary,
                  }}
                />
              </div>

              <div style={card({ overflow: 'hidden' })}>
                <div
                  className="grid items-center px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    gridTemplateColumns: '1fr 70px 70px 70px 70px 70px 60px',
                    color: textMuted,
                    borderBottom: `1px solid ${borderColor}`,
                    background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                  }}
                >
                  <span>Page</span>
                  <span className="text-center">Score</span>
                  <span className="text-center">Size</span>
                  <span className="text-center">Critical</span>
                  <span className="text-center">Warn</span>
                  <span className="text-center">Info</span>
                  <span className="text-center">Status</span>
                </div>

                <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                  {filteredPages.map((page) => {
                    const criticals = page.issues.filter(i => i.severity === 'critical').length
                    const warnings = page.issues.filter(i => i.severity === 'warning').length
                    const infos = page.issues.filter(i => i.severity === 'info').length
                    const expanded = expandedPage === page.path

                    return (
                      <div key={page.path}>
                        <div
                          className="grid items-center px-5 py-3 cursor-pointer transition-colors hover:opacity-80"
                          style={{
                            gridTemplateColumns: '1fr 70px 70px 70px 70px 70px 60px',
                            borderBottom: `1px solid ${borderColor}`,
                            background: expanded ? (dark ? 'rgba(16,185,129,0.03)' : '#f0fdf4') : 'transparent',
                          }}
                          onClick={() => setExpandedPage(expanded ? null : page.path)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {expanded ? <ChevronDown size={14} style={{ color: textMuted }} /> : <ChevronRight size={14} style={{ color: textMuted }} />}
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium truncate" style={{ color: textPrimary }}>{page.path || '/'}</p>
                              {page.title && <p className="text-[11px] truncate" style={{ color: textFaint }}>{page.title}</p>}
                            </div>
                          </div>
                          <div className="text-center">
                            <span
                              className="inline-block text-xs font-bold px-2 py-0.5 rounded-md"
                              style={{ background: `${scoreColor(page.score)}15`, color: scoreColor(page.score) }}
                            >
                              {page.score}
                            </span>
                          </div>
                          <div className="text-center">
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: page.htmlSize > 2097152 ? '#ef4444' : page.htmlSize > 1572864 ? '#f59e0b' : textMuted }}
                            >
                              {page.htmlSize > 0 ? (page.htmlSize > 1048576 ? `${(page.htmlSize / 1048576).toFixed(1)}MB` : `${Math.round(page.htmlSize / 1024)}KB`) : '—'}
                            </span>
                          </div>
                          <span className="text-center text-xs font-semibold" style={{ color: criticals > 0 ? '#ef4444' : textFaint }}>{criticals}</span>
                          <span className="text-center text-xs font-semibold" style={{ color: warnings > 0 ? '#f59e0b' : textFaint }}>{warnings}</span>
                          <span className="text-center text-xs font-semibold" style={{ color: infos > 0 ? '#3b82f6' : textFaint }}>{infos}</span>
                          <div className="flex justify-center">
                            {page.status === 200 && criticals === 0 ? (
                              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                            ) : page.status >= 400 ? (
                              <XCircle size={16} style={{ color: '#ef4444' }} />
                            ) : (
                              <AlertCircle size={16} style={{ color: '#f59e0b' }} />
                            )}
                          </div>
                        </div>

                        {expanded && (
                          <div style={{ background: dark ? 'rgba(255,255,255,0.015)' : '#fafbfc', borderBottom: `1px solid ${borderColor}` }}>
                            <div className="flex flex-wrap gap-4 px-8 py-3 text-[11px]" style={{ color: textMuted, borderBottom: `1px solid ${borderColor}` }}>
                              <span>Status: <strong style={{ color: page.status === 200 ? '#10b981' : '#ef4444' }}>{page.status || 'Error'}</strong></span>
                              <span>Load time: <strong style={{ color: textPrimary }}>{page.loadTime > 0 ? `${(page.loadTime / 1000).toFixed(1)}s` : 'N/A'}</strong></span>
                              <span>HTML size: <strong style={{ color: textPrimary }}>{page.htmlSize > 0 ? `${Math.round(page.htmlSize / 1024)}KB` : 'N/A'}</strong></span>
                              <a href={page.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: '#10b981' }}>
                                Open page <ExternalLink size={10} />
                              </a>
                            </div>

                            {page.issues.length === 0 ? (
                              <div className="px-8 py-6 text-center">
                                <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: '#10b981' }} />
                                <p className="text-sm font-semibold" style={{ color: '#10b981' }}>All checks passed!</p>
                              </div>
                            ) : (
                              page.issues
                                .sort((a, b) => ({ critical: 0, warning: 1, info: 2 }[a.severity] || 2) - ({ critical: 0, warning: 1, info: 2 }[b.severity] || 2))
                                .map((issue, idx) => (
                                  <div
                                    key={issue.check + idx}
                                    className="flex items-start gap-3 px-8 py-3"
                                    style={{ borderBottom: idx < page.issues.length - 1 ? `1px solid ${borderColor}` : 'none' }}
                                  >
                                    <div className="mt-0.5">{severityIcon(issue.severity)}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="text-xs font-semibold" style={{ color: textPrimary }}>{issue.message}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={severityBg(issue.severity)}>
                                          {issue.category}
                                        </span>
                                      </div>
                                      <p className="text-[11px]" style={{ color: textMuted }}>
                                        <ArrowUpRight size={10} className="inline mr-1" style={{ color: '#10b981' }} />
                                        {issue.fix}
                                      </p>
                                    </div>
                                  </div>
                                ))
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {filteredPages.length === 0 && (
                    <div className="px-5 py-12 text-center text-sm" style={{ color: textMuted }}>
                      No pages match your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB: Global Checks ══════════ */}
          {activeTab === 'global' && (
            <div style={card({ overflow: 'hidden' })}>
              {globalChecks.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm" style={{ color: textMuted }}>
                  Global checks run on the first scan batch.
                </div>
              ) : (
                globalChecks.map((gc, idx) => (
                  <div
                    key={gc.check}
                    className="flex items-start gap-4 px-5 py-4"
                    style={{ borderBottom: idx < globalChecks.length - 1 ? `1px solid ${borderColor}` : 'none' }}
                  >
                    <div className="mt-0.5">
                      {gc.passed ? <CheckCircle2 size={18} style={{ color: '#10b981' }} /> : severityIcon(gc.severity, 18)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[13px] font-semibold" style={{ color: textPrimary }}>
                          {gc.check.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={gc.passed ? severityBg('passed') : severityBg(gc.severity)}>
                          {gc.passed ? 'Passed' : gc.severity}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: textMuted }}>{gc.message}</p>
                      {!gc.passed && (
                        <p className="text-[11px] mt-1" style={{ color: textMuted }}>
                          <ArrowUpRight size={10} className="inline mr-1" style={{ color: '#10b981' }} />
                          {gc.fix}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
