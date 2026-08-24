'use client'
import { useEffect, useRef, Fragment } from 'react'
import TableOfContents from '@/components/blog/TableOfContents'
import IdentifyBanner from '@/components/blog/IdentifyBanner'
import AdSlot from '@/components/adify/AdSlot'
import { useAdify } from '@/components/adify/AdifyProvider'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Pick the badge color modifier from the rendered text content.
 * Editor's Choice → teal, Top Pick → red, Best Budget / Best → blue.
 */
function badgeModifier(text: string): string {
  const upper = text.trim().toUpperCase()
  if (upper.includes('EDITOR'))      return 'wf-tb-editors'
  if (upper.includes('TOP'))         return 'wf-tb-top'
  if (upper.includes('BUDGET'))      return 'wf-tb-budget'
  if (upper.includes('BEST'))        return 'wf-tb-budget'
  return ''
}

/**
 * Writerfy emits ALL three comparison-table badges with the same class
 * `writerfy-table-badge`, only differing in their text content
 * ("EDITOR'S CHOICE", "TOP PICK", "BEST BUDGET"). CSS can't reliably
 * match elements based on text, so we inject a modifier class here so
 * globals.css can color each variant differently — matching the colors
 * already used by the corresponding award badges in the product blocks
 * below the table (teal / red / blue).
 *
 * Permissive regex: tolerates extra attributes, single OR double quotes,
 * additional classes alongside writerfy-table-badge, and nested elements
 * (e.g. <strong>) inside the badge.
 */
function classifyTableBadges(html: string): string {
  return html.replace(
    /<span\b([^>]*?)\bclass\s*=\s*(["'])([^"']*?\bwriterfy-table-badge\b[^"']*?)\2([^>]*)>([\s\S]*?)<\/span>/gi,
    (full, before, quote, classes, after, inner) => {
      // already classified — leave it alone
      if (/\bwf-tb-(editors|top|budget)\b/.test(classes)) return full
      const text = String(inner).replace(/<[^>]+>/g, '')
      const mod = badgeModifier(text)
      if (!mod) return full
      const newClasses = `${classes} ${mod}`.trim()
      return `<span${before}class=${quote}${newClasses}${quote}${after}>${inner}</span>`
    }
  )
}

/**
 * Shortcode registry — add new shortcodes here.
 * Each key is the shortcode tag (without brackets).
 * The value is the React component to render.
 *
 * Usage in admin editor:  [identify-banner]
 */
const SHORTCODES: Record<string, () => React.ReactNode> = {
  'identify-banner': () => <IdentifyBanner />,
}

/** Split HTML at shortcode placeholders and interleave React components */
function renderWithShortcodes(html: string) {
  // Build a regex that matches any registered shortcode
  const tags = Object.keys(SHORTCODES).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (tags.length === 0) return <div dangerouslySetInnerHTML={{ __html: html }} />

  const regex = new RegExp(`\\[(${tags.join('|')})\\]`, 'gi')
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(html)) !== null) {
    // HTML before this shortcode
    if (match.index > lastIndex) {
      parts.push(
        <div key={`html-${key}`} dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, match.index) }} />
      )
    }
    // Render the shortcode component
    const tag = match[1].toLowerCase()
    const renderer = SHORTCODES[tag]
    if (renderer) {
      parts.push(<div key={`sc-${key}`} className="not-prose">{renderer()}</div>)
    }
    lastIndex = match.index + match[0].length
    key++
  }

  // Remaining HTML after last shortcode
  if (lastIndex < html.length) {
    parts.push(
      <div key={`html-${key}`} dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }} />
    )
  }

  return parts.length > 0 ? <>{parts}</> : <div dangerouslySetInnerHTML={{ __html: html }} />
}

/**
 * Split HTML into chunks of `n` paragraphs each (last chunk holds the
 * remainder). Used to drop an in-content ad after every N paragraphs
 * throughout the article, not just once. Splits only on top-level </p>
 * boundaries so no tag or shortcode is ever cut in half.
 */
