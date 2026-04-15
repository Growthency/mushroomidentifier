'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Droplet, Save, Check, Loader2, AlertCircle, Sun, Moon,
  Sparkles, RotateCcw, Palette, Wand2,
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

type Mode = 'dark' | 'light'

interface ThemeValues {
  accent: string
  btn: string
  bg: string
}

const EMPTY: ThemeValues = { accent: '', btn: '', bg: '' }

// Default values pulled from globals.css so admin can see what the stock theme looks like
const DEFAULTS: Record<Mode, ThemeValues> = {
  dark: {
    accent: '#6fcf7f',
    btn:    '#237a35',
    bg:     'linear-gradient(145deg, #0b1912 0%, #0d1623 43%, #190e28 73%, #0b1912 100%)',
  },
  light: {
    accent: '#156b28',
    btn:    '#156b28',
    bg:     'linear-gradient(145deg, #eaf8f2 0%, #e3ecf8 42%, #f2e9f9 73%, #f8f0e5 100%)',
  },
}

// Curated gradient presets (admin click = paste into bg)
const GRADIENT_PRESETS: { label: string; value: string; preview: string }[] = [
  { label: 'Forest',   value: 'linear-gradient(145deg, #0b1912 0%, #0d1623 43%, #190e28 73%, #0b1912 100%)', preview: 'linear-gradient(145deg, #0b1912, #190e28)' },
  { label: 'Ocean',    value: 'linear-gradient(145deg, #0a1628 0%, #0d2340 43%, #0e1b36 73%, #091223 100%)', preview: 'linear-gradient(145deg, #0a1628, #0e1b36)' },
  { label: 'Sunset',   value: 'linear-gradient(145deg, #2a0f1e 0%, #3d1020 43%, #4a1428 73%, #2a0f1e 100%)', preview: 'linear-gradient(145deg, #2a0f1e, #4a1428)' },
  { label: 'Violet',   value: 'linear-gradient(145deg, #15082b 0%, #26094a 43%, #3a0d5e 73%, #15082b 100%)', preview: 'linear-gradient(145deg, #15082b, #3a0d5e)' },
  { label: 'Graphite', value: 'linear-gradient(145deg, #0a0a0d 0%, #13131a 43%, #1a1a24 73%, #0a0a0d 100%)', preview: 'linear-gradient(145deg, #0a0a0d, #1a1a24)' },
  { label: 'Mint',     value: 'linear-gradient(145deg, #eaf8f2 0%, #d4f0e3 43%, #c2e8d8 73%, #eaf8f2 100%)', preview: 'linear-gradient(145deg, #eaf8f2, #c2e8d8)' },
  { label: 'Pearl',    value: 'linear-gradient(145deg, #f8f9fc 0%, #eef1f8 43%, #e4e9f4 73%, #f8f9fc 100%)', preview: 'linear-gradient(145deg, #f8f9fc, #e4e9f4)' },
  { label: 'Cream',    value: 'linear-gradient(145deg, #fdf7ec 0%, #fbeed5 43%, #fae6c2 73%, #fdf7ec 100%)', preview: 'linear-gradient(145deg, #fdf7ec, #fae6c2)' },
]

const ACCENT_PRESETS = [
  '#10b981', '#6fcf7f', '#22c55e', '#14b8a6',       // greens/teals
  '#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6',       // blues/purples
  '#f59e0b', '#f97316', '#ef4444', '#ec4899',       // warm
  '#156b28', '#0f766e', '#1e40af', '#7c3aed',       // deeper
]

