'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Home, Plus, Save, Trash2, Eye, EyeOff, ArrowUp, ArrowDown,
  Heading1, Type, Image as ImageIcon, Columns, Minus, AlertCircle,
  LayoutGrid, Loader2, X, Pencil, GripVertical, Check, Upload,
  Download, Sparkles,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useModal } from '@/components/admin/AdminModal'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), { ssr: false })

type BlockType =
  | 'heading'
  | 'rich-text'
  | 'image'
  | 'two-column'
  | 'visual-break'
  | 'cta-box'
  | 'feature-grid'

interface Block {
  id: string
  order_index: number
  block_type: BlockType
  data: Record<string, any>
  visible: boolean
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: any; description: string }[] = [
  { type: 'heading', label: 'Heading', icon: Heading1, description: 'Section title with optional eyebrow + subtitle' },
  { type: 'rich-text', label: 'Rich Text', icon: Type, description: 'Paragraphs, lists, tables, links — WYSIWYG editor' },
  { type: 'image', label: 'Image', icon: ImageIcon, description: 'Single image with caption and optional credit' },
  { type: 'two-column', label: 'Two Column', icon: Columns, description: 'Text on one side, image on the other' },
  { type: 'visual-break', label: 'Visual Break', icon: Minus, description: 'Full-width divider image between sections' },
  { type: 'cta-box', label: 'Alert / CTA Box', icon: AlertCircle, description: 'Info/warning/success box with button' },
  { type: 'feature-grid', label: 'Feature Grid', icon: LayoutGrid, description: 'Grid of feature cards with images + text' },
]

function defaultData(type: BlockType): Record<string, any> {
  switch (type) {
    case 'heading': return { title: 'New section heading', align: 'center', level: 'h2' }
    case 'rich-text': return { html: '<p>Start writing your content here...</p>' }
    case 'image': return { src: '', alt: '', maxHeight: 500, rounded: true }
    case 'two-column': return { html: '<h2>Two Column Section</h2><p>Text goes on one side.</p>', imageSrc: '', imageAlt: '', reverse: false }
    case 'visual-break': return { src: '', alt: '', height: 400 }
    case 'cta-box': return { variant: 'info', heading: 'Heads up', text: 'Your message goes here.', buttonText: '', buttonHref: '' }
    case 'feature-grid': return { title: '', columns: 3, items: [{ title: 'Feature one', description: 'Description here' }] }
  }
}

