'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Sparkles, Trash2, Eye, X,
  AlertTriangle, Printer, FileJson
} from 'lucide-react'

type Scan = {
  id: string
  result: any
  created_at: string
  image_hash: string
}

export default function HistoryPage() {
  const [scans, setScans]         = useState<Scan[]>([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState<Scan | null>(null)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [userId, setUserId]       = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase
        .from('analyses')
        .select('id, result, created_at, image_hash')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setScans(data || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    await supabase.from('analyses').delete().eq('id', id).eq('user_id', userId!)
    setScans(prev => prev.filter(s => s.id !== id))
    if (selected?.id === id) setSelected(null)
    setDeleting(null)
  }

  const downloadJSON = (scan: Scan) => {
    const blob = new Blob([JSON.stringify({ ...scan.result, scanned_at: scan.created_at }, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `mushroom-${scan.result?.commonName?.replace(/\s+/g, '-').toLowerCase() || 'scan'}-${new Date(scan.created_at).toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printScan = (scan: Scan) => {
    const r = scan.result
    const date = new Date(scan.created_at).toLocaleString()
    const win = window.open('', '_blank', 'width=800,height=900')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mushroom Scan – ${r.commonName}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; color: #111; }
          h1 { font-size: 2rem; margin-bottom: 4px; }
          .sci { color: #666; font-style: italic; margin-bottom: 20px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; margin-right: 8px; }
          .high { background: #fecaca; color: #b91c1c; }
          .medium { background: #fde68a; color: #92400e; }
          .low { background: #bbf7d0; color: #166534; }
          .section { margin: 20px 0; }
          .section h2 { font-size: 1rem; font-weight: 700; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-bottom: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .item label { font-size: 0.75rem; color: #666; }
          .item p { margin: 0; font-size: 0.9rem; }
          ul { margin: 0; padding-left: 1.2rem; }
          li { margin-bottom: 4px; font-size: 0.9rem; }
          .warning { background: #fff7ed; border: 2px solid #fb923c; border-radius: 8px; padding: 12px 16px; }
          .action { background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 12px 16px; }
          .similar { background: #f8f8f8; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; }
          .footer { margin-top: 40px; font-size: 0.75rem; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <span style="font-size:2.5rem">🍄</span>
          <div>
            <h1>${r.commonName || 'Unknown'}</h1>
            <p class="sci">${r.scientificName || ''}</p>
          </div>
        </div>
        <div>
          <span class="badge ${r.riskLevel === 'HIGH' ? 'high' : r.riskLevel === 'MEDIUM' ? 'medium' : 'low'}">${r.riskLevel} RISK</span>
          <span class="badge" style="background:#e0f2fe;color:#0369a1">${r.edibility || ''}</span>
          <span class="badge" style="background:#f3e8ff;color:#7c3aed">${r.confidence} Confidence</span>
        </div>
        ${r.funFact ? `<p style="margin:16px 0;padding:12px 16px;background:#f0fdf4;border-radius:8px;font-size:0.9rem">💡 ${r.funFact}</p>` : ''}

        <div class="section">
          <h2>Key Features</h2>
          <ul>${(r.keyFeatures || []).map((f: string) => `<li>${f}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>Habitat & Distribution</h2>
          <div class="grid">
            <div class="item"><label>Habitat</label><p>${r.habitat || '–'}</p></div>
            <div class="item"><label>Distribution</label><p>${r.distribution || '–'}</p></div>
            <div class="item"><label>Seasonality</label><p>${r.seasonality || '–'}</p></div>
            <div class="item"><label>Color</label><p>${r.color || '–'}</p></div>
            ${r.smell ? `<div class="item"><label>Smell</label><p>${r.smell}</p></div>` : ''}
            ${r.economicValue ? `<div class="item"><label>Economic Value</label><p>${r.economicValue}</p></div>` : ''}
          </div>
        </div>

        ${r.criticalFeatures?.length ? `
        <div class="section">
          <h2>⚠️ Critical Features</h2>
          <div class="warning">
            <ul>${(r.criticalFeatures || []).map((f: string) => `<li>${f}</li>`).join('')}</ul>
          </div>
        </div>` : ''}

        ${r.similarSpecies?.length ? `
        <div class="section">
          <h2>Similar Species</h2>
          ${(r.similarSpecies || []).map((sp: any) => `
            <div class="similar">
              <strong>${sp.name}</strong> <em style="color:#666">${sp.scientificName}</em>
              <span class="badge ${sp.toxicity === 'DEADLY' ? 'high' : sp.toxicity === 'TOXIC' ? 'medium' : 'low'}" style="font-size:0.7rem">${sp.toxicity}</span>
              <ul>${(sp.differences || []).map((d: string) => `<li>${d}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>` : ''}

        <div class="section">
          <h2>Recommended Action</h2>
          <div class="action">${r.recommendedAction || ''}</div>
        </div>

        <div class="footer">
          Identified by MushroomIdentifiers.com · ${date}<br>
          <strong>⚠️ Always verify mushroom identification with a qualified expert before consuming.</strong>
        </div>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  const riskColor = (level: string) =>
    level === 'HIGH' ? { bg: '#ef444420', text: '#ef4444' } :
    level === 'MEDIUM' ? { bg: '#f59e0b20', text: '#f59e0b' } :
    { bg: '#22c55e20', text: '#22c55e' }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <>
      {scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🍄</div>
          <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No scans yet</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Upload a mushroom photo to start identifying</p>
          <Link href="/#identifier"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            <Sparkles className="w-4 h-4" /> New Scan
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{scans.length} scan{scans.length !== 1 ? 's' : ''} found</p>
            <Link href="/#identifier"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <Sparkles className="w-4 h-4" /> New Scan
            </Link>
          </div>

          <div className="space-y-3">
            {scans.map(scan => {
              const r     = scan.result
              const rc    = riskColor(r?.riskLevel)
              const date  = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              return (
                <div key={scan.id} className="p-4 rounded-2xl flex items-center gap-4 flex-wrap md:flex-nowrap"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: rc.bg }}>🍄</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{r?.commonName || 'Unknown Mushroom'}</p>
                    <p className="text-xs italic truncate" style={{ color: 'var(--text-muted)' }}>{r?.scientificName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{date}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{ background: rc.bg, color: rc.text }}>{r?.riskLevel}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{r?.confidence}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setSelected(scan)}
                      className="p-2 rounded-xl hover:opacity-70 transition-opacity" title="View details"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => printScan(scan)}
                      className="p-2 rounded-xl hover:opacity-70 transition-opacity" title="Print / Save as PDF"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={() => downloadJSON(scan)}
                      className="p-2 rounded-xl hover:opacity-70 transition-opacity" title="Download JSON"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                      <FileJson className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(scan.id)}
                      disabled={deleting === scan.id}
                      className="p-2 rounded-xl hover:opacity-70 transition-opacity" title="Delete"
                      style={{ background: '#ef444418', color: '#ef4444' }}>
                      {deleting === scan.id
                        ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Full Result Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="relative w-full max-w-2xl my-8 rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 className="font-playfair text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selected.result?.commonName}
                </h2>
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{selected.result?.scientificName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => printScan(selected)}
                  className="p-2 rounded-xl hover:opacity-70 transition-opacity"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }} title="Print / PDF">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => downloadJSON(selected)}
                  className="p-2 rounded-xl hover:opacity-70 transition-opacity"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }} title="Download JSON">
                  <FileJson className="w-4 h-4" />
                </button>
                <button onClick={() => setSelected(null)}
                  className="p-2 rounded-xl hover:opacity-70 transition-opacity"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Risk badges */}
              <div className="flex flex-wrap gap-2">
                {(() => { const rc = riskColor(selected.result?.riskLevel); return (
                  <span className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ background: rc.bg, color: rc.text }}>{selected.result?.riskLevel} RISK</span>
                )})()}
                <span className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  {selected.result?.confidence} Confidence
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  {selected.result?.edibility}
                </span>
              </div>

              {/* Fun fact */}
              {selected.result?.funFact && (
                <p className="text-sm p-3 rounded-xl" style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)' }}>
                  💡 {selected.result.funFact}
                </p>
              )}

              {/* Key Features */}
              <div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.result?.keyFeatures?.map((f: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Habitat grid */}
              <div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Habitat & Distribution</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Habitat', selected.result?.habitat],
                    ['Distribution', selected.result?.distribution],
                    ['Seasonality', selected.result?.seasonality],
                    ['Color', selected.result?.color],
                    ['Smell', selected.result?.smell],
                    ['Economic Value', selected.result?.economicValue],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label as string}>
                      <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-faint)' }}>{label}</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical features */}
              {selected.result?.criticalFeatures?.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(251,146,60,0.1)', border: '2px solid rgba(251,146,60,0.3)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: '#fb923c' }} />
                    <h3 className="font-semibold text-sm" style={{ color: '#fb923c' }}>Critical Features</h3>
                  </div>
                  <ul className="space-y-1">
                    {selected.result.criticalFeatures.map((f: string, i: number) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--text-primary)' }}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Similar species */}
              {selected.result?.similarSpecies?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Similar Species</h3>
                  <div className="space-y-3">
                    {selected.result.similarSpecies.map((sp: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{sp.name}</p>
                            <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>{sp.scientificName}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold flex-shrink-0 ${sp.toxicity === 'DEADLY' ? 'bg-red-500/20 text-red-500' : sp.toxicity === 'TOXIC' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                            {sp.toxicity}
                          </span>
                        </div>
                        <ul className="space-y-0.5">
                          {sp.differences?.map((d: string, j: number) => (
                            <li key={j} className="text-xs" style={{ color: 'var(--text-muted)' }}>• {d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended action */}
              <div className={`p-4 rounded-xl ${selected.result?.riskLevel === 'HIGH' ? 'bg-red-500/10' : selected.result?.riskLevel === 'MEDIUM' ? 'bg-amber-500/10' : 'bg-green-500/10'}`}
                style={{ border: `2px solid ${selected.result?.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.3)' : selected.result?.riskLevel === 'MEDIUM' ? 'rgba(251,146,60,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Recommended Action</h3>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{selected.result?.recommendedAction}</p>
              </div>

              {/* Scan date */}
              <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
                Identified {new Date(selected.created_at).toLocaleString()} · MushroomIdentifiers.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
