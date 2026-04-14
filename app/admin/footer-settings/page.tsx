'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Share2, CreditCard, Award, Plus, Trash2, Save, Check, X, Power,
  ArrowUp, ArrowDown, Loader2,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

type Tab = 'settings' | 'social' | 'payments' | 'badges'

interface SiteSetting {
  key: string
  value: string
  type: string
  group_name: string
  label: string | null
  description: string | null
  sort_order: number
}

interface SocialLink {
  id: string
  label: string
  href: string
  icon_svg: string
  bg_color: string
  icon_color: string
  sort_order: number
  enabled: boolean
}

interface PaymentMethod {
  id: string
  label: string
  display_html: string
  bg_color: string
  text_color: string
  sort_order: number
  enabled: boolean
}

interface FooterBadge {
  id: string
  location: 'footer_explore' | 'footer_company'
  image_url: string
  link_url: string
  alt_text: string | null
  width: number
  height: number | null
  sort_order: number
  enabled: boolean
}

const TABS: { id: Tab; label: string; icon: typeof Settings; description: string }[] = [
  { id: 'settings', label: 'General Settings',  icon: Settings,   description: 'Brand, CTA, payment text, copyright, disclaimer' },
  { id: 'social',   label: 'Social Links',      icon: Share2,     description: 'Instagram, X, Facebook, and other social icons' },
  { id: 'payments', label: 'Payment Methods',   icon: CreditCard, description: 'VISA, MasterCard, PayPal, etc.' },
  { id: 'badges',   label: 'Footer Badges',     icon: Award,      description: 'Partner badges (ShowMeBest, Fazier, etc.)' },
]

export default function FooterSettingsPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [activeTab, setActiveTab] = useState<Tab>('settings')

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: dark ? '#fff' : '#0f172a' }}>Footer Settings</h1>
        <p style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          WordPress-style full control: edit every text, image, icon, and badge in your footer and CTA section.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-3" style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? (dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)') : 'transparent',
                color: active ? '#10b981' : (dark ? '#94a3b8' : '#64748b'),
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div style={{ minHeight: 400 }}>
        {activeTab === 'settings' && <SettingsTab dark={dark} />}
        {activeTab === 'social' && <SocialLinksTab dark={dark} />}
        {activeTab === 'payments' && <PaymentMethodsTab dark={dark} />}
        {activeTab === 'badges' && <FooterBadgesTab dark={dark} />}
      </div>
    </div>
  )
}

