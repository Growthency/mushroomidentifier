'use client'
import { useState, useEffect } from 'react'

const REVIEWS = [
  { text: "This is genuinely the best mushroom identification tool I have used. The look-alike warnings saved me from a dangerous mistake on my last foray.", name: "Marcus K.", role: "Professional Forager, Germany", avatar: "https://i.pravatar.cc/80?img=11" },
  { text: "The UI is stunning and the results are incredibly detailed. I use it every weekend. Worth every penny of the Pro subscription.", name: "Sophie L.", role: "Mycology Enthusiast, France", avatar: "https://i.pravatar.cc/80?img=5" },
  { text: "As a mycologist I was skeptical — but the accuracy is remarkable. The critical features section is exactly what beginners need to stay safe.", name: "Dr. R. Tanaka", role: "Mycologist, Japan", avatar: "https://i.pravatar.cc/80?img=12" },
  { text: "I found a rare species on my first hike using this tool. The habitat analysis feature is something no other app offers.", name: "Elena V.", role: "Nature Photographer, Italy", avatar: "https://i.pravatar.cc/80?img=47" },
  { text: "Incredibly fast results. I showed it to my foraging club and everyone was blown away. We now use it as a first check on every find.", name: "James O.", role: "Hiking Guide, USA", avatar: "https://i.pravatar.cc/80?img=33" },
  { text: "The toxicity warnings are a lifesaver — literally. Clear, detailed and the look-alike comparisons helped me teach my students mushroom safety.", name: "Priya M.", role: "Botanist, India", avatar: "https://i.pravatar.cc/80?img=44" },
]

export default function HomeReviews() {
  const [reviewIdx, setReviewIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setReviewIdx(i => (i + 1) % 6), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-12 sm:py-16 px-6 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--accent)' }}>REVIEWS</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Trusted by Foragers <span className="italic" style={{ color: 'var(--accent)' }}>Worldwide</span>
          </h2>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map(offset => {
              const review = REVIEWS[(reviewIdx + offset) % REVIEWS.length]
              return (
                <div key={offset} className="p-8 rounded-2xl card-lift transition-all duration-500" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xl">★</span>)}
                  </div>
                  <p className="text-base leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid var(--accent-bg)' }} />
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{review.name}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{review.role}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-2 mt-10">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setReviewIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === reviewIdx ? 'var(--accent)' : 'var(--border)', transform: i === reviewIdx ? 'scale(1.4)' : 'scale(1)' }}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