export default function HomepageAdminPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { showConfirm, showAlert } = useModal()

  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)

  // Hero text (title, subtitle, eyebrow) stored as site_settings rows
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroEyebrow, setHeroEyebrow] = useState('')
  const [heroOriginal, setHeroOriginal] = useState({ title: '', subtitle: '', eyebrow: '' })
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroSavedAt, setHeroSavedAt] = useState<number | null>(null)

  useEffect(() => { load(); loadHero() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/homepage-blocks')
      const json = await res.json()
      setBlocks(json.blocks || [])
    } catch (e: any) {
      showAlert('Load failed', e.message, 'warning')
    } finally {
      setLoading(false)
    }
  }

  async function loadHero() {
    try {
      const res = await fetch('/api/admin/site-settings')
      const json = await res.json()
      const rows = json.settings || []
      const title = rows.find((s: any) => s.key === 'hero_title')?.value ?? ''
      const subtitle = rows.find((s: any) => s.key === 'hero_subtitle')?.value ?? ''
      const eyebrow = rows.find((s: any) => s.key === 'hero_eyebrow')?.value ?? ''
      setHeroTitle(title); setHeroSubtitle(subtitle); setHeroEyebrow(eyebrow)
      setHeroOriginal({ title, subtitle, eyebrow })
    } catch (e: any) {
      // Fail silently — if site_settings isn't reachable the hero card shows
      // empty fields; the homepage still works because app/page.tsx falls back
      // to the original hardcoded strings when the settings are missing.
      console.error('[admin/homepage] hero load failed:', e)
    }
  }

  async function saveHero() {
    setHeroSaving(true)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [
            { key: 'hero_title', value: heroTitle },
            { key: 'hero_subtitle', value: heroSubtitle },
            { key: 'hero_eyebrow', value: heroEyebrow },
          ],
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || json.errors?.[0]?.error || 'Save failed')
      }
      setHeroOriginal({ title: heroTitle, subtitle: heroSubtitle, eyebrow: heroEyebrow })
      setHeroSavedAt(Date.now())
      setTimeout(() => setHeroSavedAt(null), 3000)
    } catch (e: any) {
      showAlert('Hero save failed', e.message, 'warning')
    } finally {
      setHeroSaving(false)
    }
  }

  async function addBlock(type: BlockType) {
    setShowAdd(false)
    try {
      const res = await fetch('/api/admin/homepage-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block_type: type, data: defaultData(type), visible: true }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load()
      setEditingBlock(json.block)
    } catch (e: any) {
      showAlert('Add failed', e.message, 'warning')
    }
  }

  async function updateBlock(updated: Block) {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/homepage-blocks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updated.id, data: updated.data, visible: updated.visible, block_type: updated.block_type }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setEditingBlock(null)
      await load()
    } catch (e: any) {
      showAlert('Save failed', e.message, 'warning')
    } finally {
      setSaving(false)
    }
  }

  async function deleteBlock(id: string) {
    const ok = await showConfirm('Delete block?', 'This cannot be undone.', 'danger')
    if (!ok) return
    try {
      const res = await fetch('/api/admin/homepage-blocks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      await load()
    } catch (e: any) {
      showAlert('Delete failed', e.message, 'warning')
    }
  }

  async function toggleVisible(block: Block) {
    await updateBlock({ ...block, visible: !block.visible })
  }

  /**
   * Wipe existing blocks and insert the seed set that mirrors the current
   * hardcoded homepage. Called from the empty state OR via "Reset to default"
   * when blocks already exist (double-confirm first).
   */
  async function importCurrentContent(replace: boolean) {
    if (replace && blocks.length > 0) {
      const ok = await showConfirm(
        'Replace all blocks?',
        `This will DELETE all ${blocks.length} existing block(s) and replace them with the default homepage content. Cannot be undone.`,
        'danger'
      )
      if (!ok) return
    }
    setImporting(true)
    try {
      const res = await fetch('/api/admin/homepage-blocks/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: replace ? 'replace' : 'append' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await load()
      showAlert('Imported', `Added ${json.inserted} editable blocks from the default homepage. Edit or rearrange them from here.`, 'success')
    } catch (e: any) {
      showAlert('Import failed', e.message, 'warning')
    } finally {
      setImporting(false)
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const newList = [...blocks]
    const target = index + dir
    if (target < 0 || target >= newList.length) return
    ;[newList[index], newList[target]] = [newList[target], newList[index]]
    setBlocks(newList)
    try {
      await fetch('/api/admin/homepage-blocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newList.map(b => b.id) }),
      })
    } catch (e: any) {
      showAlert('Reorder failed', e.message, 'warning')
      await load()
    }
  }

  const textPrimary = dark ? '#fff' : '#0f172a'
  const textMuted = dark ? '#94a3b8' : '#64748b'
  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: textPrimary }}>
            <Home className="w-7 h-7 text-emerald-400" /> Homepage Content
          </h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>
            Everything between the upload widget and the reviews section. Blocks render in order, top to bottom.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {blocks.length > 0 && (
            <button
              onClick={() => importCurrentContent(true)}
              disabled={importing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition disabled:opacity-50"
              style={{ background: cardBg, borderColor: cardBorder, color: textPrimary }}
              title="Wipe all blocks and restore the default homepage content"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Reset to default
            </button>
          )}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition"
            style={{ background: cardBg, borderColor: cardBorder, color: textPrimary }}
          >
            <Eye className="w-4 h-4" /> Preview live
          </Link>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="mb-6 p-4 rounded-xl text-sm flex items-start gap-3"
        style={{
          background: dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)',
          color: textMuted,
        }}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
        <div>
          <p className="mb-1" style={{ color: textPrimary, fontWeight: 500 }}>
            Block-based homepage editor
          </p>
          <p>
            The upload widget (top) and reviews section (bottom) stay fixed — you cannot edit those. Everything else is editable here.
            If you add zero blocks, the site falls back to the original hardcoded homepage content.
          </p>
        </div>
      </div>

      {/* ── Hero text (above the upload widget) ─────────────────────── */}
      <div
        className="mb-6 p-5 sm:p-6 rounded-2xl border"
        style={{ background: cardBg, borderColor: cardBorder }}
      >
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: textPrimary }}>
              <Sparkles className="w-5 h-5 text-emerald-400" /> Hero Section
            </h2>
            <p className="text-xs mt-1" style={{ color: textMuted }}>
              The big H1 title + paragraph at the very top of the homepage (above the upload widget).
            </p>
          </div>
          <button
            onClick={saveHero}
            disabled={
              heroSaving ||
              (heroTitle === heroOriginal.title &&
                heroSubtitle === heroOriginal.subtitle &&
                heroEyebrow === heroOriginal.eyebrow)
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {heroSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : heroSavedAt ? (
              <><Check className="w-4 h-4" /> Saved</>
            ) : (
              <><Save className="w-4 h-4" /> Save hero text</>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: textMuted }}>
              Eyebrow badge (small pill above H1)
            </label>
            <input
              value={heroEyebrow}
              onChange={e => setHeroEyebrow(e.target.value)}
              placeholder="AI-POWERED · 10,000+ SPECIES · 3 FREE SCANS"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
              style={{ background: dark ? '#0f172a' : '#f1f5f9', borderColor: dark ? '#1e293b' : '#d1d5db', color: textPrimary }}
            />
            <p className="text-[10px] mt-1" style={{ color: textMuted }}>
              Tip: use · (middle dot) to separate items. Leave empty to hide the badge.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: textMuted }}>
              Title (H1)
            </label>
            <textarea
              value={heroTitle}
              onChange={e => setHeroTitle(e.target.value)}
              rows={2}
              placeholder="Mushroom Identifier - Free Mushroom Identification App by Picture"
              className="w-full px-3 py-2 rounded-lg text-base font-semibold outline-none border resize-y"
              style={{ background: dark ? '#0f172a' : '#f1f5f9', borderColor: dark ? '#1e293b' : '#d1d5db', color: textPrimary }}
            />
            <p className="text-[10px] mt-1" style={{ color: textMuted }}>
              {heroTitle.length} chars — ideal: under 80 chars for best SEO + LCP.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: textMuted }}>
              Subtitle (paragraph under H1)
            </label>
            <textarea
              value={heroSubtitle}
              onChange={e => setHeroSubtitle(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border resize-y leading-relaxed"
              style={{ background: dark ? '#0f172a' : '#f1f5f9', borderColor: dark ? '#1e293b' : '#d1d5db', color: textPrimary }}
            />
            <p className="text-[10px] mt-1" style={{ color: textMuted }}>
              {heroSubtitle.length} chars — 1-3 sentences is typical.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: textMuted }}>
        Content blocks (between upload widget and reviews)
      </h2>

      {/* Blocks list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : blocks.length === 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Primary recommended action: import current homepage */}
          <div
            className="relative p-8 rounded-2xl border-2 overflow-hidden"
            style={{
              background: dark
                ? 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
              borderColor: 'rgba(16,185,129,0.4)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full">
                Recommended
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>
              Import current homepage
            </h3>
            <p className="text-sm mb-6" style={{ color: textMuted }}>
              Load the current homepage content as ~35 editable blocks. You'll see every heading, paragraph, image,
              comparison table, CTA, and FAQ — all editable individually. This is the fastest way to get started.
            </p>
            <button
              onClick={() => importCurrentContent(false)}
              disabled={importing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Import current content
                </>
              )}
            </button>
          </div>

          {/* Secondary: start from scratch */}
          <div
            className="p-8 rounded-2xl border-2 border-dashed"
            style={{ borderColor: cardBorder }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: dark ? '#1e293b' : '#f1f5f9', color: textMuted }}>
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>
              Start from scratch
            </h3>
            <p className="text-sm mb-6" style={{ color: textMuted }}>
              Build your homepage block by block. Good if you want a completely different layout than what's currently live.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition hover:border-emerald-400"
              style={{ background: cardBg, borderColor: cardBorder, color: textPrimary }}
            >
              <Plus className="w-4 h-4" /> Add your first block
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, i) => {
            const typeInfo = BLOCK_TYPES.find(t => t.type === block.block_type)
            const Icon = typeInfo?.icon || Type
            return (
              <div
                key={block.id}
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                  opacity: block.visible ? 1 : 0.5,
                }}
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1 rounded hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: textMuted }}
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === blocks.length - 1}
                    className="p-1 rounded hover:bg-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: textMuted }}
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    color: '#10b981',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: textPrimary }}>
                    {typeInfo?.label || block.block_type}
                  </p>
                  <p className="text-xs truncate" style={{ color: textMuted }}>
                    {blockPreview(block)}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleVisible(block)}
                    className="p-2 rounded-lg hover:bg-emerald-500/10 transition"
                    style={{ color: block.visible ? '#10b981' : textMuted }}
                    title={block.visible ? 'Hide from homepage' : 'Show on homepage'}
                  >
                    {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingBlock(block)}
                    className="p-2 rounded-lg hover:bg-emerald-500/10 transition"
                    style={{ color: textMuted }}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition"
                    style={{ color: '#ef4444' }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add block modal */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="Add a new block" dark={dark}>
          <div className="grid sm:grid-cols-2 gap-3">
            {BLOCK_TYPES.map(({ type, label, icon: Icon, description }) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="text-left p-4 rounded-xl border hover:border-emerald-400 hover:bg-emerald-500/5 transition"
                style={{ background: dark ? '#0f172a' : '#f8fafc', borderColor: cardBorder }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: textPrimary }}>{label}</p>
                </div>
                <p className="text-xs" style={{ color: textMuted }}>{description}</p>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {editingBlock && (
        <Modal
          onClose={() => setEditingBlock(null)}
          title={`Edit ${BLOCK_TYPES.find(t => t.type === editingBlock.block_type)?.label || 'block'}`}
          dark={dark}
          wide
        >
          <BlockEditor
            block={editingBlock}
            onChange={setEditingBlock}
            onSave={() => updateBlock(editingBlock)}
            saving={saving}
            dark={dark}
          />
        </Modal>
      )}
    </div>
  )
}

