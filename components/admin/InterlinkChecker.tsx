'use client'
import { useState, useEffect, useMemo } from 'react'
import { Link2, Copy, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface InterlinkCheckerProps {
  content: string
}

interface ArticleEntry {
  slug: string
  title: string
  keywords: string[]
}

// Hardcoded static pages with keywords
const STATIC_ARTICLES: ArticleEntry[] = [
  { slug: '/boletus-edulis', title: 'Boletus Edulis (Porcini)', keywords: ['boletus edulis', 'porcini', 'king bolete', 'penny bun'] },
  { slug: '/amanita-phalloides-death-cap', title: 'Amanita Phalloides (Death Cap)', keywords: ['amanita phalloides', 'death cap'] },
  { slug: '/amanita-muscaria', title: 'Amanita Muscaria (Fly Agaric)', keywords: ['amanita muscaria', 'fly agaric'] },
  { slug: '/amanita-bisporigera-destroying-angel', title: 'Amanita Bisporigera (Destroying Angel)', keywords: ['amanita bisporigera', 'destroying angel'] },
  { slug: '/amanita-virosa-mushroom', title: 'Amanita Virosa', keywords: ['amanita virosa', 'european destroying angel'] },
  { slug: '/amanita-ocreata', title: 'Amanita Ocreata', keywords: ['amanita ocreata', 'western destroying angel', 'angel of death'] },
  { slug: '/amanita-pantherina', title: 'Amanita Pantherina (Panther Cap)', keywords: ['amanita pantherina', 'panther cap', 'panther amanita'] },
  { slug: '/galerina-marginata', title: 'Galerina Marginata', keywords: ['galerina marginata', 'funeral bell', 'deadly galerina'] },
  { slug: '/cortinarius-rubellus', title: 'Cortinarius Rubellus (Deadly Webcap)', keywords: ['cortinarius rubellus', 'deadly webcap'] },
  { slug: '/omphalotus-illudens', title: 'Omphalotus Illudens (Jack-O-Lantern)', keywords: ['omphalotus illudens', 'jack-o-lantern', 'jack o lantern'] },
  { slug: '/chlorophyllum-molybdites', title: 'Chlorophyllum Molybdites', keywords: ['chlorophyllum molybdites', 'green-spored parasol', 'green spored parasol'] },
  { slug: '/gyromitra-esculenta', title: 'Gyromitra Esculenta (False Morel)', keywords: ['gyromitra esculenta', 'false morel'] },
  { slug: '/hypholoma-fasciculare', title: 'Hypholoma Fasciculare (Sulphur Tuft)', keywords: ['hypholoma fasciculare', 'sulphur tuft', 'sulfur tuft'] },
  { slug: '/lepiota-brunneoincarnata', title: 'Lepiota Brunneoincarnata (Deadly Dapperling)', keywords: ['lepiota brunneoincarnata', 'deadly dapperling'] },
  { slug: '/scleroderma-citrinum', title: 'Scleroderma Citrinum (Common Earthball)', keywords: ['scleroderma citrinum', 'common earthball', 'earthball'] },
  { slug: '/agaricus-xanthodermus', title: 'Agaricus Xanthodermus (Yellow Stainer)', keywords: ['agaricus xanthodermus', 'yellow stainer', 'yellow-staining mushroom'] },
  { slug: '/agaricus-arvensis-horse-mushroom', title: 'Agaricus Arvensis (Horse Mushroom)', keywords: ['agaricus arvensis', 'horse mushroom'] },
  { slug: '/agaricus-campestris', title: 'Agaricus Campestris (Field Mushroom)', keywords: ['agaricus campestris', 'field mushroom'] },
  { slug: '/cantharellus-cibarius', title: 'Cantharellus Cibarius (Chanterelle)', keywords: ['cantharellus cibarius', 'chanterelle', 'golden chanterelle'] },
  { slug: '/morchella-esculenta', title: 'Morchella Esculenta (Morel)', keywords: ['morchella esculenta', 'morel', 'true morel'] },
  { slug: '/pleurotus-ostreatus', title: 'Pleurotus Ostreatus (Oyster Mushroom)', keywords: ['pleurotus ostreatus', 'oyster mushroom'] },
  { slug: '/mushroom-parts-explained', title: 'Mushroom Parts Explained', keywords: ['mushroom parts', 'mushroom anatomy', 'parts of a mushroom'] },
  { slug: '/mushroom-identifier-book', title: 'Mushroom Identifier Book', keywords: ['mushroom identifier book', 'mushroom field guide', 'identification book'] },
  { slug: '/how-to-get-rid-of-mushrooms-in-grass', title: 'How to Get Rid of Mushrooms in Grass', keywords: ['get rid of mushrooms', 'mushrooms in grass', 'remove mushrooms lawn'] },
  { slug: '/why-are-mushrooms-growing-in-my-yard', title: 'Why Are Mushrooms Growing in My Yard', keywords: ['mushrooms growing in yard', 'mushrooms in my yard', 'yard mushrooms'] },
  { slug: '/death-cap-vs-destroying-angel', title: 'Death Cap vs Destroying Angel', keywords: ['death cap vs destroying angel', 'death cap destroying angel'] },
  { slug: '/are-there-any-deadly-leccinum-mushrooms', title: 'Are There Any Deadly Leccinum Mushrooms', keywords: ['deadly leccinum', 'leccinum mushrooms', 'leccinum poisonous'] },
  { slug: '/mushroom-identification-quiz', title: 'Mushroom Identification Quiz', keywords: ['mushroom identification quiz', 'mushroom quiz', 'identification quiz'] },
]

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || div.innerText || '').toLowerCase()
}

