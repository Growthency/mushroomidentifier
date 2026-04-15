'use client'

import { useState, useEffect, useRef } from 'react'
import { Paintbrush, Save, Check, Loader2, AlertCircle, Info, Eraser } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

/**
 * Global Custom CSS admin page — WordPress "Additional CSS" style.
 *
 * Rules added here are injected into every page's <head> via app/layout.tsx,
 * loaded AFTER global stylesheets so source-order specificity lets them win
 * over default styles. Use `!important` for cases that also lose to inline
 * styles on specific components.
 */
export default function CustomCssPage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [css, setCss] = useState('')
  const [originalCss, setOriginalCss] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { load() }, [])
  useEffect(() => { setCharCount(css.length) }, [css])

  async function load() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/site-settings')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      const row = (json.settings || []).find((s: any) => s.key === 'global_custom_css')
      const value = row?.value ?? ''
      setCss(value)
      setOriginalCss(value)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function save() {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: [{ key: 'global_custom_css', value: css }] }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save')
      }
      setOriginalCss(css)
      setSavedAt(Date.now())
      setTimeout(() => setSavedAt(null), 3000)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  function clearAll() {
    if (!css) return
    if (!confirm('Clear all custom CSS? This will remove every rule you have added. You still need to hit Save after.')) return
    setCss('')
    taRef.current?.focus()
  }

  // Tab key inserts 2 spaces instead of jumping focus (standard code-editor UX)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const next = css.substring(0, start) + '  ' + css.substring(end)
      setCss(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2
      })
    }
    // Ctrl/Cmd+S saves without leaving editor
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      if (!saving && css !== originalCss) save()
    }
  }

  const dirty = css !== originalCss

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))' }}>
              <Paintbrush className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>
              Custom CSS
            </h1>
          </div>
          <p className="max-w-2xl" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
            Sitewide CSS injected into every page&apos;s <code className="text-[12px] px-1.5 py-0.5 rounded"
              style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: dark ? '#e2e8f0' : '#334155' }}>&lt;head&gt;</code>.
            Loads after the global stylesheet so your rules win by source order &mdash; just like WordPress &ldquo;Additional CSS&rdquo;.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            disabled={!css || saving}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: dark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)'}`,
            }}
          >
            <Eraser className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: dirty ? 'linear-gradient(135deg, #10b981, #059669)' : (dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'),
              color: dirty ? '#fff' : (dark ? '#64748b' : '#94a3b8'),
              boxShadow: dirty ? '0 4px 14px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            {saving ? (<><Loader2 className="w-4 h-4 animate-spin" />Saving…</>) :
             savedAt ? (<><Check className="w-4 h-4" />Saved</>) :
             (<><Save className="w-4 h-4" />Save CSS</>)}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg border"
             style={{
               background: 'rgba(239,68,68,0.08)',
               borderColor: 'rgba(239,68,68,0.2)',
               color: '#ef4444',
             }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="text-[13px]">{error}</div>
        </div>
      )}

      {/* Info banner */}
      <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg border"
           style={{
             background: dark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)',
             borderColor: dark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)',
           }}>
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
        <div className="text-[13px]" style={{ color: dark ? '#cbd5e1' : '#475569' }}>
          <strong style={{ color: dark ? '#fff' : '#0f172a' }}>Tip:</strong>{' '}
          Use <code className="text-[12px] px-1 rounded" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}>!important</code> when
          overriding utility classes from Tailwind. Press{' '}
          <kbd className="px-1.5 py-0.5 text-[11px] rounded border" style={{ borderColor: dark ? 'rgba(255,255,255,0.15)' : '#cbd5e1', background: dark ? 'rgba(255,255,255,0.04)' : '#fff' }}>Ctrl</kbd>
          {' + '}
          <kbd className="px-1.5 py-0.5 text-[11px] rounded border" style={{ borderColor: dark ? 'rgba(255,255,255,0.15)' : '#cbd5e1', background: dark ? 'rgba(255,255,255,0.04)' : '#fff' }}>S</kbd>
          {' '}to save. Tab inserts 2 spaces.
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border" style={{
        borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
        background: dark ? '#0a0f1c' : '#ffffff',
      }}>
        {/* Editor toolbar (filename look) */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{
          borderColor: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
          background: dark ? '#0c1120' : '#f8fafc',
        }}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
            <span className="ml-3 text-[12px] font-mono" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
              global.css {dirty && <span className="text-amber-400 ml-1">•</span>}
            </span>
          </div>
          <span className="text-[11px] font-mono" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
            {charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}
          </span>
        </div>

        {/* Textarea */}
        {loading ? (
          <div className="h-[560px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : (
          <textarea
            ref={taRef}
            value={css}
            onChange={(e) => setCss(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder={`/* Example overrides */

/* Force brand color on all primary buttons */
.btn-primary {
  background: #16a34a !important;
  border-radius: 9999px;
}

/* Hide author avatar on mobile only */
@media (max-width: 640px) {
  .post-author-avatar { display: none; }
}`}
            className="w-full block p-5 font-mono text-[13px] leading-relaxed resize-y focus:outline-none"
            style={{
              minHeight: 560,
              background: 'transparent',
              color: dark ? '#e2e8f0' : '#0f172a',
              tabSize: 2,
            }}
          />
        )}
      </div>

      {/* Footer help */}
      <div className="mt-5 text-[12px] flex flex-wrap items-center gap-x-4 gap-y-1.5" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
        <span>Changes go live after Save &mdash; no deploy required.</span>
        <span>&bull;</span>
        <span>Cached for 60s (ISR); hard refresh if you don&apos;t see updates.</span>
        <span>&bull;</span>
        <span>Per-page CSS still wins over global (loaded later in the page&apos;s &lt;head&gt;).</span>
      </div>
    </div>
  )
}