/* ─── helpers ───────────────────────────────────────────────────────── */
function blockPreview(block: Block): string {
  const { block_type, data } = block
  switch (block_type) {
    case 'heading': return data.title || '(empty heading)'
    case 'rich-text': {
      const text = (data.html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      return text.slice(0, 90) + (text.length > 90 ? '…' : '')
    }
    case 'image': return data.src || '(no image)'
    case 'two-column': return data.imageSrc ? `Text + image (${data.imageSrc})` : '(text only)'
    case 'visual-break': return data.src || '(no image)'
    case 'cta-box': return `${data.variant}: ${data.heading || data.text || ''}`.slice(0, 90)
    case 'feature-grid': return `${(data.items || []).length} items · ${data.columns || 3} columns`
    default: return ''
  }
}

/* ─── Modal shell ───────────────────────────────────────────────────── */
function Modal({
  children, title, onClose, dark, wide = false,
}: { children: React.ReactNode; title: string; onClose: () => void; dark: boolean; wide?: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className={`${wide ? 'max-w-4xl' : 'max-w-2xl'} w-full max-h-[90vh] overflow-auto rounded-2xl border shadow-2xl`}
        style={{ background: dark ? '#0c1120' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 border-b"
          style={{ background: dark ? '#0c1120' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0' }}
        >
          <h2 className="text-lg font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/10"
            style={{ color: dark ? '#94a3b8' : '#64748b' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/* ─── Block editor ──────────────────────────────────────────────────── */
function BlockEditor({
  block, onChange, onSave, saving, dark,
}: {
  block: Block
  onChange: (b: Block) => void
  onSave: () => void
  saving: boolean
  dark: boolean
}) {
  const textPrimary = dark ? '#fff' : '#0f172a'
  const textMuted = dark ? '#94a3b8' : '#64748b'
  const inputBg = dark ? '#0f172a' : '#f1f5f9'
  const inputBorder = dark ? '#1e293b' : '#d1d5db'
  const inputCls = 'w-full px-3 py-2 rounded-lg text-sm outline-none border'
  const inputStyle = { background: inputBg, borderColor: inputBorder, color: textPrimary }
  const labelCls = 'block text-xs font-semibold mb-1.5 uppercase tracking-wide'
  const labelStyle = { color: textMuted }

  function set(key: string, value: any) {
    onChange({ ...block, data: { ...block.data, [key]: value } })
  }

  return (
    <div className="space-y-4">
      {block.block_type === 'heading' && (
        <>
          <div>
            <label className={labelCls} style={labelStyle}>Eyebrow (optional small uppercase label)</label>
            <input value={block.data.eyebrow || ''} onChange={e => set('eyebrow', e.target.value)} className={inputCls} style={inputStyle} placeholder="FEATURES" />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Title</label>
            <input value={block.data.title || ''} onChange={e => set('title', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Subtitle (optional)</label>
            <textarea value={block.data.subtitle || ''} onChange={e => set('subtitle', e.target.value)} rows={2} className={inputCls} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Level</label>
              <select value={block.data.level || 'h2'} onChange={e => set('level', e.target.value)} className={inputCls} style={inputStyle}>
                <option value="h2">H2 (large)</option>
                <option value="h3">H3 (medium)</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Alignment</label>
              <select value={block.data.align || 'center'} onChange={e => set('align', e.target.value)} className={inputCls} style={inputStyle}>
                <option value="center">Center</option>
                <option value="left">Left</option>
              </select>
            </div>
          </div>
        </>
      )}

      {block.block_type === 'rich-text' && (
        <div>
          <label className={labelCls} style={labelStyle}>Content</label>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: inputBorder }}>
            <RichEditor value={block.data.html || ''} onChange={(html) => set('html', html)} />
          </div>
        </div>
      )}

      {block.block_type === 'image' && (
        <>
          <ImagePicker label="Image" value={block.data.src || ''} onChange={v => set('src', v)} dark={dark} />
          <div>
            <label className={labelCls} style={labelStyle}>Alt text (important for SEO + accessibility)</label>
            <input value={block.data.alt || ''} onChange={e => set('alt', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Caption (optional, under image)</label>
            <input value={block.data.caption || ''} onChange={e => set('caption', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Credit (optional, overlay on image)</label>
            <input value={block.data.credit || ''} onChange={e => set('credit', e.target.value)} className={inputCls} style={inputStyle} placeholder="Photo by Name · Source" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Max height (px)</label>
              <input type="number" value={block.data.maxHeight || 500} onChange={e => set('maxHeight', Number(e.target.value))} className={inputCls} style={inputStyle} />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm" style={{ color: textPrimary }}>
                <input type="checkbox" checked={block.data.rounded !== false} onChange={e => set('rounded', e.target.checked)} />
                Rounded corners
              </label>
            </div>
          </div>
        </>
      )}

      {block.block_type === 'two-column' && (
        <>
          <div>
            <label className={labelCls} style={labelStyle}>Text (left column)</label>
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: inputBorder }}>
              <RichEditor value={block.data.html || ''} onChange={(html) => set('html', html)} />
            </div>
          </div>
          <ImagePicker label="Image (right column)" value={block.data.imageSrc || ''} onChange={v => set('imageSrc', v)} dark={dark} />
          <div>
            <label className={labelCls} style={labelStyle}>Image alt text</label>
            <input value={block.data.imageAlt || ''} onChange={e => set('imageAlt', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Image caption (optional)</label>
            <input value={block.data.imageCaption || ''} onChange={e => set('imageCaption', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <label className="inline-flex items-center gap-2 text-sm" style={{ color: textPrimary }}>
            <input type="checkbox" checked={!!block.data.reverse} onChange={e => set('reverse', e.target.checked)} />
            Swap: put image on the left instead
          </label>
        </>
      )}

      {block.block_type === 'visual-break' && (
        <>
          <ImagePicker label="Image" value={block.data.src || ''} onChange={v => set('src', v)} dark={dark} />
          <div>
            <label className={labelCls} style={labelStyle}>Alt text</label>
            <input value={block.data.alt || ''} onChange={e => set('alt', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Credit (optional, overlay)</label>
            <input value={block.data.credit || ''} onChange={e => set('credit', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Max height (px)</label>
            <input type="number" value={block.data.height || 400} onChange={e => set('height', Number(e.target.value))} className={inputCls} style={inputStyle} />
          </div>
        </>
      )}

      {block.block_type === 'cta-box' && (
        <>
          <div>
            <label className={labelCls} style={labelStyle}>Style</label>
            <select value={block.data.variant || 'info'} onChange={e => set('variant', e.target.value)} className={inputCls} style={inputStyle}>
              <option value="info">Info (blue)</option>
              <option value="success">Success (green)</option>
              <option value="warning">Warning (yellow)</option>
              <option value="danger">Danger (red)</option>
              <option value="accent">Accent (emerald)</option>
            </select>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Heading</label>
            <input value={block.data.heading || ''} onChange={e => set('heading', e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Text</label>
            <textarea value={block.data.text || ''} onChange={e => set('text', e.target.value)} rows={4} className={inputCls} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Button text (optional)</label>
              <input value={block.data.buttonText || ''} onChange={e => set('buttonText', e.target.value)} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Button link</label>
              <input value={block.data.buttonHref || ''} onChange={e => set('buttonHref', e.target.value)} className={inputCls} style={inputStyle} placeholder="/pricing" />
            </div>
          </div>
        </>
      )}

      {block.block_type === 'feature-grid' && (
        <FeatureGridEditor data={block.data} onChange={(d) => onChange({ ...block, data: d })} dark={dark} />
      )}

      {/* Save */}
      <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: inputBorder }}>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>
    </div>
  )
}

/* ─── Image picker (upload + URL) ──────────────────────────────────── */
function ImagePicker({ label, value, onChange, dark }: { label: string; value: string; onChange: (v: string) => void; dark: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const textPrimary = dark ? '#fff' : '#0f172a'
  const textMuted = dark ? '#94a3b8' : '#64748b'
  const inputBg = dark ? '#0f172a' : '#f1f5f9'
  const inputBorder = dark ? '#1e293b' : '#d1d5db'

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      onChange(json.url)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: textMuted }}>{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/my-image.webp or paste URL"
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none border"
          style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border hover:border-emerald-400 transition"
          style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Upload
        </button>
      </div>
      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border" style={{ borderColor: inputBorder, maxHeight: 180 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-auto" style={{ maxHeight: 180, objectFit: 'cover' }} />
        </div>
      )}
    </div>
  )
}

/* ─── Feature-grid editor (item list) ──────────────────────────────── */
function FeatureGridEditor({ data, onChange, dark }: { data: any; onChange: (d: any) => void; dark: boolean }) {
  const items = Array.isArray(data.items) ? data.items : []
  const textPrimary = dark ? '#fff' : '#0f172a'
  const textMuted = dark ? '#94a3b8' : '#64748b'
  const inputBg = dark ? '#0f172a' : '#f1f5f9'
  const inputBorder = dark ? '#1e293b' : '#d1d5db'
  const inputCls = 'w-full px-3 py-2 rounded-lg text-sm outline-none border'
  const inputStyle = { background: inputBg, borderColor: inputBorder, color: textPrimary }
  const labelCls = 'block text-xs font-semibold mb-1.5 uppercase tracking-wide'
  const labelStyle = { color: textMuted }

  function setItems(next: any[]) { onChange({ ...data, items: next }) }
  function updateItem(i: number, patch: any) {
    const next = [...items]; next[i] = { ...next[i], ...patch }; setItems(next)
  }
  function addItem() { setItems([...items, { title: 'New feature', description: '' }]) }
  function removeItem(i: number) { setItems(items.filter((_: any, j: number) => j !== i)) }
  function moveItem(i: number, dir: -1 | 1) {
    const next = [...items]; const t = i + dir
    if (t < 0 || t >= next.length) return
    ;[next[i], next[t]] = [next[t], next[i]]; setItems(next)
  }

  return (
    <>
      <div>
        <label className={labelCls} style={labelStyle}>Grid title (optional)</label>
        <input value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className={labelCls} style={labelStyle}>Columns</label>
        <select value={data.columns || 3} onChange={e => onChange({ ...data, columns: Number(e.target.value) })} className={inputCls} style={inputStyle}>
          <option value={2}>2 columns</option>
          <option value={3}>3 columns</option>
          <option value={4}>4 columns</option>
        </select>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={labelCls} style={labelStyle}>Feature cards</label>
          <button
            onClick={addItem}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
          >
            <Plus className="w-3 h-3" /> Add card
          </button>
        </div>
        {items.map((item: any, i: number) => (
          <div key={i} className="p-3 rounded-lg border space-y-2" style={{ borderColor: inputBorder, background: dark ? '#0c1120' : '#f8fafc' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: textPrimary }}>Card {i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-emerald-500/10 disabled:opacity-30" style={{ color: textMuted }}><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="p-1 rounded hover:bg-emerald-500/10 disabled:opacity-30" style={{ color: textMuted }}><ArrowDown className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-500/10 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <input placeholder="Title" value={item.title || ''} onChange={e => updateItem(i, { title: e.target.value })} className={inputCls} style={inputStyle} />
            <textarea placeholder="Description" value={item.description || ''} onChange={e => updateItem(i, { description: e.target.value })} rows={2} className={inputCls} style={inputStyle} />
            <ImagePicker label="Image (optional)" value={item.image || ''} onChange={v => updateItem(i, { image: v })} dark={dark} />
          </div>
        ))}
      </div>
    </>
  )
}
