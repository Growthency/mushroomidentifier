'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { TriangleAlert as AlertTriangle, Camera, Sparkles, Scan } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/* ── Scanning steps shown during analysis ── */
const SCAN_STEPS = [
  'Processing images…',
  'Identifying species…',
  'Checking toxicity levels…',
  'Analyzing habitat & features…',
  'Generating identification report…',
]

export default function HomeIdentifier() {
  const [userId, setUserId]               = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls]     = useState<string[]>([])     // blob URLs for display
  const [dataUrls, setDataUrls]           = useState<string[]>([])     // persistent data URLs for localStorage
  const [analyzing, setAnalyzing]         = useState(false)
  const [scanStep, setScanStep]           = useState(0)
  const [scanProgress, setScanProgress]   = useState(0)
  const [error, setError]                 = useState<string | null>(null)

  const supabase   = createClient()
  const router     = useRouter()
  const stepTimer  = useRef<NodeJS.Timeout | null>(null)
  const progTimer  = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [supabase])

  /* Convert File → both blob URL (display) and data URL (storage) */
  const addFiles = async (files: File[]) => {
    const newPreviews: string[] = files.map(f => URL.createObjectURL(f))
    const newDataUrls: string[] = await Promise.all(
      files.map(f => new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target?.result as string)
        reader.readAsDataURL(f)
      }))
    )
    setSelectedFiles(prev => [...prev, ...files].slice(0, 4))
    setPreviewUrls(prev  => [...prev, ...newPreviews].slice(0, 4))
    setDataUrls(prev     => [...prev, ...newDataUrls].slice(0, 4))
    setError(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4)
    if (files.length > 0) addFiles(files)
  }

  const resizeImage = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let w = img.width, h = img.height
          if (w > 800 || h > 800) {
            if (w > h) { h = (h / w) * 800; w = 800 }
            else       { w = (w / h) * 800; h = 800 }
          }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1])
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const hashImage = async (base64: string): Promise<string> => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(base64))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /* Animate scanning steps + progress bar */
  const startScanAnimation = () => {
    setScanStep(0)
    setScanProgress(0)
    let step = 0
    let prog = 0

    stepTimer.current = setInterval(() => {
      step = Math.min(step + 1, SCAN_STEPS.length - 1)
      setScanStep(step)
    }, 1800)

    progTimer.current = setInterval(() => {
      prog = prog < 88 ? prog + 1 : prog   // stalls at 88% until real result
      setScanProgress(prog)
    }, 90)
  }

  const stopScanAnimation = () => {
    if (stepTimer.current) clearInterval(stepTimer.current)
    if (progTimer.current) clearInterval(progTimer.current)
    setScanProgress(100)
  }

  const analyzeImage = async () => {
    if (selectedFiles.length === 0) return
    setAnalyzing(true)
    setError(null)
    startScanAnimation()

    try {
      const imagesBase64 = await Promise.all(selectedFiles.map(resizeImage))
      const imageHash    = await hashImage(imagesBase64[0])

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagesBase64, imageHash, userId }),
      })

      const data = await response.json()
      stopScanAnimation()

      if (!response.ok) {
        if (data.error === 'signup_required') {
          setError('signup_required')
        } else if (data.error === 'insufficient_credits') {
          setError('insufficient_credits')
        } else {
          setError((data.error || 'Analysis failed') + (data.details ? ': ' + data.details : ''))
        }
        setAnalyzing(false)
        return
      }

      /* Save result + uploaded images → localStorage → redirect */
      localStorage.setItem('mushroom_last_result', JSON.stringify(data.result))
      localStorage.setItem('mushroom_scan_images', JSON.stringify(dataUrls))
      router.push('/search-results')
    } catch {
      stopScanAnimation()
      setError('Network error. Please try again.')
      setAnalyzing(false)
    }
  }

  const reset = () => {
    setSelectedFiles([])
    setPreviewUrls([])
    setDataUrls([])
    setError(null)
  }

  const removeFile = (i: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviewUrls(prev  => prev.filter((_, idx) => idx !== i))
    setDataUrls(prev     => prev.filter((_, idx) => idx !== i))
  }

  /* ── Scanning overlay (replaces right panel) ── */
  const ScanningPanel = () => (
    <div className="rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 relative"
      style={{ background: 'var(--bg-card)', border: '2px solid var(--accent)', minHeight: 360 }}>

      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-28 h-28 rounded-full animate-ping opacity-20"
          style={{ background: 'var(--accent)' }} />
        <div className="absolute w-20 h-20 rounded-full animate-pulse opacity-30"
          style={{ background: 'var(--accent)' }} />
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center z-10 shadow-lg"
          style={{ background: 'var(--accent)' }}>
          <span className="text-3xl">🍄</span>
        </div>
        {/* Orbit dot */}
        <div className="absolute w-3 h-3 rounded-full"
          style={{
            background: 'var(--accent)',
            animation: 'orbit 1.4s linear infinite',
            transformOrigin: '0 40px',
          }} />
      </div>

      <p className="font-playfair text-xl font-bold mb-1 text-center" style={{ color: 'var(--text-primary)' }}>
        Analyzing your mushroom…
      </p>
      <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
        {SCAN_STEPS[scanStep]}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-faint)' }}>
          <span>AI Processing</span>
          <span style={{ color: 'var(--accent)' }}>{scanProgress}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${scanProgress}%`, background: 'linear-gradient(90deg, var(--accent), #15803d)' }}
          />
        </div>
        <div className="flex gap-1 mt-4 justify-center">
          {SCAN_STEPS.map((_, i) => (
            <div key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i <= scanStep ? 24 : 8,
                background: i <= scanStep ? 'var(--accent)' : 'var(--border)',
              }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
      `}</style>
    </div>
  )

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
              Sign up for free and get <strong style={{ color: 'var(--accent)' }}>30 free credits</strong> — identify 3 mushrooms instantly. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup"
                className="px-6 py-3 rounded-xl font-semibold glow-green transition-opacity hover:opacity-90"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                Sign Up Free →
              </Link>
              <Link href="/login"
                className="px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Error messages */}
        {error && error !== 'signup_required' && (
          <div className="mb-6 p-4 rounded-lg flex items-start gap-3"
            style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)' }}>
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#fb923c' }} />
            <div>
              <p className="font-medium" style={{ color: '#fb923c' }}>
                {error === 'insufficient_credits'
                  ? "You've run out of credits. Please upgrade to continue."
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
              <span className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                📷 Up to 4
              </span>
            </div>

            {/* Upload zone */}
            {selectedFiles.length < 4 && (
              <label className="block cursor-pointer mb-4">
                <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--border)' }}>
                  <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Tap to upload photos</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {selectedFiles.length}/4 photos · JPG, PNG · Max 10MB each
                  </p>
                </div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            )}

            {/* Photo previews */}
            {previewUrls.length > 0 && (
              <div className={`grid gap-2 mb-4 ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: '4/3' }}>
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {/* Hover overlay with remove */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <button
                        onClick={() => removeFile(i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}>✕</button>
                    </div>
                    {/* Corner badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-xs font-bold"
                      style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                      {i + 1}
                    </div>
                    {analyzing && (
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full h-0.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <div className="h-full" style={{
                            background: 'var(--accent)',
                            animation: 'scanline 2s ease-in-out infinite',
                            width: '40%',
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Angle guide */}
            {!analyzing && (
              <div className="mt-2">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                  📷 For best results, capture these angles:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { src: '/mushroom-top-view-cap-surface-1.webp',   label: 'Cap' },
                    { src: '/mushroom-side-profile-stem-view-2.webp', label: 'Stipe' },
                    { src: '/mushroom-underside-gills-spores-3.webp', label: 'Gills' },
                    { src: '/mushroom-base-root-volva-bottom-4.webp', label: 'Volva' },
                  ].map(({ src, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: '1', background: 'var(--bg-secondary)' }}>
                        <NextImage src={src} alt={`${label} view`} width={120} height={120} sizes="96px" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!analyzing && selectedFiles.length > 0 && (
              <div className="flex gap-3 mt-4">
                <button onClick={reset}
                  className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Clear
                </button>
                <button onClick={analyzeImage}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold glow-green flex items-center justify-center gap-2"
                  style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  <Sparkles className="w-4 h-4" />
                  Identify {selectedFiles.length} Photo{selectedFiles.length > 1 ? 's' : ''}
                </button>
              </div>
            )}

            {/* Analyzing status under left panel */}
            {analyzing && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-3"
                style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
                <Scan className="w-4 h-4 flex-shrink-0 animate-pulse" style={{ color: 'var(--accent)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  {SCAN_STEPS[scanStep]}
                </p>
              </div>
            )}
          </div>

          {/* Right — Scanning animation OR mushroom guide */}
          {analyzing ? (
            <ScanningPanel />
          ) : (
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex-1 flex items-center justify-center p-4">
                <NextImage
                  src="/mushroom-fungi-identifier.webp"
                  alt="AI mushroom identifier – anatomy guide"
                  width={600} height={400} loading="lazy"
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
          )}
        </div>

        <style>{`
          @keyframes scanline {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
        `}</style>
      </div>
    </section>
  )
}
