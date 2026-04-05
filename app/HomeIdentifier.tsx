'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { TriangleAlert as AlertTriangle, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function HomeIdentifier() {
  const [userId, setUserId]         = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls]     = useState<string[]>([])
  const [analyzing, setAnalyzing]         = useState(false)
  const [error, setError]                 = useState<string | null>(null)

  const supabase = createClient()
  const router   = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [supabase])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4)
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files].slice(0, 4))
      setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 4))
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
    const data = new TextEncoder().encode(base64)
    const buf  = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const analyzeImage = async () => {
    if (selectedFiles.length === 0) return
    setAnalyzing(true)
    setError(null)
    try {
      const imagesBase64 = await Promise.all(selectedFiles.map(resizeImage))
      const imageHash    = await hashImage(imagesBase64[0])

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
          setError('insufficient_credits')
        } else {
          setError((data.error || 'Analysis failed') + (data.details ? ': ' + data.details : ''))
        }
        setAnalyzing(false)
        return
      }

      // Save result and redirect to dedicated results page
      localStorage.setItem('mushroom_last_result', JSON.stringify(data.result))
      router.push('/search-results')
    } catch {
      setError('Network error. Please try again.')
      setAnalyzing(false)
    }
  }

  const reset = () => {
    setSelectedFiles([])
    setPreviewUrls([])
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
                  ? 'You\'ve run out of credits. Please upgrade to continue.'
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

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
                    <img src={url} alt="mushroom photo" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setPreviewUrls(prev => prev.filter((_, idx) => idx !== i))
                        setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                📷 For best results, capture these angles:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { src: '/mushroom-top-view-cap-surface-1.webp',       label: 'Cap' },
                  { src: '/mushroom-side-profile-stem-view-2.webp',     label: 'Stipe' },
                  { src: '/mushroom-underside-gills-spores-3.webp',     label: 'Gills' },
                  { src: '/mushroom-base-root-volva-bottom-4.webp',     label: 'Volva' },
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

            {!analyzing && selectedFiles.length > 0 && (
              <div className="flex gap-3 mt-4">
                <button onClick={reset}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Clear
                </button>
                <button onClick={analyzeImage}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold glow-green"
                  style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Analyze {selectedFiles.length} Photo{selectedFiles.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>

          {/* Right — Mushroom guide diagram */}
          <div className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex-1 flex items-center justify-center p-4">
              <NextImage
                src="/mushroom-fungi-identifier.webp"
                alt="AI mushroom identifier – anatomy guide showing Cap, Gills, Ring, Stipe and Volva"
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
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Analyzing your mushroom with AI...</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>This usually takes 5–10 seconds</p>
          </div>
        )}
      </div>
    </section>
  )
}