export default function ThemePage() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [mode, setMode] = useState<Mode>(dark ? 'dark' : 'light')
  const [values, setValues] = useState<Record<Mode, ThemeValues>>({ dark: { ...EMPTY }, light: { ...EMPTY } })
  const [original, setOriginal] = useState<Record<Mode, ThemeValues>>({ dark: { ...EMPTY }, light: { ...EMPTY } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const current = values[mode]
  const fallback = DEFAULTS[mode]
  const effective: ThemeValues = {
    accent: current.accent || fallback.accent,
    btn:    current.btn    || fallback.btn,
    bg:     current.bg     || fallback.bg,
  }

  const dirty = useMemo(() => {
    return (['dark', 'light'] as Mode[]).some((m) =>
      (['accent', 'btn', 'bg'] as (keyof ThemeValues)[]).some((k) => values[m][k] !== original[m][k])
    )
  }, [values, original])

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/site-settings')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      const map: Record<string, string> = {}
      for (const row of json.settings || []) map[row.key] = row.value ?? ''

      const next: Record<Mode, ThemeValues> = {
        dark: {
          accent: map.theme_accent_dark  || '',
          btn:    map.theme_btn_dark     || '',
          bg:     map.theme_bg_dark      || '',
        },
        light: {
          accent: map.theme_accent_light || '',
          btn:    map.theme_btn_light    || '',
          bg:     map.theme_bg_light     || '',
        },
      }
      setValues(next)
      setOriginal(JSON.parse(JSON.stringify(next)))
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function save() {
    setSaving(true); setError(null)
    try {
      const updates = [
        { key: 'theme_accent_dark',  value: values.dark.accent },
        { key: 'theme_btn_dark',     value: values.dark.btn },
        { key: 'theme_bg_dark',      value: values.dark.bg },
        { key: 'theme_accent_light', value: values.light.accent },
        { key: 'theme_btn_light',    value: values.light.btn },
        { key: 'theme_bg_light',     value: values.light.bg },
      ]
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save')
      }
      setOriginal(JSON.parse(JSON.stringify(values)))
      setSavedAt(Date.now())
      setTimeout(() => setSavedAt(null), 3000)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  function update(field: keyof ThemeValues, v: string) {
    setValues((prev) => ({ ...prev, [mode]: { ...prev[mode], [field]: v } }))
  }

  function resetAll() {
    if (!confirm('Reset all theme colors to defaults? This clears every custom value for both light and dark mode. You still need to hit Save after.')) return
    setValues({ dark: { ...EMPTY }, light: { ...EMPTY } })
  }

  function resetField(field: keyof ThemeValues) {
    update(field, '')
  }

  // ─────────────────────────────────────────────────────────── UI helpers ─────
  const cardBg = dark ? '#0c1120' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const textPrimary = dark ? '#fff' : '#0f172a'
  const textMuted = dark ? '#94a3b8' : '#64748b'
  const textLabel = dark ? '#cbd5e1' : '#334155'
  const subtleBg = dark ? '#0a0f1c' : '#f8fafc'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))' }}>
              <Droplet className="w-5 h-5 text-pink-400" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: textPrimary }}>Theme Colors</h1>
          </div>
          <p className="max-w-2xl" style={{ color: textMuted }}>
            Customize accent, button, and page-background colors for <strong style={{ color: textPrimary }}>Dark</strong> and{' '}
            <strong style={{ color: textPrimary }}>Light</strong> mode. Accepts any CSS color (hex, rgb, hsl) or full{' '}
            <code className="text-[12px] px-1.5 py-0.5 rounded" style={{ background: subtleBg, color: textLabel }}>linear-gradient(...)</code>{' '}
            for backgrounds. Empty = use default.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            disabled={saving}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all disabled:opacity-40"
            style={{
              background: dark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)'}`,
            }}
          >
            <RotateCcw className="w-4 h-4" /> Reset all
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: dirty ? 'linear-gradient(135deg, #10b981, #059669)' : (dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'),
              color: dirty ? '#fff' : textMuted,
              boxShadow: dirty ? '0 4px 14px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            {saving ? (<><Loader2 className="w-4 h-4 animate-spin" />Saving…</>) :
             savedAt ? (<><Check className="w-4 h-4" />Saved</>) :
             (<><Save className="w-4 h-4" />Save colors</>)}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg border"
             style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="text-[13px]">{error}</div>
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6 border-b pb-3" style={{ borderColor: cardBorder }}>
        {(['dark', 'light'] as Mode[]).map((m) => {
          const active = mode === m
          const Icon = m === 'dark' ? Moon : Sun
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? (dark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)') : 'transparent',
                color: active ? '#a78bfa' : textMuted,
                border: active ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
              }}
            >
              <Icon className="w-4 h-4" />
              {m === 'dark' ? 'Dark mode' : 'Light mode'}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* Left column — editors */}
        <div className="space-y-4">
          {/* Accent color */}
          <ColorCard
            label="Accent color"
            hint="Links, highlights, active-state borders, and brand emphasis."
            value={current.accent}
            effectiveValue={effective.accent}
            defaultValue={fallback.accent}
            onChange={(v) => update('accent', v)}
            onReset={() => resetField('accent')}
            presets={ACCENT_PRESETS}
            cardBg={cardBg}
            cardBorder={cardBorder}
            textPrimary={textPrimary}
            textMuted={textMuted}
            textLabel={textLabel}
            subtleBg={subtleBg}
            dark={dark}
          />

          {/* Button color */}
          <ColorCard
            label="Primary button color"
            hint="Fill color of the main CTA buttons."
            value={current.btn}
            effectiveValue={effective.btn}
            defaultValue={fallback.btn}
            onChange={(v) => update('btn', v)}
            onReset={() => resetField('btn')}
            presets={ACCENT_PRESETS}
            cardBg={cardBg}
            cardBorder={cardBorder}
            textPrimary={textPrimary}
            textMuted={textMuted}
            textLabel={textLabel}
            subtleBg={subtleBg}
            dark={dark}
          />

          {/* Background — supports gradient */}
          <div className="rounded-xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-semibold" style={{ color: textPrimary }}>Page background</h3>
                </div>
                <p className="text-[12px]" style={{ color: textMuted }}>
                  Solid color OR gradient. Examples: <code className="text-[11px] px-1 rounded" style={{ background: subtleBg }}>#0b1912</code>{' '}
                  or <code className="text-[11px] px-1 rounded" style={{ background: subtleBg }}>linear-gradient(...)</code>.
                </p>
              </div>
              {current.bg && (
                <button
                  onClick={() => resetField('bg')}
                  className="text-[11px] px-2 py-1 rounded transition-colors shrink-0"
                  style={{ color: textMuted, background: subtleBg }}
                >
                  Reset
                </button>
              )}
            </div>

            <textarea
              value={current.bg}
              onChange={(e) => update('bg', e.target.value)}
              placeholder={`${fallback.bg}\n\n(leave empty to use default)`}
              rows={4}
              spellCheck={false}
              className="w-full px-3 py-2 rounded-lg text-[12px] outline-none resize-y font-mono mb-3"
              style={{
                background: subtleBg,
                color: textPrimary,
                border: `1px solid ${cardBorder}`,
                tabSize: 2,
              }}
            />

            {/* Gradient presets */}
            <div>
              <p className="text-[11px] mb-2 flex items-center gap-1.5" style={{ color: textMuted }}>
                <Wand2 className="w-3 h-3" /> Quick presets
              </p>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => update('bg', p.value)}
                    className="group relative h-14 rounded-lg overflow-hidden border transition-all hover:scale-[1.02]"
                    style={{
                      background: p.preview,
                      borderColor: current.bg === p.value ? '#a78bfa' : cardBorder,
                      boxShadow: current.bg === p.value ? '0 0 0 2px rgba(167,139,250,0.3)' : 'none',
                    }}
                    title={p.label}
                  >
                    <span className="absolute bottom-1 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column — live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder }}>
            <div className="px-4 py-2.5 border-b flex items-center gap-2"
                 style={{ borderColor: cardBorder, background: subtleBg }}>
              <Palette className="w-3.5 h-3.5" style={{ color: textMuted }} />
              <span className="text-[12px] font-medium" style={{ color: textMuted }}>
                Live preview ({mode})
              </span>
            </div>

            {/* Rendered preview — uses inline bg so admin sees exactly the chosen color/gradient */}
            <div
              className="p-6"
              style={{ background: effective.bg, minHeight: 360 }}
            >
              <div
                className="rounded-2xl p-5 shadow-2xl"
                style={{
                  background: mode === 'dark' ? 'rgba(14, 28, 18, 0.85)' : 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(111,207,127,0.18)' : 'rgba(20,100,38,0.15)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: effective.btn }}
                  >
                    M
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: mode === 'dark' ? '#edf7ef' : '#081a0c' }}>
                      Mushroom Identifier
                    </h4>
                    <p className="text-[11px]" style={{ color: mode === 'dark' ? 'rgba(237,247,239,0.68)' : 'rgba(8,26,12,0.65)' }}>
                      Free AI fungi identification
                    </p>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed mb-4"
                   style={{ color: mode === 'dark' ? 'rgba(237,247,239,0.78)' : 'rgba(8,26,12,0.78)' }}>
                  Is it safe to eat? Upload a photo and get an instant{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold underline"
                     style={{ color: effective.accent }}>
                    species identification
                  </a>{' '}
                  with toxicity warnings.
                </p>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
                  style={{ background: effective.btn, boxShadow: `0 4px 14px ${effective.btn}40` }}
                >
                  Try Free — No Signup
                </button>
                <div className="flex items-center justify-center gap-2 mt-3 text-[11px]"
                     style={{ color: mode === 'dark' ? 'rgba(237,247,239,0.50)' : 'rgba(8,26,12,0.50)' }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: effective.accent }} />
                  Trusted by 10,000+ foragers
                  <span className="w-1 h-1 rounded-full" style={{ background: effective.accent }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] mt-3" style={{ color: textMuted }}>
            Preview uses your current values, falling back to defaults for empty fields. Changes go live on the real site after you hit Save &mdash; cached for 60s.
          </p>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────── sub-component ─
