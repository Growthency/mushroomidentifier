'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function HomeIdentifier() {
  const [userId, setUserId] = useState<string | null>(null)
  const [hasUsedFreeScan, setHasUsedFreeScan] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)

      if (!user) {
        const hasUsed = localStorage.getItem('mushroom_free_scan_used')
        setHasUsedFreeScan(!!hasUsed)
      }
    }
    getUser()
  }, [supabase])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4)
    if (files.length > 0) {
      setSelectedFiles(prev => {
        const combined = [...prev, ...files].slice(0, 4)
        return combined
      })
      setPreviewUrls(prev => {
        const newUrls = files.map(f => URL.createObjectURL(f))
        return [...prev, ...newUrls].slice(0, 4)
      })
      setResult(null)
      setError(null)
    }
  }

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > 800 || height > 800) {
            if (width > height) {
              height = (height / width) * 800
              width = 800
            } else {
              width = (width / height) * 800
              height = 800
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1])
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const hashImage = async (base64: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(base64)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const analyzeImage = async () => {
    if (selectedFiles.length === 0) return

    setAnalyzing(true)
    setError(null)

    try {
      const imagesBase64 = await Promise.all(selectedFiles.map(f => resizeImage(f)))
      const imageHash = await hashImage(imagesBase64[0])

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagesBase64, imageHash, userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'signup_required') {
          setError('signup_required')
        } else if (data.error === 'insufficient_credits') {
          setError('Insufficient credits. Please purchase more to continue.')
        } else {
          setError(data.error || 'Analysis failed')
        }
        setAnalyzing(false)
        return
      }

      setResult(data.result)
      if (!userId && !hasUsedFreeScan) {
        localStorage.setItem('mushroom_free_scan_used', 'true')
        setHasUsedFreeScan(true)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const reset = () => {
    setSelectedFiles([])
    setPreviewUrls([])
    setResult(null)
    setError(null)
  }

  return (
    <section id="identifier" className="py-12 sm:py-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-6 gradient-text-animate">
          Upload Photo For Accurate Mushrooms Identification
        </h2>

        {/* Guest sign-up wall */}
        {!userId && (
          <div className="mb-8 p-6 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '2px solid var(--accent)' }}>
            <div className="text-4xl mb-3">🍄</div>
            <h3 className="font-playfair text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Create a Free Account to Start Identifying
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Sign up for free and get <strong style={{ color: 'var(--accent)' }}>3 free identifications</strong> instantly. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl font-semibold glow-green transition-opacity hover:opacity-90"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}
              >
                Sign Up Free →
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        )}

        {error && error !== 'signup_required' && (
          <div className="mb-6 p-4 rounded-lg flex items-start gap-3" style={{ background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.3)' }}>
            <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#fb923c' }} />
            <div>
              <p className="font-medium" style={{ color: '#fb923c' }}>
                {error === 'insufficient_credits'
                  ? 'Insufficient credits. Please purchase more to continue.'
                  : error}
              </p>
              {error === 'insufficient_credits' && (
                <Link href="/pricing" className="underline text-sm mt-1 inline-block" style={{ color: '#fb923c' }}>
                  View Pricing →
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left — Upload panel */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)', color: '#fff' }}>
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Mushroom Photos</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Multi-angle analysis</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                📷 Up to 4
              </span>
            </div>

            {selectedFiles.length < 4 && !result && (
              <label className="block cursor-pointer mb-4">
                <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all hover:opacity-80" style={{ borderColor: 'var(--border)' }}>
                  <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Tap to upload photos</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedFiles.length}/4 photos • JPG, PNG • Max 10MB each</p>
                </div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            )}

            {previewUrls.length > 0 && !result && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
                    <img src={url} alt="AI mushroom identifier - Fungi Finder" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setPreviewUrls(prev => prev.filter((_, idx) => idx !== i))
                        setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            {!result && (
              <div className="mt-2">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                  📷 For best results, capture these angles:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { src: '/mushroom-top-view-cap-surface-1.webp', label: 'Cap' },
                    { src: '/mushroom-side-profile-stem-view-2.webp', label: 'Stipe' },
                    { src: '/mushroom-underside-gills-spores-3.webp', label: 'Gills' },
                    { src: '/mushroom-base-root-volva-bottom-4.webp', label: 'Volva' },
                  ].map(({ src, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 angle-img-group">
                      <div className="w-full rounded-lg overflow-hidden cursor-pointer" style={{ aspectRatio: '1', background: 'var(--bg-secondary)' }}>
                        <NextImage src={src} alt={`AI mushroom identifier - Fungi Finder - ${label} view`} width={120} height={120} sizes="96px" loading="lazy" className="w-full h-full object-cover angle-img-wrap" />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && !analyzing && selectedFiles.length > 0 && (
              <div className="flex gap-3 mt-4">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Clear
                </button>
                <button onClick={analyzeImage} className="flex-1 py-2.5 rounded-xl text-sm font-semibold glow-green" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Analyze {selectedFiles.length} Photo{selectedFiles.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>

          {/* Right — Mushroom guide diagram */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex-1 flex items-center justify-center p-4">
              <NextImage
                src="/mushroom-fungi-identifier.webp"
                alt="AI mushroom identifier - Fungi Finder anatomy guide showing Cap, Gills, Ring, Stipe and Volva"
                width={600}
                height={400}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto"
                style={{ maxHeight: '320px', objectFit: 'contain' }}
              />
            </div>
            <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Mushroom Profile</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Photograph each labelled part for highest AI accuracy</p>
            </div>
          </div>
        </div>

        {analyzing && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Analyzing your mushroom with AI...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                <div>
                  <h3 className="font-playfair text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{result.commonName}</h3>
                  <p className="italic" style={{ color: 'var(--text-muted)' }}>{result.scientificName}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${result.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500' : result.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                    {result.riskLevel} RISK
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                    {result.confidence} Confidence
                  </span>
                </div>
              </div>
              {result.funFact && (
                <p className="text-sm p-3 rounded-lg" style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)' }}>
                  💡 {result.funFact}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyFeatures?.map((feature: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)' }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Habitat &amp; Distribution</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Habitat</p>
                    <p style={{ color: 'var(--text-primary)' }}>{result.habitat}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Distribution</p>
                    <p style={{ color: 'var(--text-primary)' }}>{result.distribution}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Season</p>
                    <p style={{ color: 'var(--text-primary)' }}>{result.seasonality}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Color</p>
                    <p style={{ color: 'var(--text-primary)' }}>{result.color}</p>
                  </div>
                </div>
              </div>
            </div>

            {result.criticalFeatures && result.criticalFeatures.length > 0 && (
              <div className="p-6 rounded-xl" style={{ background: 'rgba(251, 146, 60, 0.1)', border: '2px solid rgba(251, 146, 60, 0.3)' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#fb923c' }} />
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: '#fb923c' }}>Critical Features</h3>
                    <ul className="space-y-2">
                      {result.criticalFeatures.map((feature: string, i: number) => (
                        <li key={i} className="text-sm" style={{ color: 'var(--text-primary)' }}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {result.similarSpecies && result.similarSpecies.length > 0 && (
              <div className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Similar Species</h3>
                <div className="space-y-4">
                  {result.similarSpecies.map((species: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{species.name}</p>
                          <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{species.scientificName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${species.toxicity === 'DEADLY' ? 'bg-red-500/20 text-red-500' : species.toxicity === 'TOXIC' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                          {species.toxicity}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {species.differences?.map((diff: string, j: number) => (
                          <li key={j} className="text-sm" style={{ color: 'var(--text-muted)' }}>• {diff}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`p-6 rounded-xl ${result.riskLevel === 'HIGH' ? 'bg-red-500/10' : result.riskLevel === 'MEDIUM' ? 'bg-amber-500/10' : 'bg-green-500/10'}`} style={{ border: `2px solid ${result.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.3)' : result.riskLevel === 'MEDIUM' ? 'rgba(251, 146, 60, 0.3)' : 'rgba(34, 197, 94, 0.3)'}` }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommended Action</h3>
              <p style={{ color: 'var(--text-primary)' }}>{result.recommendedAction}</p>
            </div>

            <button onClick={reset} className="w-full px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
              Identify Another Mushroom
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
