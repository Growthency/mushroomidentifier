'use client'

import { useState, useEffect } from 'react'
import {
  BadgeDollarSign, Plus, Trash2, Edit3, Check, X, AlertCircle, Loader2,
  Power, Zap, Eye, EyeOff, Monitor, Smartphone, Sparkles, LayoutTemplate,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import AdFrame from '@/components/adify/AdFrame'
import {
  AD_PLACEMENTS, PLACEMENT_LABELS, PLACEMENT_HELP, detectAdSize,
  type AdPlacement, type AdPageType,
} from '@/lib/ads'

interface AdUnit {
  id: string
  name: string
  code: string
  width: number
  height: number
  placement: AdPlacement
  paragraph_number: number
  page_types: AdPageType[]
  show_desktop: boolean
  show_mobile: boolean
  lazy_load: boolean
  enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type Form = {
  name: string
  code: string
  width: number
  height: number
  placement: AdPlacement
  paragraph_number: number
  page_scope: 'all' | 'home' | 'article'
  show_desktop: boolean
  show_mobile: boolean
  lazy_load: boolean
  enabled: boolean
  sort_order: number
}

const EMPTY_FORM: Form = {
  name: '', code: '', width: 300, height: 250,
  placement: 'in_content', paragraph_number: 3,
  page_scope: 'all', show_desktop: true, show_mobile: true,
  lazy_load: true, enabled: true, sort_order: 0,
}

function scopeFromPageTypes(pt: AdPageType[]): 'all' | 'home' | 'article' {
  if (!pt || pt.length === 0 || pt.includes('all')) return 'all'
  if (pt.includes('home') && !pt.includes('article')) return 'home'
  if (pt.includes('article') && !pt.includes('home')) return 'article'
  return 'all'
}

export default function AdifyPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [ads, setAds] = useState<AdUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const [editing, setEditing] = useState<AdUnit | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/ads')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setAds(json.ads || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(a: AdUnit) {
    setEditing(a)
    setForm({
      name: a.name, code: a.code, width: a.width, height: a.height,
      placement: a.placement, paragraph_number: a.paragraph_number,
      page_scope: scopeFromPageTypes(a.page_types),
      show_desktop: a.show_desktop, show_mobile: a.show_mobile,
      lazy_load: a.lazy_load, enabled: a.enabled, sort_order: a.sort_order,
    })
    setShowForm(true)
  }

  // Auto-detect size whenever the pasted code changes.
  function onCodeChange(code: string) {
    const { width, height } = detectAdSize(code)
    setForm((f) => ({ ...f, code, width, height }))
  }

  async function save() {
    if (!form.name.trim() || !form.code.trim()) {
      alert('Name and ad code are required'); return
    }
    setSaving(true)
    try {
      const page_types: AdPageType[] = form.page_scope === 'all' ? ['all'] : [form.page_scope]
      const payload = { ...form, page_types }
      const url = editing ? `/api/admin/ads/${editing.id}` : '/api/admin/ads'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setShowForm(false); setEditing(null)
      await load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleEnabled(a: AdUnit) {
    try {
      const res = await fetch(`/api/admin/ads/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !a.enabled }),
      })
      if (!res.ok) throw new Error('Failed')
      await load()
    } catch (e: any) { alert(e.message) }
  }

  async function remove(a: AdUnit) {
    if (!confirm(`Delete "${a.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/ads/${a.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await load()
    } catch (e: any) { alert(e.message) }
  }

  async function quickSetup() {
    if (!confirm('Seed the 5 Adsterra ad units into optimal placements? This only runs when you have no ad units yet.')) return
    setSeeding(true); setNotice(null)
    try {
      const res = await fetch('/api/admin/ads/seed', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Seed failed')
      setNotice(json.message || 'Done')
      await load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSeeding(false)
    }
  }

  const cardBg = dark ? '#0c1120' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const textPri = dark ? '#f1f5f9' : '#0f172a'
  const textMut = dark ? '#94a3b8' : '#64748b'
  const textFaint = dark ? '#64748b' : '#94a3b8'
  const inputBg = dark ? 'rgba(255,255,255,0.03)' : '#f8fafc'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <BadgeDollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: textPri }}>Adify</h1>
            <p className="text-sm" style={{ color: textMut }}>
              Manage Adsterra &amp; other ad-network units — placement, device &amp; page targeting, all sitewide
            </p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Ad Unit
        </button>
      </div>

      {/* How it works */}
      <div
        className="flex gap-3 p-4 rounded-xl border"
        style={{
          background: dark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.05)',
          borderColor: dark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.25)',
        }}
      >
        <AlertCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm" style={{ color: textMut }}>
          <strong style={{ color: textPri }}>How it works:</strong> Each ad renders in its own isolated, lazy-loaded frame — so multiple Adsterra tags never clash, page speed stays fast, and an ad can never redirect your site. Paste your ad code, pick a placement, and it goes live sitewide within ~30 seconds. Your ad code is stored and served <em>exactly</em> as pasted.
        </div>
      </div>

      {/* Notice */}
      {notice && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {notice}
        </div>
      )}

      {/* Quick Setup — shown when there are no ad units */}
      {!loading && ads.length === 0 && !error && (
        <div
          className="p-6 rounded-2xl border-2 relative overflow-hidden"
          style={{ background: cardBg, borderColor: 'rgba(16,185,129,0.35)' }}
        >
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-[240px]">
              <h3 className="text-lg font-bold mb-1" style={{ color: textPri }}>Quick Setup — turn on monetization now</h3>
              <p className="text-sm mb-4" style={{ color: textMut }}>
                One click seeds your 5 Adsterra units into the best-performing placements:
                <span className="block mt-2 space-y-1">
                  <Row t="728×90 Leaderboard" p="Header strip (desktop)" c={textFaint} />
                  <Row t="300×250 Rectangle" p="In-content, every 3 paragraphs (all devices)" c={textFaint} />
                  <Row t="160×300 Half-page" p="Sidebar (desktop)" c={textFaint} />
                  <Row t="468×60 Banner" p="End of article (desktop)" c={textFaint} />
                  <Row t="320×50 Anchor" p="Sticky bottom bar (mobile)" c={textFaint} />
                </span>
              </p>
              <button
                onClick={quickSetup}
                disabled={seeding}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {seeding ? 'Setting up…' : 'Run Quick Setup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
          {error}
          <p className="mt-2" style={{ color: textMut }}>
            If this says the table is missing, run the <code>ad_units</code> migration in your Supabase SQL editor first.
          </p>
        </div>
      ) : ads.length === 0 ? null : (
        <div className="grid gap-3">
          {ads.map((a) => (
            <div key={a.id} className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-base truncate" style={{ color: textPri }}>{a.name}</h3>
                    <Badge color="#6366f1">{PLACEMENT_LABELS[a.placement]}{a.placement === 'in_content' ? ` · every ${a.paragraph_number}¶` : ''}</Badge>
                    <Badge color="#0ea5e9">{a.width}×{a.height}</Badge>
                    {a.enabled
                      ? <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-500">ACTIVE</span>
                      : <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(148,163,184,0.15)', color: textFaint }}>PAUSED</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: textFaint }}>
                    <span className="inline-flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5" style={{ opacity: a.show_desktop ? 1 : 0.3 }} />
                      <Smartphone className="w-3.5 h-3.5" style={{ opacity: a.show_mobile ? 1 : 0.3 }} />
                    </span>
                    <span>{scopeLabel(a.page_types)}</span>
                    <span>{a.lazy_load ? 'Lazy' : 'Eager'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPreviewId(previewId === a.id ? null : a.id)} className="p-2 rounded-lg hover:bg-slate-500/10" title="Test render" style={{ color: textMut }}>
                    {previewId === a.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => toggleEnabled(a)} className="p-2 rounded-lg hover:bg-slate-500/10" title={a.enabled ? 'Pause' : 'Activate'} style={{ color: a.enabled ? '#10b981' : textFaint }}>
                    <Power className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-slate-500/10" title="Edit" style={{ color: textMut }}>
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(a)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* On-demand live preview (avoids counting self-impressions on every page view) */}
              {previewId === a.id && (
                <div className="mt-4 pt-4 border-t flex flex-col items-center gap-2" style={{ borderColor: border }}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: textFaint }}>Live test render</span>
                  <div className="overflow-auto max-w-full">
                    <AdFrame code={a.code} width={a.width} height={a.height} lazy={false} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => !saving && setShowForm(false)}>
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border" style={{ background: cardBg, borderColor: border }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between p-5 border-b z-10" style={{ background: cardBg, borderColor: border }}>
              <h2 className="text-lg font-bold" style={{ color: textPri }}>{editing ? 'Edit Ad Unit' : 'Add Ad Unit'}</h2>
              <button onClick={() => !saving && setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-500/10" style={{ color: textMut }}><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <Field label="Name" mut={textMut}>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rectangle 300×250 — In-content"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{ background: inputBg, borderColor: border, color: textPri }} />
              </Field>

              {/* Code */}
              <Field label="Ad code (paste from Adsterra — stored verbatim)" mut={textMut}>
                <textarea value={form.code} onChange={(e) => onCodeChange(e.target.value)} rows={7}
                  placeholder={`<script>\n  atOptions = { 'key':'…','format':'iframe','height':250,'width':300,'params':{} };\n</script>\n<script src="https://…/invoke.js"></script>`}
                  className="w-full px-4 py-3 rounded-xl border text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{ background: dark ? 'rgba(0,0,0,0.3)' : '#f8fafc', borderColor: border, color: textPri }} />
                <p className="text-xs mt-1.5" style={{ color: textFaint }}>Size auto-detected: <strong style={{ color: textMut }}>{form.width}×{form.height}</strong></p>
              </Field>

              {/* Size override */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Width (px)" mut={textMut}>
                  <input type="number" value={form.width} onChange={(e) => setForm({ ...form, width: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" style={{ background: inputBg, borderColor: border, color: textPri }} />
                </Field>
                <Field label="Height (px)" mut={textMut}>
                  <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" style={{ background: inputBg, borderColor: border, color: textPri }} />
                </Field>
              </div>

              {/* Placement */}
              <Field label="Placement" mut={textMut}>
                <div className="relative">
                  <LayoutTemplate className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textFaint }} />
                  <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as AdPlacement })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none"
                    style={{ background: inputBg, borderColor: border, color: textPri }}>
                    {AD_PLACEMENTS.map((p) => <option key={p} value={p}>{PLACEMENT_LABELS[p]}</option>)}
                  </select>
                </div>
                <p className="text-xs mt-1.5" style={{ color: textFaint }}>{PLACEMENT_HELP[form.placement]}</p>
              </Field>

              {/* Paragraph interval (only for in_content) */}
              {form.placement === 'in_content' && (
                <Field label="Show an ad every N paragraphs" mut={textMut}>
                  <input type="number" min={2} value={form.paragraph_number} onChange={(e) => setForm({ ...form, paragraph_number: parseInt(e.target.value) || 2 })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" style={{ background: inputBg, borderColor: border, color: textPri }} />
                  <p className="text-xs mt-1.5" style={{ color: textFaint }}>e.g. 3 = an ad repeats after every 3rd paragraph (max 10 per article).</p>
                </Field>
              )}

              {/* Page scope */}
              <Field label="Show on" mut={textMut}>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'home', 'article'] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, page_scope: s })}
                      className="px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all"
                      style={{
                        background: form.page_scope === s ? 'rgba(16,185,129,0.1)' : inputBg,
                        borderColor: form.page_scope === s ? '#10b981' : border,
                        color: form.page_scope === s ? '#10b981' : textPri,
                      }}>
                      {s === 'all' ? 'All pages' : s === 'home' ? 'Homepage' : 'Articles'}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Devices */}
              <Field label="Devices" mut={textMut}>
                <div className="grid grid-cols-2 gap-2">
                  <Toggle on={form.show_desktop} onClick={() => setForm({ ...form, show_desktop: !form.show_desktop })} icon={<Monitor className="w-4 h-4" />} label="Desktop" inputBg={inputBg} border={border} textMut={textMut} />
                  <Toggle on={form.show_mobile} onClick={() => setForm({ ...form, show_mobile: !form.show_mobile })} icon={<Smartphone className="w-4 h-4" />} label="Mobile" inputBg={inputBg} border={border} textMut={textMut} />
                </div>
              </Field>

              {/* Lazy + Enabled */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Loading" mut={textMut}>
                  <Toggle on={form.lazy_load} onClick={() => setForm({ ...form, lazy_load: !form.lazy_load })} icon={<Zap className="w-4 h-4" />} label={form.lazy_load ? 'Lazy (fast)' : 'Eager'} inputBg={inputBg} border={border} textMut={textMut} />
                </Field>
                <Field label="Status" mut={textMut}>
                  <Toggle on={form.enabled} onClick={() => setForm({ ...form, enabled: !form.enabled })} icon={<Power className="w-4 h-4" />} label={form.enabled ? 'Enabled' : 'Disabled'} inputBg={inputBg} border={border} textMut={textMut} />
                </Field>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 p-5 border-t" style={{ background: cardBg, borderColor: border }}>
              <button onClick={() => setShowForm(false)} disabled={saving} className="px-4 py-2.5 rounded-xl text-sm font-semibold border disabled:opacity-50" style={{ borderColor: border, color: textMut }}>Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editing ? 'Save Changes' : 'Add Ad Unit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── small presentational helpers ── */

function Row({ t, p, c }: { t: string; p: string; c: string }) {
  return (
    <span className="flex items-baseline gap-2 text-xs" style={{ color: c }}>
      <span className="font-mono font-semibold" style={{ color: '#10b981' }}>{t}</span>
      <span>→ {p}</span>
    </span>
  )
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold"
      style={{ background: `${color}1a`, color }}>
      {children}
    </span>
  )
}

function Field({ label, mut, children }: { label: string; mut: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: mut }}>{label}</label>
      {children}
    </div>
  )
}

function Toggle({ on, onClick, icon, label, inputBg, border, textMut }: {
  on: boolean; onClick: () => void; icon: React.ReactNode; label: string
  inputBg: string; border: string; textMut: string
}) {
  return (
    <button type="button" onClick={onClick}
      className="w-full px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all"
      style={{
        background: on ? 'rgba(16,185,129,0.1)' : inputBg,
        borderColor: on ? '#10b981' : border,
        color: on ? '#10b981' : textMut,
      }}>
      {icon}{label}
    </button>
  )
}

function scopeLabel(pt: AdPageType[]): string {
  const s = scopeFromPageTypes(pt)
  return s === 'all' ? 'All pages' : s === 'home' ? 'Homepage' : 'Articles'
}