// =============================================================================
// TAB 1 — General Settings (key-value editor, grouped by category)
// =============================================================================
function SettingsTab({ dark }: { dark: boolean }) {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/site-settings')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setSettings(json.settings || [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function save() {
    const updates = Object.entries(changes).map(([key, value]) => ({ key, value }))
    if (updates.length === 0) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save')
      }
      setChanges({})
      setSavedAt(Date.now())
      setTimeout(() => setSavedAt(null), 3000)
      load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (loading) return <LoadingBox dark={dark} />
  if (error && settings.length === 0) return <ErrorBox dark={dark} message={error} hint="Apply migration 20260414000003 in Supabase SQL Editor first." />

  // Group by group_name
  const groups: Record<string, SiteSetting[]> = {}
  for (const s of settings) {
    if (!groups[s.group_name]) groups[s.group_name] = []
    groups[s.group_name].push(s)
  }

  const groupTitles: Record<string, string> = {
    brand:   'Brand & Logo',
    cta:     'Call-to-Action Section (above footer)',
    payment: 'Payment Section',
    columns: 'Column Headings',
    bottom:  'Bottom Bar & Safety Disclaimer',
  }

  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([groupName, groupSettings]) => (
        <div key={groupName} className="rounded-xl p-6" style={{ background: dark ? '#0c1120' : '#fff', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0') }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: dark ? '#fff' : '#0f172a' }}>
            {groupTitles[groupName] || groupName}
          </h2>
          <div className="space-y-4">
            {groupSettings.map((s) => (
              <div key={s.key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: dark ? '#cbd5e1' : '#334155' }}>
                  {s.label || s.key}
                </label>
                {s.type === 'textarea' ? (
                  <textarea
                    value={changes[s.key] ?? s.value ?? ''}
                    onChange={(e) => setChanges({ ...changes, [s.key]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg text-sm font-mono"
                    style={{ background: dark ? '#080c14' : '#f8fafc', color: dark ? '#fff' : '#0f172a', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0') }}
                  />
                ) : (
                  <input
                    type={s.type === 'email' ? 'email' : s.type === 'url' ? 'text' : 'text'}
                    value={changes[s.key] ?? s.value ?? ''}
                    onChange={(e) => setChanges({ ...changes, [s.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: dark ? '#080c14' : '#f8fafc', color: dark ? '#fff' : '#0f172a', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0') }}
                  />
                )}
                {s.description && (
                  <p className="text-xs mt-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save bar */}
      <div className="sticky bottom-4 flex items-center justify-between gap-4 p-4 rounded-xl backdrop-blur-xl"
           style={{ background: dark ? 'rgba(12,17,32,0.95)' : 'rgba(255,255,255,0.95)', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'), boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div className="text-sm" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          {hasChanges ? `${Object.keys(changes).length} unsaved change${Object.keys(changes).length > 1 ? 's' : ''}` : 'All changes saved'}
          {error && <span className="block text-red-400 mt-1">{error}</span>}
        </div>
        <div className="flex items-center gap-2">
          {savedAt && <span className="text-xs text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: hasChanges ? '#10b981' : (dark ? '#1e293b' : '#e2e8f0'), color: hasChanges ? '#fff' : (dark ? '#64748b' : '#94a3b8') }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// TAB 2 — Social Links CRUD
// =============================================================================
function SocialLinksTab({ dark }: { dark: boolean }) {
  const [items, setItems] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/social-links')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setItems(json.items || [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function saveItem() {
    if (!editing) return
    setSaving(true); setError(null)
    try {
      const body = {
        label: editing.label, href: editing.href, icon_svg: editing.icon_svg,
        bg_color: editing.bg_color, icon_color: editing.icon_color,
        sort_order: editing.sort_order, enabled: editing.enabled,
      }
      const url = editing.id ? `/api/admin/social-links/${editing.id}` : '/api/admin/social-links'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setEditing(null); load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this social link?')) return
    await fetch(`/api/admin/social-links/${id}`, { method: 'DELETE' })
    load()
  }

  async function toggleEnabled(item: SocialLink) {
    await fetch(`/api/admin/social-links/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !item.enabled }),
    })
    load()
  }

  async function reorder(item: SocialLink, direction: 'up' | 'down') {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex((i) => i.id === item.id)
    const swap = direction === 'up' ? sorted[idx - 1] : sorted[idx + 1]
    if (!swap) return
    await Promise.all([
      fetch(`/api/admin/social-links/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: swap.sort_order }) }),
      fetch(`/api/admin/social-links/${swap.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: item.sort_order }) }),
    ])
    load()
  }

  if (loading) return <LoadingBox dark={dark} />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          {items.length} social icon{items.length !== 1 ? 's' : ''} in footer
        </p>
        <button
          onClick={() => setEditing({ label: '', href: '', icon_svg: '', bg_color: '#000000', icon_color: '#ffffff', sort_order: items.length + 1, enabled: true })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Social Link
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
               style={{ background: dark ? '#0c1120' : '#fff', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'), opacity: item.enabled ? 1 : 0.5 }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                 style={{ background: item.bg_color, color: item.icon_color }}
                 dangerouslySetInnerHTML={{ __html: item.icon_svg }} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>{item.label}</div>
              <div className="text-xs truncate" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{item.href}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => reorder(item, 'up')} disabled={idx === 0} className="p-1.5 rounded-lg hover:bg-emerald-500/10 disabled:opacity-30" style={{ color: dark ? '#94a3b8' : '#64748b' }}><ArrowUp className="w-4 h-4" /></button>
              <button onClick={() => reorder(item, 'down')} disabled={idx === items.length - 1} className="p-1.5 rounded-lg hover:bg-emerald-500/10 disabled:opacity-30" style={{ color: dark ? '#94a3b8' : '#64748b' }}><ArrowDown className="w-4 h-4" /></button>
              <button onClick={() => toggleEnabled(item)} className="p-1.5 rounded-lg hover:bg-emerald-500/10" style={{ color: item.enabled ? '#10b981' : (dark ? '#64748b' : '#94a3b8') }}><Power className="w-4 h-4" /></button>
              <button onClick={() => setEditing(item)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10" style={{ color: '#ef4444' }}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal dark={dark} title={editing.id ? 'Edit Social Link' : 'Add Social Link'} onClose={() => setEditing(null)}>
          <Field dark={dark} label="Label (e.g. Instagram)">
            <input type="text" value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className={inputCls(dark)} />
          </Field>
          <Field dark={dark} label="URL">
            <input type="url" value={editing.href || ''} onChange={(e) => setEditing({ ...editing, href: e.target.value })} className={inputCls(dark)} />
          </Field>
          <Field dark={dark} label="Icon SVG (paste full <svg> markup)">
            <textarea rows={4} value={editing.icon_svg || ''} onChange={(e) => setEditing({ ...editing, icon_svg: e.target.value })} className={inputCls(dark) + ' font-mono text-xs'} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field dark={dark} label="Background Color">
              <input type="text" value={editing.bg_color || '#000000'} onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })} className={inputCls(dark)} placeholder="#E1306C" />
            </Field>
            <Field dark={dark} label="Icon Color">
              <input type="text" value={editing.icon_color || '#ffffff'} onChange={(e) => setEditing({ ...editing, icon_color: e.target.value })} className={inputCls(dark)} placeholder="#ffffff" />
            </Field>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <ModalFooter onCancel={() => setEditing(null)} onSave={saveItem} saving={saving} dark={dark} />
        </Modal>
      )}
    </div>
  )
}

// =============================================================================
// TAB 3 — Payment Methods CRUD
// =============================================================================
function PaymentMethodsTab({ dark }: { dark: boolean }) {
  const [items, setItems] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Partial<PaymentMethod> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/payment-methods')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setItems(json.items || [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function saveItem() {
    if (!editing) return
    setSaving(true); setError(null)
    try {
      const body = {
        label: editing.label, display_html: editing.display_html,
        bg_color: editing.bg_color, text_color: editing.text_color,
        sort_order: editing.sort_order, enabled: editing.enabled,
      }
      const url = editing.id ? `/api/admin/payment-methods/${editing.id}` : '/api/admin/payment-methods'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setEditing(null); load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this payment method?')) return
    await fetch(`/api/admin/payment-methods/${id}`, { method: 'DELETE' })
    load()
  }

  async function toggleEnabled(item: PaymentMethod) {
    await fetch(`/api/admin/payment-methods/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !item.enabled }),
    })
    load()
  }

  async function reorder(item: PaymentMethod, direction: 'up' | 'down') {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex((i) => i.id === item.id)
    const swap = direction === 'up' ? sorted[idx - 1] : sorted[idx + 1]
    if (!swap) return
    await Promise.all([
      fetch(`/api/admin/payment-methods/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: swap.sort_order }) }),
      fetch(`/api/admin/payment-methods/${swap.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: item.sort_order }) }),
    ])
    load()
  }

  if (loading) return <LoadingBox dark={dark} />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          {items.length} payment method{items.length !== 1 ? 's' : ''} displayed
        </p>
        <button
          onClick={() => setEditing({ label: '', display_html: '', bg_color: '#1A1F71', text_color: '#ffffff', sort_order: items.length + 1, enabled: true })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Payment Method
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
               style={{ background: dark ? '#0c1120' : '#fff', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'), opacity: item.enabled ? 1 : 0.5 }}>
            <div className="flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-bold flex-shrink-0" style={{ background: item.bg_color, color: item.text_color, minWidth: 60, border: '1px solid rgba(0,0,0,0.08)' }} dangerouslySetInnerHTML={{ __html: item.display_html }} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>{item.label}</div>
              <div className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>bg: {item.bg_color} · text: {item.text_color}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => reorder(item, 'up')} disabled={idx === 0} className="p-1.5 rounded-lg hover:bg-emerald-500/10 disabled:opacity-30" style={{ color: dark ? '#94a3b8' : '#64748b' }}><ArrowUp className="w-4 h-4" /></button>
              <button onClick={() => reorder(item, 'down')} disabled={idx === items.length - 1} className="p-1.5 rounded-lg hover:bg-emerald-500/10 disabled:opacity-30" style={{ color: dark ? '#94a3b8' : '#64748b' }}><ArrowDown className="w-4 h-4" /></button>
              <button onClick={() => toggleEnabled(item)} className="p-1.5 rounded-lg hover:bg-emerald-500/10" style={{ color: item.enabled ? '#10b981' : (dark ? '#64748b' : '#94a3b8') }}><Power className="w-4 h-4" /></button>
              <button onClick={() => setEditing(item)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10" style={{ color: '#ef4444' }}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal dark={dark} title={editing.id ? 'Edit Payment Method' : 'Add Payment Method'} onClose={() => setEditing(null)}>
          <Field dark={dark} label="Label (e.g. VISA)">
            <input type="text" value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className={inputCls(dark)} />
          </Field>
          <Field dark={dark} label="Display Content (plain text or HTML)">
            <textarea rows={3} value={editing.display_html || ''} onChange={(e) => setEditing({ ...editing, display_html: e.target.value })} className={inputCls(dark) + ' font-mono text-xs'} placeholder="VISA  or  Pay<span style='color:#009CDE'>Pal</span>" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field dark={dark} label="Background Color">
              <input type="text" value={editing.bg_color || '#1A1F71'} onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })} className={inputCls(dark)} />
            </Field>
            <Field dark={dark} label="Text Color">
              <input type="text" value={editing.text_color || '#ffffff'} onChange={(e) => setEditing({ ...editing, text_color: e.target.value })} className={inputCls(dark)} />
            </Field>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <ModalFooter onCancel={() => setEditing(null)} onSave={saveItem} saving={saving} dark={dark} />
        </Modal>
      )}
    </div>
  )
}

// =============================================================================
// TAB 4 — Footer Badges CRUD
// =============================================================================
function FooterBadgesTab({ dark }: { dark: boolean }) {
  const [items, setItems] = useState<FooterBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Partial<FooterBadge> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/footer-badges')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setItems(json.items || [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function saveItem() {
    if (!editing) return
    setSaving(true); setError(null)
    try {
      const body = {
        location: editing.location, image_url: editing.image_url, link_url: editing.link_url,
        alt_text: editing.alt_text, width: editing.width, height: editing.height,
        sort_order: editing.sort_order, enabled: editing.enabled,
      }
      const url = editing.id ? `/api/admin/footer-badges/${editing.id}` : '/api/admin/footer-badges'
      const method = editing.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setEditing(null); load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this badge?')) return
    await fetch(`/api/admin/footer-badges/${id}`, { method: 'DELETE' })
    load()
  }

  async function toggleEnabled(item: FooterBadge) {
    await fetch(`/api/admin/footer-badges/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !item.enabled }),
    })
    load()
  }

  if (loading) return <LoadingBox dark={dark} />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          Partner badges displayed under Explore & Company columns
        </p>
        <button
          onClick={() => setEditing({ location: 'footer_explore', image_url: '', link_url: '', alt_text: '', width: 120, sort_order: items.length + 1, enabled: true })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Badge
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
               style={{ background: dark ? '#0c1120' : '#fff', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'), opacity: item.enabled ? 1 : 0.5 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.alt_text || ''} style={{ width: item.width, height: item.height || 'auto', maxWidth: 120 }} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a' }}>{item.alt_text || 'Badge'}</div>
              <div className="text-xs" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Location: {item.location === 'footer_explore' ? 'Explore column' : 'Company column'}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleEnabled(item)} className="p-1.5 rounded-lg hover:bg-emerald-500/10" style={{ color: item.enabled ? '#10b981' : (dark ? '#64748b' : '#94a3b8') }}><Power className="w-4 h-4" /></button>
              <button onClick={() => setEditing(item)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10" style={{ color: '#ef4444' }}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal dark={dark} title={editing.id ? 'Edit Badge' : 'Add Badge'} onClose={() => setEditing(null)}>
          <Field dark={dark} label="Location">
            <select value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value as any })} className={inputCls(dark)}>
              <option value="footer_explore">Explore column</option>
              <option value="footer_company">Company column</option>
            </select>
          </Field>
          <Field dark={dark} label="Image URL">
            <input type="url" value={editing.image_url || ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className={inputCls(dark)} />
          </Field>
          <Field dark={dark} label="Link URL">
            <input type="url" value={editing.link_url || ''} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} className={inputCls(dark)} />
          </Field>
          <Field dark={dark} label="Alt text">
            <input type="text" value={editing.alt_text || ''} onChange={(e) => setEditing({ ...editing, alt_text: e.target.value })} className={inputCls(dark)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field dark={dark} label="Width (px)">
              <input type="number" value={editing.width || 120} onChange={(e) => setEditing({ ...editing, width: parseInt(e.target.value) || 120 })} className={inputCls(dark)} />
            </Field>
            <Field dark={dark} label="Height (px, optional)">
              <input type="number" value={editing.height || ''} onChange={(e) => setEditing({ ...editing, height: e.target.value ? parseInt(e.target.value) : null as any })} className={inputCls(dark)} />
            </Field>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <ModalFooter onCancel={() => setEditing(null)} onSave={saveItem} saving={saving} dark={dark} />
        </Modal>
      )}
    </div>
  )
}

// =============================================================================
// Shared components
// =============================================================================
function LoadingBox({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center justify-center py-20" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  )
}

function ErrorBox({ dark, message, hint }: { dark: boolean; message: string; hint?: string }) {
  return (
    <div className="p-6 rounded-xl" style={{ background: dark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)' }}>
      <p className="text-sm font-semibold text-red-400 mb-1">{message}</p>
      {hint && <p className="text-xs" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{hint}</p>}
    </div>
  )
}

function Modal({ dark, title, children, onClose }: { dark: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto" style={{ background: dark ? '#0c1120' : '#fff', border: '1px solid ' + (dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0') }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-500/10" style={{ color: dark ? '#94a3b8' : '#64748b' }}><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ dark, label, children }: { dark: boolean; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: dark ? '#cbd5e1' : '#334155' }}>{label}</label>
      {children}
    </div>
  )
}

function ModalFooter({ onCancel, onSave, saving, dark }: { onCancel: () => void; onSave: () => void; saving: boolean; dark: boolean }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: dark ? '#1e293b' : '#f1f5f9', color: dark ? '#94a3b8' : '#64748b' }}>Cancel</button>
      <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
      </button>
    </div>
  )
}

function inputCls(dark: boolean) {
  return 'w-full px-3 py-2 rounded-lg text-sm ' + (dark ? 'bg-[#080c14] text-white border border-white/10' : 'bg-slate-50 text-slate-900 border border-slate-200')
}
