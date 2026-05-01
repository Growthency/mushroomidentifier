'use client'
/**
 * One-click "Empty all caches" button — mirrors W3 Total Cache's behaviour
 * in WordPress so the admin can purge every Next.js cache + tag without
 * a redeploy.
 *
 * Used from /admin (Dashboard) and /admin/subscription. Each mount keeps
 * its own ephemeral state (loading flash, success flash) but the
 * "last cleared" timestamp lives in localStorage so it survives a page
 * navigation and shows the same value on every surface that mounts the
 * button.
 */
import { useEffect, useState } from 'react'
import { Loader2, Zap, Check } from 'lucide-react'

interface Props {
  dark: boolean
}

const LS_KEY = 'mi-admin-last-cache-clear'

export default function ClearCacheButton({ dark }: Props) {
  const [clearing, setClearing] = useState(false)
  const [clearedFlash, setClearedFlash] = useState(false)
  const [lastCleared, setLastCleared] = useState<string | null>(null)

  useEffect(() => {
    setLastCleared(localStorage.getItem(LS_KEY))
  }, [])

  async function clearCache() {
    if (clearing) return
    setClearing(true)
    try {
      const res = await fetch('/api/admin/clear-cache', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Clear failed')
      setClearedFlash(true)
      const ts = new Date().toISOString()
      localStorage.setItem(LS_KEY, ts)
      setLastCleared(ts)
      setTimeout(() => setClearedFlash(false), 3000)
    } catch (err: any) {
      alert('Clear cache failed: ' + (err?.message || err))
    } finally {
      setClearing(false)
    }
  }

  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'

  return (
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
  )
}
