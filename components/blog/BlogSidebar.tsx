'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, TrendingUp, Clock, Eye,
  Crown, Check, ChevronRight, Sparkles,
  BookOpen, Zap, ShieldCheck, Star,
} from 'lucide-react'
import TableOfContents from '@/components/blog/TableOfContents'

const TRENDING_POSTS = [
  {
    title: 'Amanita phalloides (Death Cap): Identification Guide',
    slug: '/amanita-phalloides-death-cap',
    image: '/amanita-phalloides-death-cap-identification.webp',
    views: 4821,
  },
  {
    title: 'Death Cap vs Destroying Angel: Key Differences',
    slug: '/death-cap-vs-destroying-angel',
    image: '/death-cap-vs-destroying-angel-comparison.webp',
    views: 3920,
  },
  {
    title: 'Amanita bisporigera (Destroying Angel) Guide',
    slug: '/amanita-bisporigera-destroying-angel',
    image: '/amanita-bisporigera-destroying-angel-identification.webp',
    views: 3450,
  },
  {
    title: 'Amanita virosa Mushroom: Identification & Safety',
    slug: '/amanita-virosa-mushroom',
    image: '/amanita-virosa-mushroom-destroying-angel.webp',
    views: 2980,
  },
  {
    title: 'How to Get Rid of Mushrooms in Grass',
    slug: '/how-to-get-rid-of-mushrooms-in-grass',
    image: '/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
    views: 2740,
  },
  {
    title: 'Why Are Mushrooms Growing in My Yard?',
    slug: '/why-are-mushrooms-growing-in-my-yard',
    image: '/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
    views: 2510,
  },
  {
    title: 'Mushroom Identifier Book: Best Field Guides',
    slug: '/mushroom-identifier-book',
    image: '/mushroom-identifier-book-chanterelle-cantharellus-cibarius.webp',
    views: 2230,
  },
  {
    title: 'Mushroom Parts Explained: Cap, Gills, Stem',
    slug: '/mushroom-parts-explained',
    image: '/parts-of-mushrooms.webp',
    views: 2180,
  },
  {
    title: 'Horse Mushroom (Agaricus arvensis) Guide',
    slug: '/agaricus-arvensis-horse-mushroom',
    image: '/agaricus-arvensis-horse-mushroom.webp',
    views: 1860,
  },
  {
    title: 'Mushroom Identification Quiz — 50 Questions',
    slug: '/mushroom-identification-quiz',
    image: '/mushroom-identification-quiz-various-species.webp',
    views: 1540,
  },
]

const RECENT_POSTS = [
  {
    title: 'Mushroom Identification Quiz — 50 Questions',
    slug: '/mushroom-identification-quiz',
    image: '/mushroom-identification-quiz-various-species.webp',
    date: 'Apr 4, 2026',
  },
  {
    title: 'Horse Mushroom (Agaricus arvensis) Guide',
    slug: '/agaricus-arvensis-horse-mushroom',
    image: '/agaricus-arvensis-horse-mushroom.webp',
    date: 'Apr 3, 2026',
  },
  {
    title: 'Mushroom Parts Explained: Cap, Gills, Stem',
    slug: '/mushroom-parts-explained',
    image: '/parts-of-mushrooms.webp',
    date: 'Apr 2, 2026',
  },
  {
    title: 'Mushroom Identifier Book: Best Field Guides',
    slug: '/mushroom-identifier-book',
    image: '/mushroom-identifier-book-chanterelle-cantharellus-cibarius.webp',
    date: 'Apr 1, 2026',
  },
  {
    title: 'Why Are Mushrooms Growing in My Yard?',
    slug: '/why-are-mushrooms-growing-in-my-yard',
    image: '/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
    date: 'Mar 30, 2026',
  },
  {
    title: 'How to Get Rid of Mushrooms in Grass',
    slug: '/how-to-get-rid-of-mushrooms-in-grass',
    image: '/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
    date: 'Mar 28, 2026',
  },
  {
    title: 'Amanita virosa Mushroom: Identification & Safety',
    slug: '/amanita-virosa-mushroom',
    image: '/amanita-virosa-mushroom-destroying-angel.webp',
    date: 'Mar 25, 2026',
  },
  {
    title: 'Amanita bisporigera (Destroying Angel) Guide',
    slug: '/amanita-bisporigera-destroying-angel',
    image: '/amanita-bisporigera-destroying-angel-identification.webp',
    date: 'Mar 22, 2026',
  },
  {
    title: 'Death Cap vs Destroying Angel: Key Differences',
    slug: '/death-cap-vs-destroying-angel',
    image: '/death-cap-vs-destroying-angel-comparison.webp',
    date: 'Mar 18, 2026',
  },
  {
    title: 'Amanita phalloides (Death Cap): Identification Guide',
    slug: '/amanita-phalloides-death-cap',
    image: '/amanita-phalloides-death-cap-identification.webp',
    date: 'Mar 15, 2026',
  },
]

const PREMIUM_BENEFITS = [
  { icon: BookOpen,    text: 'All premium deep-dive articles' },
  { icon: Zap,         text: 'Priority AI — faster identifications' },
  { icon: ShieldCheck, text: 'Expert safety warnings & lookalike alerts' },
  { icon: Star,        text: 'PDF reports + full field journal access' },
]

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

