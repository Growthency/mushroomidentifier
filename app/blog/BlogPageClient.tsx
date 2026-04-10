'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, ChevronDown, Globe, Shield, BookOpen,
  ChevronLeft, ChevronRight, Eye, Heart, Lock,
  Crown, Tag, CheckCircle2, Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type RiskLevel    = 'All Levels' | 'Toxic' | 'High Risk' | 'Low Risk' | 'General'
type Region       = 'All Regions' | 'US North America' | 'EU Europe' | 'Worldwide' | 'Temperate' | 'Others'
type PricingFilter = 'All' | 'Free' | 'Premium'

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  riskLevel: Exclude<RiskLevel, 'All Levels'>
  region: Exclude<Region, 'All Regions'>
  date: string
  readTime: string
  slug: string
  image?: string
  views: number
  is_premium: boolean
}

const ARTICLES_PER_PAGE = 9

const articles: Article[] = [
  {
    id: 17,
    title: 'Agaricus campestris (Meadow Mushroom): Identification, Edibility & Lookalikes',
    excerpt:
      'Agaricus campestris, commonly known as the meadow mushroom or field mushroom, is a widely recognized edible wild mushroom found in grasslands, pastures, and open fields. Learn identification, edibility, and how to avoid toxic lookalikes.',
    category: 'Edibility Guide',
    riskLevel: 'Low Risk',
    region: 'Worldwide',
    date: 'Apr 11, 2026',
    readTime: '10 min',
    slug: '/agaricus-campestris',
    image: '/agaricus-campestris-meadow-mushroom-identification.webp',
    views: 2130,
    is_premium: false,
  },
  {
    id: 16,
    title: "Omphalotus illudens (Jack-o'-Lantern Mushroom): Identification & Safety Guide",
    excerpt:
      'Omphalotus illudens, commonly known as the jack-o\u2019-lantern mushroom, is a bright orange, bioluminescent fungus found mainly in North America. Learn identification, toxicity, and how to distinguish it from chanterelles.',
    category: 'Species Guide',
    riskLevel: 'Toxic',
    region: 'US North America',
    date: 'Apr 11, 2026',
    readTime: '11 min',
    slug: '/omphalotus-illudens',
    image: '/omphalotus-illudens-jack-o-lantern-mushroom-identification.webp',
    views: 1540,
    is_premium: false,
  },
  {
    id: 15,
    title: 'Galerina marginata (Funeral Bell): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'Galerina marginata, commonly known as the Funeral Bell, is a small brown poisonous mushroom that contains deadly amatoxins, the same toxins found in the Death Cap. Learn identification, habitat, toxicity, and safety tips.',
    category: 'Species Guide',
    riskLevel: 'Toxic',
    region: 'Worldwide',
    date: 'Apr 11, 2026',
    readTime: '10 min',
    slug: '/galerina-marginata',
    image: '/galerina-marginata-funeral-bell-identification.webp',
    views: 1680,
    is_premium: false,
  },
  {
    id: 14,
    title: 'Amanita pantherina (Panther Cap): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'Amanita pantherina, commonly known as the Panther Cap, is a toxic Amanita species known for its brown cap with white spots and strong potential for misidentification. Learn identification, habitat, toxicity, and safety tips.',
    category: 'Species Guide',
    riskLevel: 'Toxic',
    region: 'Worldwide',
    date: 'Apr 10, 2026',
    readTime: '10 min',
    slug: '/amanita-pantherina',
    image: '/amanita-pantherina-panther-cap-identification.webp',
    views: 1420,
    is_premium: false,
  },
  {
    id: 13,
    title: 'Amanita muscaria (Fly Agaric): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'Amanita muscaria, commonly known as the Fly Agaric, is one of the most recognizable mushrooms in the world due to its bright red cap with white spots. Learn identification, habitat, toxicity, and safety tips.',
    category: 'Species Guide',
    riskLevel: 'Toxic',
    region: 'Worldwide',
    date: 'Apr 10, 2026',
    readTime: '10 min',
    slug: '/amanita-muscaria',
    image: '/amanita-muscaria-fly-agaric-identification.webp',
    views: 1870,
    is_premium: false,
  },
  {
    id: 12,
    title: 'Amanita ocreata (Toxic Amanita Species): Identification Guide',
    excerpt:
      'Amanita ocreata, commonly known as the Western Destroying Angel, is a highly toxic Amanita species found in North America. It contains deadly amatoxins that can cause severe liver and kidney failure.',
    category: 'Species Guide',
    riskLevel: 'Toxic',
    region: 'US North America',
    date: 'Apr 10, 2026',
    readTime: '8 min',
    slug: '/amanita-ocreata',
    image: '/amanita-ocreata-western-destroying-angel-identification.webp',
    views: 2341,
    is_premium: false,
  },
  {
    id: 11,
    title: 'Are There Any Deadly Leccinum Mushrooms?',
    excerpt:
      'There are no confirmed deadly species in the genus Leccinum. However, several Leccinum mushrooms have been linked to gastrointestinal poisoning, especially when undercooked or misidentified.',
    category: 'Edibility Guide',
    riskLevel: 'Low Risk',
    region: 'Worldwide',
    date: 'Apr 5, 2026',
    readTime: '6 min',
    slug: '/are-there-any-deadly-leccinum-mushrooms',
    image: '/leccinum-scabrum-birch-bolete-identification.webp',
    views: 1240,
    is_premium: false,
  },
  {
    id: 10,
    title: 'Why Are Mushrooms Growing in My Yard? (Expert Investigation Guide)',
    excerpt:
      'Mushrooms grow in your yard because underground fungi (mycelium) are actively breaking down organic matter in moist, shaded soil.',
    category: 'Yard Guide',
    riskLevel: 'General',
    region: 'Worldwide',
    date: 'Apr 4, 2026',
    readTime: '7 min',
    slug: '/why-are-mushrooms-growing-in-my-yard',
    image: '/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
    views: 2510,
    is_premium: false,
  },
  {
    id: 9,
    title: 'How Do I Get Rid of Mushrooms in My Grass? (Complete Lawn Guide)',
    excerpt:
      'Learn how to remove mushrooms from your lawn fast. Fix moisture, soil, and drainage issues to stop mushrooms from coming back permanently.',
    category: 'Lawn Guide',
    riskLevel: 'General',
    region: 'Worldwide',
    date: 'Apr 4, 2026',
    readTime: '8 min',
    slug: '/how-to-get-rid-of-mushrooms-in-grass',
    image: '/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
    views: 2740,
    is_premium: false,
  },
  {
    id: 8,
    title: 'Mushroom Identifier Book: Best Field Guides, Edible Mushroom Books & Foraging Resources',
    excerpt:
      'A mushroom identifier book helps you recognize fungi by combining photos or illustrations with key traits such as cap shape, gills, stem structure, habitat, season, and spore print.',
    category: 'Guide',
    riskLevel: 'General',
    region: 'Worldwide',
    date: 'Apr 4, 2026',
    readTime: '15 min',
    slug: '/mushroom-identifier-book',
    image: '/mushroom-identifier-book-chanterelle-cantharellus-cibarius.webp',
    views: 2230,
    is_premium: false,
  },
  {
    id: 7,
    title: 'Mushroom Identification Quiz — Test Your Fungi Knowledge (50 Questions)',
    excerpt:
      'Think you know your mushrooms? Take our free 50-question mushroom identification quiz with a 30-second timer, instant feedback, and high score tracking. Challenge yourself now!',
    category: 'Guide',
    riskLevel: 'General',
    region: 'Worldwide',
    date: 'Mar 31, 2026',
    readTime: '10 min',
    slug: '/mushroom-identification-quiz',
    image: '/mushroom-identification-quiz-various-species.webp',
    views: 1540,
    is_premium: true,
  },
  {
    id: 6,
    title: 'Amanita virosa (Destroying Angel): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'Amanita virosa, the European Destroying Angel, is one of the deadliest mushrooms in Europe. Learn how to identify it by its pure white cap, gills, ring, and volva before it is too late.',
    category: 'Safety',
    riskLevel: 'Toxic',
    region: 'EU Europe',
    date: 'Mar 31, 2026',
    readTime: '12 min',
    slug: '/amanita-virosa-mushroom',
    image: '/amanita-virosa-mushroom-destroying-angel.webp',
    views: 2980,
    is_premium: false,
  },
  {
    id: 5,
    title: 'Amanita bisporigera (Destroying Angel): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'Amanita bisporigera, the Destroying Angel, is one of the deadliest mushrooms in North America. Learn destroying angel identification by its pure white cap, gills, ring, volva, and habitat.',
    category: 'Safety',
    riskLevel: 'Toxic',
    region: 'US North America',
    date: 'Mar 31, 2026',
    readTime: '12 min',
    slug: '/amanita-bisporigera-destroying-angel',
    image: '/amanita-bisporigera-destroying-angel-identification.webp',
    views: 3450,
    is_premium: false,
  },
  {
    id: 4,
    title: 'Amanita phalloides (Death Cap): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'Amanita phalloides, the Death Cap, is one of the most dangerous mushrooms in the world. Learn death cap identification by cap, gills, ring, volva, habitat, and toxic risk to stay safe.',
    category: 'Safety',
    riskLevel: 'Toxic',
    region: 'Worldwide',
    date: 'Mar 31, 2026',
    readTime: '13 min',
    slug: '/amanita-phalloides-death-cap',
    image: '/amanita-phalloides-death-cap-identification.webp',
    views: 4821,
    is_premium: false,
  },
  {
    id: 1,
    title: 'Death Cap vs Destroying Angel: Key Differences, Identification & Safety Guide',
    excerpt:
      'Compare Death Cap and Destroying Angel mushrooms by cap color, gills, ring, volva, habitat, toxicity, and look-alikes. Learn safe identification differences to avoid these deadly fungi.',
    category: 'Safety',
    riskLevel: 'Toxic',
    region: 'Worldwide',
    date: 'Mar 31, 2026',
    readTime: '12 min',
    slug: '/death-cap-vs-destroying-angel',
    image: '/death-cap-vs-destroying-angel-comparison.webp',
    views: 3920,
    is_premium: false,
  },
  {
    id: 3,
    title: 'Horse Mushroom (Agaricus arvensis): Identification, Features, Habitat & Safety Guide',
    excerpt:
      'The Horse Mushroom (Agaricus arvensis) is a large, edible mushroom found in grasslands. Learn its cap, gills, ring, anise smell, and how to avoid toxic look-alikes like Yellow Stainer.',
    category: 'Species Guide',
    riskLevel: 'High Risk',
    region: 'Worldwide',
    date: 'Mar 31, 2026',
    readTime: '11 min',
    slug: '/agaricus-arvensis-horse-mushroom',
    image: '/agaricus-arvensis-horse-mushroom.webp',
    views: 1860,
    is_premium: false,
  },
  {
    id: 2,
    title: 'Mushroom Parts Explained: Cap, Gills, Stem, Ring, Volva',
    excerpt:
      'Learn mushroom anatomy with a clear guide to cap, gills, stem, ring, and volva. Understand how these fungal structures help with accurate mushroom identification and safety.',
    category: 'Guide',
    riskLevel: 'General',
    region: 'Worldwide',
    date: 'Mar 31, 2026',
    readTime: '14 min',
    slug: '/mushroom-parts-explained',
    image: '/parts-of-mushrooms.webp',
    views: 2180,
    is_premium: true,
  },
]

