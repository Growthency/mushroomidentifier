'use client'

const REVIEWS = [
  {
    text: "This is genuinely the best mushroom identification tool I have used. The look-alike warnings saved me from a dangerous mistake on my last foray.",
    name: "Marcus K.",
    role: "Professional Forager, Germany",
    avatar: "https://i.pravatar.cc/80?img=11",
    tag: "Foraging Safety",
  },
  {
    text: "The UI is stunning and the results are incredibly detailed. I use it every weekend. Worth every penny of the Pro subscription.",
    name: "Sophie L.",
    role: "Mycology Enthusiast, France",
    avatar: "https://i.pravatar.cc/80?img=5",
    tag: "AI Identification",
  },
  {
    text: "As a mycologist I was skeptical — but the accuracy is remarkable. The critical features section is exactly what beginners need to stay safe.",
    name: "Dr. R. Tanaka",
    role: "Mycologist, Japan",
    avatar: "https://i.pravatar.cc/80?img=12",
    tag: "Expert Verified",
  },
  {
    text: "I found a rare species on my first hike using this tool. The habitat analysis feature is something no other app offers.",
    name: "Elena V.",
    role: "Nature Photographer, Italy",
    avatar: "https://i.pravatar.cc/80?img=47",
    tag: "Species Discovery",
  },
  {
    text: "Incredibly fast results. I showed it to my foraging club and everyone was blown away. We now use it as a first check on every find.",
    name: "James O.",
    role: "Hiking Guide, USA",
    avatar: "https://i.pravatar.cc/80?img=33",
    tag: "Field Testing",
  },
  {
    text: "The toxicity warnings are a lifesaver — literally. Clear, detailed and the look-alike comparisons helped me teach my students mushroom safety.",
    name: "Priya M.",
    role: "Botanist, India",
    avatar: "https://i.pravatar.cc/80?img=44",
    tag: "Education",
  },
  {
    text: "Best investment for any mushroom forager. The detailed reports with edibility confidence levels give me peace of mind every time.",
    name: "Liam W.",
    role: "Wildlife Biologist, Canada",
    avatar: "https://i.pravatar.cc/80?img=59",
    tag: "Detailed Reports",
  },
  {
    text: "I compared 5 different mushroom apps — this one is miles ahead in accuracy and detail. The lookalike warnings alone make it indispensable.",
    name: "Ana R.",
    role: "Forest Guide, Brazil",
    avatar: "https://i.pravatar.cc/80?img=23",
    tag: "App Comparison",
  },
]

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div
      className="flex-shrink-0 w-[340px] p-6 rounded-2xl flex flex-col justify-between"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        minHeight: 220,
      }}
    >
      {/* Header: Avatar + Name + Stars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-11 h-11 rounded-full object-cover"
              style={{ border: '2px solid var(--accent-bg)' }}
            />
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {review.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {review.role}
              </p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400 text-sm">&#9733;</span>
            ))}
          </div>
        </div>

        {/* Review text */}
        <p
          className="text-sm leading-relaxed italic"
          style={{ color: 'var(--text-muted)' }}
        >
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Tag */}
      <div className="mt-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'var(--accent-bg)',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
          }}
        >
          {review.tag}
        </span>
      </div>
    </div>
  )
}

export default function HomeReviews() {
  // Double the reviews for seamless infinite loop
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section
      className="py-12 sm:py-20 overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: 'var(--accent)' }}
          >
            REVIEWS
          </p>
          <h2
            className="font-playfair text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Trusted by Foragers{' '}
            <span className="italic" style={{ color: 'var(--accent)' }}>
              Worldwide
            </span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Real results from real foragers, mycologists, and nature enthusiasts.
            Here&apos;s what our community has to say.
          </p>
        </div>
      </div>

      {/* ── Infinite scrolling carousel ── */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, var(--bg-secondary), transparent)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, var(--bg-secondary), transparent)',
          }}
        />

        {/* Scrolling track */}
        <div
          className="flex gap-6 animate-marquee"
          style={{
            width: 'max-content',
          }}
        >
          {doubled.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Bottom rating summary */}
      <div className="flex items-center justify-center gap-3 mt-12">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-amber-400 text-lg">&#9733;</span>
          ))}
        </div>
        <span
          className="font-bold text-xl"
          style={{ color: 'var(--text-primary)' }}
        >
          5.0
        </span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Average rating from 50+ verified foragers
        </span>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
