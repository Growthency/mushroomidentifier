'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ChevronLeft, Sparkles, History, Zap, Crown, ChevronRight, Check, Shield } from 'lucide-react'

function SearchResultsContent() {
  const [result, setResult]       = useState<any>(null)
  const [images, setImages]       = useState<string[]>([])  // data URLs of uploaded photos
  const [activeImg, setActiveImg] = useState(0)
  const [notFound, setNotFound]   = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored     = localStorage.getItem('mushroom_last_result')
    const storedImgs = localStorage.getItem('mushroom_scan_images')

    if (stored) {
      try { setResult(JSON.parse(stored)) } catch {}
    } else {
      setNotFound(true)
    }

    if (storedImgs) {
      try {
        const imgs = JSON.parse(storedImgs)
        if (Array.isArray(imgs) && imgs.length > 0) setImages(imgs)
      } catch {}
    }
  }, [])

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="text-6xl mb-4">🍄</div>
      <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No result found</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Please upload a mushroom photo first</p>
      <Link href="/#identifier"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
        style={{ background: 'var(--accent)', color: '#fff' }}>
        <Sparkles className="w-4 h-4" /> Start New Scan
      </Link>
    </div>
  )

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  const riskColor = result.riskLevel === 'HIGH' ? '#ef4444' : result.riskLevel === 'MEDIUM' ? '#f59e0b' : '#22c55e'
  const riskBg    = result.riskLevel === 'HIGH' ? '#ef444420' : result.riskLevel === 'MEDIUM' ? '#f59e0b20' : '#22c55e20'

  const handleNewScan = () => {
    localStorage.removeItem('mushroom_last_result')
    localStorage.removeItem('mushroom_scan_images')
    router.push('/#identifier')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top nav bar */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <span className="font-playfair font-bold" style={{ color: 'var(--text-primary)' }}>🍄 Identification Result</span>
        <Link href="/dashboard/history"
          className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent)' }}>
          <History className="w-4 h-4" /> History
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* ── Uploaded images gallery ── */}
        {images.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Main image */}
            <div className="relative" style={{ height: 260 }}>
              <img
                src={images[activeImg]}
                alt={`Scan photo ${activeImg + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Risk badge overlay */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: riskBg, color: riskColor, backdropFilter: 'blur(8px)' }}>
                  {result.riskLevel} RISK
                </span>
              </div>
              {/* Photo counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="rounded-xl overflow-hidden flex-shrink-0 transition-all"
                    style={{
                      width: 72, height: 56,
                      outline: i === activeImg ? '2px solid var(--accent)' : '2px solid transparent',
                      outlineOffset: 2,
                      opacity: i === activeImg ? 1 : 0.55,
                    }}>
                    <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                <div className="flex items-center pl-1">
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                    {images.length} photo{images.length > 1 ? 's' : ''} submitted
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main result card */}
        <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="font-playfair text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {result.commonName}
              </h1>
              <p className="italic text-sm" style={{ color: 'var(--text-muted)' }}>{result.scientificName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {images.length === 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ background: riskBg, color: riskColor }}>
                  {result.riskLevel} RISK
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                {result.confidence} Confidence
              </span>
              {result.edibility && (
                <span className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  {result.edibility}
                </span>
              )}
            </div>
          </div>
          {result.funFact && (
            <p className="text-sm p-4 rounded-xl" style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)' }}>
              💡 {result.funFact}
            </p>
          )}
        </div>

        {/* Key Features */}
        {result.keyFeatures?.length > 0 && (
          <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Key Features</h2>
            <div className="flex flex-wrap gap-2">
              {result.keyFeatures.map((f: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Habitat & Distribution */}
        <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Habitat & Distribution</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Habitat',        result.habitat],
              ['Distribution',   result.distribution],
              ['Seasonality',    result.seasonality],
              ['Color',          result.color],
              ['Smell',          result.smell],
              ['Economic Value', result.economicValue],
            ].filter(([, v]) => v).map(([label, val]) => (
              <div key={label as string}>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-faint)' }}>{label}</p>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Features */}
        {result.criticalFeatures?.length > 0 && (
          <div className="p-5 rounded-2xl"
            style={{ background: 'rgba(251,146,60,0.08)', border: '2px solid rgba(251,146,60,0.3)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" style={{ color: '#fb923c' }} />
              <h2 className="font-semibold" style={{ color: '#fb923c' }}>Critical Features</h2>
            </div>
            <ul className="space-y-2">
              {result.criticalFeatures.map((f: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span style={{ color: '#fb923c' }}>•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Similar Species */}
        {result.similarSpecies?.length > 0 && (
          <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Similar Species</h2>
            <div className="space-y-3">
              {result.similarSpecies.map((sp: any, i: number) => (
                <div key={i} className="p-4 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{sp.name}</p>
                      <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>{sp.scientificName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${sp.toxicity === 'DEADLY' ? 'bg-red-500/20 text-red-500' : sp.toxicity === 'TOXIC' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                      {sp.toxicity}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {sp.differences?.map((d: string, j: number) => (
                      <li key={j} className="text-xs" style={{ color: 'var(--text-muted)' }}>• {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Action */}
        <div className="p-5 rounded-2xl"
          style={{
            background: result.riskLevel === 'HIGH' ? '#ef444410' : result.riskLevel === 'MEDIUM' ? '#f59e0b10' : '#22c55e10',
            border: `2px solid ${result.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.3)' : result.riskLevel === 'MEDIUM' ? 'rgba(251,146,60,0.3)' : 'rgba(34,197,94,0.3)'}`,
          }}>
          <h2 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Recommended Action</h2>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{result.recommendedAction}</p>
        </div>

        {/* ── Upsell Banner — convert free users to pro ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f2a1a 0%, #1a3a28 40%, #122e3a 100%)',
            border: '1px solid rgba(111,207,127,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
          {/* Top accent bar */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, #22c55e, #4ade80, #a3e635)' }} />

          <div className="px-6 py-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <Zap className="w-5 h-5" style={{ color: '#4ade80' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                    style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                    <Crown className="w-2.5 h-2.5" /> PRO
                  </span>
                  <span className="text-[10px] font-medium tracking-wide" style={{ color: 'rgba(240,253,244,0.4)' }}>
                    UPGRADE YOUR ACCURACY
                  </span>
                </div>
                <h3 className="font-bold text-base leading-snug" style={{ color: '#f0fdf4' }}>
                  Want a More Accurate Identification?
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(240,253,244,0.65)' }}>
              This analysis was performed by our <span style={{ color: 'rgba(240,253,244,0.85)' }}>standard AI model</span>.
              Upgrade to unlock our <span className="font-semibold" style={{ color: '#4ade80' }}>advanced intelligence engine</span> for
              higher-confidence species matching, detailed toxicity analysis, and expert-level safety recommendations.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {[
                { icon: Zap, text: 'Higher accuracy AI model' },
                { icon: Shield, text: 'Detailed toxicity reports' },
                { icon: Sparkles, text: 'Expert safety analysis' },
                { icon: Check, text: 'Priority identification speed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(74,222,128,0.15)' }}>
                    <Icon className="w-2.5 h-2.5" style={{ color: '#4ade80' }} />
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(240,253,244,0.8)' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/pricing"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
              }}>
              Upgrade Now — From $4.99
              <ChevronRight className="w-4 h-4" />
            </Link>

            <p className="text-center text-[11px] mt-2.5" style={{ color: 'rgba(240,253,244,0.35)' }}>
              One-time purchase · No subscription · 14-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap pb-8">
          <button onClick={handleNewScan}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            <Sparkles className="w-4 h-4" /> Identify Another
          </button>
          <Link href="/dashboard/history"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <History className="w-4 h-4" /> View History
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