function splitEveryNParagraphs(html: string, n: number): string[] {
  if (n <= 0) return [html]
  const parts: string[] = []
  const re = /<\/p>/gi
  let count = 0
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    count++
    if (count % n === 0) {
      const idx = m.index + m[0].length
      parts.push(html.slice(last, idx))
      last = idx
    }
  }
  if (last < html.length) parts.push(html.slice(last))
  return parts.length ? parts : [html]
}

/**
 * Renders rich-editor HTML with:
 * 1. Table of Contents (auto-injected immediately BEFORE the first <h2>,
 *    so the entire intro — however many paragraphs, lists, or images
 *    it contains — sits above the TOC. The first major section heading
 *    follows the TOC.)
 * 2. Shortcode expansion ([identify-banner] etc.)
 * 3. Adify in-content ads — content_top (above the article), in_content
 *    (after the Nth paragraph, N from the ad's own setting), and
 *    content_bottom (below the article).
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  // ── Step 0: Pre-process — classify Writerfy comparison-table badges so
  //           CSS can color each variant (Editor's Choice / Top Pick /
  //           Best Budget) distinctly. Cheap regex pass over the HTML.
  const processedHtml = classifyTableBadges(html)

  // ── Step 1: Find TOC insertion point ──
  // Always split at the first <h2>. If there is no h2, there's nothing to
  // make a TOC of, so we don't insert one at all.
  let beforeToc = ''
  let afterToc = processedHtml

  const firstH2 = processedHtml.search(/<h2[\s>]/i)
  if (firstH2 !== -1) {
    beforeToc = processedHtml.slice(0, firstH2)
    afterToc = processedHtml.slice(firstH2)
  }

  const hasToc = firstH2 !== -1

  // DOM-level safety net: if any badge slipped past the regex (e.g. odd
  // attribute order, exotic quoting), classify it after mount based on
  // its actual textContent. Idempotent — skips badges already classified.
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const badges = root.querySelectorAll<HTMLElement>('.writerfy-table-badge')
    badges.forEach(b => {
      if (b.classList.contains('wf-tb-editors') ||
          b.classList.contains('wf-tb-top') ||
          b.classList.contains('wf-tb-budget')) return
      const mod = badgeModifier(b.textContent || '')
      if (mod) b.classList.add(mod)
    })
  }, [html])

  // ── Step 2: In-content ads — repeat after every N paragraphs ──
  // The interval comes from the in-content ad unit itself (its
  // "paragraph_number" = every N paragraphs). We only split the body when an
  // in-content ad actually applies to this device / page type, so articles
  // without one render exactly as before. Capped so very long articles don't
  // turn into an ad wall.
  const { getUnits } = useAdify()
  const inContentUnits = getUnits('in_content')
  const hasInContent = inContentUnits.length > 0
  const interval = Math.max(2, inContentUnits[0]?.paragraph_number ?? 3)
  const MAX_IN_CONTENT_ADS = 10
  const chunks = hasInContent ? splitEveryNParagraphs(afterToc, interval) : [afterToc]

  // ── Step 3: Render with shortcode expansion + ad slots ──
  return (
    <div ref={rootRef} className={className} style={style}>
      <div className="not-prose"><AdSlot placement="content_top" /></div>
      {beforeToc && renderWithShortcodes(beforeToc)}
      {hasToc && (
        <div className="not-prose">
          <TableOfContents scope="article" />
        </div>
      )}
      {chunks.map((chunk, i) => (
        <Fragment key={i}>
          {renderWithShortcodes(chunk)}
          {hasInContent && i < chunks.length - 1 && i < MAX_IN_CONTENT_ADS && (
            <div className="not-prose"><AdSlot placement="in_content" /></div>
          )}
        </Fragment>
      ))}
      <div className="not-prose"><AdSlot placement="content_bottom" /></div>
    </div>
  )
}
