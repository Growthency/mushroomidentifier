'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Globe, CheckCircle2, XCircle, AlertTriangle, Search, RefreshCw,
  Loader2, ChevronLeft, ChevronRight, Send, ExternalLink, Clock,
  FileSearch, ArrowUpRight, Sparkles, Shield,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface CacheRow {
  url: string
  status: string
  coverage_state: string | null
  last_crawl_time: string | null
  indexing_state: string | null
  page_fetch_state: string | null
  robots_txt_state: string | null
  checked_at: string | null
  index_requested_at: string | null
}

const PER_PAGE = 100

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function extractPath(url: string): string {
  try {
    return new URL(url).pathname || '/'
  } catch {
    return url
  }
}

// ── SVG Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({ indexed, total, dark }: { indexed: number; total: number; dark: boolean }) {
  const pct = total > 0 ? (indexed / total) * 100 : 0
  const r = 58
  const circ = 2 * Math.PI * r
  const indexedDash = (pct / 100) * circ
  const notIndexedDash = circ - indexedDash

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 140 140">
        {/* Background track */}
        <circle cx="70" cy="70" r={r} fill="none"
          stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          strokeWidth="14" />
        {/* Not indexed arc (red) */}
        <circle cx="70" cy="70" r={r} fill="none"
          stroke={dark ? '#ef4444' : '#f87171'}
          strokeWidth="14"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset="0"
          transform="rotate(-90 70 70)"
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        {/* Indexed arc (green) */}
        <circle cx="70" cy="70" r={r} fill="none"
          stroke="#10b981"
          strokeWidth="14"
          strokeDasharray={`${indexedDash} ${circ}`}
          strokeDashoffset="0"
          transform="rotate(-90 70 70)"
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: '#10b981' }}>
          {pct.toFixed(1)}%
        </span>
        <span className="text-xs font-medium mt-0.5"
          style={{ color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}>
          Indexed
        </span>
      </div>
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, dark }: {
  icon: any; label: string; value: string | number; color: string; dark: boolean
}) {
  const bgMap: Record<string, string> = {
    blue: dark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
    green: dark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
    red: dark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)',
    amber: dark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)',
  }
  const iconColor: Record<string, string> = {
    blue: '#3b82f6', green: '#10b981', red: '#ef4444', amber: '#f59e0b',
  }

  return (
    <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all"
      style={{
        background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
      }}>
      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: bgMap[color] || bgMap.blue }}>
        <Icon className="w-5 h-5" style={{ color: iconColor[color] || iconColor.blue }} />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
          style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>{label}</p>
        <p className="text-2xl font-bold" style={{ color: dark ? '#f1f5f9' : '#0f172a' }}>{value}</p>
      </div>
    </div>
  )
}

// ── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPage, dark }: {
  page: number; totalPages: number; onPage: (p: number) => void; dark: boolean
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase = 'w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all'

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
        className={`${btnBase} disabled:opacity-30`}
        style={{ color: dark ? '#94a3b8' : '#64748b' }}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="w-8 text-center text-xs"
            style={{ color: dark ? '#475569' : '#94a3b8' }}>…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)}
            className={btnBase}
            style={{
              background: p === page ? '#10b981' : 'transparent',
              color: p === page ? '#fff' : dark ? '#94a3b8' : '#64748b',
              fontWeight: p === page ? 700 : 500,
            }}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={{ color: dark ? '#94a3b8' : '#64748b' }}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function IndexingReportPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  // Styles
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : '#fff'
  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'
  const textPrimary = dark ? '#f1f5f9' : '#0f172a'
  const textSecondary = dark ? 'rgba(255,255,255,0.45)' : '#94a3b8'

  // State
  const [results, setResults] = useState<CacheRow[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState({ done: 0, total: 0 })
  const [requestingUrl, setRequestingUrl] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [indexedPage, setIndexedPage] = useState(1)
  const [notIndexedPage, setNotIndexedPage] = useState(1)
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [scanError, setScanError] = useState('')
  const [toast, setToast] = useState('')

  // Fetch cached results
  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/indexing-report')
      const data = await res.json()
      setResults(data.results || [])
      setLastScan(data.lastScan)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchResults() }, [fetchResults])

  // Show toast briefly
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ─── Scan all URLs ─────────────────────────────────────────────────────────
  const runScan = async () => {
    setScanning(true)
    setScanError('')
    setScanProgress({ done: 0, total: 0 })

    try {
      // Step 1: Get all URLs from sitemap
      const urlRes = await fetch('/api/admin/indexing-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-urls' }),
      })
      const { urls, error } = await urlRes.json()
      if (error) throw new Error(error)
      if (!urls?.length) throw new Error('No URLs found in sitemap')

      setScanProgress({ done: 0, total: urls.length })

      // Step 2: Check in batches of 5
      for (let i = 0; i < urls.length; i += 5) {
        const batch = urls.slice(i, i + 5)
        const res = await fetch('/api/admin/indexing-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check-batch', urls: batch }),
        })
        const data = await res.json()

        if (data.error) {
          setScanError(data.error + (data.details ? `: ${data.details}` : ''))
          break
        }

        setScanProgress(prev => ({ ...prev, done: Math.min(prev.total, i + batch.length) }))

        // Refresh cached results after each batch
        await fetchResults()
      }

      setScanProgress(prev => ({ ...prev, done: prev.total }))
    } catch (err: any) {
      setScanError(err.message || 'Scan failed')
    }

    setScanning(false)
  }

  // ─── Request indexing ──────────────────────────────────────────────────────
  const requestIndex = async (url: string) => {
    setRequestingUrl(url)
    try {
      const res = await fetch('/api/admin/indexing-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-index', url }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`✓ Indexing requested: ${extractPath(url)}`)
        await fetchResults()
      } else {
        showToast(`✗ Failed: ${data.error || 'Unknown error'}`)
      }
    } catch {
      showToast('✗ Network error')
    }
    setRequestingUrl(null)
  }

  // ─── Bulk request not-indexed URLs (batched to avoid timeout) ────────────
  const bulkRequestNotIndexed = async () => {
    const notIndexedUrls = results
      .filter(r => r.status !== 'indexed')
      .map(r => r.url)

    if (!notIndexedUrls.length) return

    setRequestingUrl('__bulk__')
    setScanProgress({ done: 0, total: notIndexedUrls.length })
    let totalSuccess = 0
    let totalFailed = 0

    // Send in batches of 10 to stay within Vercel timeout
    for (let i = 0; i < notIndexedUrls.length; i += 10) {
      const batch = notIndexedUrls.slice(i, i + 10)
      try {
        const res = await fetch('/api/admin/indexing-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'bulk-request', urls: batch }),
        })
        const data = await res.json()
        totalSuccess += data.success || 0
        totalFailed += data.failed || 0
      } catch {
        totalFailed += batch.length
      }
      setScanProgress({ done: Math.min(i + 10, notIndexedUrls.length), total: notIndexedUrls.length })
    }

    showToast(`✓ Bulk complete: ${totalSuccess} sent, ${totalFailed} failed`)
    setScanProgress({ done: 0, total: 0 })
    await fetchResults()
    setRequestingUrl(null)
  }

  // ─── Filtered & paginated data ─────────────────────────────────────────────
  const indexed = useMemo(() =>
    results.filter(r => r.status === 'indexed' &&
      (searchQuery ? extractPath(r.url).toLowerCase().includes(searchQuery.toLowerCase()) : true)),
    [results, searchQuery])

  const notIndexed = useMemo(() =>
    results.filter(r => r.status !== 'indexed' &&
      (searchQuery ? extractPath(r.url).toLowerCase().includes(searchQuery.toLowerCase()) : true)),
    [results, searchQuery])

  const indexedTotalPages = Math.ceil(indexed.length / PER_PAGE) || 1
  const notIndexedTotalPages = Math.ceil(notIndexed.length / PER_PAGE) || 1

  const indexedSlice = indexed.slice((indexedPage - 1) * PER_PAGE, indexedPage * PER_PAGE)
  const notIndexedSlice = notIndexed.slice((notIndexedPage - 1) * PER_PAGE, notIndexedPage * PER_PAGE)

  const totalUrls = results.length
  const indexRate = totalUrls > 0 ? Math.round((indexed.length / totalUrls) * 1000) / 10 : 0

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#10b981' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-in slide-in-from-right"
          style={{
            background: toast.startsWith('✓') ? (dark ? '#065f46' : '#d1fae5') : (dark ? '#7f1d1d' : '#fee2e2'),
            color: toast.startsWith('✓') ? (dark ? '#a7f3d0' : '#065f46') : (dark ? '#fecaca' : '#991b1b'),
            border: `1px solid ${toast.startsWith('✓') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.12)' }}>
            <Globe className="w-5 h-5" style={{ color: '#10b981' }} />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: textPrimary }}>
              Indexing Report
            </h1>
            <p className="text-xs" style={{ color: textSecondary }}>
              Monitor &amp; manage your Google search index
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastScan && (
            <span className="text-xs flex items-center gap-1.5" style={{ color: textSecondary }}>
              <Clock className="w-3.5 h-3.5" />
              Last scan: {timeAgo(lastScan)}
            </span>
          )}
          <button onClick={runScan} disabled={scanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {scanning ? 'Scanning…' : 'Run Scan'}
          </button>
        </div>
      </div>

      {/* ── Scan Progress Bar ── */}
      {scanning && scanProgress.total > 0 && (
        <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: textPrimary }}>
              Checking URLs… {scanProgress.done} / {scanProgress.total}
            </span>
            <span className="text-xs font-bold" style={{ color: '#10b981' }}>
              {Math.round((scanProgress.done / scanProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(scanProgress.done / scanProgress.total) * 100}%`,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
              }} />
          </div>
        </div>
      )}

      {/* ── Scan Error ── */}
      {scanError && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: dark ? 'rgba(239,68,68,0.08)' : '#fef2f2', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Scan Error</p>
            <p className="text-xs mt-1" style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>{scanError}</p>
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {results.length === 0 && !scanning && (
        <div className="text-center py-16 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <FileSearch className="w-16 h-16 mx-auto mb-4" style={{ color: textSecondary, opacity: 0.4 }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: textPrimary }}>No Scan Data Yet</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: textSecondary }}>
            Run your first scan to check which pages from your sitemap are indexed by Google.
          </p>
          <button onClick={runScan}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Sparkles className="w-4 h-4" /> Run Your First Scan
          </button>
        </div>
      )}

      {/* ── Stats + Chart ── */}
      {results.length > 0 && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={FileSearch} label="Total Pages" value={totalUrls} color="blue" dark={dark} />
            <StatCard icon={CheckCircle2} label="Indexed" value={indexed.length} color="green" dark={dark} />
            <StatCard icon={XCircle} label="Not Indexed" value={notIndexed.length} color="red" dark={dark} />
            <StatCard icon={Shield} label="Index Rate" value={`${indexRate}%`} color="amber" dark={dark} />
          </div>

          {/* Chart + Breakdown Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donut Chart Card */}
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <DonutChart indexed={indexed.length} total={totalUrls} dark={dark} />
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
                  <span className="text-xs" style={{ color: textSecondary }}>Indexed ({indexed.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                  <span className="text-xs" style={{ color: textSecondary }}>Not Indexed ({notIndexed.length})</span>
                </div>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: textPrimary }}>Coverage Breakdown</h3>
              {(() => {
                const groups: Record<string, number> = {}
                for (const r of results) {
                  const key = r.coverage_state || 'Unknown'
                  groups[key] = (groups[key] || 0) + 1
                }
                const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1])
                return (
                  <div className="space-y-3">
                    {sorted.map(([state, count]) => {
                      const pct = totalUrls > 0 ? (count / totalUrls) * 100 : 0
                      const isGreen = state.toLowerCase().includes('indexed') && !state.toLowerCase().includes('not')
                      return (
                        <div key={state}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs truncate max-w-[200px]" style={{ color: textPrimary }}>{state}</span>
                            <span className="text-xs font-bold" style={{ color: isGreen ? '#10b981' : '#f59e0b' }}>
                              {count} ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                background: isGreen ? '#10b981' : state.toLowerCase().includes('error') ? '#ef4444' : '#f59e0b',
                              }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {lastScan && (
                <div className="mt-5 pt-4 flex items-center justify-between"
                  style={{ borderTop: `1px solid ${cardBorder}` }}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: textSecondary }}>Last Scan</span>
                  <span className="text-xs font-medium" style={{ color: textPrimary }}>{timeAgo(lastScan)}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Search + Bulk Actions ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: textSecondary }} />
              <input type="text" placeholder="Search pages…" value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setIndexedPage(1); setNotIndexedPage(1) }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc', border: `1px solid ${cardBorder}`, color: textPrimary }} />
            </div>

            {notIndexed.length > 0 && (
              <button onClick={bulkRequestNotIndexed} disabled={requestingUrl === '__bulk__'}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110 disabled:opacity-60"
                style={{ background: dark ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                {requestingUrl === '__bulk__' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Index All Not-Indexed ({notIndexed.length})
              </button>
            )}
          </div>

          {/* ── Two-Column URL Lists ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {/* ── INDEXED Column ── */}
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
              {/* Header */}
              <div className="px-5 py-3.5 flex items-center justify-between"
                style={{ background: dark ? 'rgba(16,185,129,0.08)' : '#ecfdf5', borderBottom: `1px solid ${cardBorder}` }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} />
                  <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                    Indexed Pages
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                    {indexed.length}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div style={{ background: cardBg, maxHeight: '600px', overflowY: 'auto' }}>
                {indexedSlice.length === 0 ? (
                  <div className="p-8 text-center text-xs" style={{ color: textSecondary }}>
                    No indexed pages found
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>#</th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>URL</th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-center" style={{ color: textSecondary }}>Crawled</th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-right" style={{ color: textSecondary }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indexedSlice.map((row, i) => (
                        <tr key={row.url} className="transition-colors"
                          style={{ borderBottom: `1px solid ${cardBorder}` }}
                          onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td className="px-4 py-2.5 text-xs font-mono" style={{ color: textSecondary }}>
                            {(indexedPage - 1) * PER_PAGE + i + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <a href={row.url} target="_blank" rel="noopener"
                              className="text-xs font-medium hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                              style={{ color: textPrimary }}>
                              {extractPath(row.url)}
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-40" />
                            </a>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-[10px]" style={{ color: textSecondary }}>{timeAgo(row.last_crawl_time)}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button onClick={() => requestIndex(row.url)}
                              disabled={requestingUrl === row.url}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110 disabled:opacity-50"
                              style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                              {requestingUrl === row.url ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3 h-3" />}
                              Reindex
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="px-4 py-3" style={{ borderTop: `1px solid ${cardBorder}`, background: cardBg }}>
                <Pagination page={indexedPage} totalPages={indexedTotalPages} onPage={setIndexedPage} dark={dark} />
              </div>
            </div>

            {/* ── NOT INDEXED Column ── */}
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
              {/* Header */}
              <div className="px-5 py-3.5 flex items-center justify-between"
                style={{ background: dark ? 'rgba(239,68,68,0.08)' : '#fef2f2', borderBottom: `1px solid ${cardBorder}` }}>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
                  <span className="text-sm font-bold" style={{ color: '#ef4444' }}>
                    Not Indexed Pages
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    {notIndexed.length}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div style={{ background: cardBg, maxHeight: '600px', overflowY: 'auto' }}>
                {notIndexedSlice.length === 0 ? (
                  <div className="p-8 text-center text-xs" style={{ color: textSecondary }}>
                    {results.length > 0 ? '🎉 All pages are indexed!' : 'No data yet'}
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>#</th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>URL</th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>Reason</th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-right" style={{ color: textSecondary }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notIndexedSlice.map((row, i) => (
                        <tr key={row.url} className="transition-colors"
                          style={{ borderBottom: `1px solid ${cardBorder}` }}
                          onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td className="px-4 py-2.5 text-xs font-mono" style={{ color: textSecondary }}>
                            {(notIndexedPage - 1) * PER_PAGE + i + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <a href={row.url} target="_blank" rel="noopener"
                              className="text-xs font-medium hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                              style={{ color: textPrimary }}>
                              {extractPath(row.url)}
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-40" />
                            </a>
                            {row.index_requested_at && (
                              <p className="text-[10px] mt-0.5" style={{ color: '#f59e0b' }}>
                                Requested {timeAgo(row.index_requested_at)}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-[10px] px-2 py-1 rounded-md inline-block max-w-[150px] truncate"
                              style={{
                                background: row.status === 'error'
                                  ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                color: row.status === 'error' ? '#ef4444' : '#f59e0b',
                              }}>
                              {row.coverage_state || row.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button onClick={() => requestIndex(row.url)}
                              disabled={requestingUrl === row.url}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                              {requestingUrl === row.url ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                              Index Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="px-4 py-3" style={{ borderTop: `1px solid ${cardBorder}`, background: cardBg }}>
                <Pagination page={notIndexedPage} totalPages={notIndexedTotalPages} onPage={setNotIndexedPage} dark={dark} />
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