const riskLevelColors: Record<string, string> = {
  Toxic: '#ef4444',
  'High Risk': '#f97316',
  'Low Risk': '#22c55e',
  General: '#7ec88a',
}

const regionMeta: Record<string, { icon: string; label: string }> = {
  'US North America': { icon: '🇺🇸', label: 'US North America' },
  'EU Europe':        { icon: '🇪🇺', label: 'EU Europe' },
  Worldwide:          { icon: '🌍', label: 'Worldwide' },
  Temperate:          { icon: '🌲', label: 'Temperate' },
  Others:             { icon: '📍', label: 'Others' },
}

const riskLevels: RiskLevel[] = ['All Levels', 'Toxic', 'High Risk', 'Low Risk', 'General']
const regions: Region[]       = ['All Regions', 'US North America', 'EU Europe', 'Worldwide', 'Temperate', 'Others']
const pricingOptions: { value: PricingFilter; label: string }[] = [
  { value: 'All',     label: 'All Articles' },
  { value: 'Free',    label: 'Free' },
  { value: 'Premium', label: 'Premium' },
]

export default function BlogPageClient() {
  const [searchQuery, setSearchQuery]         = useState('')
  const [selectedRisk, setSelectedRisk]       = useState<RiskLevel>('All Levels')
  const [selectedRegion, setSelectedRegion]   = useState<Region>('All Regions')
  const [selectedPricing, setSelectedPricing] = useState<PricingFilter>('All')
  const [riskOpen, setRiskOpen]               = useState(false)
  const [regionOpen, setRegionOpen]           = useState(false)
  const [pricingOpen, setPricingOpen]         = useState(false)
  const [currentPage, setCurrentPage]         = useState(1)
  const [activeFilters, setActiveFilters]     = useState({
    query: '',
    risk: 'All Levels' as RiskLevel,
    region: 'All Regions' as Region,
    pricing: 'All' as PricingFilter,
  })

  // User state
  const [isPaid, setIsPaid]           = useState(false)
  const [isLoggedIn, setIsLoggedIn]   = useState(false)
  const [favorites, setFavorites]     = useState<Set<string>>(new Set())
  const [loadingFav, setLoadingFav]   = useState<string | null>(null)
  const [allArticles, setAllArticles] = useState<Article[]>(articles)

  useEffect(() => {
    // Fetch admin-created posts from database and merge with hardcoded articles
    fetch('/api/blog/posts')
      .then(r => r.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          const hardcodedSlugs = new Set(articles.map(a => a.slug))
          const newPosts = data.posts.filter((p: Article) => !hardcodedSlugs.has(p.slug))
          if (newPosts.length > 0) {
            setAllArticles([...newPosts, ...articles])
          }
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsLoggedIn(true)

      const [{ data: profile }, { slugs }] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle(),
        fetch('/api/favorites').then(r => r.json()).catch(() => ({ slugs: [] })),
      ])

      setIsPaid(!!(profile?.plan && profile.plan !== 'free'))
      setFavorites(new Set(slugs ?? []))
    }
    init()
  }, [])

  const toggleFavorite = useCallback(async (article: Article) => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    setLoadingFav(article.slug)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: article.slug,
          title: article.title,
          image: article.image ?? '',
          excerpt: article.excerpt,
          category: article.category,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      const data = await res.json()
      if (typeof data.saved === 'boolean') {
        setFavorites(prev => {
          const next = new Set(prev)
          data.saved ? next.add(article.slug) : next.delete(article.slug)
          return next
        })
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err)
    } finally {
      setLoadingFav(null)
    }
  }, [isLoggedIn])

  const closeDropdowns = () => {
    setRiskOpen(false)
    setRegionOpen(false)
    setPricingOpen(false)
  }

  const handleSearch = () => {
    setActiveFilters({
      query: searchQuery,
      risk: selectedRisk,
      region: selectedRegion,
      pricing: selectedPricing,
    })
    setCurrentPage(1)
    closeDropdowns()
  }

  const filtered = useMemo(() => {
    return allArticles.filter(a => {
      const q      = activeFilters.query.toLowerCase()
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      const matchR = activeFilters.risk === 'All Levels' || a.riskLevel === activeFilters.risk
      const matchReg = activeFilters.region === 'All Regions' || a.region === activeFilters.region
      const matchP = activeFilters.pricing === 'All' ||
        (activeFilters.pricing === 'Free' && !a.is_premium) ||
        (activeFilters.pricing === 'Premium' && a.is_premium)
      return matchQ && matchR && matchReg && matchP
    })
  }, [activeFilters, allArticles])

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const pageItems  = filtered.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE)

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const dropdownBase: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-6"
      style={{ background: 'var(--bg-primary)' }}
      onClick={closeDropdowns}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border)' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Forager's Journal
          </div>
          <h1
            className="font-playfair text-5xl md:text-6xl font-bold mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Mushroom Forager's Blog
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Expert guides, safety tips, regional foraging insights, and AI-powered mushroom identification knowledge — crafted to help you forage smarter and safer.
          </p>
        </div>

        {/* ── Search + Filter Bar ───────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row gap-3 p-4 rounded-2xl mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search articles by title or topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Risk Level Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRiskOpen(v => !v); setRegionOpen(false); setPricingOpen(false) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm w-full md:w-auto"
              style={{ ...dropdownBase, minWidth: '162px' }}
            >
              <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: selectedRisk === 'All Levels' ? 'var(--text-muted)' : riskLevelColors[selectedRisk] }}
              />
              <span className="flex-1 text-left">{selectedRisk}</span>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform"
                style={{ color: 'var(--text-muted)', transform: riskOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {riskOpen && (
              <div className="absolute top-full mt-2 left-0 w-52 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden" style={dropdownBase}>
                {riskLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => { setSelectedRisk(level); setRiskOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--text-primary)', background: selectedRisk === level ? 'var(--accent-bg)' : 'transparent' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: level === 'All Levels' ? 'var(--text-muted)' : riskLevelColors[level] }} />
                    <span className="flex-1">{level}</span>
                    {selectedRisk === level && <span style={{ color: 'var(--accent)', fontSize: '12px' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRegionOpen(v => !v); setRiskOpen(false); setPricingOpen(false) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm w-full md:w-auto"
              style={{ ...dropdownBase, minWidth: '162px' }}
            >
              <Globe className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span className="flex-1 text-left">{selectedRegion}</span>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform"
                style={{ color: 'var(--text-muted)', transform: regionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {regionOpen && (
              <div className="absolute top-full mt-2 left-0 w-56 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden" style={dropdownBase}>
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => { setSelectedRegion(region); setRegionOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--text-primary)', background: selectedRegion === region ? 'var(--accent-bg)' : 'transparent' }}
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">
                      {region === 'All Regions' ? '🌐' : regionMeta[region].icon}
                    </span>
                    <span className="flex-1">{region}</span>
                    {selectedRegion === region && <span style={{ color: 'var(--accent)', fontSize: '12px' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setPricingOpen(v => !v); setRiskOpen(false); setRegionOpen(false) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm w-full md:w-auto"
              style={{ ...dropdownBase, minWidth: '148px' }}
            >
              {selectedPricing === 'Premium'
                ? <Crown className="w-4 h-4 flex-shrink-0" style={{ color: '#f59e0b' }} />
                : selectedPricing === 'Free'
                ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} />
                : <Tag className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              }
              <span className="flex-1 text-left" style={{
                color: selectedPricing === 'Premium' ? '#f59e0b' : selectedPricing === 'Free' ? '#22c55e' : 'var(--text-primary)',
                fontWeight: selectedPricing !== 'All' ? 600 : 400,
              }}>
                {selectedPricing === 'All' ? 'All Articles' : selectedPricing}
              </span>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform"
                style={{ color: 'var(--text-muted)', transform: pricingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {pricingOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden" style={dropdownBase}>
                {/* All */}
                <button
                  onClick={() => { setSelectedPricing('All'); setPricingOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ color: 'var(--text-primary)', background: selectedPricing === 'All' ? 'var(--accent-bg)' : 'transparent' }}
                >
                  <Tag className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <span className="flex-1">All Articles</span>
                  {selectedPricing === 'All' && <span style={{ color: 'var(--accent)', fontSize: '12px' }}>✓</span>}
                </button>
                {/* Free */}
                <button
                  onClick={() => { setSelectedPricing('Free'); setPricingOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ background: selectedPricing === 'Free' ? '#22c55e18' : 'transparent' }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} />
                  <span className="flex-1 font-medium" style={{ color: '#22c55e' }}>Free</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: '#22c55e22', color: '#22c55e' }}>FREE</span>
                  {selectedPricing === 'Free' && <span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>}
                </button>
                {/* Premium */}
                <button
                  onClick={() => { setSelectedPricing('Premium'); setPricingOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ background: selectedPricing === 'Premium' ? '#f59e0b18' : 'transparent' }}
                >
                  <Crown className="w-4 h-4 flex-shrink-0" style={{ color: '#f59e0b' }} />
                  <span className="flex-1 font-medium" style={{ color: '#f59e0b' }}>Premium</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: '#f59e0b22', color: '#f59e0b' }}>PRO</span>
                  {selectedPricing === 'Premium' && <span style={{ color: '#f59e0b', fontSize: '12px' }}>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-75"
            style={{ background: 'var(--btn-primary)', color: '#fff', whiteSpace: 'nowrap' }}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* ── Results Count ─────────────────────────────────────── */}
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {filtered.length === 0 ? (
            'No articles published yet'
          ) : (
            <>
              Showing{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{pageItems.length}</strong>
              {' '}of{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong>
              {' '}article{filtered.length !== 1 ? 's' : ''}
            </>
          )}
        </p>

        {/* ── Article Grid or Empty State ───────────────────────── */}
        {pageItems.length === 0 ? (
          <EmptyState hasFilters={
            activeFilters.query !== '' ||
            activeFilters.risk !== 'All Levels' ||
            activeFilters.region !== 'All Regions' ||
            activeFilters.pricing !== 'All'
          } />
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {pageItems.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                isPaid={isPaid}
                isLoggedIn={isLoggedIn}
                isFavorited={favorites.has(article.slug)}
                isLoadingFav={loadingFav === article.slug}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-30 hover:opacity-80"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className="w-10 h-10 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    background: currentPage === page ? 'var(--btn-primary)' : 'var(--bg-card)',
                    border: `1px solid ${currentPage === page ? 'var(--btn-primary)' : 'var(--border)'}`,
                    color: currentPage === page ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-30 hover:opacity-80"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

/* ── Article Card ─────────────────────────────────────────────── */
interface ArticleCardProps {
  article: Article
  isPaid: boolean
  isLoggedIn: boolean
  isFavorited: boolean
  isLoadingFav: boolean
  onToggleFavorite: (article: Article) => void
}

function ArticleCard({ article, isPaid, isLoggedIn, isFavorited, isLoadingFav, onToggleFavorite }: ArticleCardProps) {
  const riskColor = riskLevelColors[article.riskLevel]
  const region    = regionMeta[article.region]
  const isPremium = article.is_premium
  const canRead   = !isPremium || isPaid
  const href      = article.slug.startsWith('/') ? article.slug : `/blog/${article.slug}`

  return (
    <div
      className="rounded-2xl overflow-hidden card-lift card-glow flex flex-col relative group"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Thumbnail */}
      <Link href={href} className="block relative h-48 flex-shrink-0 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPremium && !isPaid ? 'blur-[6px] scale-110' : ''}`}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-card))' }}
          >
            <BookOpen className="w-12 h-12 opacity-20" style={{ color: 'var(--accent)' }} />
          </div>
        )}

        {/* Risk badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white z-10"
          style={{ background: riskColor }}
        >
          {article.riskLevel}
        </span>

        {/* Premium blur overlay */}
        {isPremium && !isPaid && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Premium Only
            </div>
          </div>
        )}
      </Link>

      {/* Action icons — top right of image */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        {/* Favorite button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(article) }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          title={isLoggedIn ? (isFavorited ? 'Remove from saved' : 'Save article') : 'Log in to save'}
        >
          {isLoadingFav ? (
            <div className="w-3.5 h-3.5 rounded-full border border-white border-t-transparent animate-spin" />
          ) : (
            <Heart
              className="w-4 h-4 transition-colors"
              style={{ color: isFavorited ? '#f87171' : '#ffffff', fill: isFavorited ? '#f87171' : 'transparent' }}
            />
          )}
        </button>

        {/* Free / Premium badge */}
        {isPremium ? (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.92)', color: '#fff', backdropFilter: 'blur(4px)', letterSpacing: '0.02em' }}
            title="Premium content"
          >
            <Crown className="w-3 h-3" /> PRO
          </div>
        ) : (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(34,197,94,0.92)', color: '#fff', backdropFilter: 'blur(4px)', letterSpacing: '0.02em' }}
            title="Free content"
          >
            <CheckCircle2 className="w-3 h-3" /> FREE
          </div>
        )}
      </div>

      {/* Body */}
      <Link href={href} className="p-5 flex flex-col flex-1" style={{ textDecoration: 'none' }}>
        {/* Category + Region */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {article.category}
          </span>
          {isPremium ? (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
              style={{ background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b44' }}
            >
              <Crown className="w-3 h-3" /> Premium
            </span>
          ) : (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
              style={{ background: '#22c55e18', color: '#22c55e', border: '1px solid #22c55e44' }}
            >
              <CheckCircle2 className="w-3 h-3" /> Free
            </span>
          )}
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-faint)' }}>
            {region.icon} {region.label}
          </span>
        </div>

        <h2
          className="font-playfair text-xl font-bold mb-2 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {article.title}
        </h2>
        <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {article.excerpt}
        </p>

        {/* Footer meta */}
        <div
          className="flex items-center justify-between text-xs pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/author-avatar.webp"
              alt="Paul Stamets"
              width={22}
              height={22}
              className="rounded-full object-cover flex-shrink-0"
            />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Paul Stamets</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
              <span style={{ color: 'var(--text-faint)' }}>
                {article.views >= 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
              </span>
            </span>
            <span style={{ color: 'var(--text-faint)' }}>·</span>
            <span style={{ color: 'var(--text-faint)' }}>{article.date}</span>
          </div>
        </div>

        {/* Read More */}
        <div className="mt-3 flex items-center gap-1 text-sm font-semibold transition-opacity group-hover:opacity-80" style={{ color: 'var(--accent)' }}>
          {isPremium && !isPaid ? (
            <><Lock className="w-3.5 h-3.5" /> Unlock to Read</>
          ) : (
            <>Read More <span className="transition-transform group-hover:translate-x-1 inline-block">→</span></>
          )}
        </div>
      </Link>
    </div>
  )
}

/* ── Empty State ──────────────────────────────────────────────── */
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'var(--accent-bg)' }}
      >
        <BookOpen className="w-12 h-12" style={{ color: 'var(--accent)' }} />
      </div>
      <h3
        className="font-playfair text-3xl font-bold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {hasFilters ? 'No Articles Found' : 'Articles Coming Soon'}
      </h3>
      <p className="text-base max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {hasFilters
          ? 'No articles match your current filters. Try adjusting your search terms, risk level, or region.'
          : 'Our mycology experts are crafting in-depth guides and foraging insights. Check back soon for expert articles on mushroom identification, safety, and regional foraging tips.'}
      </p>
    </div>
  )
}
