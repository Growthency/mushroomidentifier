'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, Globe, Shield, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

type RiskLevel = 'All Levels' | 'Toxic' | 'High Risk' | 'Low Risk' | 'General'
type Region = 'All Regions' | 'US North America' | 'EU Europe' | 'Worldwide' | 'Temperate' | 'Others'

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
}

const ARTICLES_PER_PAGE = 9

const articles: Article[] = [
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
    image: '/Death Cap vs Destroying Angel.webp',
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
    image: '/parts of mushrooms.webp',
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
const regions: Region[] = ['All Regions', 'US North America', 'EU Europe', 'Worldwide', 'Temperate', 'Others']

export default function BlogPageClient() {
  const [searchQuery, setSearchQuery]       = useState('')
  const [selectedRisk, setSelectedRisk]     = useState<RiskLevel>('All Levels')
  const [selectedRegion, setSelectedRegion] = useState<Region>('All Regions')
  const [riskOpen, setRiskOpen]             = useState(false)
  const [regionOpen, setRegionOpen]         = useState(false)
  const [currentPage, setCurrentPage]       = useState(1)
  const [activeFilters, setActiveFilters]   = useState({
    query: '',
    risk: 'All Levels' as RiskLevel,
    region: 'All Regions' as Region,
  })

  const closeDropdowns = () => {
    setRiskOpen(false)
    setRegionOpen(false)
  }

  const handleSearch = () => {
    setActiveFilters({ query: searchQuery, risk: selectedRisk, region: selectedRegion })
    setCurrentPage(1)
    closeDropdowns()
  }

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const q = activeFilters.query.toLowerCase()
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      const matchR = activeFilters.risk === 'All Levels' || a.riskLevel === activeFilters.risk
      const matchReg = activeFilters.region === 'All Regions' || a.region === activeFilters.region
      return matchQ && matchR && matchReg
    })
  }, [activeFilters])

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
              onClick={() => { setRiskOpen(v => !v); setRegionOpen(false) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm w-full md:w-auto"
              style={{ ...dropdownBase, minWidth: '162px' }}
            >
              <Shield className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: selectedRisk === 'All Levels'
                    ? 'var(--text-muted)'
                    : riskLevelColors[selectedRisk],
                }}
              />
              <span className="flex-1 text-left">{selectedRisk}</span>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform"
                style={{ color: 'var(--text-muted)', transform: riskOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {riskOpen && (
              <div
                className="absolute top-full mt-2 left-0 w-52 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden"
                style={dropdownBase}
              >
                {riskLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => { setSelectedRisk(level); setRiskOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{
                      color: 'var(--text-primary)',
                      background: selectedRisk === level ? 'var(--accent-bg)' : 'transparent',
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        background: level === 'All Levels'
                          ? 'var(--text-muted)'
                          : riskLevelColors[level],
                      }}
                    />
                    <span className="flex-1">{level}</span>
                    {selectedRisk === level && (
                      <span style={{ color: 'var(--accent)', fontSize: '12px' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRegionOpen(v => !v); setRiskOpen(false) }}
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
              <div
                className="absolute top-full mt-2 left-0 w-56 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden"
                style={dropdownBase}
              >
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => { setSelectedRegion(region); setRegionOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{
                      color: 'var(--text-primary)',
                      background: selectedRegion === region ? 'var(--accent-bg)' : 'transparent',
                    }}
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">
                      {region === 'All Regions' ? '🌐' : regionMeta[region].icon}
                    </span>
                    <span className="flex-1">{region}</span>
                    {selectedRegion === region && (
                      <span style={{ color: 'var(--accent)', fontSize: '12px' }}>✓</span>
                    )}
                  </button>
                ))}
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
          <EmptyState hasFilters={activeFilters.query !== '' || activeFilters.risk !== 'All Levels' || activeFilters.region !== 'All Regions'} />
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {pageItems.map(article => (
              <ArticleCard key={article.id} article={article} />
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
                <span
                  key={`ellipsis-${i}`}
                  className="w-10 h-10 flex items-center justify-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  …
                </span>
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
function ArticleCard({ article }: { article: Article }) {
  const riskColor = riskLevelColors[article.riskLevel]
  const region    = regionMeta[article.region]

  return (
    <Link
      href={article.slug.startsWith('/') ? article.slug : `/blog/${article.slug}`}
      className="rounded-2xl overflow-hidden card-lift card-glow cursor-pointer group flex flex-col"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-card))' }}
          >
            <BookOpen className="w-12 h-12 opacity-20" style={{ color: 'var(--accent)' }} />
          </div>
        )}
        {/* Risk badge overlay */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: riskColor }}
        >
          {article.riskLevel}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category + Region */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {article.category}
          </span>
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
        <p
          className="text-sm mb-4 flex-1 line-clamp-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {article.excerpt}
        </p>

        {/* Footer meta */}
        <div
          className="flex items-center justify-between text-xs pt-3"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-faint)' }}
        >
          <span>{article.date}</span>
          <span>{article.readTime} read</span>
        </div>

        {/* Read More */}
        <div className="mt-3 flex items-center gap-1 text-sm font-semibold transition-opacity group-hover:opacity-80" style={{ color: 'var(--accent)' }}>
          Read More <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
        </div>
      </div>
    </Link>
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