function getExistingLinks(html: string): string[] {
  const div = document.createElement('div')
  div.innerHTML = html
  const anchors = div.querySelectorAll('a[href]')
  const hrefs: string[] = []
  anchors.forEach(a => {
    const href = a.getAttribute('href') || ''
    hrefs.push(href)
  })
  return hrefs
}

function titleFromSlug(slug: string): string {
  return slug
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

interface InterlinkMatch {
  keyword: string
  slug: string
  title: string
}

export default function InterlinkChecker({ content }: InterlinkCheckerProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [dynamicArticles, setDynamicArticles] = useState<ArticleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  // Fetch published articles from API
  useEffect(() => {
    fetch('/api/admin/posts')
      .then(r => r.json())
      .then(data => {
        const posts = data.posts || []
        const entries: ArticleEntry[] = posts
          .filter((p: any) => p.status === 'published')
          .map((p: any) => {
            const slug = p.slug.startsWith('/') ? p.slug : `/${p.slug}`
            const keywords = [
              p.title.toLowerCase(),
              ...slug.replace(/^\//, '').split('-').length > 1
                ? [slug.replace(/^\//, '').replace(/-/g, ' ')]
                : [],
            ]
            return { slug, title: p.title, keywords }
          })
        setDynamicArticles(entries)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Merge static + dynamic, deduplicating by slug
  const allArticles = useMemo(() => {
    const slugSet = new Set(STATIC_ARTICLES.map(a => a.slug))
    const merged = [...STATIC_ARTICLES]
    for (const da of dynamicArticles) {
      if (!slugSet.has(da.slug)) {
        merged.push(da)
        slugSet.add(da.slug)
      }
    }
    return merged
  }, [dynamicArticles])

  // Scan content for interlink opportunities
  const matches = useMemo(() => {
    if (!content || content.trim().length < 10) return []

    const plainText = stripHtml(content)
    const existingLinks = getExistingLinks(content)

    const found: InterlinkMatch[] = []
    const matchedSlugs = new Set<string>()

    for (const article of allArticles) {
      // Skip if already linked
      if (existingLinks.some(href => href.includes(article.slug))) continue
      if (matchedSlugs.has(article.slug)) continue

      for (const keyword of article.keywords) {
        if (keyword.length < 3) continue
        // Case-insensitive word-boundary-ish search
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`\\b${escaped}\\b`, 'i')
        if (regex.test(plainText)) {
          found.push({
            keyword,
            slug: article.slug,
            title: article.title,
          })
          matchedSlugs.add(article.slug)
          break // one match per article is enough
        }
      }
    }

    return found
  }, [content, allArticles])

  const handleCopy = async (slug: string) => {
    const url = `https://mushroomidentifiers.com${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedSlug(slug)
      setTimeout(() => setCopiedSlug(null), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedSlug(slug)
      setTimeout(() => setCopiedSlug(null), 2000)
    }
  }

  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const textPrimary = dark ? '#fff' : '#0f172a'
  const textLabel = dark ? '#94a3b8' : '#64748b'
  const itemBg = dark ? '#0f172a' : '#f8fafc'
  const itemBorder = dark ? '#1e293b' : '#e2e8f0'

  return (
    <div className="rounded-xl border p-4" style={{ background: cardBg, borderColor: cardBorder }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold" style={{ color: textPrimary }}>Interlink Checker</h3>
          {matches.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
              {matches.length}
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4" style={{ color: textLabel }} />
          : <ChevronDown className="w-4 h-4" style={{ color: textLabel }} />
        }
      </button>

      {expanded && (
        <div className="mt-3">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="ml-2 text-xs" style={{ color: textLabel }}>Scanning articles...</span>
            </div>
          ) : matches.length === 0 ? (
            <p className="text-xs py-2" style={{ color: textLabel }}>
              {content.trim().length < 10
                ? 'Start writing to see interlink suggestions.'
                : 'No interlink opportunities found. All relevant articles are already linked or no keyword matches detected.'}
            </p>
          ) : (
            <>
              <p className="text-xs mb-3" style={{ color: textLabel }}>
                {matches.length} interlink {matches.length === 1 ? 'opportunity' : 'opportunities'} found
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {matches.map((m) => (
                  <div
                    key={m.slug}
                    className="rounded-lg p-2.5 text-xs"
                    style={{ background: itemBg, border: `1px solid ${itemBorder}` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p style={{ color: textLabel }}>
                          Content mentions <span className="font-semibold text-emerald-400">&quot;{m.keyword}&quot;</span>
                        </p>
                        <p className="mt-1 font-medium truncate" style={{ color: textPrimary }}>
                          {m.title}
                        </p>
                        <p className="text-emerald-500/70 truncate mt-0.5">{m.slug}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(m.slug)}
                        className="shrink-0 p-1.5 rounded-md transition-colors"
                        style={{
                          background: copiedSlug === m.slug ? 'rgba(16,185,129,0.15)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                          color: copiedSlug === m.slug ? '#10b981' : textLabel,
                        }}
                        title="Copy full URL"
                      >
                        {copiedSlug === m.slug
                          ? <Check className="w-3.5 h-3.5" />
                          : <Copy className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
