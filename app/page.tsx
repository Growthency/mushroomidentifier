'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, Shield, Microscope, Globe, Clock, BookOpen, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Camera, TreeDeciduous, Leaf, Mountain } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const PARTICLE_COUNT = 80
const CONNECTION_DISTANCE = 150

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null)
  const [hasUsedFreeScan, setHasUsedFreeScan] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        })
      }
    }

    initParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(126, 200, 138, 0.6)'
        ctx.fill()
      })

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.strokeStyle = `rgba(126, 200, 138, ${0.2 * (1 - distance / CONNECTION_DISTANCE)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
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
    if (!selectedFile) return

    setAnalyzing(true)
    setError(null)

    try {
      const imageBase64 = await resizeImage(selectedFile)
      const imageHash = await hashImage(imageBase64)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, imageHash, userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'free_limit_reached') {
          setError('You\'ve used your 3 lifetime free scans. Create an account to unlock unlimited identifications.')
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
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  return (
    <div>
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20" style={{ background: 'var(--bg-primary)' }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-40"
          style={{ pointerEvents: 'none' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
            AI-POWERED · 10,000+ SPECIES · 3 FREE SCANS
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up gradient-text">
            Free AI mushroom & Fungi identifier from Photos
          </h1>

          <p className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            A mushroom identifier helps answer the common question many people ask when discovering fungi in nature: "what type of mushroom is this?" Modern tools use artificial intelligence, computer vision, and image recognition to analyze mushroom photos and compare them with a large database of labeled fungal species.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up">
            <a href="#identifier" className="px-8 py-4 rounded-full text-lg font-semibold glow-green transition-all" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
              Identify a Mushroom →
            </a>
            <a href="#how-it-works" className="px-8 py-4 rounded-full text-lg font-semibold transition-all" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              See How It Works
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up">
            {[
              { label: '10K+ Species', icon: Globe },
              { label: '95% Accuracy', icon: CheckCircle },
              { label: '<60s Results', icon: Clock },
              { label: '3 Free Scans', icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <stat.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-2 animate-scroll-bounce">
            <div className="w-px h-12" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>scroll</span>
          </div>
        </div>
      </section>

      <section id="identifier" className="py-24 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-6 gradient-text">
            Upload Photo & Identify Mushrooms
          </h2>

          {!userId && !hasUsedFreeScan && (
            <div className="flex items-center justify-center gap-2 mb-6 text-sm font-medium" style={{ color: 'var(--accent)' }}>
              <div className="w-3 h-3 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
              Try your FREE scan now — No signup required
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg flex items-start gap-3" style={{ background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.3)' }}>
              <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#fb923c' }} />
              <div>
                <p className="font-medium" style={{ color: '#fb923c' }}>{error}</p>
                {error.includes('Buy credits') && (
                  <Link href="/pricing" className="underline text-sm mt-1 inline-block" style={{ color: '#fb923c' }}>
                    View Pricing →
                  </Link>
                )}
              </div>
            </div>
          )}

          {!selectedFile ? (
            <div>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed rounded-xl p-16 text-center hover:border-opacity-50 transition-all card-lift" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                  <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                  <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Drop an image or click to browse</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>For best results, photograph: cap top, side view, gills, stem base</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
          ) : (
            <div>
              {previewUrl && !result && (
                <div className="mb-6">
                  <img src={previewUrl} alt="Selected mushroom" className="w-full max-w-lg mx-auto rounded-xl" />
                </div>
              )}

              {!result && !analyzing && (
                <div className="flex gap-4 justify-center">
                  <button onClick={reset} className="px-6 py-3 rounded-lg font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    Cancel
                  </button>
                  <button onClick={analyzeImage} className="px-6 py-3 rounded-lg font-medium glow-green" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                    Analyze Mushroom
                  </button>
                </div>
              )}

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
                      <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Habitat & Distribution</h3>
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
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              By uploading clear images showing the cap, gills, pores, stem, and surrounding habitat, the system extracts visual traits such as cap shape, gill pattern, surface texture, and stem structure, then returns a ranked list of possible species matches.
            </p>
            <p>
              Many people use a wild mushroom identifier by picture when hiking, exploring forests, or observing fungi in gardens and parks. These tools often work as a mushroom identifier app or web-based identifier that runs directly in a browser. Some platforms also include a helpful mushroom ID chart, allowing users to compare key identification features such as gill attachment, cap shape, spore structures, and habitat clues to better understand mushroom anatomy.
            </p>
            <p>
              A mushroom identifier is especially useful for hikers, mushroom foragers, students of mycology, nature photographers, and outdoor enthusiasts who want to quickly research unknown fungi. By combining photo analysis, habitat context, and geographic information, the tool can narrow down potential species far faster than manually searching through traditional field guides or fungal reference books.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-xl mb-12" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0 text-red-500" />
              <div>
                <h2 className="font-semibold text-xl mb-3 text-red-500">Important Safety Notice</h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                  However, a mushroom identifier should always be used as a learning and research aid, not as a final identification authority. Some poisonous mushrooms closely resemble edible ones. For example, <strong>Amanita phalloides (death cap)</strong> — one of the most toxic mushrooms in the world — can look similar to edible species when young.
                </p>
                <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                  For safety, never rely solely on an AI result to determine edibility and always consult a local mycologist or mycological society for expert confirmation.
                </p>
              </div>
            </div>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            How AI Analyzes Mushroom Features
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8 text-center max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            This process works similarly to how experienced field mycologists approach identification. Instead of looking at a single trait, the AI evaluates combinations of characteristics:
          </p>

          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm sm:text-base" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th className="p-3 sm:p-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                  <th className="p-3 sm:p-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Example Observation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Cap shape', observation: 'Convex, flat, or bell-shaped' },
                  { feature: 'Gill attachment', observation: 'Free gills, decurrent gills, attached gills' },
                  { feature: 'Stem structure', observation: 'Hollow stem or solid stem' },
                  { feature: 'Habitat', observation: 'Growing on wood, soil, moss, or leaf litter' },
                  { feature: 'Tree association', observation: 'Oak, birch, beech, hemlock, conifer' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 sm:p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                    <td className="p-3 sm:p-4" style={{ color: 'var(--text-muted)' }}>{row.observation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-center" style={{ color: 'var(--text-muted)' }}>
            These traits together help distinguish species that may appear almost identical at first glance.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-16" style={{ color: 'var(--text-primary)' }}>How to Use the Mushroom Identifier</h2>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Identifying a mushroom with an AI mushroom identifier only takes a minute if you capture the right details. The tool uses computer vision and fungal species databases to compare your photos with thousands of known mushroom and fungi specimens. Follow these quick steps to get the most accurate results.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '01', icon: Camera, title: 'Upload Clear Mushroom Photos', desc: 'Start by uploading clear, well-lit images of the mushroom. The AI analyzes visual traits such as cap color, texture, gill pattern, and stem structure.' },
              { num: '02', icon: Shield, title: 'Capture Multiple Angles', desc: 'Upload several angles of the specimen so the image recognition system can detect more identifying features. Recommended views: cap (top view), side profile, underside (gills, pores, or teeth).' },
              { num: '03', icon: Camera, title: 'Photograph the Mushroom Cap', desc: 'Take a top-down photo of the mushroom cap showing cap shape, color and patterns, and surface texture (smooth, scaly, warty). This helps narrow down potential fungal species.' },
              { num: '04', icon: Leaf, title: 'Show the Underside Structure', desc: 'Turn the mushroom over and photograph the gills, pores, or spines. These structures are often the most important diagnostic feature in mycology.' },
              { num: '05', icon: TreeDeciduous, title: 'Capture the Stem and Base', desc: 'Photograph the full stem and base before removing the mushroom from the ground. This may reveal important structures like ring, volva, or basal bulb.' },
              { num: '06', icon: TreeDeciduous, title: 'Include the Habitat', desc: 'Take a photo showing the mushroom in its natural habitat, including soil or moss, leaf litter, decaying wood or logs, and nearby trees (oak, birch, conifer).' },
              { num: '07', icon: Mountain, title: 'Enter Location and Date Found', desc: 'Provide the geographic location and date when the mushroom was found. This helps the system filter species by geographic range, seasonality, and climate and elevation.' },
              { num: '08', icon: BookOpen, title: 'Add Observational Notes', desc: 'Include details the camera cannot capture, such as odor or smell, bruising reactions, spore print color, and cap texture (slimy, dry, velvety).' },
              { num: '09', icon: Microscope, title: 'Run the AI Identification', desc: 'Click Identify Mushroom and the AI will analyze the uploaded images using machine learning and visual feature extraction. The system returns a ranked list of possible mushroom species.' },
              { num: '10', icon: CheckCircle, title: 'Review Results Carefully', desc: 'Treat the results as a starting point for research, not a final answer. Many mushrooms have dangerous look-alikes, including toxic species like Amanita phalloides (death cap). Never eat a wild mushroom based only on an AI mushroom identification result.' },
            ].map((step) => (
              <div key={step.num} className="relative text-center p-6 rounded-xl card-lift card-glow" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl font-playfair font-bold" style={{ color: 'var(--accent)', opacity: 0.1 }}>
                  {step.num}
                </div>
                <step.icon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            Who This Mushroom Identifier Is For
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-12 text-center" style={{ color: 'var(--text-muted)' }}>
            The mushroom identifier is designed for anyone curious about fungi in the wild. It can be especially helpful for:
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              'Hikers and outdoor explorers encountering mushrooms on trails',
              'Backyard nature observers discovering fungi in gardens or lawns',
              'Mushroom foragers researching species before consulting experts',
              'Students studying mycology or forest ecology',
              'Nature photographers documenting fungal diversity',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <p style={{ color: 'var(--text-primary)' }}>{item}</p>
              </div>
            ))}
          </div>

          <p className="text-base sm:text-lg leading-relaxed mt-8 text-center" style={{ color: 'var(--text-muted)' }}>
            Whether you are walking through a Pacific Northwest conifer forest, exploring a Rocky Mountain meadow, or simply observing mushrooms growing on a fallen hardwood log, the tool can provide a quick starting point for understanding what species you may be seeing.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            How AI Helps Identify Mushrooms
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            Artificial intelligence enables rapid mushroom recognition by combining several technologies:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Computer vision to detect patterns in images',
              'Machine learning models trained on fungal specimen photos',
              'Feature extraction algorithms identifying structural traits',
              'Species probability ranking based on visual similarity and context',
            ].map((tech, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <p style={{ color: 'var(--text-primary)' }}>{tech}</p>
              </li>
            ))}
          </ul>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Instead of relying solely on color, the AI evaluates multiple anatomical features simultaneously: cap color and surface texture, gill or pore structure, stem thickness and internal structure, presence of a ring, veil, or volva, growth pattern and clustering, and habitat and substrate information. This approach helps distinguish closely related fungi and identify potential look-alike species, which are common in the fungal world.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Why Mushroom Identification Requires Caution
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            Identifying mushrooms is complex because many species share similar visual traits. Some of the most dangerous fungi — including members of the Amanita genus — resemble edible mushrooms commonly collected by beginners.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h3 className="font-semibold mb-2 text-red-500">Amanita phalloides (death cap)</h3>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Responsible for many fatal mushroom poisonings worldwide</p>
            </div>
            <div className="p-6 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h3 className="font-semibold mb-2 text-red-500">Amanita bisporigera (destroying angel)</h3>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Visually similar to edible button mushrooms when young</p>
            </div>
          </div>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Even experienced mycologists often rely on additional diagnostic signals such as spore print color, bruising reactions, smell or odor, and microscopic examination. Because a photo cannot capture all of these details, a mushroom identifier should always be treated as a starting point for research, not a final answer.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            When You Should Not Rely Only on a Mushroom Identifier?
          </h2>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              An AI mushroom identifier is an excellent starting point for recognizing fungi, but it should never be the only source used to make important decisions about wild mushrooms. Even the most advanced computer vision and machine learning systems cannot replace the experience of a trained mycologist or the careful verification methods used in traditional mycology.
            </p>
            <p>
              Certain situations require additional caution because visual similarity between mushroom species is extremely common. Many edible mushrooms have dangerous look-alikes that share similar cap color, gill structure, or stem appearance.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="font-semibold text-xl mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
              You should avoid relying only on a mushroom identifier in the following situations:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'When deciding whether a wild mushroom is edible',
                'When a mushroom is suspected to be toxic or poisonous',
                'When children or pets may have touched or ingested a mushroom',
                'When identifying mushrooms belonging to high-risk genera such as Amanita',
                'When the mushroom\'s base, spore print, or bruising reaction cannot be observed',
                'When the mushroom grows in unusual habitats or rare environments',
              ].map((situation, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <p style={{ color: 'var(--text-primary)' }}>{situation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-xl text-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
            <p className="text-base sm:text-lg leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
              In these cases, the safest approach is to consult a local mycologist, regional mycological society, or poison control center. AI tools are powerful for research and learning, but they should always be used as supporting tools rather than final authorities.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Best Practices for Safer Mushroom Identification
          </h2>

          <p className="text-center text-lg mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Successful mushroom identification relies on careful observation, accurate documentation, and verification from multiple sources. Combining AI image recognition with traditional field identification techniques provides the most reliable results.
          </p>

          <div className="mb-12 p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Key Practices Used by Mycologists
            </h3>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Professional mushroom experts follow a consistent process when identifying fungi in nature. These steps can help improve both AI identification accuracy and human verification.
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  Observe the specimen before touching it
                </h4>
                <ul className="ml-7 space-y-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  <li>• Look at the cap shape, color, and surface texture</li>
                  <li>• Note whether the mushroom grows alone or in clusters</li>
                  <li>• Check if it is growing on soil, moss, wood, or leaf litter</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  Photograph the mushroom in its habitat
                </h4>
                <p className="ml-7 mb-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  Capture images showing the environment such as:
                </p>
                <ul className="ml-7 space-y-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  <li>• Decaying hardwood logs</li>
                  <li>• Conifer forest floors</li>
                  <li>• Fallen branches or buried roots</li>
                  <li>• Open meadows or woodland edges</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  Document structural traits
                </h4>
                <p className="ml-7 mb-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  Important mushroom anatomy features include:
                </p>
                <ul className="ml-7 space-y-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  <li>• <strong>Cap</strong> – color, shape, scales, or warts</li>
                  <li>• <strong>Gills or pores</strong> – spacing and attachment to the stem</li>
                  <li>• <strong>Stem</strong> – thickness, texture, hollow or solid interior</li>
                  <li>• <strong>Ring or veil</strong> – protective structures beneath the cap</li>
                  <li>• <strong>Volva or basal bulb</strong> – structures found at the base of certain species</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  Record environmental context
                </h4>
                <p className="ml-7 mb-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  Write down:
                </p>
                <ul className="ml-7 space-y-2 text-base" style={{ color: 'var(--text-muted)' }}>
                  <li>• Location and geographic region</li>
                  <li>• Nearby tree species such as oak, birch, beech, or hemlock</li>
                  <li>• Substrate (soil, wood, moss, dung)</li>
                  <li>• Elevation and climate conditions</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)' }}>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                These ecological clues help narrow the list of possible fungal species.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            Mushroom Identification in Different Habitats
          </h2>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Habitat is one of the most important clues in mushroom identification. Most fungi grow in very specific environments and form relationships with certain trees, soil types, or decaying wood.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Mushrooms Growing on Soil', desc: 'Many mushrooms appear directly from the forest soil, especially in woodland environments. These species are often mycorrhizal fungi, meaning they form beneficial underground partnerships with tree roots. Often found near oak, beech, birch, or conifer trees.' },
              { title: 'Mushrooms Growing on Moss', desc: 'Some fungi prefer moist moss-covered environments. Moss retains water and organic matter, creating ideal conditions for many small woodland mushrooms. Found in damp forest floors, often appear after rain or high humidity.' },
              { title: 'Mushrooms Growing on Hardwood Logs', desc: 'Many fungi specialize in breaking down decaying hardwood, such as oak, maple, or birch logs. These mushrooms are known as wood-rotting fungi. They play a vital ecological role by recycling nutrients back into the forest ecosystem.' },
              { title: 'Mushrooms Growing on Conifer Wood', desc: 'Some fungi grow specifically on conifer trees such as pine, spruce, or fir. Conifer wood contains different chemical compounds than hardwood, so certain fungi specialize in breaking it down.' },
              { title: 'Mushrooms Growing on Living Trees', desc: 'Some mushrooms grow directly on living trees, especially on damaged or weakened areas of bark. These fungi may act as parasites or decomposers. Common signs include mushrooms emerging from tree trunks or branches and shelf-like formations.' },
              { title: 'Mushrooms in Meadows and Grassy Areas', desc: 'Not all mushrooms grow in forests. Many species appear in open meadows, lawns, and grassy fields, where they feed on organic material in soil. These environments are sometimes associated with fairy rings.' },
            ].map((habitat, i) => (
              <div key={i} className="p-6 rounded-xl card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>{habitat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{habitat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Can This Tool Identify Mushrooms Growing on Wood?
          </h2>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              Yes. Many distinctive fungi grow on logs, tree trunks, and woody debris, and the mushroom identifier can often recognize these species when clear images are provided.
            </p>
            <p>
              However, the AI needs to see how the mushroom attaches to the wood.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Helpful photo details include:
            </h3>
            <div className="space-y-3">
              {[
                'Whether the mushroom has a stem',
                'Whether it forms shelf-like brackets',
                'Whether it grows in dense clusters',
              ].map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <p className="text-base" style={{ color: 'var(--text-muted)' }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <p>
              It is also helpful to mention whether the wood appears to be hardwood or conifer, since some fungi specialize in only one type.
            </p>
            <p>
              Including this context helps the system better match the specimen with the correct fungal species database entries.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Mushroom Identification Accuracy: What Affects It Most
          </h2>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              The accuracy of an AI mushroom identifier depends on several factors. While artificial intelligence can analyze visual patterns extremely quickly, the quality of input information plays a major role.
            </p>
          </div>

          <h3 className="font-playfair text-2xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Factors That Improve Identification Accuracy
          </h3>

          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm sm:text-base" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th className="p-3 sm:p-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Factor</th>
                  <th className="p-3 sm:p-4 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { factor: 'Multiple photo angles', why: 'Reveals different anatomical features' },
                  { factor: 'Clear lighting', why: 'Shows color and surface texture accurately' },
                  { factor: 'Habitat photos', why: 'Provides ecological context' },
                  { factor: 'Geographic location', why: 'Filters species by regional distribution' },
                  { factor: 'Date found', why: 'Accounts for mushroom seasonality' },
                  { factor: 'Distinctive species traits', why: 'Reduces confusion with look-alikes' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 sm:p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{row.factor}</td>
                    <td className="p-3 sm:p-4" style={{ color: 'var(--text-muted)' }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <p>
              Species that are visually unique are usually identified with higher confidence, while mushrooms with many similar relatives can produce multiple possible matches.
            </p>
            <p>
              For example, white mushrooms with free gills and a ring on the stem may belong to several genera, including both edible and toxic species.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Mushroom Identification for Beginners
          </h2>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              Learning to identify mushrooms is an exciting process, but beginners should approach it carefully. Many field guides emphasize the importance of observing structural traits, habitat relationships, and ecological patterns rather than relying on a single visual feature.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl mb-12" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Simple Traits to Observe First
            </h3>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Start by focusing on a few basic characteristics:
            </p>
            <div className="space-y-3">
              {[
                'Cap shape and color',
                'Presence of gills, pores, or spines',
                'Stem thickness and structure',
                'Whether the mushroom grows on wood or soil',
                'Nearby tree species',
              ].map((trait, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <p className="text-base" style={{ color: 'var(--text-primary)' }}>{trait}</p>
                </div>
              ))}
            </div>
            <p className="text-base leading-relaxed mt-6" style={{ color: 'var(--text-muted)' }}>
              Even simple observations can dramatically reduce the number of potential species.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl mb-8" style={{ background: 'rgba(251, 146, 60, 0.1)', border: '2px solid rgba(251, 146, 60, 0.3)' }}>
            <h3 className="font-semibold text-xl mb-6 text-amber-500">
              Common Beginner Mistakes
            </h3>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
              Many misidentifications occur because important details are overlooked.
            </p>
            <p className="text-base leading-relaxed mb-4 font-medium" style={{ color: 'var(--text-primary)' }}>
              Avoid these common errors:
            </p>
            <div className="space-y-3">
              {[
                'Taking only one photo of the cap',
                'Ignoring the stem base or volva',
                'Forgetting to note the habitat',
                'Assuming a mushroom is edible because it resembles a familiar species',
              ].map((mistake, i) => (
                <div key={i} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <p className="text-base" style={{ color: 'var(--text-primary)' }}>{mistake}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-base sm:text-lg leading-relaxed text-center" style={{ color: 'var(--text-muted)' }}>
            <p>
              Remember that even experienced foragers often verify their findings with multiple references or expert advice.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Why This Mushroom Identifier Is Useful as a Web-Based Tool?
          </h2>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              One advantage of a web-based mushroom identifier is accessibility. Unlike many mobile apps, the tool works directly in a browser on desktop, tablet, or smartphone.
            </p>
            <p>
              This makes it easy to use while hiking or exploring outdoor environments.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
              Key advantages include:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'No app download or installation required',
                'Works on mobile devices and computers',
                'Fast access in the field',
                'No account creation necessary',
                'Unlimited identification requests',
              ].map((advantage, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <p className="text-base" style={{ color: 'var(--text-primary)' }}>{advantage}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-base sm:text-lg leading-relaxed text-center" style={{ color: 'var(--text-muted)' }}>
            <p>
              Because it runs entirely online, users can identify multiple specimens during a single outing without needing to install updates or manage software.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Mushroom ID Chart: Common Types
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: 'var(--text-muted)' }}>
            A mushroom ID chart is a helpful visual reference used in mushroom identification and mycology. It groups mushrooms by their key structural traits so beginners can quickly narrow down possible species.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th className="p-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Mushroom Type</th>
                  <th className="p-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Key Features</th>
                  <th className="p-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Habitat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Gilled Mushrooms', features: 'Thin blade-like gills under the cap, visible stem', habitat: 'Forest soil, grasslands' },
                  { type: 'Pore Mushrooms (Boletes)', features: 'Sponge-like underside with pores, thick caps', habitat: 'Near hardwood or conifer trees' },
                  { type: 'Tooth / Spine Mushrooms', features: 'Underside covered with soft spines or teeth', habitat: 'Forest floors, moss, decaying wood' },
                  { type: 'Polypores / Shelf Fungi', features: 'Bracket or shelf-shaped, no traditional stem', habitat: 'Dead logs, tree trunks' },
                  { type: 'Puffballs', features: 'Round, no visible gills, release spores as powder', habitat: 'Grasslands, fields, forest edges' },
                  { type: 'Morels', features: 'Honeycomb-pattern caps with hollow interior', habitat: 'Forest soil near trees' },
                  { type: 'Amanita Group', features: 'Often have gills, a ring, and a volva at base', habitat: 'Forests with oak, birch, or conifer' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 font-medium" style={{ color: 'var(--text-primary)' }}>{row.type}</td>
                    <td className="p-3" style={{ color: 'var(--text-muted)' }}>{row.features}</td>
                    <td className="p-3" style={{ color: 'var(--text-muted)' }}>{row.habitat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Key Benefits of Using This Free Mushroom Identifier
          </h2>

          <div className="space-y-8">
            {[
              { title: 'Free Access with No Hidden Fees', desc: 'This mushroom identification tool is completely free to use. There are no subscription plans, locked features, or hidden charges. Anyone interested in fungi identification, mushroom foraging, or nature observation can access the tool instantly through a web browser.' },
              { title: 'Unlimited Mushroom Identifications', desc: 'Users can run as many identification requests as they need. Each photo submission is analyzed independently by the AI recognition system, allowing you to identify multiple specimens during a single outing.' },
              { title: 'Simple and Easy Photo Upload Workflow', desc: 'The tool is designed with a straightforward interface that allows users to upload images quickly. The image analysis system works best when photos show important mushroom structures such as cap shape, gills, stem, and habitat.' },
              { title: 'Fast Ranked Species Results', desc: 'Once images are uploaded, the AI analyzes visual patterns and compares them with thousands of labeled fungal specimen images. The system returns a ranked list of possible mushroom species within seconds.' },
              { title: 'Helpful for Learning Mushroom Traits', desc: 'Using a mushroom identifier is also a great way to learn about mushroom anatomy and fungal biology. As users explore different species, they become familiar with important identification traits.' },
            ].map((benefit, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{benefit.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            When to Consult a Local Expert
          </h2>

          <div className="space-y-6 text-base sm:text-lg leading-relaxed mb-12" style={{ color: 'var(--text-muted)' }}>
            <p>
              There are times when expert assistance is essential. If a mushroom may pose a health risk, a trained professional should always confirm identification.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="relative overflow-hidden rounded-xl" style={{ height: '300px' }}>
              <img
                src="https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mushroom identifier expert examining wild mushrooms in forest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 rounded-xl flex flex-col justify-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold text-xl mb-6" style={{ color: 'var(--text-primary)' }}>
                Experts who can help include:
              </h3>
              <div className="space-y-4">
                {[
                  'Professional mycologists',
                  'Members of a regional mycological society',
                  'Local mushroom identification groups',
                  'Poison control specialists',
                ].map((expert, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                    <p className="text-base" style={{ color: 'var(--text-primary)' }}>{expert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            Common Similar Species Our Mushroom Identifier Distinguishes
          </h2>
          <p className="text-center text-base sm:text-lg leading-relaxed mb-12 max-w-4xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Understanding look-alike mushrooms is essential in mushroom identification and mycology. Many fungal species share similar cap color or shape, but differ in gill attachment, stem structure, habitat, smell, and seasonality. Below are common confusing pairs explained clearly, along with how our AI mushroom identifier helps distinguish them.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                1. Death Cap vs Paddy Straw Mushroom
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Amanita phalloides vs Volvariella volvacea)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                The death cap is one of the most toxic mushrooms, often confused with the edible paddy straw mushroom due to similar appearance when young. The key difference lies in the presence of a ring and volva, along with habitat — forest vs cultivated environments.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold text-red-500">Death Cap (Toxic)</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Paddy Straw (Edible)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', toxic: 'Volva, ring, free gills', edible: 'Volva, no ring' },
                      { feature: 'Color', toxic: 'Greenish, pale yellow', edible: 'Gray to brown' },
                      { feature: 'Smell', toxic: 'Mild sweet', edible: 'Mild earthy' },
                      { feature: 'Growth Pattern', toxic: 'Single/scattered', edible: 'Clusters' },
                      { feature: 'Environment', toxic: 'Woodland forests', edible: 'Straw, farms' },
                      { feature: 'Habitat & Distribution', toxic: 'Europe, Asia, North America', edible: 'Tropical regions' },
                      { feature: 'Seasonality', toxic: 'Summer–Fall', edible: 'Warm seasons' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.toxic}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI identifies differences in volva structure, ring presence, habitat context, and cap color variation to prevent confusion.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                2. Destroying Angel vs Button Mushroom
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Amanita bisporigera vs Agaricus bisporus)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                The destroying angel looks very similar to edible button mushrooms, especially when young. However, it contains deadly toxins. The most reliable differences include gill color change and absence of volva in Agaricus.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold text-red-500">Destroying Angel (Toxic)</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Button Mushroom (Edible)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', toxic: 'Volva + ring, white gills', edible: 'No volva, pink→brown gills' },
                      { feature: 'Color', toxic: 'Pure white', edible: 'White/light brown' },
                      { feature: 'Smell', toxic: 'Slight/unpleasant', edible: 'Mild pleasant' },
                      { feature: 'Growth Pattern', toxic: 'Single', edible: 'Clusters' },
                      { feature: 'Environment', toxic: 'Forest soil', edible: 'Grass/cultivated' },
                      { feature: 'Habitat & Distribution', toxic: 'North America, Europe', edible: 'Worldwide' },
                      { feature: 'Seasonality', toxic: 'Summer–Fall', edible: 'Year-round' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.toxic}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI detects gill color progression, stem base structure, and habitat differences to distinguish these species.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl mb-16" style={{ height: '400px' }}>
            <img
              src="https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Mushroom identifier analyzing chanterelle mushrooms growing in forest habitat"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
                  Visual Comparison Is Critical
                </h3>
                <p className="text-white/90 text-base sm:text-lg">
                  Our AI mushroom identifier uses advanced pattern recognition to spot subtle differences between look-alike species.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                3. Chanterelle vs False Chanterelle
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Cantharellus cibarius vs Hygrophoropsis aurantiaca)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                True chanterelles are prized edible mushrooms but are often confused with false chanterelles. The key difference lies in ridge-like folds vs true gills, along with smell and growth environment.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Chanterelle (Edible)</th>
                      <th className="p-2 text-left font-semibold text-amber-500">False Chanterelle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', edible: 'Ridges (not true gills)', false: 'Thin true gills' },
                      { feature: 'Color', edible: 'Yellow/golden', false: 'Bright orange' },
                      { feature: 'Smell', edible: 'Fruity (apricot)', false: 'Weak/none' },
                      { feature: 'Growth Pattern', edible: 'Scattered', false: 'Dense clusters' },
                      { feature: 'Environment', edible: 'Forest soil', false: 'Decaying wood' },
                      { feature: 'Habitat & Distribution', edible: 'Europe, North America', false: 'Worldwide' },
                      { feature: 'Seasonality', edible: 'Summer–Fall', false: 'Late summer–Fall' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.false}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI identifies ridge vs gill structures, color intensity, and substrate (soil vs wood) for accurate differentiation.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                4. Oyster Mushroom vs Angel Wings
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Pleurotus ostreatus vs Pleurocybella porrigens)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Both species grow in clusters on wood, making them visually similar. However, oyster mushrooms are edible, while angel wings can be toxic in some conditions. The main differences include thickness and substrate type.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Oyster (Edible)</th>
                      <th className="p-2 text-left font-semibold text-red-500">Angel Wings (Toxic risk)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', edible: 'Thick flesh, decurrent gills', toxic: 'Thin, fragile' },
                      { feature: 'Color', edible: 'Gray/white', toxic: 'Pure white' },
                      { feature: 'Smell', edible: 'Mild pleasant', toxic: 'Slight' },
                      { feature: 'Growth Pattern', edible: 'Clusters', toxic: 'Dense clusters' },
                      { feature: 'Environment', edible: 'Hardwood logs', toxic: 'Conifer wood' },
                      { feature: 'Habitat & Distribution', edible: 'Worldwide', toxic: 'Northern forests' },
                      { feature: 'Seasonality', edible: 'Fall–Winter', toxic: 'Late fall' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.toxic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI compares growth on hardwood vs conifer, gill attachment, and body thickness to separate these species.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                5. Morel vs False Morel
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Morchella esculenta vs Gyromitra esculenta)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Morels are highly valued edible mushrooms, but false morels can be toxic. The most important distinction is internal structure and cap shape.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Morel (Edible)</th>
                      <th className="p-2 text-left font-semibold text-red-500">False Morel (Toxic)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', edible: 'Hollow, honeycomb cap', toxic: 'Brain-like, solid' },
                      { feature: 'Color', edible: 'Tan/yellow', toxic: 'Reddish brown' },
                      { feature: 'Smell', edible: 'Mild earthy', toxic: 'Strong' },
                      { feature: 'Growth Pattern', edible: 'Scattered', toxic: 'Scattered' },
                      { feature: 'Environment', edible: 'Forest soil', toxic: 'Woodland floor' },
                      { feature: 'Habitat & Distribution', edible: 'North America, Europe', toxic: 'Northern hemisphere' },
                      { feature: 'Seasonality', edible: 'Spring', toxic: 'Spring' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.toxic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI analyzes cap texture patterns, internal structure clues, and shape consistency for identification.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                6. Puffball vs Young Amanita
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Lycoperdon spp. vs Amanita spp. immature)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Young Amanita mushrooms can resemble puffballs before their caps open. This is a critical distinction because Amanita species are often highly toxic.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Puffball (Edible young)</th>
                      <th className="p-2 text-left font-semibold text-red-500">Young Amanita (Toxic)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', edible: 'Solid white interior', toxic: 'Developing gills inside' },
                      { feature: 'Color', edible: 'White', toxic: 'White' },
                      { feature: 'Smell', edible: 'Mild', toxic: 'Neutral' },
                      { feature: 'Growth Pattern', edible: 'Groups', toxic: 'Single' },
                      { feature: 'Environment', edible: 'Grasslands/forests', toxic: 'Forest soil' },
                      { feature: 'Habitat & Distribution', edible: 'Worldwide', toxic: 'Worldwide' },
                      { feature: 'Seasonality', edible: 'Summer–Fall', toxic: 'Summer–Fall' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.toxic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI evaluates internal structure (via context clues), growth pattern, and base features to avoid misidentification.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl mb-16" style={{ height: '400px' }}>
            <img
              src="https://images.pexels.com/photos/1227513/pexels-photo-1227513.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Mushroom identifier distinguishing bolete mushrooms with distinctive pore patterns"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
                  Structural Details Matter
                </h3>
                <p className="text-white/90 text-base sm:text-lg">
                  Pore patterns, gill structures, and stem characteristics are key to accurate mushroom identification.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                7. King Bolete vs Bitter Bolete
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Boletus edulis vs Tylopilus felleus)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Both are pore mushrooms and look very similar, but the bitter bolete is inedible due to taste. Differences include pore color and stem features.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>King Bolete (Edible)</th>
                      <th className="p-2 text-left font-semibold text-amber-500">Bitter Bolete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', edible: 'Thick stem, white pores', bitter: 'Pink pores, bitter' },
                      { feature: 'Color', edible: 'Brown cap', bitter: 'Brown cap' },
                      { feature: 'Smell', edible: 'Pleasant', bitter: 'Mild' },
                      { feature: 'Growth Pattern', edible: 'Single/scattered', bitter: 'Single' },
                      { feature: 'Environment', edible: 'Forest soil', bitter: 'Forests' },
                      { feature: 'Habitat & Distribution', edible: 'Europe, North America', bitter: 'Worldwide' },
                      { feature: 'Seasonality', edible: 'Summer–Fall', bitter: 'Summer–Fall' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.edible}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.bitter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI identifies pore color variations, stem patterns, and subtle surface differences to distinguish these boletes.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                8. Shaggy Ink Cap vs Common Ink Cap
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                (Coprinus comatus vs Coprinopsis atramentaria)
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Both ink caps grow in urban and grassy areas, but they differ in cap texture and appearance.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                      <th className="p-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>Shaggy Ink Cap (Edible young)</th>
                      <th className="p-2 text-left font-semibold text-amber-500">Common Ink Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Key Features', shaggy: 'Shaggy, elongated cap', common: 'Smooth gray cap' },
                      { feature: 'Color', shaggy: 'White with scales', common: 'Gray' },
                      { feature: 'Smell', shaggy: 'Mild', common: 'Mild' },
                      { feature: 'Growth Pattern', shaggy: 'Groups', common: 'Groups' },
                      { feature: 'Environment', shaggy: 'Lawns/roadsides', common: 'Urban soil' },
                      { feature: 'Habitat & Distribution', shaggy: 'Worldwide', common: 'Worldwide' },
                      { feature: 'Seasonality', shaggy: 'Spring–Fall', common: 'Spring–Fall' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.feature}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.shaggy}</td>
                        <td className="p-2" style={{ color: 'var(--text-muted)' }}>{row.common}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--accent)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Our AI analyzes cap texture, shape, and growth environment to clearly separate these similar species.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: 'What type of mushroom is this?', a: 'To determine what type of mushroom this is, observe key features such as cap shape, gills or pores, stem structure, and habitat. A mushroom identifier uses AI to analyze these traits and compare them with a database of fungal species.' },
              { q: 'How does a mushroom identifier work?', a: 'A mushroom identifier uses artificial intelligence and computer vision to analyze uploaded photos of a mushroom\'s cap, gills, pores, stem, and base. The system compares these visual features with thousands of labeled specimens and returns a ranked list of possible species matches.' },
              { q: 'Is there a free mushroom identifier app?', a: 'Yes, this tool works as a free web-based mushroom identifier that runs directly in your browser. Upload images and use AI mushroom recognition without installing software.' },
              { q: 'Can a wild mushroom be identified from a picture?', a: 'Yes, a wild mushroom identifier by picture can recognize many species by analyzing structural traits like cap texture, gill pattern, and habitat. However, photo-based identification should always be confirmed with a field guide or mycologist.' },
              { q: 'Can a mushroom identifier tell if a mushroom is edible?', a: 'No. A mushroom identifier tool can suggest possible species but cannot confirm edibility or toxicity. Some dangerous mushrooms like Amanita phalloides (death cap) closely resemble edible species.' },
              { q: 'Why does habitat matter in mushroom identification?', a: 'Many fungi grow in specific environments such as forest soil, moss, hardwood logs, or conifer wood. Habitat information helps narrow down possible mushroom species since many fungi form ecological relationships with certain trees or substrates.' },
              { q: 'Do I need to create an account?', a: 'No. The tool works instantly in your browser and does not require registration or sign-up.' },
              { q: 'How does the AI identify mushrooms?', a: 'The system uses machine learning and computer vision trained on large datasets of labeled fungal specimen images. It analyzes features such as cap shape, gill pattern, stem structure, and habitat clues.' },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-2xl text-center" style={{ background: 'var(--accent-bg)', border: '2px solid var(--accent)' }}>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Final Safety Reminder Before Using Any Mushroom Identification Result
            </h2>
            <div className="space-y-4 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              <p>
                A mushroom identifier is a valuable educational tool, but it cannot replace professional expertise or traditional identification methods.
              </p>
              <div className="my-8 p-6 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>Never eat a wild mushroom based solely on AI identification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>Keep unknown mushrooms away from children and pets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>Always verify results using field guides or expert advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>Treat AI suggestions as hypotheses, not final answers</span>
                  </li>
                </ul>
              </div>
              <p className="font-medium">
                Nature contains an incredible diversity of fungi, from tiny woodland species to large mushrooms growing on ancient logs. Using a mushroom identifier responsibly can help you explore this fascinating world while staying safe and informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--accent)' }}>REVIEWS</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Trusted by Foragers <span className="italic" style={{ color: 'var(--accent)' }}>Worldwide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 rounded-xl card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
                "This is genuinely the best mushroom identification tool I have used. The look-alike warnings saved me from a dangerous mistake on my last foray."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  MK
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Marcus K.</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Professional Forager, Germany</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-xl card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
                "The UI is stunning and the results are incredibly detailed. I use it every weekend. Worth every penny of the Pro subscription."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  SL
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Sophie L.</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Mycology Enthusiast, France</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-xl card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-base leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
                "As a mycologist I was skeptical — but the accuracy is remarkable. The critical features section is exactly what beginners need to stay safe."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  RT
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Dr. R. Tanaka</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Mycologist, Japan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Start Identifying Safely Today
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
            Join thousands of foragers using AI-powered identification
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#identifier" className="px-8 py-4 rounded-full text-lg font-semibold glow-green hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
              Try Free — No Signup →
            </a>
            <Link href="/pricing" className="px-8 py-4 rounded-full text-lg font-semibold hover:opacity-70 transition-opacity" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
