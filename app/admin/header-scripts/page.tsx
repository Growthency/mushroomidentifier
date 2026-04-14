'use client'

import { useState, useEffect } from 'react'
import { Code, Plus, Trash2, Edit3, Check, X, AlertCircle, Loader2, Power, Copy, CheckCheck } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

type Position = 'head' | 'body_start' | 'body_end'

interface Script {
  id: string
  name: string
  code: string
  position: Position
  enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

const POSITION_LABELS: Record<Position, string> = {
  head: '<head>',
  body_start: '<body> start',
  body_end: '<body> end',
}

const POSITION_HELP: Record<Position, string> = {
  head: 'Runs before page render — use for GA, Search Console, Tag Manager head snippet, pixel init',
  body_start: 'Runs right after <body> opens — use for GTM noscript fallback',
  body_end: 'Runs before </body> closes — use for chat widgets, analytics that should load last',
}

export default function HeaderScriptsPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState<Script | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState<{
    name: string
    code: string
    position: Position
    enabled: boolean
    sort_order: number
  }>({ name: '', code: '', position: 'head', enabled: true, sort_order: 0 })

  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/scripts')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setScripts(json.scripts || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm({ name: '', code: '', position: 'head', enabled: true, sort_order: 0 })
    setShowForm(true)
  }

  function openEdit(s: Script) {
    setEditing(s)
    setForm({
      name: s.name,
      code: s.code,
      position: s.position,
      enabled: s.enabled,
      sort_order: s.sort_order,
    })
    setShowForm(true)
  }

  async function save() {
    if (!form.name.trim() || !form.code.trim()) {
      alert('Name and code are required')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/scripts/${editing.id}` : '/api/admin/scripts'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setShowForm(false)
      setEditing(null)
      await load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleEnabled(s: Script) {
    try {
      const res = await fetch(`/api/admin/scripts/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !s.enabled }),
      })
      if (!res.ok) throw new Error('Failed')
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function remove(s: Script) {
    if (!confirm(`Delete "${s.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/scripts/${s.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function copyCode(s: Script) {
    await navigator.clipboard.writeText(s.code)
    setCopied(s.id)
    setTimeout(() => setCopied(null), 1500)
  }

  const cardBg = dark ? '#0c1120' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const textPri = dark ? '#f1f5f9' : '#0f172a'
  const textMut = dark ? '#94a3b8' : '#64748b'
  const textFaint = dark ? '#64748b' : '#94a3b8'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: textPri }}>Header Scripts</h1>
            <p className="text-sm" style={{ color: textMut }}>
              Add Google Analytics, Search Console, Meta Pixel, or any custom HTML/JS sitewide
            </p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Script
        </button>
      </div>

      {/* Info banner */}
      <div
        className="flex gap-3 p-4 rounded-xl border"
        style={{
          background: dark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.05)',
          borderColor: dark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.25)',
        }}
      >
        <AlertCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm" style={{ color: textMut }}>
          <strong style={{ color: textPri }}>How it works:</strong> Scripts added here are injected sitewide into the HTML. Use <code className="px-1.5 py-0.5 rounded bg-slate-500/10 text-xs">&lt;script&gt;</code>, <code className="px-1.5 py-0.5 rounded bg-slate-500/10 text-xs">&lt;meta&gt;</code>, <code className="px-1.5 py-0.5 rounded bg-slate-500/10 text-xs">&lt;link&gt;</code> tags etc. Changes appear on public pages within 60 seconds (cache TTL).
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      ) : scripts.length === 0 ? (
        <div
          className="p-12 rounded-2xl border-2 border-dashed text-center"
          style={{ borderColor: border }}
        >
          <Code className="w-12 h-12 mx-auto mb-4" style={{ color: textFaint }} />
          <p className="text-base font-semibold mb-1" style={{ color: textPri }}>No scripts yet</p>
          <p className="text-sm mb-6" style={{ color: textMut }}>
            Add your first script to start tracking or installing sitewide code
          </p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Your First Script
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border transition-colors"
              style={{ background: cardBg, borderColor: border }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-base truncate" style={{ color: textPri }}>
                      {s.name}
                    </h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold"
                      style={{
                        background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                        color: '#6366f1',
                      }}
                    >
                      {POSITION_LABELS[s.position]}
                    </span>
                    {s.enabled ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-500">
                        ACTIVE
                      </span>
                    ) : (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
                        style={{
                          background: dark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.1)',
                          color: textFaint,
                        }}
                      >
                        PAUSED
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: textFaint }}>
                    Updated {new Date(s.updated_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleEnabled(s)}
                    className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
                    title={s.enabled ? 'Disable' : 'Enable'}
                    style={{ color: s.enabled ? '#10b981' : textFaint }}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyCode(s)}
                    className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
                    title="Copy code"
                    style={{ color: textMut }}
                  >
                    {copied === s.id ? (
                      <CheckCheck className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
                    title="Edit"
                    style={{ color: textMut }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(s)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <pre
                className="text-xs p-3 rounded-lg overflow-x-auto font-mono max-h-32 overflow-y-auto"
                style={{
                  background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(15,23,42,0.04)',
                  color: textMut,
                }}
              >
                <code>{s.code.length > 500 ? s.code.slice(0, 500) + '…' : s.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => !saving && setShowForm(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border"
            style={{ background: cardBg, borderColor: border }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-5 border-b" style={{ background: cardBg, borderColor: border }}>
              <h2 className="text-lg font-bold" style={{ color: textPri }}>
                {editing ? 'Edit Script' : 'Add New Script'}
              </h2>
              <button
                onClick={() => !saving && setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-slate-500/10"
                style={{ color: textMut }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                  Script Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Google Analytics, Meta Pixel, Search Console"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    borderColor: border,
                    color: textPri,
                  }}
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                  Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['head', 'body_start', 'body_end'] as Position[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, position: p })}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
                        form.position === p ? 'ring-2 ring-emerald-500' : ''
                      }`}
                      style={{
                        background: form.position === p
                          ? 'rgba(16,185,129,0.1)'
                          : (dark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                        borderColor: form.position === p ? '#10b981' : border,
                        color: form.position === p ? '#10b981' : textPri,
                      }}
                    >
                      {POSITION_LABELS[p]}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: textFaint }}>
                  {POSITION_HELP[form.position]}
                </p>
              </div>

              {/* Code */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                  Code (HTML / JavaScript)
                </label>
                <textarea
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder={`<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){...})</script>\n<!-- End Google Tag Manager -->`}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: dark ? 'rgba(0,0,0,0.3)' : '#f8fafc',
                    borderColor: border,
                    color: textPri,
                  }}
                />
              </div>

              {/* Sort order + Enabled */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                    Load Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                    style={{
                      background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      borderColor: border,
                      color: textPri,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, enabled: !form.enabled })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: form.enabled ? 'rgba(16,185,129,0.1)' : (dark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                      borderColor: form.enabled ? '#10b981' : border,
                      color: form.enabled ? '#10b981' : textMut,
                    }}
                  >
                    <Power className="w-4 h-4" />
                    {form.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 p-5 border-t" style={{ background: cardBg, borderColor: border }}>
              <button
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-50"
                style={{ borderColor: border, color: textMut }}
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editing ? 'Save Changes' : 'Add Script'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