function ColorCard(props: {
  label: string
  hint: string
  value: string
  effectiveValue: string
  defaultValue: string
  onChange: (v: string) => void
  onReset: () => void
  presets: string[]
  cardBg: string
  cardBorder: string
  textPrimary: string
  textMuted: string
  textLabel: string
  subtleBg: string
  dark: boolean
}) {
  const {
    label, hint, value, effectiveValue, defaultValue,
    onChange, onReset, presets,
    cardBg, cardBorder, textPrimary, textMuted, textLabel, subtleBg, dark,
  } = props

  // Only hex colors can go in <input type="color">, so guard it
  const isHex = /^#[0-9a-fA-F]{6}$/.test(effectiveValue)

  return (
    <div className="rounded-xl border p-5" style={{ background: cardBg, borderColor: cardBorder }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-4 h-4 rounded border shrink-0"
              style={{ background: effectiveValue, borderColor: cardBorder }}
            />
            <h3 className="text-sm font-semibold" style={{ color: textPrimary }}>{label}</h3>
          </div>
          <p className="text-[12px]" style={{ color: textMuted }}>{hint}</p>
        </div>
        {value && (
          <button
            onClick={onReset}
            className="text-[11px] px-2 py-1 rounded transition-colors shrink-0"
            style={{ color: textMuted, background: subtleBg }}
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="color"
          value={isHex ? effectiveValue : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0 shrink-0"
          title="Pick a color"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${defaultValue} (default)`}
          className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none font-mono"
          style={{
            background: subtleBg,
            color: textPrimary,
            border: `1px solid ${cardBorder}`,
          }}
        />
      </div>

      <div>
        <p className="text-[11px] mb-1.5" style={{ color: textMuted }}>Quick swatches</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((hex) => (
            <button
              key={hex}
              onClick={() => onChange(hex)}
              className="w-7 h-7 rounded-md border transition-all hover:scale-110"
              style={{
                background: hex,
                borderColor: effectiveValue === hex ? '#fff' : cardBorder,
                boxShadow: effectiveValue === hex ? `0 0 0 2px ${hex}` : 'none',
              }}
              title={hex}
              aria-label={`Use ${hex}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
