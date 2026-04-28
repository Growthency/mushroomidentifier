'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Plus, Trash2, AlertCircle, Loader2, Power, Globe, Link2, Info } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useModal } from '@/components/admin/AdminModal'

type MatchType = 'domain' | 'url'

interface Rule {
  id: string
  pattern: string
  match_type: MatchType
  note: string | null
  enabled: boolean
  created_at: string
  updated_at: string
}

export default function ExternalLinksPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { showConfirm } = useModal()

  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [pattern, setPattern] = useState('')
  const [note, setNote] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/external-links')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setRules(json.rules ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!pattern.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/external-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern: pattern.trim(), note: note.trim() || undefined }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setPattern('')
      setNote('')
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleEnabled(rule: Rule) {
    try {
      await fetch('/api/admin/external-links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rule.id, enabled: !rule.enabled }),
      })
      await load()
    } catch {
      /* surface via load() */
    }
  }

  async function handleDelete(rule: Rule) {
    const ok = await showConfirm(
      'Delete rule',
      `Stop adding nofollow to links matching "${rule.pattern}"?`,
      'danger',
    )
    if (!ok) return
    await fetch('/api/admin/external-links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rule.id }),
    })
    await load()
  }

  // Live-detect domain vs URL as the admin types so they can see what
  // the rule will do BEFORE submitting.
  const inferredType: MatchType =
    /^https?:\/\//i.test(pattern.trim()) || pattern.includes('/') || pattern.includes('?')
      ? 'url'
      : 'domain'

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>
          External Links
        </h1>
        <p className="text-[13px] mt-1.5 max-w-2xl leading-relaxed" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          Add a domain to make every outbound link to that domain (and its subdomains) <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[12px]">rel=&quot;nofollow&quot;</code>.
          Or add a specific URL to nofollow only that exact link. Useful for affiliate networks (e.g. <strong>amazon.com</strong>) where every product link across all articles should pass no SEO equity.
        </p>
      </div>

      {/* ── Add form ────────────────────────────────────────────── */}
      <form
        onSubmit={handleAdd}
        className="rounded-2xl p-5 mb-6"
        style={{
          background: dark ? 'rgba(255,255,255,0.02)' : '#fff',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px] font-semibold" style={{ color: dark ? '#fff' : '#0f172a' }}>
            Add a rule
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              Domain or URL
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="amazon.com  —or—  https://amazon.com/dp/B0XXXX"
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none transition-all"
              style={{
                background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                color: dark ? '#fff' : '#0f172a',
              }}
            />
            {pattern.trim() && (
              <p className="text-[11px] mt-1.5 flex items-center gap-1.5" style={{ color: dark ? '#64748b' : '#64748b' }}>
                <Info className="w-3 h-3" />
                Detected as a <strong className={inferredType === 'domain' ? 'text-emerald-500' : 'text-blue-500'}>{inferredType}</strong> rule.
                {inferredType === 'domain'
                  ? ' Every link to this hostname (and its subdomains) will become nofollow.'
                  : ' Only this exact URL will become nofollow.'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Amazon affiliate"
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none transition-all"
              style={{
                background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                color: dark ? '#fff' : '#0f172a',
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {error ? (
            <p className="text-[12px] text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          ) : <span />}

          <button
            type="submit"
            disabled={saving || !pattern.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add rule
          </button>
        </div>
      </form>

      {/* ── Existing rules ─────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: dark ? 'rgba(255,255,255,0.02)' : '#fff',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-16 px-6">
            <ExternalLink className="w-8 h-8 mx-auto mb-3 opacity-40" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
            <p className="text-[13px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No nofollow rules yet</p>
            <p className="text-[11px] mt-1" style={{ color: dark ? '#475569' : '#cbd5e1' }}>
              Add a domain or URL above to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Pattern</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Type</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Note</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Status</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}` }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium font-mono text-[12.5px] truncate max-w-[360px]" style={{ color: dark ? '#fff' : '#0f172a' }}>
                      {rule.pattern}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    {rule.match_type === 'domain' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 font-medium">
                        <Globe className="w-3 h-3" /> Domain
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 font-medium">
                        <Link2 className="w-3 h-3" /> URL
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-[11px]" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
                      {rule.note || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleEnabled(rule)}
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg font-semibold transition-colors ${
                        rule.enabled
                          ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20'
                          : (dark
                            ? 'bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.06]'
                            : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-200')
                      }`}
                      title={rule.enabled ? 'Click to disable' : 'Click to enable'}
                    >
                      <Power className="w-3 h-3" />
                      {rule.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDelete(rule)}
                        className="p-2 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-500"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
