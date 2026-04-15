'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Search, Plus, Trash2, Play, Loader2, TrendingUp, TrendingDown,
  Minus, Target, Trophy, AlertCircle, Clock, BarChart3, X, Zap,
  ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Keyword {
  id: number
  keyword: string
  position: number | null
  prev_position: number | null
  change: number | null
  rank_url: string | null
  volume: number | null
  checked_at: string | null
  created_at: string
}

// Format volume: 1200 → "1.2K", 54000 → "54K"
function fmtVol(v: number | null) {
  if (!v) return '—'
  if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(v)
}

interface Quota {
  used: number
  limit: number
  remaining: number
  resetAt?: string
  planName?: string | null
}

// Format "Apr 1" from an ISO date (UTC-safe so it matches SerpAPI's reset moment)
function formatResetDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// Days remaining until an ISO date (rounded up, never negative)
function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── Donut Chart Component ──
function QuotaDonut({ used, limit }: { used: number; limit: number }) {
  const remaining = Math.max(0, limit - used)
  const pct = limit > 0 ? (used / limit) * 100 : 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  // Color based on usage
  const color = pct < 50 ? '#10b981' : pct < 80 ? '#f59e0b' : '#ef4444'
  const bgRing = 'rgba(255,255,255,0.08)'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={bgRing} strokeWidth="10"
        />
        {/* Progress ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{remaining}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-60">remaining</span>
      </div>
    </div>
  )
}

// ── Position Badge ──
function PositionBadge({ position }: { position: number | null }) {
  if (position === null) {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(100,116,139,0.15)' }}>
        <span className="text-xs font-bold" style={{ color: '#64748b' }}>N/A</span>
      </div>
    )
  }

  let bg: string, color: string, glow: string
  if (position <= 3) {
    bg = 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    color = '#000'
    glow = '0 0 20px rgba(251,191,36,0.4)'
  } else if (position <= 10) {
    bg = 'linear-gradient(135deg, #34d399, #10b981)'
    color = '#000'
    glow = '0 0 20px rgba(16,185,129,0.3)'
  } else if (position <= 30) {
    bg = 'linear-gradient(135deg, #60a5fa, #3b82f6)'
    color = '#fff'
    glow = '0 0 15px rgba(59,130,246,0.3)'
  } else if (position <= 50) {
    bg = 'linear-gradient(135deg, #fb923c, #f97316)'
    color = '#fff'
    glow = '0 0 15px rgba(249,115,22,0.3)'
  } else {
    bg = 'linear-gradient(135deg, #f87171, #ef4444)'
    color = '#fff'
    glow = '0 0 15px rgba(239,68,68,0.3)'
  }

  return (
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
      style={{ background: bg, boxShadow: glow }}>
      <span className="text-lg font-black" style={{ color }}>#{position}</span>
    </div>
  )
}

// ── Change Indicator ──
function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="text-xs opacity-40">—</span>
  }
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-emerald-400">
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="text-xs font-bold">+{change}</span>
      </div>
    )
  }
  if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-400">
        <TrendingDown className="w-3.5 h-3.5" />
        <span className="text-xs font-bold">{change}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 opacity-50">
      <Minus className="w-3.5 h-3.5" />
      <span className="text-xs">0</span>
    </div>
  )
}

// ── Time Ago ──
function timeAgo(dateStr: string | null) {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function RankTrackerPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [quota, setQuota] = useState<Quota>({ used: 0, limit: 250, remaining: 250 })
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [checkProgress, setCheckProgress] = useState(0)
  const [checkingSingle, setCheckingSingle] = useState<number | null>(null)
  const [editingVol, setEditingVol] = useState<number | null>(null)
  const [volInput, setVolInput] = useState('')
  const [sortBy, setSortBy] = useState<'volume' | 'position' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rank-tracker')
      const data = await res.json()
      setKeywords(data.keywords || [])
      if (data.quota) setQuota(data.quota)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleSort = (col: 'volume' | 'position') => {
    if (sortBy === col) {
      if (sortDir === 'desc') setSortDir('asc')
      else { setSortBy(null); setSortDir('desc') } // third click resets
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  const sortedKeywords = useMemo(() => {
    if (!sortBy) return keywords
    return [...keywords].sort((a, b) => {
      const aVal = sortBy === 'volume' ? (a.volume ?? 0) : (a.position ?? 999)
      const bVal = sortBy === 'volume' ? (b.volume ?? 0) : (b.position ?? 999)
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal
    })
  }, [keywords, sortBy, sortDir])

  const handleAdd = async () => {
    if (!newKeyword.trim()) return
    setAdding(true)
    setError('')
    try {
      const res = await fetch('/api/admin/rank-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', keyword: newKeyword.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNewKeyword('')
      setShowInput(false)
      fetchData()
    } catch (err: any) {
      setError(err.message)
    }
    setAdding(false)
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch('/api/admin/rank-tracker', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setKeywords(prev => prev.filter(k => k.id !== id))
    } catch {}
  }

  const handleRunCheck = async () => {
    if (keywords.length === 0) return
    setChecking(true)
    setCheckProgress(0)
    setError('')

    // Animate progress
    const progressInterval = setInterval(() => {
      setCheckProgress(prev => {
        const target = 90
        return prev < target ? prev + (target - prev) * 0.05 : prev
      })
    }, 200)

    try {
      const res = await fetch('/api/admin/rank-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCheckProgress(100)
      setTimeout(() => { fetchData(); setChecking(false); setCheckProgress(0) }, 600)
    } catch (err: any) {
      setError(err.message)
      setChecking(false)
      setCheckProgress(0)
    }
    clearInterval(progressInterval)
  }

  const handleRunSingle = async (id: number) => {
    setCheckingSingle(id)
    setError('')
    try {
      const res = await fetch('/api/admin/rank-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_single', id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Update the keyword in state
      if (data.result) {
        setKeywords(prev => prev.map(k => k.id === id ? {
          ...k,
          position: data.result.position,
          prev_position: data.result.prev_position,
          change: data.result.change,
          rank_url: data.result.rank_url,
          checked_at: new Date().toISOString(),
        } : k))
      }
      // Refresh quota
      try {
        const qRes = await fetch('/api/admin/rank-tracker')
        const qData = await qRes.json()
        if (qData.quota) setQuota(qData.quota)
      } catch {}
    } catch (err: any) {
      setError(err.message)
    }
    setCheckingSingle(null)
  }

  const handleVolSave = async (id: number) => {
    const vol = volInput.trim() ? parseInt(volInput.replace(/[^0-9]/g, ''), 10) || null : null
    try {
      await fetch('/api/admin/rank-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_volume', id, volume: vol }),
      })
      setKeywords(prev => prev.map(k => k.id === id ? { ...k, volume: vol } : k))
    } catch {}
    setEditingVol(null)
    setVolInput('')
  }

  // Stats
  const ranked = keywords.filter(k => k.position !== null)
  const top10 = keywords.filter(k => k.position !== null && k.position <= 10).length
  const avgPos = ranked.length > 0
    ? Math.round(ranked.reduce((a, k) => a + (k.position || 0), 0) / ranked.length * 10) / 10
    : 0

  // Theme
  const bg = dark ? '#0f172a' : '#f8fafc'
  const cardBg = dark ? '#1e293b' : '#ffffff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const textPrimary = dark ? '#f1f5f9' : '#0f172a'
  const textSecondary = dark ? '#94a3b8' : '#64748b'
  const inputBg = dark ? '#0f172a' : '#f1f5f9'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Rank Tracker</h1>
              <p className="text-sm mt-0.5" style={{ color: textSecondary }}>
                Track your Google rankings for target keywords (US)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Quota Card */}
        <div className="col-span-2 lg:col-span-1 row-span-2 rounded-2xl border p-6 flex flex-col items-center justify-center"
          style={{ background: cardBg, borderColor: cardBorder }}>
          <QuotaDonut used={quota.used} limit={quota.limit} />
          <p className="text-xs mt-3 font-medium" style={{ color: textSecondary }}>
            {quota.used} / {quota.limit} searches used
          </p>
          <p className="text-[10px] mt-1 opacity-50">This month</p>
          {quota.resetAt && (
            <div
              className="mt-3 px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
              title={`Refills on ${new Date(quota.resetAt).toUTCString()}`}
            >
              <Clock className="w-3 h-3" style={{ color: '#10b981' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>
                Refills {formatResetDate(quota.resetAt)}
                <span className="opacity-70"> · in {daysUntil(quota.resetAt)}d</span>
              </span>
            </div>
          )}
        </div>

        {/* Keywords Tracked */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Keywords
            </span>
            <Target className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-3xl font-bold" style={{ color: textPrimary }}>{keywords.length}</p>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>tracked</p>
        </div>

        {/* Top 10 */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Top 10
            </span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold" style={{ color: textPrimary }}>{top10}</p>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>keywords</p>
        </div>

        {/* Avg Position */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Avg Position
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold" style={{ color: textPrimary }}>
            {avgPos > 0 ? `#${avgPos}` : '—'}
          </p>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>across all</p>
        </div>

        {/* Ranked */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Ranking
            </span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold" style={{ color: textPrimary }}>
            {ranked.length}<span className="text-lg opacity-50">/{keywords.length}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>found in top 100</p>
        </div>

        {/* Last Checked */}
        <div className="rounded-2xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: textSecondary }}>
              Last Check
            </span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-bold" style={{ color: textPrimary }}>
            {keywords[0]?.checked_at ? timeAgo(keywords[0].checked_at) : 'Never'}
          </p>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>
            {keywords.length > 0 ? `uses ${keywords.length}-${keywords.length * 10} searches` : 'add keywords first'}
          </p>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: textPrimary, border: `1px solid ${cardBorder}` }}
            >
              <Plus className="w-4 h-4" /> Add Keyword
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. mushroom identifier"
                autoFocus
                className="px-4 py-2.5 rounded-xl text-sm outline-none w-64"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
              />
              <button
                onClick={handleAdd}
                disabled={adding || !newKeyword.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
              </button>
              <button
                onClick={() => { setShowInput(false); setNewKeyword(''); setError('') }}
                className="p-2.5 rounded-xl transition-colors"
                style={{ color: textSecondary }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleRunCheck}
          disabled={checking || keywords.length === 0}
          className="relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
          style={{
            background: checking
              ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: checking
              ? '0 4px 20px rgba(14,165,233,0.4)'
              : '0 4px 20px rgba(16,185,129,0.4)',
          }}
        >
          {/* Progress bar overlay */}
          {checking && (
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300 ease-out"
              style={{
                width: `${checkProgress}%`,
                background: 'rgba(255,255,255,0.15)',
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking {keywords.length} keywords...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" fill="currentColor" />
                Run Check
              </>
            )}
          </span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Keywords Table ── */}
      {keywords.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ background: cardBg, borderColor: cardBorder }}>
          <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>No keywords yet</h3>
          <p className="text-sm" style={{ color: textSecondary }}>
            Add your target keywords to start tracking their Google rankings.
          </p>
          <button
            onClick={() => setShowInput(true)}
            className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Your First Keyword
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
          {/* Table header */}
          <div className="grid gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider"
            style={{ gridTemplateColumns: '40px 1fr 80px 100px 80px 1fr 80px 44px 40px', color: textSecondary, borderBottom: `1px solid ${cardBorder}`, background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <div>#</div>
            <div>Keyword</div>
            <button onClick={() => toggleSort('volume')} className="text-center flex items-center justify-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" title="Sort by volume">
              Volume
              {sortBy === 'volume' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
            </button>
            <button onClick={() => toggleSort('position')} className="text-center flex items-center justify-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" title="Sort by position">
              <span className="text-base leading-none">🇺🇸</span> Position
              {sortBy === 'position' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
            </button>
            <div className="text-center">Change</div>
            <div>Ranking URL</div>
            <div className="text-center">Checked</div>
            <div></div>
            <div></div>
          </div>

          {/* Rows */}
          {sortedKeywords.map((kw, idx) => (
            <div
              key={kw.id}
              className="grid gap-4 px-6 py-4 items-center transition-colors group"
              style={{
                gridTemplateColumns: '40px 1fr 80px 100px 80px 1fr 80px 44px 40px',
                borderBottom: idx < sortedKeywords.length - 1 ? `1px solid ${cardBorder}` : 'none',
                background: 'transparent',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {/* Index */}
              <div>
                <span className="text-sm font-mono opacity-40">{idx + 1}</span>
              </div>

              {/* Keyword */}
              <div>
                <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                  {kw.keyword}
                </p>
              </div>

              {/* Volume */}
              <div className="flex justify-center">
                {editingVol === kw.id ? (
                  <input
                    type="text"
                    value={volInput}
                    onChange={e => setVolInput(e.target.value)}
                    onBlur={() => handleVolSave(kw.id)}
                    onKeyDown={e => { if (e.key === 'Enter') handleVolSave(kw.id); if (e.key === 'Escape') { setEditingVol(null); setVolInput('') } }}
                    autoFocus
                    placeholder="0"
                    className="w-16 text-center text-xs px-1.5 py-1 rounded-lg outline-none"
                    style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
                  />
                ) : (
                  <button
                    onClick={() => { setEditingVol(kw.id); setVolInput(kw.volume ? String(kw.volume) : '') }}
                    className="text-xs font-medium px-2 py-1 rounded-lg transition-colors hover:bg-emerald-500/10"
                    style={{ color: kw.volume ? textPrimary : textSecondary }}
                    title="Click to edit search volume"
                  >
                    {fmtVol(kw.volume)}
                  </button>
                )}
              </div>

              {/* Position Badge */}
              <div className="flex justify-center">
                <PositionBadge position={kw.position} />
              </div>

              {/* Change */}
              <div className="flex justify-center">
                <ChangeIndicator change={kw.change} />
              </div>

              {/* URL */}
              <div>
                {kw.rank_url ? (
                  <a
                    href={kw.rank_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-500 hover:underline truncate block"
                  >
                    {kw.rank_url.replace('https://mushroomidentifiers.com', '')}
                  </a>
                ) : (
                  <span className="text-xs opacity-30">—</span>
                )}
              </div>

              {/* Checked */}
              <div className="text-center">
                <span className="text-xs" style={{ color: textSecondary }}>
                  {timeAgo(kw.checked_at)}
                </span>
              </div>

              {/* Run Single */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleRunSingle(kw.id)}
                  disabled={checkingSingle === kw.id || checking}
                  className="p-2 rounded-lg transition-all hover:bg-emerald-500/10 text-emerald-400 disabled:opacity-40"
                  title="Check this keyword"
                >
                  {checkingSingle === kw.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                  )}
                </button>
              </div>

              {/* Delete */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(kw.id)}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 text-red-400"
                  title="Remove keyword"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Position Legend ── */}
      {keywords.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
          {[
            { label: 'Top 3', bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
            { label: '4-10', bg: 'linear-gradient(135deg, #34d399, #10b981)' },
            { label: '11-30', bg: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
            { label: '31-50', bg: 'linear-gradient(135deg, #fb923c, #f97316)' },
            { label: '50+', bg: 'linear-gradient(135deg, #f87171, #ef4444)' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: l.bg }} />
              <span className="text-xs" style={{ color: textSecondary }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
