'use client'

import { useState, useEffect } from 'react'
import {
  Menu as MenuIcon, Plus, Trash2, Edit3, Check, X, Power,
  ArrowUp, ArrowDown, Loader2, ExternalLink, Link as LinkIcon,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

type Location = 'header' | 'footer_explore' | 'footer_company' | 'footer_bottom'

interface MenuItem {
  id: string
  location: Location
  label: string
  url: string
  target: '_self' | '_blank'
  sort_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

const LOCATION_TABS: { id: Location; label: string; description: string }[] = [
  { id: 'header',          label: 'Header Menu',        description: 'Main navigation links at the top of the site' },
  { id: 'footer_explore',  label: 'Footer — Explore',   description: 'First column of footer (feature pages)' },
  { id: 'footer_company',  label: 'Footer — Company',   description: 'Second column of footer (legal + about)' },
  { id: 'footer_bottom',   label: 'Footer — Bottom',    description: 'Small links next to copyright text' },
]

export default function MenusPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Location>('header')

  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<{
    label: string
    url: string
    target: '_self' | '_blank'
    enabled: boolean
  }>({ label: '', url: '', target: '_self', enabled: true })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/menus')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setItems(json.items || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = items
    .filter((i) => i.location === activeTab)
    .sort((a, b) => a.sort_order - b.sort_order)

  function openNew() {
    setEditing(null)
    setForm({ label: '', url: '', target: '_self', enabled: true })
    setShowForm(true)
  }

  function openEdit(m: MenuItem) {
    setEditing(m)
    setForm({ label: m.label, url: m.url, target: m.target, enabled: m.enabled })
    setShowForm(true)
  }

  async function save() {
    if (!form.label.trim() || !form.url.trim()) {
      alert('Label and URL are required')
      return
    }
    setSaving(true)
    try {
      const sort_order = editing ? editing.sort_order : (filtered.length > 0 ? Math.max(...filtered.map(i => i.sort_order)) + 1 : 1)
      const url = editing ? `/api/admin/menus/${editing.id}` : '/api/admin/menus'
      const method = editing ? 'PUT' : 'POST'
      const payload = editing
        ? form
        : { ...form, location: activeTab, sort_order }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  async function toggleEnabled(m: MenuItem) {
    try {
      const res = await fetch(`/api/admin/menus/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !m.enabled }),
      })
      if (!res.ok) throw new Error('Failed')
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function remove(m: MenuItem) {
    if (!confirm(`Remove "${m.label}" from menu? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/menus/${m.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function move(m: MenuItem, direction: 'up' | 'down') {
    const index = filtered.findIndex((i) => i.id === m.id)
    if (index === -1) return
    const target = direction === 'up' ? filtered[index - 1] : filtered[index + 1]
    if (!target) return
    try {
      // Swap sort_order between this and neighbor
      await Promise.all([
        fetch(`/api/admin/menus/${m.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: target.sort_order }),
        }),
        fetch(`/api/admin/menus/${target.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: m.sort_order }),
        }),
      ])
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const cardBg = dark ? '#0c1120' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const textPri = dark ? '#f1f5f9' : '#0f172a'
  const textMut = dark ? '#94a3b8' : '#64748b'
  const textFaint = dark ? '#64748b' : '#94a3b8'
  const activeTabInfo = LOCATION_TABS.find(t => t.id === activeTab)!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <MenuIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: textPri }}>Menus</h1>
            <p className="text-sm" style={{ color: textMut }}>
              Manage header navigation and footer links sitewide
            </p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex flex-wrap gap-2 p-2 rounded-xl border"
        style={{ background: cardBg, borderColor: border }}
      >
        {LOCATION_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const count = items.filter(i => i.location === tab.id).length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive ? 'bg-emerald-500 text-white' : ''
              }`}
              style={!isActive ? { color: textMut } : undefined}
            >
              {tab.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : (dark ? 'rgba(148,163,184,0.15)' : '#e2e8f0'),
                  color: isActive ? '#fff' : textFaint,
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab description */}
      <p className="text-sm" style={{ color: textMut }}>
        <strong style={{ color: textPri }}>{activeTabInfo.label}:</strong>{' '}{activeTabInfo.description}
      </p>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="p-12 rounded-2xl border-2 border-dashed text-center"
          style={{ borderColor: border }}
        >
          <LinkIcon className="w-12 h-12 mx-auto mb-4" style={{ color: textFaint }} />
          <p className="text-base font-semibold mb-1" style={{ color: textPri }}>No links yet</p>
          <p className="text-sm mb-6" style={{ color: textMut }}>
            Add the first link to {activeTabInfo.label.toLowerCase()}
          </p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m, idx) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border flex items-center gap-3 flex-wrap"
              style={{ background: cardBg, borderColor: border }}
            >
              {/* Order controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(m, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-slate-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: textMut }}
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => move(m, 'down')}
                  disabled={idx === filtered.length - 1}
                  className="p-1 rounded hover:bg-slate-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: textMut }}
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-sm" style={{ color: textPri }}>
                    {m.label}
                  </span>
                  {m.target === '_blank' && (
                    <ExternalLink className="w-3.5 h-3.5" style={{ color: textFaint }} />
                  )}
                  {!m.enabled && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                      style={{
                        background: dark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.1)',
                        color: textFaint,
                      }}
                    >
                      HIDDEN
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono truncate" style={{ color: textMut }}>{m.url}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleEnabled(m)}
                  className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
                  title={m.enabled ? 'Hide from site' : 'Show on site'}
                  style={{ color: m.enabled ? '#10b981' : textFaint }}
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEdit(m)}
                  className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
                  style={{ color: textMut }}
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(m)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
            className="w-full max-w-xl rounded-2xl border"
            style={{ background: cardBg, borderColor: border }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: border }}>
              <h2 className="text-lg font-bold" style={{ color: textPri }}>
                {editing ? 'Edit Link' : `Add Link to ${activeTabInfo.label}`}
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
              {/* Label */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                  Label (shown on site)
                </label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. About Us, Pricing, Contact"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    borderColor: border,
                    color: textPri,
                  }}
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                  URL
                </label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="/pricing  or  https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    borderColor: border,
                    color: textPri,
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: textFaint }}>
                  Use /path for internal pages (e.g. <code>/pricing</code>), full URL for external links
                </p>
              </div>

              {/* Target + Enabled */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                    Open In
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['_self', '_blank'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, target: t })}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          form.target === t ? 'ring-2 ring-emerald-500' : ''
                        }`}
                        style={{
                          background: form.target === t
                            ? 'rgba(16,185,129,0.1)'
                            : (dark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                          borderColor: form.target === t ? '#10b981' : border,
                          color: form.target === t ? '#10b981' : textPri,
                        }}
                      >
                        {t === '_self' ? 'Same tab' : 'New tab'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textMut }}>
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, enabled: !form.enabled })}
                    className="w-full px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: form.enabled ? 'rgba(16,185,129,0.1)' : (dark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                      borderColor: form.enabled ? '#10b981' : border,
                      color: form.enabled ? '#10b981' : textMut,
                    }}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {form.enabled ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t" style={{ borderColor: border }}>
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
                {editing ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