// ── Premium Banner ───────────────────────────────────────────────────────────
function PremiumBanner() {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: 'linear-gradient(145deg, #0f2a1a 0%, #1a4a2a 45%, #0d3320 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Hero image strip */}
      <div className="relative w-full overflow-hidden" style={{ height: 110 }}>
        <Image
          src="/amanita-phalloides-death-cap-identification.webp"
          alt="Premium mushroom articles"
          fill
          className="object-cover"
          style={{ opacity: 0.45, filter: 'saturate(0.7)' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(15,42,26,0.3) 0%, rgba(15,42,26,0.9) 100%)',
          }}
        />
        {/* Badge on image */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }}
          >
            <Crown className="w-3 h-3" />
            PREMIUM
          </span>
        </div>
        {/* Stars */}
        <div className="absolute top-3 right-3 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" style={{ color: '#fbbf24' }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        {/* Heading */}
        <div className="flex items-start gap-2 mb-2">
          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
          <h3 className="font-bold text-sm leading-snug" style={{ color: '#f0fdf4' }}>
            Unlock All Premium Articles &amp; Features
          </h3>
        </div>

        {/* Sub-text */}
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'rgba(240,253,244,0.65)' }}>
          Join thousands of foragers who identify mushrooms safely with expert-level content.
        </p>

        {/* Benefits */}
        <ul className="space-y-1.5 mb-4">
          {PREMIUM_BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <div
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.18)' }}
              >
                <Check className="w-2.5 h-2.5" style={{ color: '#4ade80' }} />
              </div>
              <span className="text-xs" style={{ color: 'rgba(240,253,244,0.8)' }}>{text}</span>
            </li>
          ))}
        </ul>

        {/* Price hint */}
        <div
          className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'rgba(240,253,244,0.7)' }}>
            Starting from
          </span>
          <span className="font-bold text-sm" style={{ color: '#4ade80' }}>
            $4.99 one-time
          </span>
        </div>

        {/* CTA Button */}
        <Link
          href="/pricing"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            boxShadow: '0 2px 12px rgba(34,197,94,0.35)',
          }}
        >
          View Plans
          <ChevronRight className="w-4 h-4" />
        </Link>

        {/* Trust note */}
        <p className="text-center text-xs mt-2" style={{ color: 'rgba(240,253,244,0.4)' }}>
          14-day money-back guarantee · No subscription
        </p>
      </div>
    </div>
  )
}

// ── Fixed Banner Wrapper (uses JS position:fixed) ────────────────────────────
function FixedBanner() {
  const markerRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; width: number } | null>(null)
  const [bannerH, setBannerH] = useState(0)

  useEffect(() => {
    const measure = () => {
      const el = markerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setPos({ left: rect.left, width: rect.width })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Measure banner height once rendered
  useEffect(() => {
    if (bannerRef.current) {
      setBannerH(bannerRef.current.offsetHeight)
    }
  }, [pos])

  return (
    <>
      {/* Invisible marker to measure sidebar position */}
      <div ref={markerRef} className="w-full h-0" aria-hidden />
      {/* Fixed banner */}
      {pos && (
        <div
          ref={bannerRef}
          style={{
            position: 'fixed',
            top: 88,
            left: pos.left,
            width: pos.width,
            zIndex: 20,
          }}
        >
          <PremiumBanner />
        </div>
      )}
      {/* Spacer so sidebar content doesn't hide behind fixed banner */}
      {bannerH > 0 && <div style={{ height: bannerH + 16 }} />}
    </>
  )
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────
export default function BlogSidebar() {
  const [query, setQuery] = useState('')

  const filteredTrending = query.trim()
    ? TRENDING_POSTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : TRENDING_POSTS

  const filteredRecent = query.trim()
    ? RECENT_POSTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : RECENT_POSTS

  return (
    <aside className="hidden lg:block w-[272px] xl:w-[292px] flex-shrink-0">

      {/* ── Premium Banner — normal flow ── */}
      <PremiumBanner />

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Trending Posts */}
        <div
          className="rounded-xl overflow-hidden mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Trending Posts
            </span>
          </div>
          <ul>
            {filteredTrending.map((post, i) => (
              <li key={post.slug} style={{ borderBottom: '1px solid var(--border)' }}>
                <Link href={post.slug} className="flex items-center gap-3 px-3 py-2.5 transition-colors">
                  <div
                    className="flex-shrink-0 rounded-lg overflow-hidden"
                    style={{ width: 52, height: 44, background: 'var(--bg-secondary)' }}
                  >
                    <Image src={post.image} alt={post.title} width={52} height={44} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-1.5 mb-1">
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--accent)', opacity: 0.8 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatViews(post.views)} views</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {filteredTrending.length === 0 && (
              <li className="px-4 py-4 text-xs text-center" style={{ color: 'var(--text-faint)' }}>No articles found</li>
            )}
          </ul>
        </div>

        {/* Recent Posts */}
        <div
          className="rounded-xl overflow-hidden mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Recent Posts
            </span>
          </div>
          <ul>
            {filteredRecent.map((post) => (
              <li key={post.slug} style={{ borderBottom: '1px solid var(--border)' }}>
                <Link href={post.slug} className="flex items-center gap-3 px-3 py-2.5 transition-colors">
                  <div
                    className="flex-shrink-0 rounded-lg overflow-hidden"
                    style={{ width: 52, height: 44, background: 'var(--bg-secondary)' }}
                  >
                    <Image src={post.image} alt={post.title} width={52} height={44} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{post.date}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {filteredRecent.length === 0 && (
              <li className="px-4 py-4 text-xs text-center" style={{ color: 'var(--text-faint)' }}>No articles found</li>
            )}
          </ul>
        </div>

      {/* ── Table of Contents ── */}
      <TableOfContents />
    </aside>
  )
}
