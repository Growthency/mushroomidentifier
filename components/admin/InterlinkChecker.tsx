'use client'
import { useState, useEffect, useMemo } from 'react'
import { Link2, Copy, Check, ChevronDown, ChevronUp, Loader2, Zap, Plus } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface InterlinkCheckerProps {
  content: string
  currentSlug?: string
  /**
   * Called with the new HTML after the admin clicks Approve-all or a single
   * Apply button. Parent should push this back into its content state AND
   * bump the RichEditor's resetKey so the live DOM re-syncs.
   *
   * If not provided, the component falls back to read-only mode (old
   * behaviour — Copy-URL button only, no Apply).
   */
  onContentChange?: (newHtml: string) => void
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

// Tags whose text content we do NOT wrap in links — avoids nested anchors,
// modifying headings, and breaking code blocks or script/style elements.
const SKIP_TAGS = new Set([
  'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'CODE', 'PRE', 'SCRIPT', 'STYLE',
])

/**
 * Wrap the first text-node occurrence of `regex` inside `root` with an
 * anchor tag pointing at `slug`. Skips tags in SKIP_TAGS. Returns true if
 * a match was wrapped, false if nothing was found.
 *
 * Works by walking text nodes via TreeWalker — safer than regex-on-HTML
 * because it can't accidentally break up an attribute value or half-split
 * a tag.
 */
function wrapFirstMatch(root: Node, regex: RegExp, slug: string): boolean {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      let el: Element | null = node.parentElement
      while (el) {
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
        el = el.parentElement
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let textNode = walker.nextNode() as Text | null
  while (textNode) {
    const text = textNode.nodeValue || ''
    const m = text.match(regex)
    if (m && m.index !== undefined) {
      const before = text.slice(0, m.index)
      const matched = m[0] // preserves original casing from the content
      const after = text.slice(m.index + matched.length)

      const frag = document.createDocumentFragment()
      if (before) frag.appendChild(document.createTextNode(before))
      const a = document.createElement('a')
      a.setAttribute('href', slug)
      a.textContent = matched
      frag.appendChild(a)
      if (after) frag.appendChild(document.createTextNode(after))

      textNode.parentNode!.replaceChild(frag, textNode)
      return true
    }
    textNode = walker.nextNode() as Text | null
  }
  return false
}

/**
 * Applies an array of interlink matches to an HTML string. Each keyword's
 * first occurrence (outside existing links / headings / code) gets wrapped
 * in `<a href="slug">keyword</a>`. Returns the updated HTML.
 */
function applyInterlinks(html: string, matches: InterlinkMatch[]): string {
  if (!html || matches.length === 0) return html

  const container = document.createElement('div')
  container.innerHTML = html

  for (const match of matches) {
    const escaped = match.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b(${escaped})\\b`, 'i')
    wrapFirstMatch(container, regex, match.slug)
  }

  return container.innerHTML
}

export default function InterlinkChecker({ content, currentSlug, onContentChange }: InterlinkCheckerProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [dynamicArticles, setDynamicArticles] = useState<ArticleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [appliedSlug, setAppliedSlug] = useState<string | null>(null)
  const [applyingAll, setApplyingAll] = useState(false)

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

    // Normalise current slug for comparison (ensure leading slash)
    const normCurrent = currentSlug
      ? (currentSlug.startsWith('/') ? currentSlug : `/${currentSlug}`)
      : null

    for (const article of allArticles) {
      // Skip the article we're currently editing
      if (normCurrent && article.slug === normCurrent) continue
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

  const handleApply = (match: InterlinkMatch) => {
    if (!onContentChange) return
    const newHtml = applyInterlinks(content, [match])
    if (newHtml !== content) {
      onContentChange(newHtml)
      setAppliedSlug(match.slug)
      setTimeout(() => setAppliedSlug(null), 2000)
    }
  }

  const handleApplyAll = () => {
    if (!onContentChange || matches.length === 0) return
    setApplyingAll(true)
    // Small delay so the UI shows the loader (keeps the transition feel
    // consistent with how other batch actions behave in the admin).
    requestAnimationFrame(() => {
      const newHtml = applyInterlinks(content, matches)
      onContentChange(newHtml)
      setApplyingAll(false)
    })
  }

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
              <div className="flex items-center justify-between mb-3 gap-2">
                <p className="text-xs" style={{ color: textLabel }}>
                  {matches.length} interlink {matches.length === 1 ? 'opportunity' : 'opportunities'} found
                </p>
                {onContentChange && (
                  <button
                    onClick={handleApplyAll}
                    disabled={applyingAll}
                    className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition disabled:opacity-50"
                    title={`Insert all ${matches.length} interlinks into the content`}
                  >
                    {applyingAll
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Zap className="w-3 h-3" />
                    }
                    Approve all ({matches.length})
                  </button>
                )}
              </div>
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
                      <div className="shrink-0 flex items-center gap-1">
                        {onContentChange && (
                          <button
                            onClick={() => handleApply(m)}
                            className="p-1.5 rounded-md transition-colors"
                            style={{
                              background: appliedSlug === m.slug ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)',
                              color: appliedSlug === m.slug ? '#10b981' : '#10b981',
                            }}
                            title="Insert this interlink into the content"
                          >
                            {appliedSlug === m.slug
                              ? <Check className="w-3.5 h-3.5" />
                              : <Plus className="w-3.5 h-3.5" />
                            }
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(m.slug)}
                          className="p-1.5 rounded-md transition-colors"
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
