'use client'
/**
 * Dashboard stat tile. Each data source gets its own look so the three tabs
 * read differently at a glance: Google Analytics (emerald), Search Console
 * (blue/indigo), Bing (cyan/sky). Light and dark variants.
 */
export type StatTone = 'ga' | 'gsc' | 'bing'

const TONES: Record<StatTone, { from: string; to: string; glowRgb: string; lightBg: string; darkBg: string }> = {
  ga: { from: '#10b981', to: '#0ea5a0', glowRgb: '16,185,129', lightBg: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)', darkBg: 'linear-gradient(135deg, #0f2e26 0%, #0b1f1a 100%)' },
  gsc: { from: '#3b82f6', to: '#6366f1', glowRgb: '79,110,247', lightBg: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)', darkBg: 'linear-gradient(135deg, #15203a 0%, #0f172a 100%)' },
  bing: { from: '#06b6d4', to: '#0ea5e9', glowRgb: '14,165,233', lightBg: 'linear-gradient(135deg, #ffffff 0%, #ecfeff 100%)', darkBg: 'linear-gradient(135deg, #0c2a33 0%, #0b1a24 100%)' },
}

export default function GlossyStat({ icon: Icon, label, value, hint, tone, dark }: {
  icon: any
  label: string
  value: number | string
  /** Small line under the number, e.g. "last 30 days". */
  hint?: string
  tone: StatTone
  dark: boolean
}) {
  const t = TONES[tone]
  const shown = typeof value === 'number' ? value.toLocaleString() : value
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        background: dark ? t.darkBg : t.lightBg,
        border: `1px solid rgba(${t.glowRgb},${dark ? 0.35 : 0.22})`,
        boxShadow: dark
          ? `0 10px 30px -12px rgba(${t.glowRgb},0.45), inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 10px 30px -14px rgba(${t.glowRgb},0.35), inset 0 1px 0 rgba(255,255,255,0.9)`,
      }}
    >
      {/* gloss sweep + corner glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)', opacity: dark ? 0.25 : 1 }} />
      <div className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full" style={{ background: `radial-gradient(circle, rgba(${t.glowRgb},0.35) 0%, rgba(${t.glowRgb},0) 70%)` }} />

      <div className="relative flex items-start justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#64748b' }}>{label}</span>
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})`, boxShadow: `0 6px 16px -4px rgba(${t.glowRgb},0.6)` }}
        >
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p
        className="relative text-[28px] leading-none font-extrabold tracking-tight"
        style={{
          backgroundImage: dark ? `linear-gradient(90deg, #ffffff, ${t.from})` : `linear-gradient(90deg, #0f172a, ${t.to})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {shown}
      </p>
      {hint && <p className="relative text-[11px] mt-2" style={{ color: dark ? 'rgba(255,255,255,0.45)' : '#94a3b8' }}>{hint}</p>}
    </div>
  )
}
